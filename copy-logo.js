const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\jomar\\.gemini\\antigravity-ide\\brain\\948f702e-0204-4281-b1cb-1992f52b35d6\\fenix_catalog_logo_1791336397218.jpg';
const destPublic = 'c:\\Catalogo2\\catalogo-app-react\\public\\fenix-logo.png';
const destAssetsDir = 'c:\\Catalogo2\\catalogo-app-react\\src\\assets';
const destAssets = path.join(destAssetsDir, 'fenix-logo.png');

if (!fs.existsSync(destAssetsDir)) {
  fs.mkdirSync(destAssetsDir, { recursive: true });
}

fs.copyFileSync(src, destPublic);
fs.copyFileSync(src, destAssets);
console.log('Logo copied successfully!');
