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

        // Voice ID: "Rachel" (American, Calm) - works well with Multilingual v2
        // Alternative: "Sarah" or generic. Rachel: 21m00Tcm4TlvDq8ikWAM
        const VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

        // Call ElevenLabs API
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "xi-api-key": apiKey,
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_multilingual_v2", // Critical for Indian languages
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

        // Return the audio stream directly
        const audioBuffer = await response.arrayBuffer();

        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.byteLength.toString(),
            },
        });

    } catch (error) {
        console.error("TTS Route Error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
