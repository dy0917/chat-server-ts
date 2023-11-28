import mongoose, { Document, Schema, ToObjectOptions  } from 'mongoose';
import { generalFields, generalSettings } from './types/General';
export type TUser = Document & {
  firstName: string;
  lastName: string;
  email: string;
  salt: string;
  password: string;
  _id: string;
  socketId: string;
};


const userSchema = new mongoose.Schema<TUser>(
  {
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    salt: { type: String, required: true },
    password: { type: String, required: true },
    socketId: String,
  },
  generalSettings
);


// Exclude fields by default
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.salt;
    delete ret.createAt;
    delete ret.updateAt;
    return ret;
  },
});

export default mongoose.model<TUser>('User', userSchema);
