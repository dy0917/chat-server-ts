import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';
import { encryptionKey } from '../env';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const tokenHeader = req.headers.authorization as string;
    try {
        if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) {
            return res.sendStatus(401);
        }
        const headerToken = tokenHeader.replace('Bearer ', '');
                const decodedToken = jwt.verify(headerToken, encryptionKey!);
        if (decodedToken) {
            const {_id, email, firstName,lastName }:any = decodedToken;
            req.user = {_id, email, firstName, lastName }
            return next();
        }
        return res.status(401).send();
    } catch (e) { 
        console.log(e);
        return res.status(401).send();
        
    }
};