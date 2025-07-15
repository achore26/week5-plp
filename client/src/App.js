import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import './App.css';
// Add to the top
// import notificationSound from './notification.mp3'; // Add a sound file when available

// Modify socket connection to include reconnection
const socket = io('http://localhost:5000', {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

function App() {
  // Check if mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [onlineUsers, setOnlineUsers] = useState({});
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  // New state variables
  const [isAuth, setIsAuth] = useState(false);
  const [authError, setAuthError] = useState('');
  // Private messaging state
  const [privateMessages, setPrivateMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [privateMessage, setPrivateMessage] = useState('');
  // New state
  const [rooms, setRooms] = useState(['general', 'random']);
  const [roomMessages, setRoomMessages] = useState({});
  const [activeChat, setActiveChat] = useState('general');
  const [unreadCounts, setUnreadCounts] = useState({
    global: 0,
    // Will track like: { "username": X, "roomname": Y }
  });
  
  // Add these NEW states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Inside your component
  const playSound = () => {
    // For now, we'll use a simple beep sound or you can add a sound file later
    try {
      // Create a simple beep sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
    
    // Uncomment this when you add the sound file:
    // const audio = new Audio(notificationSound);
    // audio.play();
  };

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window) {
      Notification.requestPermission();
    }

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('user_list_updated', (userList) => {
      setOnlineUsers(userList);
    });

    // Add to useEffect
    socket.on('user_status_update', (users) => {
      setOnlineUsers(users);
    });

    // New message notification
    socket.on('receive_message', (data) => {
      setMessages(prev => [...prev, data]);
      
      // Play sound on new messages
      playSound();
      
      // Update unread counter if not in global chat
      if (activeChat !== 'global') {
        setUnreadCounts(prev => ({
          ...prev,
          global: prev.global + 1
        }));
      }
      
      // Show notification if document is hidden or user is not in global chat
      if (document.hidden || activeChat !== 'global') {
        if (Notification.permission === 'granted') {
          // Only show browser notifications on desktop
          if (!isMobile && document.hidden) {
            new Notification(`New message from ${data.sender}`, {
              body: data.message,
              icon: '/logo192.png' // Optional
            });
          }
        }
      }
    });

    socket.on('typing', (data) => {
      if (data.isTyping && !typingUsers.includes(data.username)) {
        setTypingUsers(prev => [...prev, data.username]);
      } else if (!data.isTyping) {
        setTypingUsers(prev => prev.filter(user => user !== data.username));
      }
    });

    // Add these socket listeners in useEffect
    socket.on('register_success', () => {
      setAuthError('');
      alert('Registration successful! Please login.');
    });

    socket.on('login_success', ({ token, username }) => {
      localStorage.setItem('token', token);
      setUsername(username);
      setIsAuth(true);
    });

    socket.on('load_messages', (loadedMessages) => {
      setMessages(loadedMessages);
    });

    socket.on('auth_error', (error) => {
      setAuthError(error);
    });

    // Private message notification
    socket.on('private_message', (data) => {
      setPrivateMessages(prev => [...prev, data]);
      
      // Play sound on new messages
      playSound();
      
      // Update unread counter if not currently chatting with sender
      if (selectedUser !== data.from) {
        setUnreadCounts(prev => ({
          ...prev,
          [data.from]: (prev[data.from] || 0) + 1
        }));
      }
      
      // Show notification if document is hidden or user is not chatting with sender
      if (document.hidden || selectedUser !== data.from) {
        if (Notification.permission === 'granted') {
          // Only show browser notifications on desktop
          if (!isMobile && document.hidden) {
            new Notification(`Private message from ${data.from}`, { 
              body: data.message,
              icon: '/logo192.png'
            });
          }
        }
      }
    });

    // Add to useEffect
    socket.on('room_message', (msg) => {
      const roomName = msg.room || activeChat;
      setRoomMessages(prev => ({
        ...prev,
        [roomName]: [...(prev[roomName] || []), msg]
      }));
      
      // Update unread counter if not currently in the room
      if (activeChat !== roomName) {
        setUnreadCounts(prev => ({
          ...prev,
          [roomName]: (prev[roomName] || 0) + 1
        }));
      }
      
      // Show notification if document is hidden or user is not in the room
      if (document.hidden || activeChat !== roomName) {
        if (Notification.permission === 'granted') {
          // Only show browser notifications on desktop
          if (!isMobile && document.hidden) {
            new Notification(`New message in #${roomName} from ${msg.sender}`, {
              body: msg.message,
              icon: '/logo192.png'
            });
          }
        }
        playSound();
      }
    });

    socket.on('room_update', (messages) => {
      setRoomMessages(prev => ({
        ...prev,
        [activeChat]: messages
      }));
    });

    // File upload notification
    socket.on('new_file', (fileData) => {
      if (document.hidden || activeChat !== fileData.room) {
        if (Notification.permission === 'granted') {
          // Only show browser notifications on desktop
          if (!isMobile && document.hidden) {
            new Notification(`New file from ${fileData.sender}`, {
              body: `${fileData.name} was uploaded to #${fileData.room}`,
              icon: '/logo192.png'
            });
          }
        }
        playSound();
      }
    });

    // Add to useEffect
    socket.on('user_joined', (username) => {
      setMessages(prev => [...prev, {
        sender: 'System',
        message: `${username} joined the chat`,
        isSystem: true
      }]);
    });

    socket.on('user_left', (username) => {
      setMessages(prev => [...prev, {
        sender: 'System',
        message: `${username} left the chat`,
        isSystem: true
      }]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('user_list_updated');
      socket.off('user_status_update');
      socket.off('receive_message');
      socket.off('typing');
      socket.off('register_success');
      socket.off('login_success');
      socket.off('auth_error');
      socket.off('load_messages');
      socket.off('private_message');
      socket.off('room_message');
      socket.off('room_update');
      socket.off('new_file');
      socket.off('user_joined');
      socket.off('user_left');
    };
  }, [typingUsers, activeChat, selectedUser]);

  // Request messages on auth
  useEffect(() => {
    if (isAuth) {
      socket.emit('request_messages');
      // Join default room
      socket.emit('join_room', activeChat);
    }
  }, [isAuth, activeChat]);

  // Add this NEW effect for infinite scroll
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      if (container.scrollTop === 0 && hasMore) {
        loadMoreMessages();
      }
    };
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMore, page, activeChat]);

  // Handle message sending
  const handleRegister = (e) => {
    e.preventDefault();
    if (username.trim()) {
      socket.emit('register_user', username.trim());
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && username) {
      const messageData = {
        sender: username,
        message: message.trim(),
        timestamp: new Date().toISOString()
      };
      socket.emit('send_message', messageData);
      setMessage('');
    }
  };

  const handleMessageChange = (e) => {
    const msg = e.target.value;
    setMessage(msg);
    
    if (msg && !isTyping) {
      socket.emit('typing', { username, isTyping: true });
      setIsTyping(true);
    } else if (!msg && isTyping) {
      socket.emit('typing', { username, isTyping: false });
      setIsTyping(false);
    }
  };

  const handleSendPrivateMessage = (e) => {
    e.preventDefault();
    if (privateMessage.trim() && selectedUser) {
      socket.emit('private_message', {
        to: selectedUser,
        message: privateMessage.trim()
      });
      setPrivateMessage('');
    }
  };

  const handleSendRoomMessage = (e) => {
    e.preventDefault();
    if (message.trim() && activeChat && username) {
      const messageData = {
        room: activeChat,
        message: message.trim()
      };
      socket.emit('room_message', messageData);
      setMessage('');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        socket.emit('file_upload', {
          file: reader.result,
          fileName: file.name,
          room: activeChat
        }, (error, fileData) => {
          if (error) {
            console.error('File upload error:', error);
            alert('Failed to upload file');
          } else {
            console.log('File uploaded successfully:', fileData);
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearUnreadCount = (chatContext) => {
    setUnreadCounts(prev => ({
      ...prev,
      [chatContext]: 0
    }));
  };

  const resetUnread = (chatType, chatId) => {
    if (chatType === 'global') {
      setUnreadCounts(prev => ({
        ...prev,
        global: 0
      }));
    } else if (chatType === 'room') {
      setUnreadCounts(prev => ({
        ...prev,
        [chatId]: 0
      }));
    } else if (chatType === 'private') {
      setUnreadCounts(prev => ({
        ...prev,
        [chatId]: 0
      }));
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          // Only show browser notifications on desktop
          if (!isMobile) {
            new Notification('Notifications enabled!', {
              body: 'You will now receive notifications for new messages.',
              icon: '/logo192.png'
            });
          }
        }
      });
    }
  };

  // Add this NEW function
  const loadMoreMessages = async () => {
    const response = await fetch(
      `http://localhost:5000/messages?page=${page + 1}&limit=10&room=${activeChat}`
    );
    const data = await response.json();
    
    if (data.messages.length > 0) {
      setMessages(prev => [...data.messages, ...prev]);
      setPage(prev => prev + 1);
    } else {
      setHasMore(false);
    }
  };

  // Add this NEW search function
  const handleSearch = async (query) => {
    const response = await fetch(
      `http://localhost:5000/search?query=${query}&room=${activeChat}`
    );
    const results = await response.json();
    console.log('Search results:', results);
  };

  // Add missing functions for the new layout
  const joinRoom = (room) => {
    setActiveChat(room);
    resetUnread('room', room);
    socket.emit('join_room', room);
  };

  // New auth components
  if (!isAuth) {
    return (
      <div className="auth-container">
        <h1>Real-Time Chat App</h1>
        <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
        
        <h2>Login</h2>
        {authError && <div className="error">{authError}</div>}
        <form onSubmit={(e) => {
          e.preventDefault();
          socket.emit('login', { 
            username: e.target.username.value, 
            password: e.target.password.value 
          });
        }}>
          <input name="username" placeholder="Username" required />
          <input name="password" type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
        
        <h2>Register</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          socket.emit('register', { 
            username: e.target.newUsername.value, 
            password: e.target.newPassword.value 
          });
        }}>
          <input name="newUsername" placeholder="Username" required />
          <input name="newPassword" type="password" placeholder="Password" required />
          <button type="submit">Register</button>
        </form>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="user-info">
          <h3>Welcome, {username}!</h3>
          <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
        </div>

        {/* Notification permission request */}
        {'Notification' in window && Notification.permission === 'default' && (
          <div className="notification-permission">
            <button onClick={requestNotificationPermission}>Enable Notifications</button>
          </div>
        )}

        <h2>Chat Rooms</h2>
        <div className="room-list">
          {['general', 'random'].map(room => (
            <div 
              key={room}
              className={`room-item ${activeChat === room ? 'active' : ''}`}
              onClick={() => joinRoom(room)}
            >
              # {room}
              {unreadCounts[room] > 0 && (
                <span className="notification-badge">{unreadCounts[room]}</span>
              )}
            </div>
          ))}
        </div>

        <h2>Online Users</h2>
        <div className="user-list">
          {Object.values(onlineUsers).map(user => (
            <div 
              key={user.username}
              className={`user-item ${user.status === 'online' ? 'online' : ''}`}
            >
              <span onClick={() => {
                setSelectedUser(user.username);
                resetUnread('private', user.username);
              }}>
                {user.username}
              </span>
              {user.username !== username && (
                <button 
                  className="private-msg-btn"
                  onClick={() => {
                    setSelectedUser(user.username);
                    resetUnread('private', user.username);
                  }}
                >
                  PM
                  {unreadCounts[user.username] > 0 && (
                    <span className="notification-badge">{unreadCounts[user.username]}</span>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-area">
        {/* Chat Header */}
        <div className="chat-header">
          <h3>
            {selectedUser ? `Private chat with ${selectedUser}` : `#${activeChat}`}
          </h3>
          <div className="chat-controls">
            <input 
              type="text" 
              placeholder="Search messages..." 
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
            {selectedUser && (
              <button onClick={() => setSelectedUser(null)} className="close-btn">
                Close Private Chat
              </button>
            )}
          </div>
        </div>

        {/* Private Message Interface */}
        {selectedUser && (
          <div className="private-chat-container">
            <div className="private-messages">
              {privateMessages
                .filter(msg => msg.from === selectedUser || msg.to === selectedUser)
                .map((msg, index) => (
                  <div key={index} className="message other">
                    <strong>{msg.from}: </strong>
                    {msg.message}
                    <div className="message-meta">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
            </div>
            
            <div className="private-input-area">
              <input
                type="text"
                value={privateMessage}
                onChange={(e) => setPrivateMessage(e.target.value)}
                placeholder="Type a private message..."
                className="message-input"
                onKeyPress={(e) => e.key === 'Enter' && handleSendPrivateMessage(e)}
              />
              <button onClick={handleSendPrivateMessage} className="send-button">
                Send
              </button>
            </div>
          </div>
        )}

        {/* Room Messages */}
        {!selectedUser && (
          <>
            <div className="messages-container" ref={messagesContainerRef}>
              {hasMore && <div className="loading">Loading older messages...</div>}
              {(roomMessages[activeChat] || []).map((msg, index) => (
                <div 
                  key={msg.id || index}
                  className={`message ${
                    msg.sender === username ? 'user' : 
                    msg.sender ? 'other' : 'system'
                  }`}
                >
                  {msg.sender && msg.sender !== username && <strong>{msg.sender}: </strong>}
                  {msg.message}
                  {msg.url && (
                    <div>
                      <a href={msg.url} target="_blank" rel="noreferrer">
                        📎 {msg.name || 'View File'}
                      </a>
                    </div>
                  )}
                  <div className="message-meta">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <div className="typing-indicator">
                {typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing...
              </div>
            )}

            {/* Input Area */}
            <div className="message-input-area">
              <input
                type="text"
                className="message-input"
                value={message}
                onChange={handleMessageChange}
                placeholder={`Type a message in #${activeChat}...`}
                onKeyPress={(e) => e.key === 'Enter' && handleSendRoomMessage(e)}
              />
              <input
                type="file"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                ref={fileInputRef}
              />
              <button onClick={() => fileInputRef.current?.click()} className="file-btn">
                📎
              </button>
              <button 
                className="send-button" 
                onClick={(e) => handleSendRoomMessage(e)}
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
