/**
 * Version check script
 * Runs after build to validate version consistency
 */

const fs = require('fs');
const path = require('path');

const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8')
);

const version = packageJson.version;

// Write version to .env.local for runtime checks
const envContent = `NEXT_PUBLIC_APP_VERSION=${version}\n`;

const envPath = path.join(__dirname, '../.env.local');
const existingEnv = fs.existsSync(envPath)
  ? fs.readFileSync(envPath, 'utf-8')
  : '';

// Update or add version to env
const newEnv = existingEnv
  .split('\n')
  .filter((line) => !line.startsWith('NEXT_PUBLIC_APP_VERSION='))
  .join('\n')
  .trim() + '\n' + envContent;

fs.writeFileSync(envPath, newEnv);

console.log(`✅ Version ${version} synced to environment`);
