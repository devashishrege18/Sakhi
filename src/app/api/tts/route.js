import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { text, language } = await req.json();
        const apiKey = process.env.ELEVENLABS_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
        }

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        // Voice selection based on language for better native accent
        // "Charlotte" - more neutral, works better with Indian languages
        // "Aria" - expressive multilingual voice
        // "Domi" - Young woman, warm tone
        const VOICE_MAP = {
            'hi-IN': 'XrExE9yKIg1WjnnlVkGX',  // Charlotte - works well with Hindi
            'ta-IN': 'XrExE9yKIg1WjnnlVkGX',  // Charlotte
            'te-IN': 'XrExE9yKIg1WjnnlVkGX',  // Charlotte
            'bn-IN': 'XrExE9yKIg1WjnnlVkGX',  // Charlotte
            'mr-IN': 'XrExE9yKIg1WjnnlVkGX',  // Charlotte
            'gu-IN': 'XrExE9yKIg1WjnnlVkGX',  // Charlotte
            'kn-IN': 'XrExE9yKIg1WjnnlVkGX',  // Charlotte
            'ml-IN': 'XrExE9yKIg1WjnnlVkGX',  // Charlotte
            'pa-IN': 'XrExE9yKIg1WjnnlVkGX',  // Charlotte
            'en-IN': 'XrExE9yKIg1WjnnlVkGX',  // Charlotte
        };

        const VOICE_ID = VOICE_MAP[language] || 'XrExE9yKIg1WjnnlVkGX'; // Charlotte as default

        // Call ElevenLabs API with Multilingual v2 model
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?optimize_streaming_latency=3`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "xi-api-key": apiKey,
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_multilingual_v2", // Best for Indian languages
                voice_settings: {
                    stability: 0.65,         // Higher stability for clearer pronunciation
                    similarity_boost: 0.75,   // Higher similarity for more natural voice
                    style: 0.3,               // Slight expressiveness
                    use_speaker_boost: true   // Improves clarity
                },
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("ElevenLabs Error:", err);
            return NextResponse.json({ error: 'TTS API error' }, { status: response.status });
        }

        // Stream the audio directly to client
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
