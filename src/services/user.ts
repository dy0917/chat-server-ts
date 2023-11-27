import User from '../models/user';
import type { TUser } from '../models/user';
import bcrypt from 'bcrypt';

const createUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = new User({
    firstName,
    lastName,
    email,
    salt,
    password: hash,
  });
  return await user.save();
};

const findUserFullDetailByEmail = async (email: string) => {
  const user = await User.findOne({ email }).select('password salt');
  return user;
};

const findUserByEmail = async (email: string) => {
  const user = await User.findOne({ email }).exec();
  return user;
};

const findUserById = async (_id: string) => {
  const user = await User.findOne({ _id }).exec();
  return user;
};

const findUserByQueryString = async (queryString: string) => {
  const regex = new RegExp(queryString, 'i');
  const users = await User.find({
    $or: [
      { firstName: regex },
      { lastName: regex },

    ],
  })
    .exec();
  return users;
};

export {
  createUser,
  findUserByEmail,
  findUserFullDetailByEmail,
  findUserById,
  findUserByQueryString,
};
