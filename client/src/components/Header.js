import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  background-color: #1a1a1a;
  border-bottom: 1px solid #333;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'JetBrains Mono', monospace;
`;

const Title = styled.h1`
  color: #00ff00;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.connected ? '#00ff00' : '#ff4444'};
  animation: ${props => props.connected ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const DirectoryText = styled.span`
  color: #888;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ConnectionText = styled.span`
  color: ${props => props.connected ? '#00ff00' : '#ff4444'};
  font-weight: 500;
`;

function Header({ isConnected, serverStatus, currentDirectory }) {
  return (
    <HeaderContainer>
      <Title>🚀 Terminal App</Title>
      
      <StatusContainer>
        <StatusItem>
          <StatusDot connected={isConnected} />
          <ConnectionText connected={isConnected}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </ConnectionText>
        </StatusItem>
        
        <StatusItem>
          <span style={{ color: '#888' }}>📁</span>
          <DirectoryText title={currentDirectory}>
            {currentDirectory || 'Loading...'}
          </DirectoryText>
        </StatusItem>
        
        <StatusItem>
          <span style={{ color: '#888' }}>⚡</span>
          <span style={{ color: '#00ffff' }}>v1.0.0</span>
        </StatusItem>
      </StatusContainer>
    </HeaderContainer>
  );
}

export default Header; 