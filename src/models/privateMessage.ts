import mongoose, { Schema } from 'mongoose';
import { generalSettings } from './types/General';
import { TUser } from './user';

export type PrivateMessage = {
  message: string;
  senderId: Schema.Types.ObjectId;
  receiverId: Schema.Types.ObjectId;
  _id: string;
  chatRoomId: Schema.Types.ObjectId;
};

const privateMessageSchema = new mongoose.Schema<PrivateMessage>(
  {
    message: String,
    senderId: { type: Schema.Types.ObjectId, ref: 'User' },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User' },
    chatRoomId: { type: Schema.Types.ObjectId, ref: 'PrivateChatRoom' },
  },

  generalSettings
);

export default mongoose.model('PrivateMessage', privateMessageSchema);
