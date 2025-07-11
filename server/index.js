const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');
const chalk = require('chalk');
const figlet = require('figlet');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
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