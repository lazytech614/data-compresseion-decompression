import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  clerkId: String,
  email: String,
  name: String,
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
