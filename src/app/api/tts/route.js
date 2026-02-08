import { NextResponse } from 'next/server';
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';

// Initialize Polly client
const pollyClient = new PollyClient({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export async function POST(req) {
    try {
        const { text } = await req.json();

        if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
            return NextResponse.json({ error: 'AWS credentials not configured' }, { status: 500 });
        }

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        // Use Kajal neural voice for Hindi (works for all Indian language scripts)
        const command = new SynthesizeSpeechCommand({
            Text: text,
            OutputFormat: 'mp3',
            VoiceId: 'Kajal',
            Engine: 'neural',
            LanguageCode: 'hi-IN',
        });

        const response = await pollyClient.send(command);

        // Convert audio stream to buffer
        const audioBuffer = await streamToBuffer(response.AudioStream);

        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
            },
        });

    } catch (error) {
        console.error('Amazon Polly TTS Error:', error);
        return NextResponse.json({
            error: 'TTS API error',
            details: error.message
        }, { status: 500 });
    }
}

// Helper function to convert stream to buffer
async function streamToBuffer(stream) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
}
