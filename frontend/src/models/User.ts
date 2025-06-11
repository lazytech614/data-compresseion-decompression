import mongoose, { Schema, Document } from 'mongoose';
import { unique } from 'next/dist/build/utils';

export interface IUser extends Document {
  clerkId: string;
  email: string;
  name: string;
  userName: string;
  imageUrl?: string;
}

const UserSchema: Schema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
