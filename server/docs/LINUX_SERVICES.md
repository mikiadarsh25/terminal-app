# Linux Services Documentation

This document describes the comprehensive Linux-based services added to the terminal application backend.

## Overview

The Linux services provide a complete set of system monitoring, management, and administration capabilities for Linux systems. These services are exposed through both REST API endpoints and real-time Socket.IO events.

## Features

### 🔧 System Information
- CPU information and usage
- Memory usage and statistics
- Disk usage and file system information
- System load and uptime
- Hardware information
- Temperature monitoring

### 🌐 Network Services
- Network interface information
- Active connections and ports
- Routing table
- Ping and traceroute utilities
- Firewall status

### 📁 File System Operations
- Directory contents listing
- Disk usage analysis
- File search capabilities
- File information and statistics

### 📦 Package Management
- Installed package counting
- Package list updates
- Support for multiple package managers (apt, yum, pacman)

### 🔄 Service Management
- Service status checking
- Start/stop/restart services
- System service monitoring

### 📋 Process Management
- Process listing and monitoring
- Top processes by CPU usage
- Real-time process monitoring

### 🔒 Security Services
- Open ports detection
- Firewall status
- User management
- System logs

### 📊 Logging Services
- System log retrieval
- Service-specific logs
- Configurable log line limits

## API Endpoints

### System Information

#### GET `/api/linux/system/info`
Get comprehensive system information including CPU, memory, disk, and uptime.

**Response:**
```json
{
  "success": true,
  "data": {
    "cpu": "Intel(R) Core(TM) i7-8700K CPU @ 3.70GHz",
    "memory": "              total        used        free\nMem:           15Gi       8.2Gi       7.1Gi",
    "disk": "Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1       20G   15G  4.0G  79% /",
    "uptime": " 14:23:45 up 2 days,  3:45,  1 user,  load average: 0.52, 0.58, 0.59"
  }
}
```

#### GET `/api/linux/system/processes?limit=20`
Get top processes by CPU usage.

**Parameters:**
- `limit` (optional): Number of processes to return (default: 20)

#### GET `/api/linux/system/load`
Get system load average.

#### GET `/api/linux/system/memory`
Get detailed memory information.

#### GET `/api/linux/system/cpu`
Get CPU usage information.

#### GET `/api/linux/system/temperature`
Get system temperature (requires `sensors` package).

### Network Services

#### GET `/api/linux/network/info`
Get comprehensive network information.

#### GET `/api/linux/network/ping/:host?count=4`
Ping a host.

**Parameters:**
- `host`: Target hostname or IP
- `count` (optional): Number of ping packets (default: 4)

#### GET `/api/linux/network/traceroute/:host`
Perform traceroute to a host.

#### GET `/api/linux/network/ports`
Get list of open ports.

### File System Services

#### GET `/api/linux/filesystem/usage?path=.`
Get disk usage for a path.

**Parameters:**
- `path` (optional): Directory path (default: current directory)

#### GET `/api/linux/filesystem/contents?path=.`
Get directory contents.

#### GET `/api/linux/filesystem/find?pattern=*.txt&directory=.`
Find files matching a pattern.

**Parameters:**
- `pattern`: File pattern to search for (required)
- `directory` (optional): Directory to search in (default: current directory)

#### GET `/api/linux/filesystem/info?filepath=file.txt`
Get detailed file information.

**Parameters:**
- `filepath`: Path to the file (required)

### Package Management

#### GET `/api/linux/packages/count`
Get count of installed packages.

#### POST `/api/linux/packages/update`
Update package list.

### Service Management

#### GET `/api/linux/services/:serviceName/status`
Get service status.

#### POST `/api/linux/services/:serviceName/start`
Start a service.

#### POST `/api/linux/services/:serviceName/stop`
Stop a service.

#### POST `/api/linux/services/:serviceName/restart`
Restart a service.

### Logging Services

#### GET `/api/linux/logs/system?lines=50`
Get system logs.

**Parameters:**
- `lines` (optional): Number of log lines to return (default: 50)

#### GET `/api/linux/logs/service/:serviceName?lines=50`
Get service-specific logs.

### Security Services

#### GET `/api/linux/security/firewall`
Get firewall status.

### Hardware Information

#### GET `/api/linux/hardware/info`
Get comprehensive hardware information.

### User Management

#### GET `/api/linux/users/all`
Get all system users.

#### GET `/api/linux/users/logged-in`
Get currently logged-in users.

### Custom Commands

#### POST `/api/linux/execute`
Execute a custom command with security validation.

**Request Body:**
```json
{
  "command": "ls -la",
  "allowedCommands": ["ls", "cat", "grep"]
}
```

### Health Check

#### GET `/api/linux/health`
Check if Linux services are running.

## Socket.IO Events

### Real-time Monitoring

#### `linux-system-info`
Request system information.

**Emit:** `socket.emit('linux-system-info')`
**Listen:** `socket.on('linux-system-info-result', (data) => {})`

#### `linux-processes`
Request process list.

**Emit:** `socket.emit('linux-processes', { limit: 20 })`
**Listen:** `socket.on('linux-processes-result', (data) => {})`

#### `linux-network-info`
Request network information.

**Emit:** `socket.emit('linux-network-info')`
**Listen:** `socket.on('linux-network-info-result', (data) => {})`

#### `linux-memory-usage`
Request memory usage.

**Emit:** `socket.emit('linux-memory-usage')`
**Listen:** `socket.on('linux-memory-usage-result', (data) => {})`

#### `linux-cpu-usage`
Request CPU usage.

**Emit:** `socket.emit('linux-cpu-usage')`
**Listen:** `socket.on('linux-cpu-usage-result', (data) => {})`

#### `linux-start-monitoring`
Start real-time monitoring.

**Emit:** `socket.emit('linux-start-monitoring')`
**Listen:** 
- `socket.on('linux-monitoring-started', (data) => {})`
- `socket.on('linux-monitoring-data', (data) => {})`

## Security Features

### Command Validation
- All custom commands are validated against a whitelist
- Dangerous commands are blocked by default
- Configurable allowed command list

### Platform Detection
- Services automatically detect if running on Linux
- Graceful fallback for non-Linux systems
- Platform-specific error messages

### Error Handling
- Comprehensive error handling for all operations
- Timeout protection for long-running commands
- Buffer size limits to prevent memory issues

## Dependencies

The Linux services require the following system packages (on Linux):

- `ps` - Process information
- `top` - System monitoring
- `free` - Memory information
- `df` - Disk usage
- `du` - Directory usage
- `netstat` - Network statistics
- `ping` - Network connectivity
- `traceroute` - Network routing
- `sensors` - Temperature monitoring (optional)
- `systemctl` - Service management
- `journalctl` - Log viewing

## Usage Examples

### JavaScript/Node.js

```javascript
// REST API Example
const response = await fetch('/api/linux/system/info');
const data = await response.json();
console.log(data);

// Socket.IO Example
socket.emit('linux-system-info');
socket.on('linux-system-info-result', (data) => {
  console.log('System Info:', data);
});
```

### cURL Examples

```bash
# Get system information
curl http://localhost:3004/api/linux/system/info

# Get top processes
curl http://localhost:3004/api/linux/system/processes?limit=10

# Ping a host
curl http://localhost:3004/api/linux/network/ping/google.com?count=3

# Get disk usage
curl http://localhost:3004/api/linux/filesystem/usage?path=/home

# Execute custom command
curl -X POST http://localhost:3004/api/linux/execute \
  -H "Content-Type: application/json" \
  -d '{"command": "ls -la", "allowedCommands": ["ls"]}'
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "output": "Error message describing what went wrong"
}
```

## Platform Compatibility

- **Linux**: Full functionality available
- **macOS**: Limited functionality (basic commands only)
- **Windows**: Not supported (returns platform error)

## Performance Considerations

- Commands have 30-second timeout by default
- Buffer size limited to 1MB per command
- Real-time monitoring uses streaming for efficiency
- Concurrent command execution supported

## Troubleshooting

### Common Issues

1. **Permission Denied**: Some commands require sudo privileges
2. **Command Not Found**: Required system packages not installed
3. **Timeout Errors**: Commands taking too long to execute
4. **Platform Errors**: Running on non-Linux system

### Debug Mode

Enable debug logging by setting environment variable:
```bash
DEBUG=linux-services npm run server
```

## Contributing

To add new Linux services:

1. Add method to `LinuxServices` class in `server/services/linuxServices.js`
2. Add corresponding route in `server/routes/linuxRoutes.js`
3. Add Socket.IO event if real-time updates needed
4. Update this documentation
5. Test on Linux system

## License

This Linux services module is part of the terminal application and follows the same license terms. 