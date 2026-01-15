const fs = require('fs');
const path = 'C:\\Users\\hp\\antigravity\\sakhi\\src\\app\\page.js';

if (!fs.existsSync(path)) {
    console.error('File not found:', path);
    process.exit(1);
}

let c = fs.readFileSync(path, 'utf8');

console.log('Original length:', c.length);

// Define the robust functions we want to insert
const restoreBlock = `
  const speakResponse = (text) => {
    if (!text || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLang.code;
    if (femaleVoice) utterance.voice = femaleVoice;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
  };

  const handleVoiceCommand = async (text) => {
    if (!text || !text.trim()) return;
    
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            message: text, 
            history: messages,
            language: selectedLang.english
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch');
      
      const reply = data.response || data.content || "Sorry, I couldn't understand.";
      const aiMsg = { role: 'assistant', content: reply };
      
      setMessages(prev => [...prev, aiMsg]);
      speakResponse(reply);
      loadChatHistory();

      // DOM-based Redirect Logic
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

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    }
    setLoading(false);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    
    if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch(e) {}
    }
    
    initSpeechRecognition(selectedLang.code);
    
    setTimeout(() => {
        try {
            recognitionRef.current?.start();
        } catch (e) {
            console.error('Mic start error', e);
        }
    }, 100);
  };
`;

// Find the start of toggleListening and the end of the corrupted block
// The corrupted block ends around where we see "setLoading(false);" followed by the broken setTimeout or };
// In page_debug.js:
// toggleListening starts at line 121
// The corrupted mess ends at line 164 "};" (which closes the broken function)

// We will look for: const toggleListening = ... UNTIL ... }; that contains "speakResponse" or "loadChatHistory" 
// which are the orphans we saw.

const corruptedRegex = /const toggleListening\s*=\s*\(\)\s*=>\s*\{[\s\S]*?setLoading\(false\);[\s\S]*?\}\s*,\s*1500\s*\);\s*\n\s*\};/;

// Actually, looking at the file content in Step 4000:
// 121: const toggleListening...
// ...
// 162: }, 1500);
// 163:
// 164: };

const exactCorruptedBlock = /const toggleListening\s*=\s*\(\)\s*=>\s*\{[\s\S]*?\}\s*,\s*1500\s*\);\s*[\r\n]*\s*\};/;

if (c.match(exactCorruptedBlock)) {
    c = c.replace(exactCorruptedBlock, restoreBlock);
    console.log('Replaced corrupted block matches');
} else {
    // Fallback: search for start of toggleListening and just replace a large chunk until handleSubmit
    const start = c.indexOf('const toggleListening =');
    const end = c.indexOf('const handleSubmit =');

    if (start > 0 && end > start) {
        c = c.substring(0, start) + restoreBlock + '\n\n  ' + c.substring(end);
        console.log('Replaced via index markers');
    } else {
        console.error('Could not find marker for replacement');
    }
}

fs.writeFileSync(path, c);
console.log('Restoration complete. New length:', c.length);
