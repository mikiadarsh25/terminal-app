const express = require('express');
const router = express.Router();
const LinuxServices = require('../services/linuxServices');

const linuxServices = new LinuxServices();

// System Information Routes
router.get('/system/info', async (req, res) => {
  try {
    const result = await linuxServices.getSystemInfo();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: error.message });
  }
});

router.get('/system/processes', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const result = await linuxServices.getTopProcesses(limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: error.message });
  }
});

router.get('/system/load', async (req, res) => {
  try {
    const result = await linuxServices.getSystemLoad();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: error.message });
  }
});

router.get('/system/memory', async (req, res) => {
  try {
    const result = await linuxServices.getMemoryUsage();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: error.message });
  }
});

router.get('/system/cpu', async (req, res) => {
  try {
    const result = await linuxServices.getCpuUsage();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: error.message });
  }
});

router.get('/system/temperature', async (req, res) => {
  try {
    const result = await linuxServices.getTemperature();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: error.message });
  }
});

// Network Routes
router.get('/network/info', async (req, res) => {
  try {
    const result = await linuxServices.getNetworkInfo();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: error.message });
  }
});

router.get('/network/ping/:host', async (req, res) => {
  try {
    const { host } = req.params;
    const count = parseInt(req.query.count) || 4;
    const result = await linuxServices.pingHost(host, count);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: error.message });
  }
});

router.get('/network/traceroute/:host', async (req, res) => {
  try {
    const { host } = req.params;
    const result = await linuxServices.traceroute(host);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: error.message });
  }
});

router.get('/network/ports', async (req, res) => {
  try {
    const result = await linuxServices.getOpenPorts();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: error.message });
  }
});

// File System Routes
router.get('/filesystem/usage', async (req, res) => {
  try {
    const path = req.query.path || '.';
    const result = await linuxServices.getDiskUsage(path);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: error.message });
  }
});

router.get('/filesystem/contents', async (req, res) => {
  try {
    const path = req.query.path || '.';
    const result = await linuxServices.getDirectoryContents(path);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: error.message });
  }
});

router.get('/filesystem/find', async (req, res) => {
  try {
    const { pattern, directory } = req.query;
    if (!pattern) {
      return res.status(400).json({ success: false, output: 'Pattern parameter is required' });
    }
    const result = await linuxServices.findFiles(pattern, directory || '.');
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: error.message });
  }
});

router.get('/filesystem/info', async (req, res) => {
  try {
    const { filepath } = req.query;
    if (!filepath) {
      return res.status(400).json({ success: false, output: 'Filepath parameter is required' });
    }
    const result = await linuxServices.getFileInfo(filepath);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: error.message });
  }
});

// Package Management Routes
router.get('/packages/count', async (req, res) => {
  try {
    const result = await linuxServices.getInstalledPackages();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: error.message });
  }
});

router.post('/packages/update', async (req, res) => {
  try {
    const result = await linuxServices.updatePackageList();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: error.message });
  }
});

// Service Management Routes
router.get('/services/:serviceName/status', async (req, res) => {
  try {
    const { serviceName } = req.params;
    const result = await linuxServices.getServiceStatus(serviceName);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: error.message });
  }
});

router.post('/services/:serviceName/start', async (req, res) => {
  try {
    const { serviceName } = req.params;
    const result = await linuxServices.startService(serviceName);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: error.message });
  }
});

router.post('/services/:serviceName/stop', async (req, res) => {
  try {
    const { serviceName } = req.params;
    const result = await linuxServices.stopService(serviceName);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: error.message });
  }
});

router.post('/services/:serviceName/restart', async (req, res) => {
  try {
    const { serviceName } = req.params;
    const result = await linuxServices.restartService(serviceName);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: error.message });
  }
});

// Log Routes
router.get('/logs/system', async (req, res) => {
  try {
    const lines = parseInt(req.query.lines) || 50;
    const result = await linuxServices.getSystemLogs(lines);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: error.message });
  }
});

router.get('/logs/service/:serviceName', async (req, res) => {
  try {
    const { serviceName } = req.params;
    const lines = parseInt(req.query.lines) || 50;
    const result = await linuxServices.getLogsByService(serviceName, lines);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: error.message });
  }
});

// Security Routes
router.get('/security/firewall', async (req, res) => {
  try {
    const result = await linuxServices.getFirewallStatus();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: error.message });
  }
});

// Hardware Routes
router.get('/hardware/info', async (req, res) => {
  try {
    const result = await linuxServices.getHardwareInfo();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: error.message });
  }
});

// User Management Routes
router.get('/users/all', async (req, res) => {
  try {
    const result = await linuxServices.getUsers();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: error.message });
  }
});

router.get('/users/logged-in', async (req, res) => {
  try {
    const result = await linuxServices.getLoggedInUsers();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: error.message });
  }
});

// Custom Command Route (with security)
router.post('/execute', async (req, res) => {
  try {
    const { command, allowedCommands } = req.body;
    
    if (!command) {
      return res.status(400).json({ success: false, output: 'Command is required' });
    }

    // Define safe commands that can be executed
    const safeCommands = allowedCommands || [
      'ls', 'cat', 'grep', 'find', 'ps', 'top', 'free', 'df', 'du',
      'who', 'uptime', 'uname', 'hostname', 'pwd', 'echo', 'date'
    ];

    const result = await linuxServices.executeCustomCommand(command, safeCommands);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: error.message });
  }
});

// Health check route
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Linux services are running',
    platform: process.platform,
    isLinux: process.platform === 'linux'
  });
});

module.exports = router; 