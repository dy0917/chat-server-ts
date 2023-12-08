import { Request, Response, NextFunction } from 'express';
import {
  createChatRoom,
  findExistedPrivateChatRoom,
} from '../services/privateChatRoom';
import { findUserById } from '../services/user';
import { appSocket } from '../';
const initChatRoom = async (req: Request, res: Response) => {
  const { receiverId } = req.body;

  const sender = await findUserById(req.user!._id);
  const receiver = await findUserById(receiverId);
  if (!receiver) {
    res.status(401).send('User not found');
    return;
  }
  const existed = await findExistedPrivateChatRoom({
    senderId: req.user!._id,
    receiverId,
  });
  if (existed.length === 0) {
    const room = await createChatRoom({ senderId: req.user!._id, receiverId });
    const otherViewRoom = room.toObject();
    otherViewRoom.users = [];
    otherViewRoom.users.push(sender!.toJSON());
    if (receiver.socketId)
      await appSocket.sendRoomConfirm(receiver.socketId, otherViewRoom);
    res.status(200).send({ room });
    return;
  }
  res.status(401).send('User has had channel');
  return;
};

export { initChatRoom };
