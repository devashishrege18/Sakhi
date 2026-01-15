'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { saveChat, getChats, deleteChat, newChatId } from '../lib/firebase';
// MOCK FIREBASE TO UNBLOCK BUILD ONLY (Preserving other bugs)
const saveChat = async () => { };
const getChats = async () => [];
const deleteChat = async () => { };
const newChatId = () => Date.now().toString();

const INDIAN_LANGUAGES = [
  { code: 'hi-IN', name: '\u0939\u093F\u0902\u0926\u0940', english: 'Hindi' },
  { code: 'bn-IN', name: '\u09AC\u09BE\u0982\u09B2\u09BE', english: 'Bengali' },
  { code: 'te-IN', name: '\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41', english: 'Telugu' },
  { code: 'mr-IN', name: '\u092E\u0930\u093E\u0920\u0940', english: 'Marathi' },
  { code: 'ta-IN', name: '\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD', english: 'Tamil' },
  { code: 'gu-IN', name: '\u0A97\u0AC1\u0A9C\u0AB0\u0ABE\u0AA4\u0AC0', english: 'Gujarati' },
  { code: 'kn-IN', name: '\u0C95\u0CA8\u0CCD\u0CA8\u0CA1', english: 'Kannada' },
  { code: 'ml-IN', name: '\u0D2E\u0D32\u0D2F\u0D3E\u0D33\u0D02', english: 'Malayalam' },
  { code: 'pa-IN', name: '\u0A2A\u0A70\u0A1C\u0ABE\u0A2C\u0A40', english: 'Punjabi' },
  { code: 'en-IN', name: 'English', english: 'English' },
];

const VOICE_FEATURES = {
  hospitals: { keywords: ['hospital', 'असपतल', 'மரததவமன', 'ఆసపతర', 'হসপতল', 'clinic', 'emergency'], route: '/hospitals' },
  doctors: { keywords: ['doctor', 'डकटर', 'மரததவர', 'డకటర', 'ডকতর', 'consultation'], route: '/doctors' },
  wellness: { keywords: ['wellness', 'diet', 'exercise', 'सवसथय', 'ஆரககயம', 'fitness'], route: '/wellness' },
  pharmacy: { keywords: ['pharmacy', 'medicine', 'दवई', 'மரநத', 'pads'], route: '/pharmacy' },
  forum: { keywords: ['forum', 'community', 'समदय', 'discussion'], route: '/forum' },
};

export default function Home() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showLanguages, setShowLanguages] = useState(false);
  const [selectedLang, setSelectedLang] = useState(INDIAN_LANGUAGES[0]);
  const [femaleVoice, setFemaleVoice] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const shouldListenRef = useRef(false);

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Auto-save chat when messages change
  useEffect(() => {
    if (messages.length > 0 && currentChatId) {
      const title = messages[0]?.content?.slice(0, 30) || 'New Chat';
      saveChat(currentChatId, title, messages);
    }
  }, [messages, currentChatId]);

  const loadChatHistory = async () => {
    const chats = await getChats();
    setChatHistory(chats);
  };

  const startNewChat = () => {
    const id = newChatId();
    setCurrentChatId(id);
    setMessages([]);
  };

  const loadChat = (chat) => {
    setCurrentChatId(chat.id);
    setMessages(chat.messages || []);
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    await deleteChat(chatId);
    if (currentChatId === chatId) {
      startNewChat();
    }
    loadChatHistory();
  };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis?.getVoices() || [];
      const female = voices.find(v => v.name.includes('Zira') || v.name.includes('Heera') || v.name.toLowerCase().includes('female'));
      setFemaleVoice(female || voices.find(v => v.lang.includes('hi')) || voices[0]);
    };
    if (typeof window !== 'undefined') { loadVoices(); window.speechSynthesis?.addEventListener('voiceschanged', loadVoices); }
  }, []);

  useEffect(() => { initSpeechRecognition(selectedLang.code); }, [selectedLang]);

  // Stop speech when tab loses focus or route changes
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const initSpeechRecognition = (langCode) => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SR();
      recognitionRef.current.continuous = false; // Single utterance only
      recognitionRef.current.interimResults = true; // Show interim for UX
      recognitionRef.current.lang = langCode;

      recognitionRef.current.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
        // ONLY process when result is FINAL to prevent duplicates
        if (e.results[0].isFinal) {
          handleVoiceCommand(transcript);
          setIsListening(false);
        }
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      // Stop listening
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    // Cleanup any existing instance to prevent duplicates
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (e) { }
    }

    // Fresh init with current language
    initSpeechRecognition(selectedLang.code);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error('Mic start error:', e);
        setIsListening(false);
      }
    }
  };

  const speakResponse = (text, nav) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      // Consistent voice settings for both typed and spoken
      if (femaleVoice) u.voice = femaleVoice;
      u.lang = selectedLang.code;
      u.pitch = 1.0;  // Natural pitch
      u.rate = 0.95;  // Slightly slower for clarity
      u.onstart = () => setIsSpeaking(true);
      u.onend = () => {
        setIsSpeaking(false);
        // Execute redirect AFTER speech ends
        if (nav) {
          setTimeout(() => {
            window.location.href = nav;
          }, 500);
        }
      };
      window.speechSynthesis.speak(u);
    } else if (nav) {
      // Fallback: redirect immediately if no speech synthesis
      setTimeout(() => { window.location.href = nav; }, 1000);
    }
  };

  const handleVoiceCommand = (text) => {
    if (!currentChatId) setCurrentChatId(newChatId());
    const lower = text.toLowerCase();
    for (const [k, f] of Object.entries(VOICE_FEATURES)) {
      if (f.keywords.some(kw => lower.includes(kw.toLowerCase()))) {
        const r = { hospitals: 'Nearby hospitals dikha rahi hoon...', doctors: 'Doctor se connect kar rahi hoon...', wellness: 'Wellness tips la rahi hoon...', pharmacy: 'Pharmacy khol rahi hoon...', forum: 'Community forum le ja rahi hoon...' };
        setMessages(prev => [...prev, { role: 'user', content: text }, { role: 'assistant', content: r[k], navigating: true }]);
        speakResponse(r[k], f.route);
        return;
      }
    }
    sendMessage(text);
  };

  const sendMessage = async (text) => {
    if (!text?.trim()) return;
    if (!currentChatId) setCurrentChatId(newChatId());
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: userMsg.text, history: messages, language: selectedLang.code }) });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content, intent: data.intent }]);
      speakResponse(data.content);
      loadChatHistory();
    } catch { setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Try again. ' }]); }
    setLoading(false);
  };

  const handleSubmit = () => handleVoiceCommand(input);
  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } };
  const waveHeights = [30, 50, 75, 40, 65, 90, 55, 80, 45, 70, 35];

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className={`sidebar ${showSidebar ? 'open' : ''}`}>
        <div className="sidebar-top">
          <button onClick={startNewChat} className="new-chat-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
            New chat
          </button>
        </div>

        <nav className="sidebar-nav">
          {/* Chat History */}
          <div className="nav-section">
            <span className="nav-title">Recent Chats</span>
            {chatHistory.length === 0 ? (
              <p className="no-chats">No chats yet</p>
            ) : (
              chatHistory.slice(0, 10).map(chat => (
                <div key={chat.id} onClick={() => loadChat(chat)} className={`chat-item ${currentChatId === chat.id ? 'active' : ''}`}>
                  <span className="chat-title"> {chat.title?.slice(0, 25) || 'Chat'}</span>
                  <button onClick={(e) => handleDeleteChat(chat.id, e)} className="delete-btn" title="Delete chat"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                </div>
              ))
            )}
          </div>

          {/* Features */}
          <div className="nav-section">
            <span className="nav-title"></span>






          </div>
        </nav>

        <div className="sidebar-bottom">
          <div className="user-info">
            <div className="user-avatar"></div>
            <span>Guest User</span>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="main">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button onClick={() => setShowSidebar(!showSidebar)} className="toggle-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
            </button>
            <div className="logo-container">
              <img src="/sakhi-logo.png" alt="Sakhi" className="logo-img" />
              <span className="logo-text">Sakhi</span>
            </div>
          </div>

          <div className="header-right">
            <div className="lang-dropdown-container">
              <button onClick={() => setShowLanguages(!showLanguages)} className="lang-btn">
                {selectedLang.english}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
              </button>
              {showLanguages && (
                <div className="lang-menu">
                  {INDIAN_LANGUAGES.map(l => (
                    <button key={l.code} onClick={() => { setSelectedLang(l); setShowLanguages(false); }} className={`lang-item ${selectedLang.code === l.code ? 'active' : ''}`}>
                      {l.name} <span>{l.english}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Chat Container */}
        <div className="chat-container">
          {messages.length === 0 ? (
            <div className="welcome">
              <img src="/sakhi-logo.png" alt="Sakhi" className="welcome-logo" />
              <h1>How can I help you today?</h1>
              <p className="welcome-sub">Main Sakhi hoon - aapki health companion </p>

              <div className="suggestions">
                {[[' PCOS ke baare mein batao', 'PCOS information'], [' Nearby hospital dikhao', 'Find hospitals'], [' Doctor se baat karni hai', 'Consult doctor'], [' Period track karna hai', 'Track periods']].map(([q, label]) => (
                  <button key={q} onClick={() => handleVoiceCommand(q)} className="suggestion-card">
                    <span className="suggestion-text">{q}</span>
                    <span className="suggestion-label">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="messages">
              {messages.map((m, i) => (
                <div key={i} className={`message-row ${m.role}`}>
                  <div className="message-avatar">{m.role === 'user' ? '' : <img src="/sakhi-logo.png" alt="Sakhi" />}</div>
                  <div className="message-content">
                    <div className="message-name">{m.role === 'user' ? 'You' : 'Sakhi'}</div>
                    <div className="message-text">{m.content}</div>
                    {m.navigating && <div className="navigating"> Redirecting...</div>}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="message-row assistant">
                  <div className="message-avatar"><img src="/sakhi-logo.png" alt="Sakhi" /></div>
                  <div className="message-content">
                    <div className="message-name">Sakhi</div>
                    <div className="typing-indicator"><span></span><span></span><span></span></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Waveform */}
        {(isListening || isSpeaking) && (
          <div className="waveform">
            <div className="wave-dot"></div><div className="wave-dot"></div>
            {waveHeights.map((h, i) => <div key={i} className="wave-bar" style={{ height: h, animationDelay: `${i * 50}ms` }} />)}
            <div className="wave-dot"></div><div className="wave-dot"></div><div className="wave-dot"></div>
          </div>
        )}

        {/* Input Area */}
        <div className="input-wrapper">
          <div className="input-container">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey} placeholder="Ask something to Sakhi..." rows={1} className="chat-input" />
            <div className="input-actions">
              <button onClick={toggleListening} className={`action-btn mic ${isListening ? 'active' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" /><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" /></svg>
              </button>
              <button onClick={handleSubmit} disabled={!input.trim() || loading} className="action-btn send">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
              </button>
            </div>
          </div>
          <p className="input-footer">Sakhi uses AI. Responses are for informational purposes only.</p>
        </div>
      </main>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; }
        .app { display: flex; height: 100vh; overflow: hidden; }
        
        /* Sidebar - Original Purple Theme */
        .sidebar { width: 280px; background: linear-gradient(180deg, #4a1a6b 0%, #6b21a8 100%); display: flex; flex-direction: column; transition: all 0.3s; }
        .sidebar:not(.open) { width: 0; overflow: hidden; }
        .sidebar-top { padding: 16px; }
        .new-chat-btn { width: 100%; padding: 14px; display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 12px; color: white; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .new-chat-btn:hover { background: rgba(255,255,255,0.25); transform: translateY(-2px); }
        .sidebar-nav { flex: 1; padding: 12px; overflow-y: auto; }
        .nav-section { margin-bottom: 20px; }
        .nav-title { display: block; padding: 10px 14px; font-size: 11px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
        .no-chats { padding: 10px 14px; font-size: 12px; color: rgba(255,255,255,0.4); font-style: italic; }
        .chat-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; color: white; border-radius: 10px; font-size: 13px; cursor: pointer; transition: all 0.2s; }
        .chat-item:hover { background: rgba(255,255,255,0.15); }
        .chat-item.active { background: rgba(255,255,255,0.2); }
        .chat-title { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .delete-btn { background: none; border: none; cursor: pointer; opacity: 0; transition: opacity 0.2s; font-size: 12px; }
        .chat-item:hover .delete-btn { opacity: 1; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; color: white; text-decoration: none; border-radius: 10px; font-size: 14px; transition: all 0.2s; }
        .nav-item:hover { background: rgba(255,255,255,0.15); transform: translateX(4px); }
        .nav-item span:first-child { font-size: 18px; }
        .sidebar-bottom { display: none;  padding: 16px; border-top: 1px solid rgba(255,255,255,0.2); }
        .user-info { display: flex; align-items: center; gap: 12px; padding: 10px; color: white; font-size: 14px; }
        .user-avatar { width: 36px; height: 36px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        
        /* Main - Original Lavender/Pink Theme */
        .main { flex: 1; display: flex; flex-direction: column; background: linear-gradient(135deg, #D8A9D8 0%, #c792c7 50%, #D8A9D8 100%); }
        
        /* Header */
        .header { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255,255,255,0.3); }
        .header-left { display: flex; align-items: center; gap: 16px; }
        .toggle-btn { background: rgba(255,255,255,0.3); border: none; color: #4a1a6b; cursor: pointer; padding: 10px; border-radius: 10px; transition: all 0.2s; }
        .toggle-btn:hover { background: rgba(255,255,255,0.5); }
        .logo-container { display: flex; align-items: center; gap: 12px; }
        .logo-img { height: 45px; width: auto; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2)); }
        .logo-text { font-size: 28px; font-weight: bold; color: #228B22; font-family: Georgia, serif; text-shadow: 0 2px 8px rgba(34,139,34,0.3); }
        .header-right { display: flex; align-items: center; gap: 12px; }
        .lang-dropdown-container { position: relative; }
        .lang-btn { display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: rgba(255,255,255,0.4); border: none; border-radius: 10px; color: #4a1a6b; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .lang-btn:hover { background: rgba(255,255,255,0.6); }
        .lang-menu { position: absolute; top: 100%; right: 0; margin-top: 8px; background: white; border-radius: 14px; padding: 8px; min-width: 220px; max-height: 350px; overflow-y: auto; z-index: 100; box-shadow: 0 10px 40px rgba(0,0,0,0.15); }
        .lang-item { display: flex; justify-content: space-between; width: 100%; padding: 12px 14px; background: none; border: none; color: #333; border-radius: 10px; cursor: pointer; font-size: 14px; text-align: left; transition: all 0.2s; }
        .lang-item:hover { background: #f3e8ff; }
        .lang-item.active { background: linear-gradient(135deg, #f3e8ff, #fce7f3); }
        .lang-item span { color: #666; font-size: 12px; }
        
        /* Chat */
        .chat-container { flex: 1; overflow-y: auto; padding: 24px; }
        .welcome { max-width: 700px; margin: 0 auto; text-align: center; padding-top: 40px; }
        .welcome-logo { height: 140px; margin-bottom: 24px; filter: drop-shadow(0 10px 30px rgba(232,168,56,0.4)); animation: float 3s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .welcome h1 { font-size: 32px; font-weight: 700; color: #4a1a6b; margin-bottom: 10px; }
        .welcome-sub { color: #6b4a7a; font-size: 16px; margin-bottom: 40px; }
        .suggestions { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; max-width: 600px; margin: 0 auto; }
        .suggestion-card { background: rgba(255,248,240,0.9); border: 1px solid rgba(107,33,168,0.2); border-radius: 16px; padding: 18px; text-align: left; cursor: pointer; transition: all 0.2s; }
        .suggestion-card:hover { background: white; transform: translateY(-4px); box-shadow: 0 10px 30px rgba(107,33,168,0.15); }
        .suggestion-text { display: block; font-size: 14px; color: #4a1a6b; margin-bottom: 6px; font-weight: 500; }
        .suggestion-label { font-size: 12px; color: #888; }
        
        /* Messages */
        .messages { max-width: 800px; margin: 0 auto; }
        .message-row { display: flex; gap: 12px; padding: 16px 0; align-items: flex-start; } .message-row.user { justify-content: flex-end; } .message-row.assistant { justify-content: flex-start; }
        .message-row.user .message-bubble { background: linear-gradient(135deg, #6b21a8, #9333ea); color: white; border-radius: 18px 18px 4px 18px; padding: 12px 16px; max-width: 70%; } .message-row.user .message-name { color: rgba(255,255,255,0.8); } .message-row.user .message-text { color: white; } .message-row.assistant { background: rgba(255,248,240,0.5); margin: 0 -24px; padding-left: 24px; padding-right: 24px; border-radius: 12px; }
        .message-avatar { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 20px; overflow: hidden; }
        .message-avatar img { width: 100%; height: 100%; object-fit: contain; }
        .message-row.user .message-avatar { background: linear-gradient(135deg, #6b21a8, #9333ea); }
        .message-row.assistant .message-avatar { background: linear-gradient(135deg, #228B22, #38a169); }
        .message-content { flex: 1; min-width: 0; }
        .message-name { font-weight: 700; font-size: 14px; margin-bottom: 8px; color: #4a1a6b; }
        .message-text { font-size: 15px; line-height: 1.7; color: #333; white-space: pre-wrap; }
        .navigating { margin-top: 8px; font-size: 13px; color: #6b21a8; }
        .typing-indicator { display: flex; gap: 6px; padding: 8px 0; }
        .typing-indicator span { width: 10px; height: 10px; background: #6b21a8; border-radius: 50%; animation: typing 1.4s infinite; }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-10px); } }
        
        /* Waveform - Original Exact Style */
        .waveform { display: flex; justify-content: center; align-items: center; gap: 6px; padding: 24px; }
        .wave-dot { width: 10px; height: 10px; border-radius: 50%; background: #1E1E5A; }
        .wave-bar { width: 10px; background: #1E1E5A; border-radius: 5px; animation: waveAnim 0.6s ease-in-out infinite alternate; }
        @keyframes waveAnim { 0% { transform: scaleY(0.5); } 100% { transform: scaleY(1.2); } }
        
        /* Input */
        .input-wrapper { padding: 20px 24px 28px; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); }
        .input-container { max-width: 800px; margin: 0 auto; display: flex; align-items: center; gap: 12px; background: rgba(255,248,240,0.95); border: 2px solid rgba(107,33,168,0.2); border-radius: 20px; padding: 14px 18px; transition: all 0.2s; }
        .input-container:focus-within { border-color: #6b21a8; box-shadow: 0 0 0 4px rgba(107,33,168,0.15); }
        .chat-input { flex: 1; background: none; border: none; color: #333; font-size: 16px; line-height: 1.5; resize: none; outline: none; max-height: 200px; }
        .chat-input::placeholder { color: #999; }
        .input-actions { display: flex; gap: 10px; }
        .action-btn { width: 44px; height: 44px; border-radius: 12px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .action-btn.mic { background: rgba(107,33,168,0.1); color: #6b21a8; }
        .action-btn.mic:hover { background: rgba(107,33,168,0.2); }
        .action-btn.mic.active { background: #dc2626; color: white; animation: pulse 1s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        .action-btn.send { background: linear-gradient(135deg, #6b21a8, #9333ea); color: white; }
        .action-btn.send:hover { transform: scale(1.05); box-shadow: 0 6px 20px rgba(107,33,168,0.4); }
        .action-btn.send:disabled { background: #ccc; cursor: not-allowed; transform: none; box-shadow: none; }
        .input-footer { text-align: center; font-size: 12px; color: #6b4a7a; margin-top: 14px; }
      
                    
          
          
          /* USER MESSAGE - Complete Bubble Fix */
          .message-row.user { 
            justify-content: flex-end !important;
            flex-direction: row-reverse !important;
          }
          .message-row.user .message-content {
            background: linear-gradient(135deg, #6b21a8, #9333ea) !important;
            color: white !important;
            border-radius: 18px 18px 4px 18px !important;
            padding: 12px 16px !important;
            max-width: 75% !important;
            width: auto !important;
            display: inline-block !important;
          }
          .message-row.user .message-name { 
            color: rgba(255,255,255,0.9) !important; 
            text-align: right !important;
          }
          .message-row.user .message-text { 
            color: white !important; 
          }
          .message-row.user .message-avatar {
            margin-left: 12px !important;
            margin-right: 0 !important;
          }
          
          /* ASSISTANT MESSAGE - Keep on left */
          .message-row:not(.user) .message-content {
            background: rgba(255,248,240,0.95) !important;
            border-radius: 18px 18px 18px 4px !important;
            padding: 12px 16px !important;
            max-width: 75% !important;
          }
          
          /* Delete button visible */
          .delete-btn {
            background: none !important;
            border: none !important;
            cursor: pointer !important;
            font-size: 16px !important;
            opacity: 0.7 !important;
            padding: 4px 8px !important;
          }
          .delete-btn:hover {
            opacity: 1 !important;
            color: #ff4444 !important;
          }
          
        /* CHATGPT-STYLE CHAT LAYOUT */
        .message-row { display: flex; padding: 12px 0; gap: 12px; max-width: 100%; }
        .message-row.user { justify-content: flex-end; flex-direction: row-reverse; }
        .message-row.user .message-content { background: linear-gradient(135deg, #6b21a8, #9333ea); color: white; border-radius: 18px 18px 4px 18px; padding: 10px 16px; max-width: 70%; width: fit-content; display: inline-block; box-shadow: 0 2px 8px rgba(107, 33, 168, 0.3); }
        .message-row.user .message-name { display: none; }
        .message-row.user .message-text { color: white; margin: 0; }
        .message-row.user .message-avatar { display: none; }
        .message-row:not(.user) { justify-content: flex-start; }
        .message-row:not(.user) .message-content { background: transparent; padding: 8px 0; max-width: 85%; border-radius: 0; box-shadow: none; }
        .message-row:not(.user) .message-name { color: #9333ea; font-weight: 600; font-size: 14px; margin-bottom: 6px; }
        .message-row:not(.user) .message-text { color: #374151; line-height: 1.6; }
        .message-row:not(.user) .message-avatar { width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0; }
        .delete-btn { background: transparent; border: none; cursor: pointer; font-size: 16px; opacity: 0.6; padding: 4px; color: #999; }
        .delete-btn:hover { opacity: 1; color: #ef4444; }
        .messages-container, .chat-messages { background: transparent; }
        /* === CHATGPT-STYLE LAYOUT === */
        /* User messages: small dark purple bubble, right-aligned, no avatar/name */
        .message-row.user {
          display: flex !important;
          justify-content: flex-end !important;
          padding: 8px 16px !important;
        }
        .message-row.user .message-avatar {
          display: none !important;
        }
        .message-row.user .message-content {
          background: #6b21a8 !important;
          color: white !important;
          padding: 10px 16px !important;
          border-radius: 20px 20px 4px 20px !important;
          max-width: 60% !important;
          width: fit-content !important;
          min-width: auto !important;
        }
        .message-row.user .message-name {
          display: none !important;
        }
        .message-row.user .message-text {
          color: white !important;
          font-size: 15px !important;
        }
        
        /* Sakhi messages: clean text, no background box, avatar on left */
        .message-row:not(.user) {
          display: flex !important;
          justify-content: flex-start !important;
          align-items: flex-start !important;
          padding: 12px 16px !important;
          gap: 12px !important;
        }
        .message-row:not(.user) .message-content {
          background: none !important;
          background-color: transparent !important;
          padding: 0 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          border: none !important;
          max-width: 80% !important;
        }
        .message-row:not(.user) .message-avatar {
          width: 28px !important;
          height: 28px !important;
          border-radius: 50% !important;
          flex-shrink: 0 !important;
          display: block !important;
        }
        .message-row:not(.user) .message-name {
          color: #9333ea !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          margin-bottom: 4px !important;
        }
        .message-row:not(.user) .message-text {
          color: #1f2937 !important;
          font-size: 15px !important;
          line-height: 1.6 !important;
        }
        
        /* Delete button - visible emoji */
        .delete-btn {
          display: inline-block !important;
          visibility: visible !important;
          opacity: 0.7 !important;
          background: none !important;
          border: none !important;
          cursor: pointer !important;
          font-size: 14px !important;
          padding: 2px 6px !important;
        }
        .delete-btn:hover {
          opacity: 1 !important;
          color: #dc2626 !important;
        }
        
        /* Remove any wrapper backgrounds */
        .chat-area, .messages-container, .chat-messages {
          background: transparent !important;
        }
        /* === END CHATGPT STYLE === */
        /* === TARGETED CHATGPT-STYLE FIXES === */
        /* FIX 1: Remove background from assistant/Sakhi message ROW */
        .message-row.assistant {
          background: transparent !important;
          background-color: transparent !important;
          box-shadow: none !important;
        }
        /* FIX 2: Make user bubble fit-content, not flex-grow */
        .message-row.user .message-content {
          flex: none !important;
          flex-grow: 0 !important;
          width: fit-content !important;
          min-width: auto !important;
          background: #6b21a8 !important;
          color: white !important;
          padding: 10px 16px !important;
          border-radius: 20px 20px 4px 20px !important;
        }
        /* Hide user avatar and name */
        .message-row.user .message-avatar,
        .message-row.user .message-name {
          display: none !important;
        }
        .message-row.user .message-text {
          color: white !important;
        }
        /* Sakhi content - no background */
        .message-row.assistant .message-content {
          background: none !important;
          background-color: transparent !important;
          box-shadow: none !important;
          flex: none !important;
        }
        /* === END TARGETED FIXES === */
        /* === FIX USER RIGHT ALIGNMENT === */
        .message-row.user {
          display: flex !important;
          flex-direction: row !important;
          justify-content: flex-end !important;
          width: 100% !important;
        }
        /* === END RIGHT ALIGNMENT FIX === */
        /* === DELETE BUTTON VISIBILITY FIX === */
        .chat-item {
          position: relative !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
        }
        .chat-item .delete-btn,
        .chat-item button[class*="delete"],
        .chat-item .trash-btn,
        .chat-item svg {
          opacity: 1 !important;
          visibility: visible !important;
          display: inline-flex !important;
          color: #fff !important;
          background: rgba(255, 255, 255, 0.2) !important;
          border-radius: 4px !important;
          padding: 4px !important;
          cursor: pointer !important;
        }
        .chat-item:hover .delete-btn,
        .chat-item:hover button[class*="delete"],
        .chat-item:hover .trash-btn {
          background: rgba(220, 50, 50, 0.7) !important;
        }
        /* === END DELETE BUTTON FIX === */
        
        
        
        
        `}</style>
    </div>
  );
}
