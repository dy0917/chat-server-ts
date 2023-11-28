import { Request, Response, NextFunction } from 'express';
import {
  createChatRoom,
  findExistedPrivateChatRoom,
} from '../services/privateChatRoom';
import { findUserById } from '../services/user';
const initChatRoom = async (req: Request, res: Response) => {
  const { receiverId } = req.body;

  const receiver = findUserById(receiverId);
  if (!receiver) {
    return res.status(401).send('User not found');
  }
  const existed = await findExistedPrivateChatRoom({
    senderId: req.user!._id,
    receiverId,
  });
  if (existed.length === 0) {
    const room = await createChatRoom({ senderId: req.user!._id, receiverId });
    res.status(200).send({ room });
    return;
  }
  return res.status(401).send('User has had channel');
};

export { initChatRoom };
