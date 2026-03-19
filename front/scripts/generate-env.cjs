const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
const envFile = path.join(distDir, 'env.js');
const apiUrl = process.env.VITE_API_URL || 'http://localhost:3000/api';

fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(
  envFile,
  `window.__ENV__ = { VITE_API_URL: ${JSON.stringify(apiUrl)} };\n`,
  'utf8'
);

console.log(`Generated ${envFile} with VITE_API_URL=${apiUrl}`);
