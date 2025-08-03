import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  id: Number,
  sender: String,
  message: String,
  date: Date,
  sim_number: String,
  sim_slot: String
}, { collection: 'user1' });

export default mongoose.model('Message', messageSchema);