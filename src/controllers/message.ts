import { Request, Response } from 'express';
import privateMessage from '../models/privateMessage';
import { findMessagesByRoomAndTimeBefore } from '../services/privateMessage';
type Query = {
  roomId?: string;
  lastMessageDateTime?: string;
};

const getMessagesByRoomAndTime = async (
  req: Request<{}, {}, {}, Query>,
  res: Response
) => {
  // const rooms = await findPrivateChatRoomByUserId(user._id);
  const { roomId, lastMessageDateTime } = req.query;
  const historyMessages = await findMessagesByRoomAndTimeBefore({
    chatRoomId: roomId!,
    lastMessageDateTime: lastMessageDateTime!,
  });

  res.status(200).send({ messages: historyMessages });
};

export { getMessagesByRoomAndTime };
