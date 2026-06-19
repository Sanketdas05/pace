const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'public', 'favicon.jpg');
const out192 = path.join(__dirname, 'public', 'pwa-192x192.png');
const out512 = path.join(__dirname, 'public', 'pwa-512x512.png');
const maskable512 = path.join(__dirname, 'public', 'pwa-512x512-maskable.png');

async function generateIcons() {
  try {
    const svgBuffer = fs.readFileSync(svgPath);
    
    // Create a 192x192 icon with padding
    await sharp(svgBuffer)
      .resize(192, 192, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .toFile(out192);

    // Create a 512x512 icon with padding
    await sharp(svgBuffer)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .toFile(out512);

    // Create a maskable 512x512 icon (needs solid background)
    await sharp(svgBuffer)
      .resize(380, 380, { fit: 'contain' }) // smaller inner icon for maskable
      .extend({
        top: 66, bottom: 66, left: 66, right: 66,
        background: '#ffffff'
      })
      .toFile(maskable512);

    console.log('Icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
