const fs = require('fs');
const path = 'C:\\Users\\hp\\antigravity\\sakhi\\src\\app\\page.js';

if (!fs.existsSync(path)) {
    console.error('File not found:', path);
    process.exit(1);
}

let c = fs.readFileSync(path, 'utf8');

const newHandler = `const handleVoiceCommand = async (text) => {
    if (!text || !text.trim()) return;
    
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Intent Analysis
    const lower = text.toLowerCase();
    let intentRoute = null;
    if (lower.includes('hospital') || lower.includes('clinic') || lower.includes('emergency')) intentRoute = '/hospitals';
    else if (lower.includes('pharmacy') || lower.includes('medicine') || lower.includes('dawai') || lower.includes('chemist')) intentRoute = '/pharmacy';
    else if (lower.includes('doctor') || lower.includes('consult')) intentRoute = '/doctors';
    else if (lower.includes('wellness') || lower.includes('yoga') || lower.includes('exercise')) intentRoute = '/wellness';
    else if (lower.includes('forum') || lower.includes('community') || lower.includes('chat')) intentRoute = '/forum';

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
      
      // Check AI response for override
      const replyLower = reply.toLowerCase();
      if (replyLower.includes('redirect') || replyLower.includes('navigat')) {
         if (replyLower.includes('hospital')) intentRoute = '/hospitals';
         else if (replyLower.includes('pharmacy')) intentRoute = '/pharmacy';
         else if (replyLower.includes('doctor')) intentRoute = '/doctors';
      }

      setMessages(prev => [...prev, aiMsg]);
      speakResponse(reply);
      loadChatHistory();

      if (intentRoute) {
        setTimeout(() => {
             window.location.href = intentRoute;
        }, 2000);
      }

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    }
    setLoading(false);
  };`;

// Replace the existing handleVoiceCommand function
// We look for 'const handleVoiceCommand = async (text) => {' ... until the start of 'const toggleListening'
const startMarker = 'const handleVoiceCommand = async (text) => {';
const endMarker = 'const toggleListening =';

const startIdx = c.indexOf(startMarker);
const endIdx = c.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
    c = c.substring(0, startIdx) + newHandler + '\n\n  ' + c.substring(endIdx);
    console.log('Updated handleVoiceCommand with intent logic.');
    fs.writeFileSync(path, c);
} else {
    console.error('Could not find function boundaries to replace.');
}
