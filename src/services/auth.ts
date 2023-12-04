import type { TUser } from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { encryptionKey } from '../env';

const isPasswordMatch = async (user: TUser, password:string) => {
    const hash = await bcrypt.hash(password, user.salt);
    return hash === user.password;
}

const generateAccessToken = async ({ firstName, lastName, _id, email }: {firstName: string, lastName:string, _id:string, email: string}) => { 
    const secret = encryptionKey!;
    const options = { expiresIn: '8h' };
    const payload = {
        _id,
        email,
        firstName,
        lastName
    };
    return  await jwt.sign(payload, secret, options);
}

export { isPasswordMatch, generateAccessToken};
