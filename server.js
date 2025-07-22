require('dotenv').config(); // 🔥 Ensure this is at the top

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
// ✅ Add security headers
app.use(helmet());

// ✅ Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);


// ✅ Socket.io setup
const io = new Server(server, {
  cors: {
    origin: '*', // or specify frontend URL
    methods: ['GET', 'POST']
  }
});

// 💬 Active users map
const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register', (userId) => {
    activeUsers.set(userId, socket.id);
  });

  socket.on('sendMessage', ({ senderId, receiverId, text }) => {
    const receiverSocketId = activeUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', { senderId, text });
    }
  });

  socket.on('disconnect', () => {
    for (let [uid, sid] of activeUsers.entries()) {
      if (sid === socket.id) activeUsers.delete(uid);
    }
    console.log('User disconnected:', socket.id);
  });
});

// ✅ MongoDB connection
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('❌ MONGO_URI is missing in .env file!');
  process.exit(1);
}

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  server.listen(5000, () => {
    console.log('🚀 Server + WebSocket running on port 5000');
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});
