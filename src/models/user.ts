import mongoose, { Document, Schema, ToObjectOptions  } from 'mongoose';
import { generalFields, generalSettings } from './types/General';


// type UserDocument = Document & {
//   username: string;
//   email: string;
//   password: string;
//   // Other user fields...
// };

// const userASchema = new mongoose.Schema<UserDocument>({
//   username: String,
//   email: String,
//   password: String,
//   // Other user fields...
// });

// // Exclude the 'password' field by default
// userASchema.set('toJSON', {
//   transform: bool | (doc: UserDocument, ret: UserDocument, options) => {
//     delete ret.password;
//     return ret;
//   },
// });

// const User = mongoose.model<UserDocument>('UserA', userASchema);


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

// userSchema.set('toJSON', {
//   transform: (doc: UserDocument, ret: UserDocument) => {
//     delete ret.password;
//     return ret;
//   },
// });

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
