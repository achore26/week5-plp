const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const SECRET_KEY = 'your-secret-key-here'; // Change this in production!

const app = express();
app.use(cors());
const server = http.createServer(app);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Add basic file info endpoint
app.get('/file-info/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);
  
  fs.stat(filePath, (err, stats) => {
    if (err) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    res.json({
      name: filename,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime
    });
  });
});

// Add these NEW endpoints (before socket.io code)
app.get('/messages', (req, res) => {
  const { page = 1, limit = 20, room = 'general' } = req.query;
  const startIndex = (page - 1) * limit;
  const roomMessages = rooms[room] || [];
  res.json({
    messages: roomMessages.slice(startIndex, startIndex + limit),
    total: roomMessages.length
  });
});

app.get('/search', (req, res) => {
  const { query, room = 'general' } = req.query;
  const results = (rooms[room] || []).filter(msg => 
    msg.message.toLowerCase().includes(query.toLowerCase())
  );
  res.json(results);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  },
  connectionStateRecovery: { // NEW: Reconnection support
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true
  }
});

// Mock database
const users = [];
const onlineUsers = {};
const messages = [];
// Track rooms
const rooms = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Add these new socket events
  socket.on('register', async ({ username, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    socket.emit('register_success');
  });

  socket.on('login', async ({ username, password }) => {
    const user = users.find(u => u.username === username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return socket.emit('auth_error', 'Invalid credentials');
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    socket.emit('login_success', { token, username });
  });

  socket.on('register_user', (username) => {
    onlineUsers[socket.id] = { username, status: 'online' };
    io.emit('user_status_update', onlineUsers);
    io.emit('user_joined', username); // New event
    console.log(`User ${username} registered`);
  });

  socket.on('send_message', (data) => {
    const message = {
      ...data,
      id: uuidv4(), // NEW: Unique ID for each message
      timestamp: new Date().toISOString()
    };
    
    if (data.room) {
      rooms[data.room] = [...(rooms[data.room] || []), message];
      io.to(data.room).emit('receive_message', message);
    } else {
      messages.push(message);
      io.emit('receive_message', message);
    }
  });

  // Add new event to load previous messages
  socket.on('request_messages', () => {
    socket.emit('load_messages', messages);
  });

  socket.on('update_status', (status) => {
    if (onlineUsers[socket.id]) {
      onlineUsers[socket.id].status = status;
      io.emit('user_status_update', onlineUsers);
    }
  });

  socket.on('get_user_status', () => {
    socket.emit('user_status_update', onlineUsers);
  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });

  // Add these events inside the connection handler
  socket.on('private_message', ({ to, message }) => {
    const fromUser = onlineUsers[socket.id]?.username;
    if (!fromUser) return;

    // Find recipient's socket ID
    const recipientEntry = Object.entries(onlineUsers).find(
      ([_, user]) => user.username === to
    );

    if (recipientEntry) {
      const [recipientSocketId] = recipientEntry;
      io.to(recipientSocketId).emit('private_message', {
        from: fromUser,
        message,
        timestamp: new Date().toISOString()
      });
    }
  });

  // New events
  socket.on('join_room', (roomName) => {
    socket.join(roomName);
    rooms[roomName] = rooms[roomName] || [];
    io.to(roomName).emit('room_update', rooms[roomName]);
  });

  socket.on('room_message', ({ room, message }) => {
    const msgData = {
      sender: onlineUsers[socket.id]?.username,
      message,
      timestamp: new Date().toISOString()
    };
    rooms[room] = rooms[room] || [];
    rooms[room].push(msgData);
    io.to(room).emit('room_message', msgData);
  });

  // Handle file uploads
  socket.on('file_upload', ({ file, fileName, room }, callback) => {
    // Validate inputs
    if (!file || !fileName || !room) {
      return callback(new Error('Missing required fields'));
    }
    
    // Sanitize filename
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '');
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${sanitizedFileName}`;
    
    const filePath = path.join(uploadsDir, uniqueFileName);
    
    // Convert base64 to buffer if needed
    const fileBuffer = Buffer.isBuffer(file) ? file : Buffer.from(file, 'base64');
    
    fs.writeFile(filePath, fileBuffer, (err) => {
      if (err) {
        console.error('File upload error:', err);
        return callback(err);
      }
      
      const fileData = {
        url: `/uploads/${uniqueFileName}`,
        name: fileName,
        sender: onlineUsers[socket.id]?.username,
        timestamp: new Date().toISOString(),
        room: room
      };
      
      io.to(room).emit('new_file', fileData);
      callback(null, fileData);
    });
  });

  socket.on('disconnect', () => {
    const userInfo = onlineUsers[socket.id];
    if (userInfo) {
      delete onlineUsers[socket.id];
      io.emit('user_status_update', onlineUsers);
      io.emit('user_left', userInfo.username); // New event
      console.log(`User ${userInfo.username} disconnected`);
    }
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
