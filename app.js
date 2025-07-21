const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require('./routes/matchRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const userActionsRoutes = require('./routes/userActionsRoutes');
const chatRoutes = require('./routes/chatRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/user-actions', userActionsRoutes);
app.use('/api/chat', chatRoutes);

module.exports = app;
