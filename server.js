const mongoose = require('mongoose');
const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);

// ✅ Socket.io setup
const io = new Server(server, {
  cors: {
    origin: '*', // or restrict to frontend URL
    methods: ['GET', 'POST']
  }
});

// 💬 Store active users
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

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(5000, () => console.log('Server + WebSocket running on port 5000'));
  })
  .catch(err => console.error(err));