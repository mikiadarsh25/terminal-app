const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');
const chalk = require('chalk');
const figlet = require('figlet');

// Import Linux services routes
const linuxRoutes = require('./routes/linuxRoutes');

const app = express();
const server = http.createServer(app);
// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://*.github.io",
  "https://*.herokuapp.com",
  "https://*.railway.app",
  "https://*.render.com"
];

const io = socketIo(server, {
  cors: {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list
      const isAllowed = allowedOrigins.some(allowedOrigin => {
        if (allowedOrigin.includes('*')) {
          return origin.includes(allowedOrigin.replace('*.', ''));
        }
        return origin === allowedOrigin;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        return origin.includes(allowedOrigin.replace('*.', ''));
      }
      return origin === allowedOrigin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Terminal command execution
function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        resolve({
          success: false,
          output: stderr || error.message,
          command: command
        });
      } else {
        resolve({
          success: true,
          output: stdout,
          command: command
        });
      }
    });
  });
}

// Import LinuxServices for Socket.IO
const LinuxServices = require('./services/linuxServices');
const linuxServices = new LinuxServices();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(chalk.green('Client connected:', socket.id));

  socket.on('execute-command', async (data) => {
    try {
      const result = await executeCommand(data.command);
      socket.emit('command-result', result);
    } catch (error) {
      socket.emit('command-result', {
        success: false,
        output: error.message,
        command: data.command
      });
    }
  });

  // Linux Services Socket Events
  socket.on('linux-system-info', async () => {
    try {
      const result = await linuxServices.getSystemInfo();
      socket.emit('linux-system-info-result', result);
    } catch (error) {
      socket.emit('linux-system-info-result', {
        success: false,
        output: error.message
      });
    }
  });

  socket.on('linux-processes', async (data) => {
    try {
      const limit = data.limit || 20;
      const result = await linuxServices.getTopProcesses(limit);
      socket.emit('linux-processes-result', result);
    } catch (error) {
      socket.emit('linux-processes-result', {
        success: false,
        output: error.message
      });
    }
  });

  socket.on('linux-network-info', async () => {
    try {
      const result = await linuxServices.getNetworkInfo();
      socket.emit('linux-network-info-result', result);
    } catch (error) {
      socket.emit('linux-network-info-result', {
        success: false,
        output: error.message
      });
    }
  });

  socket.on('linux-memory-usage', async () => {
    try {
      const result = await linuxServices.getMemoryUsage();
      socket.emit('linux-memory-usage-result', result);
    } catch (error) {
      socket.emit('linux-memory-usage-result', {
        success: false,
        output: error.message
      });
    }
  });

  socket.on('linux-cpu-usage', async () => {
    try {
      const result = await linuxServices.getCpuUsage();
      socket.emit('linux-cpu-usage-result', result);
    } catch (error) {
      socket.emit('linux-cpu-usage-result', {
        success: false,
        output: error.message
      });
    }
  });

  socket.on('linux-start-monitoring', async () => {
    try {
      const result = await linuxServices.startRealtimeMonitoring((data) => {
        socket.emit('linux-monitoring-data', data);
      });
      socket.emit('linux-monitoring-started', result);
    } catch (error) {
      socket.emit('linux-monitoring-started', {
        success: false,
        output: error.message
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(chalk.red('Client disconnected:', socket.id));
  });
});

// API Routes
app.get('/api/status', (req, res) => {
  res.json({ status: 'Terminal server is running' });
});

app.get('/api/current-directory', (req, res) => {
  res.json({ directory: process.cwd() });
});

// Linux Services Routes
app.use('/api/linux', linuxRoutes);

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Start server
server.listen(PORT, () => {
  console.clear();
  console.log(chalk.cyan(figlet.textSync('Terminal App', { horizontalLayout: 'full' })));
  console.log(chalk.green(`🚀 Server running on port ${PORT}`));
  console.log(chalk.yellow(`📱 React app will be available at http://localhost:3000`));
  console.log(chalk.blue(`🔌 Socket.IO server ready for real-time communication`));
  console.log(chalk.gray('Press Ctrl+C to stop the server\n'));
});

module.exports = { app, server, io }; 