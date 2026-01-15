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

CRITICAL INSTRUCTION - AUTO-DETECT LANGUAGE:
1. First, DETECT the language of the user's message. Use mixed-script detection (e.g. "kya haal hai" = Hindi).
2. output MUST be in the NATIVE SCRIPT of the DETECTED language.
   - If user speaks Hindi (Latin/Devanagari) -> Respond in HINDI (Devanagari)
   - If user speaks Tamil (Latin/Tamil) -> Respond in TAMIL (Tamil Script)
   - If user speaks English -> Respond in English
   - If user switches language, SWITCH your response language to match them immediately.

IMPORTANT: Do NOT use "Hinglish" or Latin characters for Indian languages. Use the correct script so the text-to-speech engine speaks it correctly.

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
When user mentions these topics (in ANY language), suggest the relevant feature:

HOSPITALS: pain, emergency, blood, accident, urgent
→ Suggest "Nearby Hospitals" / "Paas ke aspataal"

PHARMACY: medicine, pads, tablets, buy
→ Suggest "Pharmacy" / "Dawai ki dukaan"

DOCTORS: doctor, consultation, specialist
→ Suggest "Talk to Doctor" / "Doctor se baat karein"

WELLNESS: diet, exercise, yoga, stress
→ Suggest "Wellness Tips" / "Sehat ke nuskhe"

FORUM: discuss, share, community
→ Suggest "Community Forum" / "Charcha karein"

RESPONSE RULES:
1. RESPONSE MUST BE IN THE NATIVE SCRIPT of the DETECTED language.
2. Keep responses 50-80 words.
3. First acknowledge the user's concern.
4. Give helpful information.
5. Suggest relevant feature if applicable.

EXAMPLES:
[Input: "pet duk raha hai" (Hindi detected)]
→ Output: "बहन, पेट दर्द बहुत परेशान कर सकता है। अगर यह अभी शुरू हुआ है, तो आराम करें और गर्म पानी पिएं। अगर दर्द बहुत ज्यादा है, तो मैं आपको पास के अस्पताल दिखा सकती हूं। क्या आप डॉक्टर से बात करना चाहेंगी?"

[Input: "enakku thalai vali" (Tamil detected)]
→ Output: "சகோதரி, தலைவலி இருந்தால் ஓய்வு எடுங்கள். அதிக ஸ்ட்ரெஸ் வேண்டாம். இது தொடர்ந்தால், மருத்துவரை அணுகுவது நல்லது. நான் உங்களுக்கு அருகில் உள்ள மருத்துவமனைகளைக் காட்டட்டுमा?"

[Input: "I feel sick" (English detected)]
→ Output: "I'm sorry to hear that. Can you tell me more about your symptoms? If it's urgent, I can show you nearby hospitals, or you can consult a doctor through our app."`;

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
        max_tokens: 400
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ content: "Connection issue. Please try again." });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "Maaf karo behan, thodi technical issue hai.";
    return NextResponse.json({ content: text });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ content: "Technical error. Please refresh." });
  }
}