import { Request, Response, NextFunction } from 'express';
import { findPrivateChatRoomByUserId } from '../services/privateChatRoom';
import { TUser } from '../models/user';
const getCacheUser = async (req: Request, res: Response) => {
    
    const user = req.user as TUser;
    const rooms  = await findPrivateChatRoomByUserId(user._id)
    res.status(200).send({ user, rooms })
};
  
export {getCacheUser };