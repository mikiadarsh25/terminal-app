const LinuxServices = require('./services/linuxServices');

async function testLinuxServices() {
  console.log('🧪 Testing Linux Services...\n');
  
  const linuxServices = new LinuxServices();
  
  // Test system information
  console.log('1. Testing System Information...');
  try {
    const systemInfo = await linuxServices.getSystemInfo();
    console.log('✅ System Info:', systemInfo.success ? 'Success' : 'Failed');
    if (systemInfo.success) {
      console.log('   CPU:', systemInfo.data.cpu);
      console.log('   Uptime:', systemInfo.data.uptime);
    }
  } catch (error) {
    console.log('❌ System Info Error:', error.message);
  }
  
  // Test process list
  console.log('\n2. Testing Process List...');
  try {
    const processes = await linuxServices.getTopProcesses(5);
    console.log('✅ Process List:', processes.success ? 'Success' : 'Failed');
    if (processes.success) {
      console.log('   Found processes:', processes.output.split('\n').length - 1);
    }
  } catch (error) {
    console.log('❌ Process List Error:', error.message);
  }
  
  // Test network info
  console.log('\n3. Testing Network Information...');
  try {
    const networkInfo = await linuxServices.getNetworkInfo();
    console.log('✅ Network Info:', networkInfo.success ? 'Success' : 'Failed');
  } catch (error) {
    console.log('❌ Network Info Error:', error.message);
  }
  
  // Test memory usage
  console.log('\n4. Testing Memory Usage...');
  try {
    const memoryUsage = await linuxServices.getMemoryUsage();
    console.log('✅ Memory Usage:', memoryUsage.success ? 'Success' : 'Failed');
  } catch (error) {
    console.log('❌ Memory Usage Error:', error.message);
  }
  
  // Test file system operations
  console.log('\n5. Testing File System Operations...');
  try {
    const diskUsage = await linuxServices.getDiskUsage('.');
    console.log('✅ Disk Usage:', diskUsage.success ? 'Success' : 'Failed');
    if (diskUsage.success) {
      console.log('   Current directory usage:', diskUsage.output);
    }
  } catch (error) {
    console.log('❌ Disk Usage Error:', error.message);
  }
  
  // Test directory contents
  console.log('\n6. Testing Directory Contents...');
  try {
    const contents = await linuxServices.getDirectoryContents('.');
    console.log('✅ Directory Contents:', contents.success ? 'Success' : 'Failed');
    if (contents.success) {
      console.log('   Files found:', contents.output.split('\n').length - 1);
    }
  } catch (error) {
    console.log('❌ Directory Contents Error:', error.message);
  }
  
  // Test package management
  console.log('\n7. Testing Package Management...');
  try {
    const packages = await linuxServices.getInstalledPackages();
    console.log('✅ Package Count:', packages.success ? 'Success' : 'Failed');
    if (packages.success) {
      console.log('   Package manager:', packages.packageManager);
      console.log('   Package count:', packages.output);
    }
  } catch (error) {
    console.log('❌ Package Management Error:', error.message);
  }
  
  // Test custom command execution
  console.log('\n8. Testing Custom Command Execution...');
  try {
    const customCmd = await linuxServices.executeCustomCommand('echo "Hello from Linux Services"', ['echo']);
    console.log('✅ Custom Command:', customCmd.success ? 'Success' : 'Failed');
    if (customCmd.success) {
      console.log('   Output:', customCmd.output);
    }
  } catch (error) {
    console.log('❌ Custom Command Error:', error.message);
  }
  
  // Test health check
  console.log('\n9. Testing Health Check...');
  try {
    const health = await linuxServices.executeCommand('uname -a');
    console.log('✅ Health Check:', health.success ? 'Success' : 'Failed');
    if (health.success) {
      console.log('   System:', health.output);
    }
  } catch (error) {
    console.log('❌ Health Check Error:', error.message);
  }
  
  console.log('\n🎉 Linux Services Testing Complete!');
}

// Run the tests
testLinuxServices().catch(console.error); 