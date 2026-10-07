import { NextResponse } from "next/server";

// Round-robin key rotation counter (in-memory, per instance)
let keyIndex = 0;

function getNextApiKey(env) {
  // Collect all available keys: GROQ_API_KEY, GROQ_API_KEY_2, GROQ_API_KEY_3, ...
  const keys = [];
  if (env.GROQ_API_KEY)   keys.push(env.GROQ_API_KEY);
  if (env.GROQ_API_KEY_2) keys.push(env.GROQ_API_KEY_2);
  if (env.GROQ_API_KEY_3) keys.push(env.GROQ_API_KEY_3);
  if (env.GROQ_API_KEY_4) keys.push(env.GROQ_API_KEY_4);
  if (env.GROQ_API_KEY_5) keys.push(env.GROQ_API_KEY_5);
  if (keys.length === 0) return null;
  const key = keys[keyIndex % keys.length];
  keyIndex = (keyIndex + 1) % keys.length;
  return { key, total: keys.length };
}

async function callGroq(apiKey, model, messages) {
  return fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.75,
      max_tokens: 250,
      response_format: { type: "json_object" }
    }),
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.message || "";
    const history = body.history || [];
    const language = body.language || "hi-IN";

    const keyInfo = getNextApiKey(process.env);
    if (!keyInfo) {
      return NextResponse.json({ content: "API key not configured." });
    }

    const { key: apiKey, total: totalKeys } = keyInfo;

    const conversationHistory = history.slice(-4).map(msg => ({
      role: (msg.type === "user" || msg.role === "user") ? "user" : "assistant",
      content: msg.text || msg.content || ""
    }));

    const languageMap = {
      'hi-IN': 'Respond in PURE HINDI (Devanagari script) by default.',
      'bn-IN': 'Respond in PURE BENGALI (Bengali script) by default.',
      'te-IN': 'Respond in PURE TELUGU (Telugu script) by default.',
      'mr-IN': 'Respond in PURE MARATHI (Devanagari script) by default.',
      'ta-IN': 'Respond in PURE TAMIL (Tamil script) by default.',
      'gu-IN': 'Respond in PURE GUJARATI (Gujarati script) by default.',
      'kn-IN': 'Respond in PURE KANNADA (Kannada script) by default.',
      'ml-IN': 'Respond in PURE MALAYALAM (Malayalam script) by default.',
      'pa-IN': 'Respond in PURE PUNJABI (Gurmukhi script) by default.',
      'en-IN': 'Respond in clear English by default.'
    };

    const languageInstruction = languageMap[language] || languageMap['hi-IN'];

    const systemPrompt = `You are Sakhi, a warm and knowledgeable health companion for women in India.

DEFAULT LANGUAGE PREFERENCE: ${languageInstruction}

CRITICAL INSTRUCTION - AUTO-DETECT LANGUAGE & JSON OUTPUT:
1. First, DETECT the language of the user's message. Use mixed-script detection (e.g. "kya haal hai" = Hindi).
2. You MUST respond in valid JSON format:
   {
     "language": "code", // e.g. hi-IN, ta-IN, en-IN
     "content": "response text in NATIVE SCRIPT"
   }

SUPPORTED CODES:
hi-IN (Hindi), bn-IN (Bengali), te-IN (Telugu), mr-IN (Marathi), ta-IN (Tamil), gu-IN (Gujarati), kn-IN (Kannada), ml-IN (Malayalam), pa-IN (Punjabi), en-IN (English)

IMPORTANT: Do NOT use "Hinglish" or Latin characters for Indian languages. Use the correct script.

NAME PRONUNCIATION (CRITICAL):
When referring to yourself, ALWAYS write your name in the native script of the response language:
- Hindi/Marathi: साखी
- Bengali: সাখী
- Tamil: சாக்கி
- Telugu: సాఖీ
- Gujarati: સાખી
- Kannada: ಸಾಖಿ
- Malayalam: സാഖി
- Punjabi: ਸਾਖੀ
- English: Sakhi (only for English responses)
NEVER write "Sakhi" in Roman letters when responding in Indian languages.

PERSONALITY:
- Be like a caring older sister (didi/akka/tai) - supportive, non-judgmental
- Be empathetic and understanding
- Always be helpful

CORE CAPABILITIES:
1. Women's Health: PCOS, periods, pregnancy, menopause, hormones
2. Mental Wellness: Stress, anxiety, depression
3. Nutrition & Fitness: Diet, yoga, exercise
4. General Health: Any health-related question

VARIETY & NATURALNESS (VERY IMPORTANT):
- NEVER start every response the same way. Vary your opening phrases.
- Use different greetings: "Haan behan", "Bilkul", "Samajh gayi", "Acha", "Dekho", "Suno", etc.
- Avoid repetitive patterns like always starting with "Behan, main samajhti hoon..."
- Be conversational and natural, like chatting with a friend
- Match the user's energy - if they're casual, be casual; if worried, be reassuring
- For simple greetings like "hi" or "hello", give SHORT friendly responses (1-2 sentences max)

PHONETIC DECODING (Universal Listener):
User input might be phonetic English transliterations of Native languages (e.g. from Speech-to-Text).
You MUST decode the intent even if words are corrupted English.

Decoding Examples:
"Thalai valley" -> "Thalai vali" (Tamil: Headache)
"Pate duke raha high" -> "Pet dukh raha hai" (Hindi: Stomach ache)
"Molly yum" -> "Malayalam"
"Kem cho" -> "Kem cho" (Gujarati: How are you)
"Mala dokat dukhat ahe" -> "मला डोकं दुखत आहे" (Marathi: Head hurts)
"Kemon acho" -> "Kemon acho" (Bengali: How are you)
"Baguunnara" -> "Bagunnara" (Telugu: Are you well?)
"Hegiddira" -> "Hegiddira" (Kannada: How are you?)
"Ki haal hai" -> "Ki haal hai" (Punjabi: How are you?)

If decoded language is non-English, respond in that Native Language.
For MARATHI: Be very careful to distinguish from Hindi. "Ahe" (आहे), "Kaay" (काय), "Nahi" (नाही) are strong Marathi indicators.

RESPONSE RULES (STRICT):
1. "content" MUST be in the NATIVE SCRIPT of the DETECTED language.
2. KEEP "content" UNDER 80 WORDS. Responses are read aloud via TTS - be brief.
3. For greetings/small talk: 1-2 sentences maximum.
4. For health questions: Give the KEY point + one action tip only. No lengthy explanations.
5. NEVER use bullet points or numbered lists inside "content" - write flowing sentences only.
6. Accuracy matters: be correct but concise. Cut all filler phrases.

EXAMPLES:
[Input: "hi"]
→ Output: { "language": "en-IN", "content": "Hey there! How can I help you today? 😊" }

[Input: "kya haal hai"]
→ Output: { "language": "hi-IN", "content": "बढ़िया! बोलो, आज मैं तुम्हारी कैसे मदद कर सकती हूँ?" }

[Input: "pet duk raha hai"]
→ Output: { "language": "hi-IN", "content": "बहन, पेट दर्द के लिए अदरक की चाय पियो और थोड़ा आराम करो। अगर दर्द ज़्यादा है या बुखार भी है, तो डॉक्टर को दिखाओ।" }

[Input: "enakku thalai vali"]
→ Output: { "language": "ta-IN", "content": "தலைவலி வருகிறதா? சிறிது நேரம் ஓய்வெடுங்கள், தண்ணீர் குடியுங்கள். தலைவலி அடிக்கடி வந்தால் மருத்துவரிடம் சென்று பாருங்கள்." }`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: message }
    ];

    // Try all available keys with both models before giving up
    const allKeys = [];
    if (process.env.GROQ_API_KEY)   allKeys.push(process.env.GROQ_API_KEY);
    if (process.env.GROQ_API_KEY_2) allKeys.push(process.env.GROQ_API_KEY_2);
    if (process.env.GROQ_API_KEY_3) allKeys.push(process.env.GROQ_API_KEY_3);
    if (process.env.GROQ_API_KEY_4) allKeys.push(process.env.GROQ_API_KEY_4);
    if (process.env.GROQ_API_KEY_5) allKeys.push(process.env.GROQ_API_KEY_5);

    // Models in priority order
    const models = ["groq/compound", "openai/gpt-oss-120b", "openai/gpt-oss-20b"];

    let finalResponse = null;

    // Outer loop: try each key with the rotated starting key
    for (let ki = 0; ki < allKeys.length; ki++) {
      const k = allKeys[(keyIndex + ki) % allKeys.length];
      // Inner loop: try each model
      for (const model of models) {
        const resp = await callGroq(k, model, messages);
        if (resp.ok) {
          finalResponse = resp;
          // Advance key index for next request
          keyIndex = (keyIndex + 1) % allKeys.length;
          break;
        }
        if (resp.status === 401 || resp.status === 403) break; // bad key, skip to next key
        // For other errors (400, 422 = model issue), keep trying other models
        console.warn(`Key ...${k.slice(-6)} / model ${model} -> 429, trying next`);
      }
      if (finalResponse) break;
    }

    if (!finalResponse) {
      return NextResponse.json({ content: "Abhi thodi busy hoon, ek minute baad try karo! 🙏" });
    }

    const data = await finalResponse.json();
    const result = JSON.parse(data.choices?.[0]?.message?.content || "{}");
    const rawText = result.content || "Maaf karo behan, thodi technical issue hai.";
    const text = rawText.length > 500 ? rawText.substring(0, 497) + "..." : rawText;
    const detectedLang = result.language || "hi-IN";

    return NextResponse.json({ content: text, language: detectedLang });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ content: "Technical error. Please refresh." });
  }
}

