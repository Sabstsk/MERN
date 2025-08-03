import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

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
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message); // <-- log error message
    process.exit(1);
  }
}
connectDB();

// ✅ Root check
app.get('/', (req, res) => {
  res.send('✅ Server ready');
});

//
// 📩 Message Endpoints
//
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await db.collection('messages').find().sort({ date: -1 }).toArray();
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
app.get('/api/number', async (req, res) => {
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


app.put('/api/number', async (req, res) => {
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