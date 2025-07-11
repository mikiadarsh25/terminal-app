import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const TerminalWrapper = styled.div`
  flex: 1;
  background-color: #0a0a0a;
  color: #ffffff;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  line-height: 1.4;
  padding: 20px;
  overflow-y: auto;
  position: relative;
`;

const OutputContainer = styled.div`
  margin-bottom: 10px;
`;

const CommandLine = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Prompt = styled.span`
  color: #00ff00;
  margin-right: 10px;
  font-weight: 600;
`;

const CommandInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: #ffffff;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  outline: none;
  caret-color: #00ff00;
  
  &::placeholder {
    color: #666;
  }
`;

const Cursor = styled.span`
  color: #00ff00;
  animation: blink 1s infinite;
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`;

const OutputText = styled.div`
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-bottom: 10px;
  color: ${props => props.success ? '#00ff00' : '#ff4444'};
`;

const CommandText = styled.div`
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 5px;
`;

const Timestamp = styled.span`
  color: #666;
  font-size: 12px;
  margin-left: 10px;
`;

const WelcomeMessage = styled.div`
  color: #00ffff;
  font-size: 16px;
  margin-bottom: 20px;
  text-align: center;
`;

const ConnectionStatus = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  background-color: ${props => props.connected ? '#00ff00' : '#ff4444'};
  color: #000;
`;

function Terminal({ executeCommand, commandHistory, isConnected }) {
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandIndex, setCommandIndex] = useState(-1);
  const [commandHistoryLocal, setCommandHistoryLocal] = useState([]);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  useEffect(() => {
    // Extract commands from command history
    const commands = commandHistory
      .filter(item => item.type === 'command')
      .map(item => item.command);
    setCommandHistoryLocal(commands);
  }, [commandHistory]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (currentCommand.trim()) {
        executeCommand(currentCommand.trim());
        setCurrentCommand('');
        setCommandIndex(-1);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandIndex < commandHistoryLocal.length - 1) {
        const newIndex = commandIndex + 1;
        setCommandIndex(newIndex);
        setCurrentCommand(commandHistoryLocal[commandHistoryLocal.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandIndex > 0) {
        const newIndex = commandIndex - 1;
        setCommandIndex(newIndex);
        setCurrentCommand(commandHistoryLocal[commandHistoryLocal.length - 1 - newIndex]);
      } else if (commandIndex === 0) {
        setCommandIndex(-1);
        setCurrentCommand('');
      }
    }
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString();
  };

  const renderOutput = (item) => {
    if (item.type === 'command') {
      return (
        <OutputContainer key={`${item.timestamp.getTime()}-${item.command}`}>
          <CommandText>
            $ {item.command}
            <Timestamp>{formatTimestamp(item.timestamp)}</Timestamp>
          </CommandText>
        </OutputContainer>
      );
    } else if (item.type === 'result') {
      return (
        <OutputContainer key={`${item.timestamp.getTime()}-result`}>
          <OutputText success={item.success}>
            {item.output || 'No output'}
          </OutputText>
        </OutputContainer>
      );
    }
    return null;
  };

  return (
    <TerminalWrapper ref={terminalRef}>
      <ConnectionStatus connected={isConnected}>
        {isConnected ? 'Connected' : 'Disconnected'}
      </ConnectionStatus>
      
      <WelcomeMessage>
        🚀 Welcome to Terminal App v1.0.0
        <br />
        Type 'help' for available commands
      </WelcomeMessage>

      {commandHistory.map(renderOutput)}

      <CommandLine>
        <Prompt>$</Prompt>
        <CommandInput
          ref={inputRef}
          type="text"
          value={currentCommand}
          onChange={(e) => setCurrentCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter command..."
          disabled={!isConnected}
        />
        {!currentCommand && <Cursor>|</Cursor>}
      </CommandLine>
    </TerminalWrapper>
  );
}

export default Terminal; 