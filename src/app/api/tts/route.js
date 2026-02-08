import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { text, language } = await req.json();
        const apiKey = process.env.SARVAM_API_KEY;

        if (!apiKey) {
            console.error('Sarvam API key missing');
            return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
        }

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        // Map language codes to Sarvam format (BCP-47)
        const langMap = {
            'hi-IN': 'hi-IN',
            'bn-IN': 'bn-IN',
            'ta-IN': 'ta-IN',
            'te-IN': 'te-IN',
            'mr-IN': 'mr-IN',
            'gu-IN': 'gu-IN',
            'kn-IN': 'kn-IN',
            'ml-IN': 'ml-IN',
            'pa-IN': 'pa-IN',
            'or-IN': 'od-IN',
            'en-IN': 'en-IN',
        };

        const targetLang = langMap[language] || 'hi-IN';

        // Fix pronunciation - replace "Sakhi" with phonetic spelling
        let processedText = text
            .replace(/Sakhi/gi, 'Sukhi')
            .replace(/सखी/g, 'सखी')  // Hindi already correct
            .substring(0, 1000); // REST API limit is 1000 chars

        // Use lowercase speaker names as per Sarvam API docs
        const requestBody = {
            text: processedText,
            target_language_code: targetLang,
            speaker: 'priya', // lowercase - female voice
            model: 'bulbul:v3',
        };

        console.log('Sarvam TTS request:', JSON.stringify(requestBody));

        const response = await fetch('https://api.sarvam.ai/text-to-speech', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-subscription-key': apiKey,
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error('Sarvam TTS Error:', response.status, err);
            return NextResponse.json({
                error: 'TTS API error',
                details: err,
                status: response.status
            }, { status: response.status });
        }

        // Sarvam returns base64 audio in JSON response
        const data = await response.json();

        if (!data.audios || !data.audios[0]) {
            console.error('Sarvam response:', data);
            return NextResponse.json({ error: 'No audio in response' }, { status: 500 });
        }

        // Convert base64 to buffer
        const audioBuffer = Buffer.from(data.audios[0], 'base64');

        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/wav',
            },
        });

    } catch (error) {
        console.error('Sarvam TTS Route Error:', error);
        return NextResponse.json({
            error: 'Internal server error',
            details: error.message
        }, { status: 500 });
    }
}
