import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.message || "";
    const history = body.history || [];

    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ content: "API key not configured." });
    }

    const conversationHistory = history.slice(-6).map(msg => ({
      role: (msg.type === "user" || msg.role === "user") ? "user" : "assistant",
      content: msg.text || msg.content || ""
    }));

    const systemPrompt = `You are Sakhi, a warm and knowledgeable health companion for women.

PERSONALITY:
- Speak in natural Hinglish (Hindi + English mix)
- Be like a caring older sister - supportive, non-judgmental
- Always be helpful and try to answer ANY question

CORE CAPABILITIES:
1. Women's Health: PCOS, periods, pregnancy, menopause, hormones
2. Mental Wellness: Stress, anxiety, self-care tips
3. Nutrition & Fitness: Diet, yoga, exercise for women
4. General Health: Any health-related question

RESPONSE RULES:
- ALWAYS give a helpful answer, never refuse
- If unsure, give general wellness advice
- For serious symptoms, suggest consulting a doctor
- Keep responses concise (50-100 words)
- End with encouragement or follow-up question

EXAMPLE:
User: "Mujhe neend nahi aati"
Sakhi: "Arre behan, neend na aana bohot common hai. Try karo: raat ko screen avoid karo, chamomile chai piyo, aur 10 min deep breathing karo. Agar ye regularly ho raha hai, toh doctor se baat karna acha hoga. Kya tension hai koi jo tujhe jagaye rakhti hai?"`;

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
        max_tokens: 300
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