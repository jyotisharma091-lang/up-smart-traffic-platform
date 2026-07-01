const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/import\s+{([^}]+)}\s+from\s+['"]([^'"]*types[^'"]*)['"]/g, (match, p1, p2) => {
    // If it already says 'import type', leave it
    if (match.startsWith('import type')) return match;
    
    // Some imports might not be from types but just have types in the path, but in this project it's just '../types' or '../../types' or '@/types/...'
    return `import type {${p1}} from '${p2}'`;
  });
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Updated ${file}`);
  }
});
