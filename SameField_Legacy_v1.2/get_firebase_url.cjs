const { spawn } = require('child_process');
const fs = require('fs');

const child = spawn('firebase', ['login', '--no-localhost'], { shell: true });

let output = '';

child.stdout.on('data', (data) => {
    const str = data.toString();
    output += str;
    process.stdout.write(str);

    if (str.includes('? Enable Gemini')) {
        child.stdin.write('n\n');
    }
    if (str.includes('? Allow Firebase to collect')) {
        child.stdin.write('n\n');
    }
});

child.stderr.on('data', (data) => {
    process.stderr.write(data.toString());
});

child.on('close', (code) => {
    fs.writeFileSync('login_output.txt', output);
});

// Periodic check to see if we got the URL
const interval = setInterval(() => {
    const urlMatch = output.match(/https:\/\/accounts\.google\.com\/o\/oauth2\/auth\?client_id=[^\s]+/);
    if (urlMatch) {
        fs.writeFileSync('captured_url.txt', urlMatch[0]);
        console.log('\n\nURL CAPTURED: ' + urlMatch[0]);
        clearInterval(interval);
    }
}, 1000);

setTimeout(() => {
    clearInterval(interval);
    process.exit(0);
}, 30000);
