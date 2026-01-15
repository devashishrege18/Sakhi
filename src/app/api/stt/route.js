import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
        }

        // Create a new FormData for the Groq API request
        const groqFormData = new FormData();
        groqFormData.append('file', file);
        groqFormData.append('model', 'whisper-large-v3'); // Multilingual model
        groqFormData.append('response_format', 'verbose_json'); // To get language detection
        // Prime the model to expect Indian languages and health context to prevent hallucinations (e.g. Arabic)
        groqFormData.append('prompt', 'Hindi Marathi Tamil Telugu Bengali Gujarati Kannada Malayalam Punjabi English. Medical health context. Sakhi assistant.');

        const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
            body: groqFormData,
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('Groq STT Error:', errText);
            return NextResponse.json({ error: 'STT API error' }, { status: response.status });
        }

        const data = await response.json();

        // data.text = transcription
        // data.language = detected language code (e.g. 'hi', 'en', 'ta')

        return NextResponse.json({
            text: data.text,
            language: data.language
        });

    } catch (error) {
        console.error('STT Route Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
