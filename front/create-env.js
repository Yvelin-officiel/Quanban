const fs = require('fs');

const apiUrl = process.env.VITE_API_URL || 'http://localhost:3000';
const envContent = `VITE_API_URL=${apiUrl}\n`;

fs.writeFileSync('.env', envContent);
