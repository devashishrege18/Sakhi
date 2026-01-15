const fs = require('fs');
const path = 'C:\\Users\\hp\\antigravity\\sakhi\\src\\app\\page.js';

if (!fs.existsSync(path)) {
    console.error('File not found:', path);
    process.exit(1);
}

let c = fs.readFileSync(path, 'utf8');

// Fix the selector
if (c.includes("querySelectorAll('.message.assistant')")) {
    c = c.replace(/querySelectorAll\('.message.assistant'\)/g, "querySelectorAll('.message-row.assistant')");
    console.log('Fixed selector: .message.assistant -> .message-row.assistant');
} else {
    console.log('Selector not found or already fixed?');
    // Check if I used single or double quotes
    if (c.includes('querySelectorAll(".message.assistant")')) {
        c = c.replace(/querySelectorAll\(".message.assistant"\)/g, 'querySelectorAll(".message-row.assistant")');
        console.log("Fixed selector (double quotes)");
    }
}

// Also make the keywords check a bit more robust? 
// No, let's just fix the selector first. The subagent noted matchDikha was false in one case, 
// so maybe the bot isn't saying it. 
// But let's fix the guaranteed bug first.

fs.writeFileSync(path, c);
console.log('Redirect selector fix applied.');
