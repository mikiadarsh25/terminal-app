import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import Terminal from './components/Terminal';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import config from './config';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #0a0a0a;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const TerminalContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

function App() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);
  const [currentDirectory, setCurrentDirectory] = useState('');
  const [serverStatus, setServerStatus] = useState('disconnected');

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(config.serverUrl);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      setServerStatus('connected');
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      setServerStatus('disconnected');
      console.log('Disconnected from server');
    });

    newSocket.on('command-result', (result) => {
      setCommandHistory(prev => [...prev, {
        type: 'result',
        timestamp: new Date(),
        ...result
      }]);
    });

    // Fetch initial directory
    fetchCurrentDirectory();

    return () => {
      newSocket.close();
    };
  }, []);

  const fetchCurrentDirectory = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/current-directory`);
      const data = await response.json();
      setCurrentDirectory(data.directory);
    } catch (error) {
      console.error('Failed to fetch current directory:', error);
    }
  };

  const executeCommand = (command) => {
    if (!socket || !isConnected) {
      console.error('Socket not connected');
      return;
    }

    // Add command to history
    setCommandHistory(prev => [...prev, {
      type: 'command',
      timestamp: new Date(),
      command: command
    }]);

    // Send command to server
    socket.emit('execute-command', { command });
  };

  const clearHistory = () => {
    setCommandHistory([]);
  };

  return (
    <AppContainer>
      <Header 
        isConnected={isConnected} 
        serverStatus={serverStatus}
        currentDirectory={currentDirectory}
      />
      <MainContent>
        <Sidebar 
          commandHistory={commandHistory}
          clearHistory={clearHistory}
        />
        <TerminalContainer>
          <Terminal 
            executeCommand={executeCommand}
            commandHistory={commandHistory}
            isConnected={isConnected}
          />
        </TerminalContainer>
      </MainContent>
    </AppContainer>
  );
}

export default App; 