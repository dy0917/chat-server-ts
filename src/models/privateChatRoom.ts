import mongoose, { Schema } from 'mongoose';
import { generalSettings } from './types/General';

export type PrivateChatRoom = {
  users: Schema.Types.ObjectId[];
  _id: string;
};

const privateChatRoomSchema = new mongoose.Schema<PrivateChatRoom>(
  {
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },

  generalSettings
);

export default mongoose.model('PrivateChatRoom', privateChatRoomSchema);
