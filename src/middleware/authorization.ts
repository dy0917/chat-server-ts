import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';
const secret = 'your-secret-key';
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const tokenHeader = req.headers.authorization as string;
    console.log('tokenHeader', tokenHeader);
    try {
        if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) {
            return res.sendStatus(401);
        }
        const headerToken = tokenHeader.replace('Bearer ', '');
        const decodedToken = jwt.verify(headerToken, secret);
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