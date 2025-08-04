// Middleware for API Key authentication
export default function apiKeyAuth(req, res, next) {
  const apiKey = req.header('x-api-key');
  const validApiKey = process.env.API_KEY;
  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }
  next();
}

