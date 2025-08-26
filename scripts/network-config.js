import { networkInterfaces } from 'os';

function getNetworkIP() {
  const interfaces = networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    const interfaceList = interfaces[name];
    if (interfaceList) {
      for (const netInterface of interfaceList) {
        // Skip internal and non-IPv4 addresses
        if (netInterface.family === 'IPv4' && !netInterface.internal) {
          return netInterface.address;
        }
      }
    }
  }
  
  return 'localhost';
}

const networkIP = getNetworkIP();

console.log('\n🌐 Network Configuration:');
console.log('========================');
console.log(`🔗 Your Network IP: ${networkIP}`);
console.log(`🖥️  Local Access: http://localhost:5173`);
console.log(`📱 Network Access: http://${networkIP}:5173`);
console.log(`🔧 Backend API: http://${networkIP}:5000`);

console.log('\n📋 Instructions:');
console.log('================');
console.log('1. Start the backend server: npm run dev (in server folder)');
console.log('2. Start the frontend: npm run dev (in root folder)');
console.log(`3. Access from other devices: http://${networkIP}:5173`);

console.log('\n⚙️  Environment Variables:');
console.log('==========================');
console.log(`VITE_API_URL=http://${networkIP}:5000/api`);
console.log(`FRONTEND_URL=http://${networkIP}:5173`);
