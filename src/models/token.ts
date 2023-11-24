import mongoose, { Schema ,Types } from 'mongoose';
import { generalFields, generalSettings } from './types/General';
import { TUser } from './user';

export type Token = {
  token: string;
  userId: Types.ObjectId;
  expiredAt: Date;
  id: string;
};

const tokenSchema = new mongoose.Schema<Token>(
  {
    token: { type: String, trim: true, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    expiredAt: { type: Date, required: true },
  },

  generalSettings
);

export default mongoose.model('Token', tokenSchema);
