import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const messagesPath = path.join(__dirname, 'messages.json');
const numberPath = path.join(__dirname, 'number.json');

// Messages endpoints
app.get('/api/messages', (req, res) => {
  fs.readFile(messagesPath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read messages.' });
    const parsed = JSON.parse(data);
    res.json(parsed.messages || []);
  });
});

app.post('/api/messages', (req, res) => {
  const newMsg = req.body;
  fs.readFile(messagesPath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read messages.' });
    let parsed = JSON.parse(data);
    if (!Array.isArray(parsed.messages)) parsed.messages = [];
    parsed.messages.push(newMsg);
    fs.writeFile(messagesPath, JSON.stringify(parsed, null, 2), err2 => {
      if (err2) return res.status(500).json({ error: 'Failed to write messages.' });
      res.json({ success: true });
    });
  });
});

// Number endpoints
app.get('/api/number', (req, res) => {
  fs.readFile(numberPath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read number.' });
    res.json(JSON.parse(data));
  });
});

app.put('/api/number', (req, res) => {
  const { number } = req.body;
  const newObj = { number };
  fs.writeFile(numberPath, JSON.stringify(newObj, null, 2), err => {
    if (err) return res.status(500).json({ error: 'Failed to update number.' });
    res.json({ success: true });
  });
});

app.delete('/api/number', (req, res) => {
  const newObj = { number: '' };
  fs.writeFile(numberPath, JSON.stringify(newObj, null, 2), err => {
    if (err) return res.status(500).json({ error: 'Failed to clear number.' });
    res.json({ success: true });
  });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
