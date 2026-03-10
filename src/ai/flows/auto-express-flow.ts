
'use server';
/**
 * @fileOverview A flow to "express" a file's content by generating a summary/explanation 
 * and a text-to-speech audio overview.
 *
 * - autoExpressFile - A function that generates a summary and audio for a file.
 * - AutoExpressInput - The input type for the autoExpressFile function.
 * - AutoExpressOutput - The return type for the autoExpressFile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import wav from 'wav';

const AutoExpressInputSchema = z.object({
  fileName: z.string().describe('The name of the file.'),
  fileContent: z.string().optional().describe('The textual content of the file.'),
  fileMimeType: z.string().optional().describe('The MIME type of the file.'),
  photoDataUri: z.string().optional().describe('A data URI of the file if it is an image.'),
});
export type AutoExpressInput = z.infer<typeof AutoExpressInputSchema>;

const AutoExpressOutputSchema = z.object({
  summary: z.string().describe('A text summary or explanation of the file.'),
  audioDataUri: z.string().describe('A data URI for the generated audio in WAV format.'),
});
export type AutoExpressOutput = z.infer<typeof AutoExpressOutputSchema>;

export async function autoExpressFile(input: AutoExpressInput): Promise<AutoExpressOutput> {
  return autoExpressFlow(input);
}

const expressPrompt = ai.definePrompt({
  name: 'autoExpressPrompt',
  input: {schema: AutoExpressInputSchema},
  output: {schema: z.object({ expression: z.string() })},
  prompt: `You are an intelligent file explainer. Your task is to "express" the meaning of a file in a concise, engaging way.

- If the file is a source code file (e.g., .js, .py, .ts, .json), explain what the code does, its purpose, and its key logic.
- If it is a text document, summarize its main points.
- If it is an image, describe what is in the image.
- Keep the "expression" to 2-3 sentences max. It should be perfect for reading aloud.

File Name: {{{fileName}}}
{{#if fileMimeType}}MIME Type: {{{fileMimeType}}}{{/if}}
{{#if fileContent}}Content:
"""
{{{fileContent}}}
"""
{{/if}}
{{#if photoDataUri}}Photo Reference: {{media url=photoDataUri}}{{/if}}

Provide a clear and concise "expression" of this file.`,
});

const autoExpressFlow = ai.defineFlow(
  {
    name: 'autoExpressFlow',
    inputSchema: AutoExpressInputSchema,
    outputSchema: AutoExpressOutputSchema,
  },
  async input => {
    // 1. Generate text expression
    const {output} = await expressPrompt(input);
    const summaryText = output?.expression || "I'm sorry, I couldn't analyze this file correctly.";

    // 2. Generate audio using TTS
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: `Please read this summary aloud: ${summaryText}`,
    });

    if (!media) {
      throw new Error('Failed to generate audio for Auto-Express.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavData = await toWav(audioBuffer);

    return {
      summary: summaryText,
      audioDataUri: 'data:audio/wav;base64,' + wavData,
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
