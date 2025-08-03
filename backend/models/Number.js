import mongoose from 'mongoose';

const numberSchema = new mongoose.Schema({
  number: String,
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Number', numberSchema);
