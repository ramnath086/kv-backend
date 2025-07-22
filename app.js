const express = require('express'); 
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require('./routes/matchRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const userActionsRoutes = require('./routes/userActionsRoutes');
const chatRoutes = require('./routes/chatRoutes');

dotenv.config();
const app = express();

// ✅ Security headers
app.use(helmet());

// ✅ Rate limiting (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: '⚠️ Too many requests from this IP. Please try again after 15 minutes.'
});
app.use(limiter);

// ✅ Enable CORS for frontend (adjust origin if needed)
app.use(cors());

// ✅ Parse JSON bodies
app.use(express.json());

// ✅ Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/user-actions', userActionsRoutes);
app.use('/api/chat', chatRoutes);

// ✅ Health check endpoint
app.get('/', (req, res) => {
  res.send('✅ KV Backend is live with security headers and rate limiting');
});

module.exports = app;
