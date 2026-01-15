
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\hp\\Desktop\\SameField_Legacy_v1.2\\page_debug.js', 'utf8');

let braceCount = 0;
let parenCount = 0;
let lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const char of line) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
        if (char === '(') parenCount++;
        if (char === ')') parenCount--;
        if (char === '[') parenCount++; // treating brackets same for simplicity
        if (char === ']') parenCount--;
    }
    if (braceCount < 0) {
        console.log(`Brace count went negative at line ${i + 1}: ${line}`);
        process.exit(1);
    }
    if (parenCount < 0) {
        console.log(`Paren count went negative at line ${i + 1}: ${line}`);
        process.exit(1);
    }
}
console.log(`Final Brace Count: ${braceCount}`);
console.log(`Final Paren Count: ${parenCount}`);
