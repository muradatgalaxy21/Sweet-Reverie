import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

async function generateAllFavicons() {
  console.log('Generating circular sweet-reverie-renew favicon assets...');

  const sourcePng = 'public/logo/sweet-reverie-no-bg.png';
  const baseSize = 1024; // High master resolution for supersampling

  // Outer border color: deep velvet burgundy #662A37
  // Background fill: warm luxury ivory/cream #FAF7F2
  const strokeWidth = 20; // ~2% at 1024px
  const radius = baseSize / 2;
  const strokeRadius = radius - (strokeWidth / 2);

  const circularBadgeSvg = Buffer.from(
    `<svg width="${baseSize}" height="${baseSize}" viewBox="0 0 ${baseSize} ${baseSize}">
      <!-- Circular Background Fill -->
      <circle cx="${radius}" cy="${radius}" r="${radius}" fill="#FAF7F2" />
      <!-- Crisp Circular Border -->
      <circle cx="${radius}" cy="${radius}" r="${strokeRadius}" fill="none" stroke="#662A37" stroke-width="${strokeWidth}" />
    </svg>`
  );

  // Logo sized to 89% so it breathes comfortably inside the circular border
  const logoSize = Math.round(baseSize * 0.89);
  const resizedLogo = await sharp(sourcePng)
    .resize(logoSize, logoSize, {
      fit: 'inside',
      kernel: sharp.kernel.lanczos3
    })
    .toBuffer();

  // Composite the master 1024x1024 circular favicon
  const masterCircleFavicon = await sharp({
    create: {
      width: baseSize,
      height: baseSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite([
    { input: circularBadgeSvg, top: 0, left: 0 },
    { input: resizedLogo, gravity: 'center' }
  ])
  .png({ compressionLevel: 9 })
  .toBuffer();

  const publicDir = 'public';
  const appDir = 'src/app';

  // Master 512x512
  const png512 = await sharp(masterCircleFavicon).resize(512, 512, { kernel: sharp.kernel.lanczos3 }).png().toBuffer();
  // 192x192
  const png192 = await sharp(masterCircleFavicon).resize(192, 192, { kernel: sharp.kernel.lanczos3 }).png().toBuffer();
  // Apple Touch Icon 180x180
  const png180 = await sharp(masterCircleFavicon).resize(180, 180, { kernel: sharp.kernel.lanczos3 }).png().toBuffer();
  // 64x64
  const png64 = await sharp(masterCircleFavicon).resize(64, 64, { kernel: sharp.kernel.lanczos3 }).png().toBuffer();
  // 48x48
  const png48 = await sharp(masterCircleFavicon).resize(48, 48, { kernel: sharp.kernel.lanczos3 }).png().toBuffer();
  // 32x32
  const png32 = await sharp(masterCircleFavicon).resize(32, 32, { kernel: sharp.kernel.lanczos3 }).png().toBuffer();
  // 16x16
  const png16 = await sharp(masterCircleFavicon).resize(16, 16, { kernel: sharp.kernel.lanczos3 }).png().toBuffer();

  // Save to public directory
  fs.writeFileSync(path.join(publicDir, 'favicon.png'), png32);
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32);
  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), png16);
  fs.writeFileSync(path.join(publicDir, 'favicon-48x48.png'), png48);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), png192);
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), png512);

  // Save Next.js App Router special icon files
  fs.writeFileSync(path.join(appDir, 'icon.png'), png512);
  fs.writeFileSync(path.join(appDir, 'apple-icon.png'), png180);

  // Temporary PNG file to generate multi-resolution ICO via Python PIL
  const tempMaster = 'temp_master_favicon.png';
  fs.writeFileSync(tempMaster, png512);

  console.log('Generating multi-resolution ICO file (16, 32, 48, 64)...');
  execSync(
    'python -c "from PIL import Image; img = Image.open(\'temp_master_favicon.png\'); img.save(\'public/favicon.ico\', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)]); img.save(\'src/app/favicon.ico\', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])"',
    { stdio: 'inherit' }
  );

  if (fs.existsSync(tempMaster)) {
    fs.unlinkSync(tempMaster);
  }

  console.log('All favicon assets generated successfully:');
  console.log('  - public/favicon.ico');
  console.log('  - src/app/favicon.ico');
  console.log('  - src/app/icon.png');
  console.log('  - src/app/apple-icon.png');
  console.log('  - public/favicon.png (32x32)');
  console.log('  - public/favicon-32x32.png');
  console.log('  - public/favicon-16x16.png');
  console.log('  - public/apple-touch-icon.png (180x180)');
  console.log('  - public/icon-192.png');
  console.log('  - public/icon-512.png');
}

generateAllFavicons().catch((err) => {
  console.error('Error generating favicons:', err);
  process.exit(1);
});
