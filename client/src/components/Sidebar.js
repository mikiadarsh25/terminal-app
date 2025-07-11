import React, { useState } from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 300px;
  background-color: #1a1a1a;
  border-right: 1px solid #333;
  display: flex;
  flex-direction: column;
  font-family: 'JetBrains Mono', monospace;
`;

const SidebarHeader = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SidebarTitle = styled.h3`
  color: #00ff00;
  font-size: 16px;
  margin: 0;
`;

const ClearButton = styled.button`
  background-color: #ff4444;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  font-family: 'JetBrains Mono', monospace;
  
  &:hover {
    background-color: #cc3333;
  }
`;

const HistoryContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
`;

const HistoryItem = styled.div`
  padding: 8px 12px;
  margin-bottom: 5px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #333;
  }
`;

const CommandHistoryItem = styled(HistoryItem)`
  background-color: #2a2a2a;
  border-left: 3px solid #00ff00;
`;

const ResultHistoryItem = styled(HistoryItem)`
  background-color: #2a2a2a;
  border-left: 3px solid #0066cc;
  color: #ccc;
`;

const CommandText = styled.div`
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 2px;
`;

const ResultText = styled.div`
  color: #ccc;
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Timestamp = styled.div`
  color: #666;
  font-size: 10px;
  margin-top: 2px;
`;

const EmptyState = styled.div`
  text-align: center;
  color: #666;
  padding: 40px 20px;
  font-size: 14px;
`;

const QuickActions = styled.div`
  padding: 15px 20px;
  border-top: 1px solid #333;
`;

const QuickActionButton = styled.button`
  width: 100%;
  background-color: #333;
  color: #ffffff;
  border: none;
  padding: 8px 12px;
  margin-bottom: 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  font-family: 'JetBrains Mono', monospace;
  text-align: left;
  
  &:hover {
    background-color: #444;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

function Sidebar({ commandHistory, clearHistory }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString();
  };

  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleHistoryItemClick = (item) => {
    setSelectedItem(item);
  };

  const renderHistoryItem = (item, index) => {
    if (item.type === 'command') {
      return (
        <CommandHistoryItem 
          key={`${item.timestamp.getTime()}-${item.command}`}
          onClick={() => handleHistoryItemClick(item)}
        >
          <CommandText>$ {item.command}</CommandText>
          <Timestamp>{formatTimestamp(item.timestamp)}</Timestamp>
        </CommandHistoryItem>
      );
    } else if (item.type === 'result') {
      return (
        <ResultHistoryItem 
          key={`${item.timestamp.getTime()}-result`}
          onClick={() => handleHistoryItemClick(item)}
        >
          <ResultText>
            {item.success ? '✅' : '❌'} {truncateText(item.output || 'No output')}
          </ResultText>
          <Timestamp>{formatTimestamp(item.timestamp)}</Timestamp>
        </ResultHistoryItem>
      );
    }
    return null;
  };

  return (
    <SidebarContainer>
      <SidebarHeader>
        <SidebarTitle>📋 History</SidebarTitle>
        <ClearButton onClick={clearHistory}>
          Clear
        </ClearButton>
      </SidebarHeader>
      
      <HistoryContainer>
        {commandHistory.length === 0 ? (
          <EmptyState>
            No commands executed yet
            <br />
            Start typing in the terminal!
          </EmptyState>
        ) : (
          commandHistory.map(renderHistoryItem)
        )}
      </HistoryContainer>
      
      <QuickActions>
        <QuickActionButton onClick={() => window.open('https://github.com', '_blank')}>
          🌐 Open GitHub
        </QuickActionButton>
        <QuickActionButton onClick={() => window.open('https://nodejs.org', '_blank')}>
          📦 Node.js Docs
        </QuickActionButton>
        <QuickActionButton onClick={() => window.open('https://reactjs.org', '_blank')}>
          ⚛️ React Docs
        </QuickActionButton>
      </QuickActions>
    </SidebarContainer>
  );
}

export default Sidebar; 