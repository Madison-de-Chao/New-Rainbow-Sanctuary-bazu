#!/usr/bin/env node

/**
 * JavaScript Syntax Checker
 * Validates all JavaScript files in the js/ directory for syntax errors
 * Usage: node scripts/check-js-syntax.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getAllJSFiles(dir) {
  const files = [];
  
  function traverseDir(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverseDir(fullPath);
      } else if (item.endsWith('.js')) {
        files.push(fullPath);
      }
    }
  }
  
  traverseDir(dir);
  return files;
}

function checkSyntax(file) {
  try {
    console.log(`Checking ${file}...`);
    execSync(`node --check "${file}"`, { stdio: 'pipe' });
    console.log(`✅ ${file} syntax is valid`);
    return true;
  } catch (error) {
    console.error(`❌ ${file} has syntax errors:`);
    console.error(error.stdout ? error.stdout.toString() : error.message);
    return false;
  }
}

function main() {
  console.log('Checking JavaScript files for basic syntax...');
  
  const jsDir = path.join(__dirname, '..', 'js');
  
  if (!fs.existsSync(jsDir)) {
    console.error('❌ js/ directory not found');
    process.exit(1);
  }
  
  const jsFiles = getAllJSFiles(jsDir);
  
  if (jsFiles.length === 0) {
    console.log('No JavaScript files found');
    return;
  }
  
  let allValid = true;
  
  for (const file of jsFiles) {
    if (!checkSyntax(file)) {
      allValid = false;
    }
  }
  
  if (allValid) {
    console.log('\n🎉 All JavaScript files have valid syntax!');
    process.exit(0);
  } else {
    console.log('\n💥 Some JavaScript files have syntax errors');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkSyntax, getAllJSFiles };