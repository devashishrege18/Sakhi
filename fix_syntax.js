const fs = require('fs');
const path = 'C:\\Users\\hp\\antigravity\\sakhi\\src\\app\\page.js';

if (!fs.existsSync(path)) {
    console.error('File not found:', path);
    process.exit(1);
}

let c = fs.readFileSync(path, 'utf8');

console.log('Original length:', c.length);

// 1. Fix optional catch binding (some parsers dislike catch {)
c = c.replace(/catch\s*\{/g, 'catch (error) {');

// 2. Fix potential code jamming where I inserted text
// "const boxes" might be stuck to a previous brace
c = c.replace(/\}(\s*)const boxes/g, '}\n$1const boxes');

// 3. Fix any other obvious jamming from my previous edits
// "setLoading(false);" followed immediately by "setTimeout"
c = c.replace(/setLoading\(false\);(\s*)setTimeout/g, 'setLoading(false);\n$1setTimeout');

// 4. Ensure toggleListening implementation is not corrupted
// (Sometimes replacements leave artifacts if regex wasn't perfect)
// Check for "const toggleListening = () => { ... };"
// If it looks weird, we might need to alert.

// 5. Fix "window.location.href =" if it's jammed
c = c.replace(/;window\.location\.href/g, ';\nwindow.location.href');

fs.writeFileSync(path, c);
console.log('Syntax fixes applied. New length:', c.length);
