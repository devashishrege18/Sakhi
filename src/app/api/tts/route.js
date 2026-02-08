import { NextResponse } from 'next/server';
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';

export async function POST(req) {
    try {
        const { text } = await req.json();

        if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
            return NextResponse.json({ error: 'AWS credentials not configured' }, { status: 500 });
        }

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        // Initialize Polly client inside the handler (for serverless compatibility)
        const pollyClient = new PollyClient({
            region: process.env.AWS_REGION || 'ap-south-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });

        // Use Kajal neural voice for Hindi (works for all Indian language scripts)
        const command = new SynthesizeSpeechCommand({
            Text: text,
            OutputFormat: 'mp3',
            VoiceId: 'Kajal',
            Engine: 'neural',
            LanguageCode: 'hi-IN',
        });

        const response = await pollyClient.send(command);

        // Convert audio stream to Uint8Array for Edge compatibility
        const chunks = [];
        const reader = response.AudioStream.transformToWebStream().getReader();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
        }

        // Combine all chunks into one Uint8Array
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const audioData = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
            audioData.set(chunk, offset);
            offset += chunk.length;
        }

        return new NextResponse(audioData, {
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
