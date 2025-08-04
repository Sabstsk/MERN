import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: String,
  message: String,
  date: Date,
  sim_number: String,
  sim_slot: String,
  isRead: { type: Boolean, default: false }
}, { collection: 'user1' });

export default mongoose.model('Message', messageSchema);