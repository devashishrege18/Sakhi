const fs = require('fs');
const path = 'C:\\Users\\hp\\antigravity\\sakhi\\src\\app\\page.js';

if (!fs.existsSync(path)) {
    console.error('File not found:', path);
    process.exit(1);
}

let c = fs.readFileSync(path, 'utf8');

console.log('Original length:', c.length);

// 1. Force continuous = false
c = c.replace(/continuous\s*=\s*true/g, 'continuous = false');
c = c.replace(/recognition\.continuous\s*=\s*true/g, 'recognition.continuous = false');

// 2. Fix onresult to stop properly
const onresultRegex = /recognition\.onresult\s*=\s*\(event\)\s*=>\s*\{[^}]+\};/g;
const newOnresult = `recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev ? prev + ' ' + transcript : transcript);
      console.log('Result:', transcript);
      recognition.stop();
      setIsListening(false);
    };`;

if (c.match(onresultRegex)) {
    c = c.replace(onresultRegex, newOnresult);
    console.log('Replaced onresult');
} else {
    // If regex fails (maybe complex nesting), try simpler insertion
    // Look for setInput... and add stop()
    c = c.replace(
        /(setInput\([^)]+\);)(\s*\}\s*;)/,
        '$1 recognition.stop(); setIsListening(false); $2'
    );
    console.log('Patched onresult');
}

// 3. Fix toggleListening to be safer
const toggleStart = 'const toggleListening = () => {';
const toggleEnd = '  };';
const toggleRegex = /const toggleListening\s*=\s*\(\)\s*=>\s*\{[\s\S]*?\n\s*\};/;

const newToggle = `const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    
    // Cleanup old
    if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch(e) {}
    }
    
    initSpeechRecognition();
    
    if (recognitionRef.current) {
        try {
            recognitionRef.current.start();
        } catch (e) {
            console.error('Start error, retrying', e);
            setTimeout(() => {
                try { recognitionRef.current?.start(); } catch(e2) {}
            }, 100);
        }
    }
  };`;

// Use regex replacement for toggleListening
c = c.replace(toggleRegex, newToggle);
console.log('Replaced toggleListening');


// 4. Clean up old redirects
c = c.replace(/setTimeout\s*\(\s*\(\)\s*=>\s*\{[\s\S]*?window\.location\.href[\s\S]*?1500\s*\);/g, '');

// 5. Insert correct redirect
const redirectCode = `
      // DOM-based Redirect
      setTimeout(() => {
        try {
            const boxes = document.querySelectorAll('.message.assistant');
            if (boxes.length > 0) {
                const txt = boxes[boxes.length - 1].textContent.toLowerCase();
                if (txt.includes('redirect') || txt.includes('dikha')) {
                    if (txt.includes('hospital')) window.location.href = '/hospitals';
                    else if (txt.includes('pharmacy') || txt.includes('dawai')) window.location.href = '/pharmacy';
                    else if (txt.includes('doctor')) window.location.href = '/doctors';
                    else if (txt.includes('wellness') || txt.includes('tips')) window.location.href = '/wellness';
                    else if (txt.includes('community') || txt.includes('forum')) window.location.href = '/forum';
                }
            }
        } catch(e) { console.error('Redirect check failed', e); }
      }, 1500);
`;

const lastSetLoading = c.lastIndexOf('setLoading(false);');
if (lastSetLoading > -1) {
    c = c.substring(0, lastSetLoading + 18) + redirectCode + c.substring(lastSetLoading + 18);
    console.log('Inserted redirect logic');
}

fs.writeFileSync(path, c);
console.log('Done. New length:', c.length);
