import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.message || "";
    const history = body.history || [];
    const language = body.language || "hi-IN"; // Get selected language

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ content: "API key not configured." });
    }

    const conversationHistory = history.slice(-6).map(msg => ({
      role: (msg.type === "user" || msg.role === "user") ? "user" : "assistant",
      content: msg.text || msg.content || ""
    }));

    // Language-specific response instructions - STRICT NATIVE SCRIPT
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

PERSONALITY:
- Be like a caring older sister (didi/akka/tai) - supportive, non-judgmental
- Be empathetic and understanding
- Always be helpful

CORE CAPABILITIES:
1. Women's Health: PCOS, periods, pregnancy, menopause, hormones
2. Mental Wellness: Stress, anxiety, depression
3. Nutrition & Fitness: Diet, yoga, exercise
4. General Health: Any health-related question

FEATURE DETECTION:
If user mentions relevant topics, include suggestion in "content".

PHONETIC DECODING (Universal Listener):
User input might be phonetic English transliterations of Native languages (e.g. from Speech-to-Text).
You MUST decode the intent even if words are corrupted English.

Decoding Examples:
"Thalai valley" -> "Thalai vali" (Tamil: Headache)
"Pate duke raha high" -> "Pet dukh raha hai" (Hindi: Stomach ache)
"Molly yum" -> "Malayalam"
"Kem cho" -> "Kem cho" (Gujarati: How are you)
"Mala dokat dukhat ahe" -> "मळा डोक्यात दुखत आहे" (Marathi: Head hurts)
"Kai zala" -> "काय झाले" (Marathi: What happened)

If decoded language is non-English, respond in that Native Language.
For MARATHI: Be very careful to distinguish from Hindi. "Ahe" (आहे), "Kaay" (काय), "Nahi" (नाही) are strong Marathi indicators.

RESPONSE RULES:
1. "content" MUST be in the NATIVE SCRIPT of the DETECTED language.
2. Keep responses 50-80 words.
3. First acknowledge the user's concern.
4. Give helpful information.

EXAMPLES:
[Input: "pet duk raha hai"]
→ Output: { "language": "hi-IN", "content": "बहन, पेट दर्द बहुत परेशान कर सकता है। अगर यह अभी शुरू हुआ है, तो आराम करें और गर्म पानी पिएं। अगर दर्द बहुत ज्यादा है, तो मैं आपको पास के अस्पताल दिखा सकती हूं। क्या आप डॉक्टर से बात करना चाहेंगी?" }

[Input: "enakku thalai vali"]
→ Output: { "language": "ta-IN", "content": "சகோதரி, தலைவலி இருந்தால் ஓய்வு எடுங்கள். அதிக ஸ்ட்ரெஸ் வேண்டாம். இது தொடர்ந்தால், மருத்துவரை அணுகுவது நல்லது. நான் உங்களுக்கு அருகில் உள்ள மருத்துவமனைகளைக் காட்டட்டுமா?" }`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          ...conversationHistory,
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 400,
        response_format: { type: "json_object" } // Force valid JSON
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ content: "Connection issue. Please try again." });
    }

    const data = await response.json();
    const result = JSON.parse(data.choices?.[0]?.message?.content || "{}");
    const text = result.content || "Maaf karo behan, thodi technical issue hai.";
    const detectedLang = result.language || "hi-IN";

    return NextResponse.json({ content: text, language: detectedLang });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ content: "Technical error. Please refresh." });
  }
}