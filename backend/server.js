import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import Message from './models/Message.js';
import NumberModel from './models/Number.js';

dotenv.config();

// 🔗 MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/messages';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ Root check
app.get('/', (req, res) => {
  res.send('✅ Server ready');
});

//
// 📩 Message Endpoints
//
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ date: -1 }); // ➡️ Updated to sort by 'date'
    res.json(messages);
  } catch (err) {
    console.error('GET /api/messages error:', err);
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    // ➡️ Updated to destructure the new fields from the request body
    const { id, sender, message, date, sim_number, sim_slot } = req.body;
    
    // ➡️ Created a new message with the updated fields
    const newMsg = new Message({ id, sender, message, date, sim_number, sim_slot });
    
    await newMsg.save();
    res.json({ success: true, message: newMsg });
  } catch (err) {
    console.error('POST /api/messages error:', err);
    res.status(500).json({ error: 'Failed to save message.' });
  }
});

//
// 📱 Number Endpoints
//
app.get('/api/number', async (req, res) => {
  try {
    let numberDoc = await NumberModel.findOne();
    if (!numberDoc) {
      numberDoc = await NumberModel.create({ number: '' });
    }
    // ➡️ Updated line: Send only the 'number' property.
    res.json(numberDoc.number);
  } catch (err) {
    console.error('GET /api/number error:', err);
    res.status(500).json({ error: 'Failed to fetch number.' });
  }
});


app.put('/api/number', async (req, res) => {
  try {
    const { number } = req.body;
    let numberDoc = await NumberModel.findOne();

    if (!numberDoc) {
      numberDoc = new NumberModel({ number });
    } else {
      numberDoc.number = number;
      numberDoc.updatedAt = Date.now();
    }

    await numberDoc.save();
    res.json({ success: true, number: numberDoc });
  } catch (err) {
    console.error('PUT /api/number error:', err);
    res.status(500).json({ error: 'Failed to update number.' });
  }
});

app.delete('/api/number', async (req, res) => {
  try {
    const numberDoc = await NumberModel.findOne();
    if (numberDoc) {
      numberDoc.number = '';
      numberDoc.updatedAt = Date.now();
      await numberDoc.save();
    }
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/number error:', err);
    res.status(500).json({ error: 'Failed to clear number.' });
  }
});

//
// 🌐 Serve Frontend in Production
//
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Backend server running at http://localhost:${PORT}`);
});