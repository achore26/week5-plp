# Real-Time Chat Application

A modern, full-featured real-time chat application built with React, Node.js, Express, and Socket.IO. This application provides seamless communication with authentication, private messaging, file uploads, notifications, and much more.

## 🚀 Features

### 🔐 Authentication & Security
- **JWT-based Authentication**: Secure login and registration system
- **Password Hashing**: Bcrypt encryption for password security
- **Session Management**: Automatic token expiration and refresh

### 💬 Messaging System
- **Real-time Messaging**: Instant message delivery using Socket.IO
- **Multiple Chat Rooms**: Support for different channels/rooms
- **Private Messaging**: Direct user-to-user communication
- **Message Persistence**: Chat history maintained across sessions
- **Message Search**: Search through chat history
- **Typing Indicators**: See when users are typing

### 👥 User Management
- **Online Status**: Real-time user presence indicators
- **User List**: See all connected users
- **Status Updates**: Online/offline/away status management
- **User Join/Leave Notifications**: System messages for user activity

### 📁 File Sharing
- **File Uploads**: Share files with other users
- **File Serving**: Secure file download and viewing
- **File Information**: File metadata and size information

### 🔔 Notifications
- **Browser Notifications**: Desktop notifications for new messages
- **Sound Notifications**: Audio alerts for incoming messages
- **Mobile-Optimized**: Smart notification handling for mobile devices
- **Unread Counters**: Track unread messages per room/user

### 📱 User Interface
- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Works on desktop and mobile
- **Grid Layout**: Sidebar with main chat area
- **Message Bubbles**: WhatsApp/Slack-style message display
- **Dark Sidebar**: Professional dark theme for navigation

### 🔄 Advanced Features
- **Connection Recovery**: Automatic reconnection handling
- **Infinite Scroll**: Load older messages on demand
- **Message Pagination**: Efficient message loading
- **Error Handling**: Comprehensive error management
- **CORS Support**: Cross-origin resource sharing

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks
- **Socket.IO Client**: Real-time communication
- **CSS3**: Modern styling with flexbox/grid
- **HTML5**: Semantic markup

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **Socket.IO**: Real-time communication
- **JWT**: Authentication tokens
- **Bcrypt**: Password hashing
- **UUID**: Unique message identifiers
- **CORS**: Cross-origin support
- **File System**: File upload handling

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **Git** (for version control)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd realtime-chat-app
```

### 2. Install Dependencies

#### Server Dependencies
```bash
cd server
npm install
```

#### Client Dependencies
```bash
cd ../client
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the server directory:
```bash
# Server Configuration
PORT=5000
SECRET_KEY=your-super-secret-jwt-key-here
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

### 4. Start the Application

#### Start the Server
```bash
cd server
npm start
```

#### Start the Client (in a new terminal)
```bash
cd client
npm start
```

The application will be available at:
- **Client**: http://localhost:3000
- **Server**: http://localhost:5000

## 📖 Usage Guide

### Getting Started
1. **Register**: Create a new account with username and password
2. **Login**: Sign in with your credentials
3. **Join Rooms**: Click on room names in the sidebar to join
4. **Send Messages**: Type in the input field and press Enter or click Send
5. **Private Messages**: Click on usernames to start private conversations

### Features Usage

#### Chat Rooms
- **General**: Default public room for all users
- **Random**: Secondary public room
- **Room Switching**: Click room names to switch between channels

#### Private Messaging
- **Start Chat**: Click on any username in the sidebar
- **Send Message**: Type and send private messages
- **Notifications**: Get alerts for new private messages

#### File Sharing
- **Upload Files**: Use the file input to share files
- **View Files**: Click on file links to download/view
- **File Types**: Supports images, documents, and other file types

#### Notifications
- **Enable**: Click "Enable Notifications" when prompted
- **Sound**: Audio notifications for all new messages
- **Visual**: Browser notifications when window is not active

## 🏗️ Project Structure

```
realtime-chat-app/
├── client/                     # React frontend
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── App.js             # Main React component
│   │   ├── App.css            # Application styles
│   │   └── index.js           # React entry point
│   └── package.json
├── server/                     # Node.js backend
│   ├── index.js               # Server entry point
│   ├── uploads/               # File upload directory
│   └── package.json
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## 🔧 API Endpoints

### REST API
- `GET /messages?page=1&limit=20&room=general` - Get paginated messages
- `GET /search?query=hello&room=general` - Search messages
- `GET /file-info/:filename` - Get file information
- `GET /uploads/:filename` - Download files

### Socket.IO Events

#### Authentication
- `register` - Register new user
- `login` - User login
- `register_user` - Register user session

#### Messaging
- `send_message` - Send global message
- `room_message` - Send room message
- `private_message` - Send private message
- `receive_message` - Receive message
- `load_messages` - Load message history

#### User Management
- `user_status_update` - User status changes
- `user_joined` - User join notification
- `user_left` - User leave notification
- `typing` - Typing indicator

#### Room Management
- `join_room` - Join a room
- `room_update` - Room message updates

#### File Handling
- `file_upload` - Upload file
- `new_file` - New file notification

## 🎨 Customization

### Styling
- Modify `client/src/App.css` for custom styles
- Update color scheme in CSS variables
- Customize layout in React components

### Adding Features
- Add new socket events in `server/index.js`
- Implement UI components in `client/src/App.js`
- Add new API endpoints as needed

### Configuration
- Update CORS settings in server configuration
- Modify JWT expiration times
- Adjust file upload limits

## 🔒 Security Considerations

### Production Deployment
1. **Change Secret Key**: Use a strong, random JWT secret
2. **Environment Variables**: Store sensitive data in environment variables
3. **HTTPS**: Use SSL/TLS in production
4. **Rate Limiting**: Implement rate limiting for API endpoints
5. **Input Validation**: Add comprehensive input validation
6. **File Upload Security**: Validate file types and sizes

### Security Features
- Password hashing with bcrypt
- JWT token authentication
- CORS protection
- Input sanitization
- File upload validation

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 5000
sudo lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
sudo lsof -ti:3000 | xargs kill -9
```

#### Connection Issues
- Check if both server and client are running
- Verify CORS configuration
- Check network connectivity

#### File Upload Issues
- Ensure uploads directory exists
- Check file size limits
- Verify file permissions

### Debug Mode
Enable debug logging by setting environment variable:
```bash
DEBUG=socket.io:* npm start
```

## 📝 Development

### Adding New Features
1. **Server-side**: Add socket event handlers in `server/index.js`
2. **Client-side**: Add React components and event listeners
3. **Database**: Extend the in-memory storage or add real database
4. **Testing**: Add unit and integration tests

### Code Style
- Use ES6+ features
- Follow React best practices
- Implement proper error handling
- Add comprehensive comments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Socket.IO for real-time communication
- React team for the excellent frontend framework
- Express.js for the robust backend framework
- All contributors and users of this application

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Happy Chatting! 🎉**
