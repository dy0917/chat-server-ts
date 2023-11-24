import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const generalFields = {
  id: { type: Schema.Types.ObjectId, auto: true, required: true },
};
export const generalSettings = { timestamps: true };
