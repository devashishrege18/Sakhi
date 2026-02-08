import { NextResponse } from 'next/server';
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';

export async function POST(req) {
    try {
        const { text } = await req.json();

        if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
            console.error('AWS credentials missing');
            return NextResponse.json({ error: 'AWS credentials not configured' }, { status: 500 });
        }

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        // Initialize Polly client inside the handler
        const pollyClient = new PollyClient({
            region: process.env.AWS_REGION || 'ap-south-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });

        // Use Kajal neural voice for Hindi
        const command = new SynthesizeSpeechCommand({
            Text: text,
            OutputFormat: 'mp3',
            VoiceId: 'Kajal',
            Engine: 'neural',
            LanguageCode: 'hi-IN',
        });

        const response = await pollyClient.send(command);

        // The AudioStream is a Readable stream, convert to Uint8Array
        const audioStream = response.AudioStream;

        // Use transformToByteArray which is available in AWS SDK v3
        const audioBytes = await audioStream.transformToByteArray();

        return new NextResponse(audioBytes, {
            headers: {
                'Content-Type': 'audio/mpeg',
            },
        });

    } catch (error) {
        console.error('Amazon Polly TTS Error:', error.name, error.message);
        return NextResponse.json({
            error: 'TTS API error',
            details: error.message,
            name: error.name
        }, { status: 500 });
    }
}
