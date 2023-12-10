import { Request, Response, NextFunction } from 'express';

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;

export type AppRoute = {
  routeName: string;
  method: 'get' | 'post' | 'patch' | 'delete' | 'update';
  permission?: Middleware;
  controller: (
    req: Request<any>,
    res: Response,
    next?: NextFunction
  ) => void | Promise<void>;
};
