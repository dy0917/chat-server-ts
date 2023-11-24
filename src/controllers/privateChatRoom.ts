import { Request, Response, NextFunction } from 'express';
import { createChatRoom, findExistedPrivateChatRoom } from '../services/privateChatRoom';
const initChatRoom = async (req: Request, res: Response) => {
    const { senderId, receiverId } = req.body;
    const existed = await findExistedPrivateChatRoom({ senderId, receiverId });
    if (existed.length === 0) { 
        const room = await createChatRoom({ senderId, receiverId });
        res.status(200).send(room)
        return;
    }
    return res.status(401).send('User has had channel')
};

export {initChatRoom };