import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { text } = await req.json();
        const apiKey = process.env.ELEVENLABS_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
        }

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        // Voice: "Aisha" - friendly, empathetic Hindi voice, perfect for conversational health app
        // Alternative: "Aria" for multilingual, or custom Indian voices
        const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; // Aisha - warm Indian voice

        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?optimize_streaming_latency=4`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "xi-api-key": apiKey,
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_multilingual_v2",
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5,
                },
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("ElevenLabs Error:", err);
            return NextResponse.json({ error: 'TTS API error' }, { status: response.status });
        }

        return new NextResponse(response.body, {
            headers: {
                'Content-Type': 'audio/mpeg',
            },
        });

    } catch (error) {
        console.error("TTS Route Error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
