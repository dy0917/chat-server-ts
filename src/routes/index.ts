import express, { Express, Request, Response, NextFunction } from 'express';
import { register, login } from '../controllers/auth';
import { verifyToken } from '../middleware/authorization';
import { getCacheUser, getUsersByQueryString } from '../controllers/user';
import { initChatRoom } from '../controllers/privateChatRoom';
import { AppRoute, Middleware } from '../types/AppRoute';
import { AppMiddleware } from '../types/AppMiddleware';
import { getMessagesByRoomAndTime } from '../controllers/message';


const router = express.Router();
const appRoutes: Array<AppRoute | AppMiddleware> = [
  {
    routeName: '/auth/login',
    method: 'post',
    controller: login,
  },
  {
    routeName: '/auth/register',
    method: 'post',
    controller: register,
  },
  {
    middleware: verifyToken,
  },
  {
    routeName: '/user/me',
    method: 'get',
    controller: getCacheUser,
  },
  {
    routeName: '/messages',
    method: 'get',
    controller: getMessagesByRoomAndTime,
  },
  {
    routeName: '/users/find',
    method: 'get',
    controller: getUsersByQueryString,
  },
  {
    routeName: '/chatRoom/add',
    method: 'post',
    controller: initChatRoom,
  },
];

appRoutes.forEach((route) => {
  if (isAppMiddleware(route)) {
    router.use(route.middleware);
  } else if (isAppRoute(route)) {
    const { method, permission, controller } = route;
    switch (method) {
      case 'get':
        router.get(route.routeName, getMiddleWare(permission), controller);
        break;
      case 'post':
        router.post(route.routeName, getMiddleWare(permission), controller);
        break;
      case 'update':
        break;
      case 'patch':
        break;
      case 'delete':
        break;
      default:
        console.log(`Sorry, method ${route.method} not implement.`);
    }
  }
  // router.use(pc.routeName, pc.permission, pc.controller)
});

function isAppMiddleware(
  route: AppMiddleware | AppRoute
): route is AppMiddleware {
  return (<AppMiddleware>route).middleware !== undefined;
}

function isAppRoute(route: AppMiddleware | AppRoute): route is AppMiddleware {
  return (<AppRoute>route).controller !== undefined;
}

function getMiddleWare(middleware: Middleware | undefined) {
  return middleware
    ? middleware
    : (_req: Request, _res: Response, next: NextFunction) => {
        next();
      };
}

export default router;
