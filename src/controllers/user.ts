import { Request, Response, NextFunction } from 'express';
import { findPrivateChatRoomByUserId } from '../services/privateChatRoom';
import { TUser } from '../models/user';
import { findUserByQueryString } from '../services/user';
const getCacheUser = async (req: Request, res: Response) => {
  const user = req.user as TUser;
  const rooms = await findPrivateChatRoomByUserId(user._id);
  res.status(200).send({ user, rooms });
};

type Query = {
  queryString?: string;
};

const getUsersByQueryString = async (
  req: Request<{}, {}, {}, Query>,
  res: Response
) => {
  const { queryString } = req.query;
  const users = await findUserByQueryString(queryString!);
  res.status(200).send({ users });
};

export { getCacheUser, getUsersByQueryString };
