import mongoose, { Schema } from 'mongoose';
import { generalSettings } from './types/General';

export type PrivateMessage = {
  context: string;
  senderId: Schema.Types.ObjectId;
  receiverId: Schema.Types.ObjectId;
  _id: string;
  chatRoomId: Schema.Types.ObjectId;
};

const privateMessageSchema = new mongoose.Schema<PrivateMessage>(
  {
    context: String,
    senderId: { type: Schema.Types.ObjectId, ref: 'User' },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User' },
    chatRoomId: { type: Schema.Types.ObjectId, ref: 'PrivateChatRoom' },
  },

  generalSettings
);

privateMessageSchema.set('toJSON', {
    transform: (doc, ret) => {
      delete ret.createAt;
      delete ret.updateAt;
      return ret;
    },
  });

export default mongoose.model('PrivateMessage', privateMessageSchema);
