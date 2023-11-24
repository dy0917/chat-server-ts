import { Request, Response, NextFunction } from 'express';
import {
  isPasswordMatch,
  generateAccessToken,
} from '../services/auth';

import {
  createUser,
  findUserByEmail,
  findUserFullDetailByEmail
} from '../services/user';

const register = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const exsitedUser = await findUserByEmail(email);
    if (exsitedUser) {
      res.status(404).send('User existed');
      return;
    }
    const user = await createUser(firstName, lastName, email, password);
    res.send(user);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const exsitedUsers = await findUserFullDetailByEmail(email);
  if (exsitedUsers.length == 0) {
    res.status(401).send('Email or password is not correct');
    return;
  }
  const exsitedUser = exsitedUsers[0];

  if (await isPasswordMatch(exsitedUser, password)) {
    const user = await findUserByEmail(email);
    const token = await generateAccessToken(exsitedUser);
    res.status(200).send({ user, token });
    return;
  }
  res.status(404).send('Email or password is not correct');
};

export { register, login };
