import { Request, Response, NextFunction } from 'express';
import { findPrivateChatRoomByUserId } from '../services/privateChatRoom';
import { TUser } from '../models/user';
import { findUserByQueryString } from '../services/user';
import { findMessagesByRoomId } from '../services/privateMessage';
const getCacheUser = async (req: Request, res: Response) => {
  const user = req.user as TUser;
  const rooms = await findPrivateChatRoomByUserId(user._id);
  const messages = await findMessagesByRoomId(rooms.map((room) => room._id));
  const roomsWithMessages = rooms.map((room) => {
    const roomJson = room.toObject();
    return {
      ...roomJson,
      messages: messages.filter((m) => {
        return m.chatRoomId.toString() === room._id.toString();
      }),
    };
  });
  res.status(200).send({ user, rooms: roomsWithMessages, messages });
};

type Query = {
  queryString?: string;
};

const getUsersByQueryString = async (
  req: Request<{}, {}, {}, Query>,
  res: Response
) => {
  const user = req.user as TUser;
  const rooms = await findPrivateChatRoomByUserId(user._id);

  const { queryString } = req.query;
  const myContacts = Array.from(
    new Set(
      rooms.reduce((result: any, room) => {
        return [...result, ...room.users];
      }, [])
    )
  ) as string[];


  const users = await findUserByQueryString(queryString!, [
    user._id,
    ...myContacts,
  ]);
  res.status(200).send({ users });
};

export { getCacheUser, getUsersByQueryString };
