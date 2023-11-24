import * as express from "express"
import { Request } from 'express';

type TUser = {
  firstName: string;
  lastName: string;
  _id: string;
  email: string;
};

declare global {
    namespace Express {
        interface Request {
            user? : TUser
        }
    }
}