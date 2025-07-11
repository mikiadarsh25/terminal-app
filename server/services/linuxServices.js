const { exec, spawn } = require('child_process');
const os = require('os');
const fs = require('fs').promises;
const path = require('path');

class LinuxServices {
  constructor() {
    this.isLinux = os.platform() === 'linux';
  }

  // Execute command with promise wrapper
  async executeCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
      const defaultOptions = {
        cwd: process.cwd(),
        maxBuffer: 1024 * 1024, // 1MB buffer
        timeout: 30000 // 30 second timeout
      };
      
      exec(command, { ...defaultOptions, ...options }, (error, stdout, stderr) => {
        if (error) {
          resolve({
            success: false,
            output: stderr || error.message,
            command: command,
            error: error
          });
        } else {
          resolve({
            success: true,
            output: stdout.trim(),
            command: command
          });
        }
      });
    });
  }

  // System Information Services
  async getSystemInfo() {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    try {
      const [cpuInfo, memInfo, diskInfo, uptime] = await Promise.all([
        this.executeCommand('cat /proc/cpuinfo | grep "model name" | head -1'),
        this.executeCommand('free -h'),
        this.executeCommand('df -h'),
        this.executeCommand('uptime')
      ]);

      return {
        success: true,
        data: {
          cpu: cpuInfo.output,
          memory: memInfo.output,
          disk: diskInfo.output,
          uptime: uptime.output
        }
      };
    } catch (error) {
      return { success: false, output: error.message };
    }
  }

  async getProcessList() {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    return await this.executeCommand('ps aux --sort=-%cpu | head -20');
  }

  async getTopProcesses(limit = 10) {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    return await this.executeCommand(`ps aux --sort=-%cpu | head -${limit + 1}`);
  }

  // Network Services
  async getNetworkInfo() {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    try {
      const [interfaces, connections, routing] = await Promise.all([
        this.executeCommand('ip addr show'),
        this.executeCommand('netstat -tuln'),
        this.executeCommand('route -n')
      ]);

      return {
        success: true,
        data: {
          interfaces: interfaces.output,
          connections: connections.output,
          routing: routing.output
        }
      };
    } catch (error) {
      return { success: false, output: error.message };
    }
  }

  async pingHost(host, count = 4) {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    return await this.executeCommand(`ping -c ${count} ${host}`);
  }

  async traceroute(host) {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    return await this.executeCommand(`traceroute ${host}`);
  }

  // File System Services
  async getDiskUsage(path = '.') {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    return await this.executeCommand(`du -sh ${path}`);
  }

  async getDirectoryContents(path = '.') {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    return await this.executeCommand(`ls -la ${path}`);
  }

  async findFiles(pattern, directory = '.') {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    return await this.executeCommand(`find ${directory} -name "${pattern}" -type f`);
  }

  async getFileInfo(filepath) {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    try {
      const [stat, type, size] = await Promise.all([
        this.executeCommand(`stat ${filepath}`),
        this.executeCommand(`file ${filepath}`),
        this.executeCommand(`wc -c < ${filepath}`)
      ]);

      return {
        success: true,
        data: {
          stat: stat.output,
          type: type.output,
          size: size.output
        }
      };
    } catch (error) {
      return { success: false, output: error.message };
    }
  }

  // System Monitoring Services
  async getSystemLoad() {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    return await this.executeCommand('cat /proc/loadavg');
  }

  async getMemoryUsage() {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    return await this.executeCommand('cat /proc/meminfo');
  }

  async getCpuUsage() {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    return await this.executeCommand('top -bn1 | grep "Cpu(s)"');
  }

  async getTemperature() {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    return await this.executeCommand('sensors');
  }

  // Package Management Services
  async getInstalledPackages() {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    // Try different package managers
    const packageManagers = [
      { cmd: 'dpkg -l | wc -l', name: 'dpkg' },
      { cmd: 'rpm -qa | wc -l', name: 'rpm' },
      { cmd: 'pacman -Q | wc -l', name: 'pacman' }
    ];

    for (const pm of packageManagers) {
      try {
        const result = await this.executeCommand(pm.cmd);
        if (result.success) {
          return { ...result, packageManager: pm.name };
        }
      } catch (error) {
        continue;
      }
    }

    return { success: false, output: 'No supported package manager found' };
  }

  async updatePackageList() {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    const updateCommands = [
      'apt update',
      'yum update',
      'pacman -Sy'
    ];

    for (const cmd of updateCommands) {
      try {
        const result = await this.executeCommand(cmd);
        if (result.success) {
          return result;
        }
      } catch (error) {
        continue;
      }
    }

    return { success: false, output: 'Failed to update package list' };
  }

  // Service Management
  async getServiceStatus(serviceName) {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    const commands = [
      `systemctl status ${serviceName}`,
      `service ${serviceName} status`,
      `systemctl is-active ${serviceName}`
    ];

    for (const cmd of commands) {
      try {
        const result = await this.executeCommand(cmd);
        if (result.success) {
          return result;
        }
      } catch (error) {
        continue;
      }
    }

    return { success: false, output: `Service ${serviceName} not found or not accessible` };
  }

  async startService(serviceName) {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    return await this.executeCommand(`sudo systemctl start ${serviceName}`);
  }

  async stopService(serviceName) {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    return await this.executeCommand(`sudo systemctl stop ${serviceName}`);
  }

  async restartService(serviceName) {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    return await this.executeCommand(`sudo systemctl restart ${serviceName}`);
  }

  // Log Services
  async getSystemLogs(lines = 50) {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    return await this.executeCommand(`journalctl -n ${lines} --no-pager`);
  }

  async getLogsByService(serviceName, lines = 50) {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    return await this.executeCommand(`journalctl -u ${serviceName} -n ${lines} --no-pager`);
  }

  // Security Services
  async getOpenPorts() {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    return await this.executeCommand('netstat -tuln');
  }

  async getFirewallStatus() {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    const commands = [
      'ufw status',
      'iptables -L',
      'firewall-cmd --state'
    ];

    for (const cmd of commands) {
      try {
        const result = await this.executeCommand(cmd);
        if (result.success) {
          return result;
        }
      } catch (error) {
        continue;
      }
    }

    return { success: false, output: 'No firewall configuration found' };
  }

  // Hardware Services
  async getHardwareInfo() {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    try {
      const [cpu, memory, disk, pci] = await Promise.all([
        this.executeCommand('lscpu'),
        this.executeCommand('free -h'),
        this.executeCommand('lsblk'),
        this.executeCommand('lspci')
      ]);

      return {
        success: true,
        data: {
          cpu: cpu.output,
          memory: memory.output,
          disk: disk.output,
          pci: pci.output
        }
      };
    } catch (error) {
      return { success: false, output: error.message };
    }
  }

  // User Management
  async getUsers() {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    return await this.executeCommand('cat /etc/passwd');
  }

  async getLoggedInUsers() {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    return await this.executeCommand('who');
  }

  // Real-time monitoring with streaming
  async startRealtimeMonitoring(callback) {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    const top = spawn('top', ['-b', '-n', '1']);
    
    top.stdout.on('data', (data) => {
      callback({ type: 'top', data: data.toString() });
    });

    top.stderr.on('data', (data) => {
      callback({ type: 'error', data: data.toString() });
    });

    return { success: true, pid: top.pid };
  }

  // Custom command execution with validation
  async executeCustomCommand(command, allowedCommands = []) {
    if (!this.isLinux) {
      return { success: false, output: 'This service is only available on Linux systems' };
    }

    // Basic security: check if command is in allowed list
    if (allowedCommands.length > 0) {
      const isAllowed = allowedCommands.some(allowed => 
        command.startsWith(allowed)
      );
      
      if (!isAllowed) {
        return { 
          success: false, 
          output: 'Command not allowed for security reasons' 
        };
      }
    }

    return await this.executeCommand(command);
  }
}

module.exports = LinuxServices; 