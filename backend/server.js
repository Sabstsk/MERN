import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import apiKeyAuth from './middleware/apiKeyAuth.js';
import auth from './middleware/auth.js';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI; // Use your .env for the URI

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function connectDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Pinged your deployment. You successfully connected to MongoDB!");
    db = client.db(); // Default DB from URI

    // Start server only after DB is connected
    app.listen(PORT, () => {
      console.log(`🚀 Backend server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
}
connectDB();

// ✅ Root check
app.get('/', (req, res) => {
  res.send('✅ Server ready');
});

// 🔑 Login route for JWT token
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;
  if (username === adminUser && password === adminPass) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

//
// 📩 Message Endpoints
//
// Website: GET /api/messages (auth required)
app.get('/api/messages', auth, async (req, res) => {
  try {
    const messages = await db.collection('messages').find().sort({ date: -1 }).toArray();
    res.json(messages);
  } catch (err) {
    console.error('GET /api/messages error:', err);
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});

// Mobile: POST /api/messages (API key required)
app.post('/api/messages', apiKeyAuth, async (req, res) => {
  try {
    // ➡️ Updated to destructure the new fields from the request body
    const { id, sender, message, date, sim_number, sim_slot } = req.body;
    
    // ➡️ Created a new message with the updated fields
    const newMsg = { id, sender, message, date, sim_number, sim_slot };
    
    await db.collection('messages').insertOne(newMsg);
    res.json({ success: true, message: newMsg });
  } catch (err) {
    console.error('POST /api/messages error:', err);
    res.status(500).json({ error: 'Failed to save message.' });
  }
});

//
// 📱 Number Endpoints
//
// Mobile: GET /api/number (API key required)
app.get('/api/number', apiKeyAuth, async (req, res) => {
  try {
    let numberDoc = await db.collection('numbers').findOne();
    if (!numberDoc) {
      numberDoc = { number: '' };
      await db.collection('numbers').insertOne(numberDoc);
    }
    // ➡️ Updated line: Send only the 'number' property.
    res.json(numberDoc.number);
  } catch (err) {
    console.error('GET /api/number error:', err);
    res.status(500).json({ error: 'Failed to fetch number.' });
  }
});

// Website: GET /api/number (auth required)
app.get('/api/number/web', auth, async (req, res) => {
  try {
    let numberDoc = await db.collection('numbers').findOne();
    if (!numberDoc) {
      numberDoc = { number: '' };
      await db.collection('numbers').insertOne(numberDoc);
    }
    res.json(numberDoc.number);
  } catch (err) {
    console.error('GET /api/number/web error:', err);
    res.status(500).json({ error: 'Failed to fetch number.' });
  }
});


// Website: PUT /api/number (auth required)
app.put('/api/number', auth, async (req, res) => {
  try {
    const { number } = req.body;
    let numberDoc = await db.collection('numbers').findOne();

    if (!numberDoc) {
      numberDoc = { number };
      await db.collection('numbers').insertOne(numberDoc);
    } else {
      numberDoc.number = number;
      numberDoc.updatedAt = Date.now();
      await db.collection('numbers').updateOne({ _id: numberDoc._id }, { $set: numberDoc });
    }

    res.json({ success: true, number: numberDoc });
  } catch (err) {
    console.error('PUT /api/number error:', err);
    res.status(500).json({ error: 'Failed to update number.' });
  }
});

// (Optional) DELETE /api/number (no auth applied here)
app.delete('/api/number', async (req, res) => {
  try {
    const numberDoc = await db.collection('numbers').findOne();
    if (numberDoc) {
      numberDoc.number = '';
      numberDoc.updatedAt = Date.now();
      await db.collection('numbers').updateOne({ _id: numberDoc._id }, { $set: numberDoc });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/number error:', err);
    res.status(500).json({ error: 'Failed to clear number.' });
  }
});

// Website: DELETE /api/messages/:id (auth required)
app.delete('/api/messages/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers['authorization'] || req.headers['Authorization'];
    console.log('DELETE /api/messages/:id called');
    console.log('ID received:', id);
    console.log('Token received:', token);
    // ObjectId is now imported at the top of the file
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (objectIdErr) {
      console.error('Invalid ObjectId:', id, objectIdErr);
      return res.status(400).json({ error: 'Invalid message ID format.' });
    }
    const result = await db.collection('messages').deleteOne({ _id: objectId });
    console.log('Delete result:', result);
    if (result.deletedCount === 0) {
      console.warn('Message not found for id:', id);
      return res.status(404).json({ error: 'Message not found.' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/messages/:id error:', err);
    res.status(500).json({ error: 'Failed to delete message.', details: err.message });
  }
});

// Website: DELETE /api/messages (delete all, auth required)
app.delete('/api/messages', auth, async (req, res) => {
  try {
    const result = await db.collection('messages').deleteMany({});
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    console.error('DELETE /api/messages error:', err);
    res.status(500).json({ error: 'Failed to delete all messages.' });
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