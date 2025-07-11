# 🚀 Terminal App

A modern, web-based terminal application built with **Node.js** and **React**. This application provides a beautiful, responsive terminal interface that can execute real system commands through a secure backend.

## ✨ Features

- **Real-time Command Execution**: Execute system commands with live output
- **Beautiful UI**: Modern, dark-themed interface with syntax highlighting
- **Command History**: View and manage your command history
- **Real-time Communication**: WebSocket-based communication for instant updates
- **Responsive Design**: Works on desktop and mobile devices
- **Keyboard Navigation**: Arrow keys for command history navigation
- **Connection Status**: Real-time server connection monitoring
- **Current Directory Display**: Always know where you are in the file system

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **Child Process** - Command execution
- **Chalk** - Terminal styling
- **Figlet** - ASCII art

### Frontend
- **React** - UI framework
- **Styled Components** - CSS-in-JS styling
- **Socket.IO Client** - Real-time communication
- **JetBrains Mono** - Terminal font

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd terminal-app
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3004

## 📁 Project Structure

```
terminal-app/
├── server/
│   └── index.js          # Express server with Socket.IO
├── client/
│   ├── public/
│   │   ├── index.html    # Main HTML file
│   │   └── manifest.json # Web app manifest
│   ├── src/
│   │   ├── components/
│   │   │   ├── Terminal.js   # Main terminal component
│   │   │   ├── Header.js     # App header
│   │   │   └── Sidebar.js    # Command history sidebar
│   │   ├── App.js        # Main React app
│   │   ├── index.js      # React entry point
│   │   └── index.css     # Global styles
│   └── package.json      # React dependencies
├── package.json          # Main project dependencies
└── README.md            # This file
```

## 🎯 Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the React frontend
- `npm run build` - Build the React app for production
- `npm run install-all` - Install dependencies for both frontend and backend
- `npm start` - Start the production server

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
PORT=3004
NODE_ENV=development
```

### Frontend Configuration
For production deployment, create a `.env` file in the `client/` directory:

```env
REACT_APP_SERVER_URL=https://your-backend-url.herokuapp.com
```

Replace `your-backend-url.herokuapp.com` with your actual backend deployment URL.

### Customization
- **Port**: Change the server port in `server/index.js`
- **Styling**: Modify colors and themes in the styled components
- **Commands**: Add custom command handlers in the server

## 🎨 UI Features

### Terminal Interface
- **Command Input**: Type commands with syntax highlighting
- **Output Display**: Real-time command output with success/error indicators
- **Cursor Animation**: Blinking cursor for authentic terminal feel
- **Auto-scroll**: Automatically scrolls to show latest output

### Sidebar
- **Command History**: View all executed commands with timestamps
- **Quick Actions**: Access to common resources
- **Clear History**: One-click history clearing

### Header
- **Connection Status**: Real-time server connection indicator
- **Current Directory**: Display current working directory
- **App Version**: Version information

## 🔒 Security Considerations

⚠️ **Important**: This application executes real system commands. Use with caution:

- Only run in trusted environments
- Be careful with commands that modify system files
- Consider implementing command whitelisting for production use
- The application runs commands in the current working directory

## 🚀 Deployment

### Frontend Deployment (GitHub Pages)

1. **Update the homepage URL** in `client/package.json`:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/terminal-app"
   ```

2. **Set the backend URL** by creating `client/.env`:
   ```env
   REACT_APP_SERVER_URL=https://your-backend-url.herokuapp.com
   ```

3. **Deploy to GitHub Pages**:
   ```bash
   cd client
   npm run deploy
   ```

### Backend Deployment (Heroku/Railway/Render)

1. **Deploy your backend** to any of these platforms:
   - [Heroku](https://heroku.com) (free tier available)
   - [Railway](https://railway.app) (free tier available)
   - [Render](https://render.com) (free tier available)

2. **Set environment variables** on your deployment platform:
   ```env
   PORT=3004
   NODE_ENV=production
   ```

3. **Update the frontend** with your backend URL in `client/.env`

### CORS Configuration
The server is configured to allow requests from:
- `http://localhost:3000` (development)
- `https://*.github.io` (GitHub Pages)
- `https://*.herokuapp.com` (Heroku)
- `https://*.railway.app` (Railway)
- `https://*.render.com` (Render)

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process using port 3004
   lsof -ti:3004 | xargs kill -9
   ```

2. **Socket connection failed**
   - Ensure both frontend and backend are running
   - Check firewall settings
   - Verify CORS configuration
   - Check that the backend URL is correctly set in `client/.env`

3. **CORS errors**
   - Ensure your backend is deployed and accessible
   - Check that the frontend is using the correct backend URL
   - Verify CORS configuration in `server/index.js`

4. **Command not found**
   - Ensure the command exists in your system PATH
   - Check if the command requires sudo privileges

### Development Tips

- Use `console.log()` in the server for debugging
- Check browser console for frontend errors
- Monitor Socket.IO events in browser dev tools

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by modern terminal applications
- Built with love for the developer community
- Uses amazing open-source libraries

---

**Happy coding! 🎉** 