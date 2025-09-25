#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the service worker file path
const swPath = path.join(__dirname, '..', 'public', 'sw.js');

// Read the current service worker file
let content = fs.readFileSync(swPath, 'utf8');

// Generate a version based on Git commit hash (if available) or timestamp
let version;
try {
  // Try to get Git commit hash for more precise versioning
  const gitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  version = `v${timestamp}-${gitHash}`;
} catch {
  // Fallback to timestamp if Git is not available
  const now = new Date();
  version = `v${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}.${now.getHours()}${now.getMinutes()}`;
}

// Update the version in the service worker
content = content.replace(/const VERSION = '[^']*';/, `const VERSION = '${version}';`);

// Update the cache names to force cache invalidation
const timestamp = Date.now();
content = content.replace(/const STATIC_CACHE = '[^']*';/, `const STATIC_CACHE = 'show-tracker-static-${timestamp}';`);
content = content.replace(/const DYNAMIC_CACHE = '[^']*';/, `const DYNAMIC_CACHE = 'show-tracker-dynamic-${timestamp}';`);

// Write the updated file
fs.writeFileSync(swPath, content);

console.log(`✅ Service worker updated to version ${version}`);
console.log(`📝 Cache names updated to force invalidation`);
console.log(`🚀 Ready for deployment!`);
