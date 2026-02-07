import { NextResponse } from 'next/server';

// Native Indian voice mappings for Google Cloud TTS
const VOICE_MAP = {
    'hi-IN': { languageCode: 'hi-IN', name: 'hi-IN-Neural2-A', ssmlGender: 'FEMALE' },  // Hindi
    'bn-IN': { languageCode: 'bn-IN', name: 'bn-IN-Standard-A', ssmlGender: 'FEMALE' }, // Bengali
    'te-IN': { languageCode: 'te-IN', name: 'te-IN-Standard-A', ssmlGender: 'FEMALE' }, // Telugu
    'ta-IN': { languageCode: 'ta-IN', name: 'ta-IN-Neural2-A', ssmlGender: 'FEMALE' },  // Tamil
    'mr-IN': { languageCode: 'mr-IN', name: 'mr-IN-Standard-A', ssmlGender: 'FEMALE' }, // Marathi
    'gu-IN': { languageCode: 'gu-IN', name: 'gu-IN-Standard-A', ssmlGender: 'FEMALE' }, // Gujarati
    'kn-IN': { languageCode: 'kn-IN', name: 'kn-IN-Standard-A', ssmlGender: 'FEMALE' }, // Kannada
    'ml-IN': { languageCode: 'ml-IN', name: 'ml-IN-Standard-A', ssmlGender: 'FEMALE' }, // Malayalam
    'pa-IN': { languageCode: 'pa-IN', name: 'pa-IN-Standard-A', ssmlGender: 'FEMALE' }, // Punjabi
    'en-IN': { languageCode: 'en-IN', name: 'en-IN-Neural2-A', ssmlGender: 'FEMALE' },  // Indian English
};

export async function POST(req) {
    try {
        const { text, language } = await req.json();
        const apiKey = process.env.GOOGLE_CLOUD_TTS_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'Google Cloud TTS API key not configured' }, { status: 500 });
        }

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        // Get voice config for the language, default to Hindi
        const voiceConfig = VOICE_MAP[language] || VOICE_MAP['hi-IN'];

        // Call Google Cloud TTS API
        const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input: { text: text },
                voice: {
                    languageCode: voiceConfig.languageCode,
                    name: voiceConfig.name,
                    ssmlGender: voiceConfig.ssmlGender,
                },
                audioConfig: {
                    audioEncoding: 'MP3',
                    speakingRate: 0.95,  // Slightly slower for clarity
                    pitch: 0,
                },
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error('Google Cloud TTS Error:', err);
            return NextResponse.json({ error: 'TTS API error' }, { status: response.status });
        }

        const data = await response.json();

        // Google returns audio as base64 encoded string
        const audioContent = data.audioContent;
        const audioBuffer = Buffer.from(audioContent, 'base64');

        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
            },
        });

    } catch (error) {
        console.error('Google TTS Route Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
