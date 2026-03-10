'use server';
/**
 * @fileOverview A flow to generate a concise summary of a text document.
 *
 * - documentSummarization - A function that generates a summary of the provided document content.
 * - DocumentSummarizationInput - The input type for the documentSummarization function.
 * - DocumentSummarizationOutput - The return type for the documentSummarization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DocumentSummarizationInputSchema = z.object({
  documentContent: z.string().describe('The full text content of the document to be summarized.'),
});
export type DocumentSummarizationInput = z.infer<typeof DocumentSummarizationInputSchema>;

const DocumentSummarizationOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the document content.'),
});
export type DocumentSummarizationOutput = z.infer<typeof DocumentSummarizationOutputSchema>;

export async function documentSummarization(input: DocumentSummarizationInput): Promise<DocumentSummarizationOutput> {
  return documentSummarizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'documentSummarizationPrompt',
  input: {schema: DocumentSummarizationInputSchema},
  output: {schema: DocumentSummarizationOutputSchema},
  prompt: `You are an expert summarization AI. Your task is to provide a concise summary of the provided document content.

Document Content:
"""
{{{documentContent}}}
"""

Please provide a clear and concise summary that captures the main points of the document.`,
});

const documentSummarizationFlow = ai.defineFlow(
  {
    name: 'documentSummarizationFlow',
    inputSchema: DocumentSummarizationInputSchema,
    outputSchema: DocumentSummarizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
