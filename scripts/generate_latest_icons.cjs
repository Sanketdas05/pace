const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

// Premium Pace 'p' Folded Leaf Mark SVG
// Uses crisp geometry, #FF6B00 (Pace Signature Coral Accent) on a sleek, dark modern container (#121614)
function createPaceSvg({ size = 512, background = null, paddingRatio = 0.22 }) {
  const iconSize = size * (1 - paddingRatio * 2);
  const offset = size * paddingRatio;
  
  // Background rect if requested
  const bgMarkup = background
    ? `<rect width="${size}" height="${size}" rx="${size * 0.22}" fill="${background}"/>`
    : '';

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <defs>
        <linearGradient id="paceAccentGrad" x1="8.5" y1="6.5" x2="34" y2="32.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FF7A1A"/>
          <stop offset="100%" stop-color="#FF5500"/>
        </linearGradient>
        <filter id="subtleGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#FF6B00" flood-opacity="0.25"/>
        </filter>
      </defs>
      ${bgMarkup}
      <g transform="translate(${offset}, ${offset}) scale(${iconSize / 36})" filter="url(#subtleGlow)">
        <!-- Bottom Petal / Stem -->
        <path 
          d="M8.5 17.5C8 23.5 8.5 28 11 31.5C13.5 34.5 17 32.5 18 27.5V17.5H8.5Z" 
          fill="url(#paceAccentGrad)"
          fill-opacity="0.86"
        />
        <!-- Top Rounded Loop / Cap -->
        <path 
          d="M8.5 17.5C8.5 11.2 12.5 6.5 18.5 6.5H23.5C29.5 6.5 34 11.2 34 17.5C34 23.8 29.5 28.5 23.5 28.5H18V17.5H8.5Z" 
          fill="url(#paceAccentGrad)"
        />
      </g>
    </svg>
  `.trim();
}

// For maskable icon: Needs solid edge-to-edge background with strict 60% safe area
function createMaskableSvg(size = 512) {
  const iconSize = size * 0.54; // safe area: 54% inside 512
  const offset = (size - iconSize) / 2;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <defs>
        <linearGradient id="maskableGrad" x1="8.5" y1="6.5" x2="34" y2="32.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FF7A1A"/>
          <stop offset="100%" stop-color="#FF5500"/>
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="#111613"/>
      <g transform="translate(${offset}, ${offset}) scale(${iconSize / 36})">
        <path 
          d="M8.5 17.5C8 23.5 8.5 28 11 31.5C13.5 34.5 17 32.5 18 27.5V17.5H8.5Z" 
          fill="url(#maskableGrad)"
          fill-opacity="0.86"
        />
        <path 
          d="M8.5 17.5C8.5 11.2 12.5 6.5 18.5 6.5H23.5C29.5 6.5 34 11.2 34 17.5C34 23.8 29.5 28.5 23.5 28.5H18V17.5H8.5Z" 
          fill="url(#maskableGrad)"
        />
      </g>
    </svg>
  `.trim();
}

async function run() {
  console.log('Generating latest Pace brand icons...');

  // 1. Vector SVG Favicon for modern browsers
  const faviconSvg = createPaceSvg({ size: 64, background: '#111613', paddingRatio: 0.16 });
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg, 'utf-8');

  // 2. 32x32 PNG Favicon
  const favicon32Buffer = Buffer.from(createPaceSvg({ size: 64, background: '#111613', paddingRatio: 0.16 }));
  await sharp(favicon32Buffer).resize(32, 32).png().toFile(path.join(publicDir, 'favicon.png'));

  // 3. 180x180 Apple Touch Icon (iOS home screen)
  const appleTouchBuffer = Buffer.from(createPaceSvg({ size: 180, background: '#111613', paddingRatio: 0.20 }));
  await sharp(appleTouchBuffer).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // 4. 192x192 PWA Icon
  const pwa192Buffer = Buffer.from(createPaceSvg({ size: 192, background: '#111613', paddingRatio: 0.20 }));
  await sharp(pwa192Buffer).png().toFile(path.join(publicDir, 'pwa-192x192.png'));

  // 5. 512x512 PWA Icon
  const pwa512Buffer = Buffer.from(createPaceSvg({ size: 512, background: '#111613', paddingRatio: 0.20 }));
  await sharp(pwa512Buffer).png().toFile(path.join(publicDir, 'pwa-512x512.png'));

  // 6. 512x512 Maskable Icon (safe zone compliant)
  const maskableBuffer = Buffer.from(createMaskableSvg(512));
  await sharp(maskableBuffer).png().toFile(path.join(publicDir, 'pwa-512x512-maskable.png'));

  // 7. Update legacy favicon.jpg so any cached references load the crisp new logo
  await sharp(pwa512Buffer).jpeg({ quality: 95 }).toFile(path.join(publicDir, 'favicon.jpg'));

  console.log('All icons generated successfully with the latest Pace logo!');
}

run().catch(console.error);
