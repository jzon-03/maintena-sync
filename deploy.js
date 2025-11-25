const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting GitHub Pages deployment...');

try {
  // Build the application for production
  console.log('📦 Building application...');
  execSync('ng build --configuration production --base-href /', { stdio: 'inherit' });
  
  // Copy CNAME file
  console.log('📋 Copying CNAME file...');
  const distDir = path.join(__dirname, 'dist', 'maintena-sync', 'browser');
  fs.copyFileSync(path.join(__dirname, 'src', 'CNAME'), path.join(distDir, 'CNAME'));
  
  // Copy index.html to 404.html for SPA routing
  console.log('📋 Copying index.html to 404.html for SPA routing...');
  fs.copyFileSync(path.join(distDir, 'index.html'), path.join(distDir, '404.html'));
  
  // Deploy to GitHub Pages
  console.log('🌐 Deploying to GitHub Pages...');
  execSync(`npx angular-cli-ghpages --dir=${distDir} --cname=preventive-maintenance.sharpfloornc.com`, { stdio: 'inherit' });
  
  console.log('✅ Deployment completed successfully!');
  console.log('🌍 Your app will be available at: https://preventive-maintenance.sharpfloornc.com');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}