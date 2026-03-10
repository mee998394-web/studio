'use server';
/**
 * @fileOverview An AI agent for intelligent file tagging and categorization.
 *
 * - intelligentFileTagging - A function that analyzes file content and/or filename
 *   to suggest relevant tags and categories.
 * - IntelligentFileTaggingInput - The input type for the intelligentFileTagging function.
 * - IntelligentFileTaggingOutput - The return type for the intelligentFileTagging function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentFileTaggingInputSchema = z.object({
  fileName: z.string().describe('The name of the file.'),
  fileContent: z
    .string()
    .optional()
    .describe('The textual content of the file, if available.'),
  fileMimeType: z
    .string()
    .optional()
    .describe('The MIME type of the file (e.g., application/pdf, text/plain).'),
});
export type IntelligentFileTaggingInput = z.infer<
  typeof IntelligentFileTaggingInputSchema
>;

const IntelligentFileTaggingOutputSchema = z.object({
  suggestedTags: z
    .array(z.string())
    .describe('A list of relevant tags for the file.'),
  suggestedCategories: z
    .array(z.string())
    .describe('A list of relevant categories for the file.'),
  summary: z.string().describe('A brief summary of the file content.'),
});
export type IntelligentFileTaggingOutput = z.infer<
  typeof IntelligentFileTaggingOutputSchema
>;

export async function intelligentFileTagging(
  input: IntelligentFileTaggingInput
): Promise<IntelligentFileTaggingOutput> {
  return intelligentFileTaggingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentFileTaggingPrompt',
  input: {schema: IntelligentFileTaggingInputSchema},
  output: {schema: IntelligentFileTaggingOutputSchema},
  prompt: `You are an intelligent file organization assistant. Your task is to analyze a file's name and its content (if provided) and extract relevant tags, categories, and a concise summary.

Instructions:
- Analyze the provided file name and content.
- Suggest a list of 3-5 concise, relevant tags. If no content is provided, rely more on the filename and MIME type.
- Suggest 1-3 broad categories that the file belongs to (e.g., 'Documents', 'Reports', 'Images', 'Code', 'Marketing', 'Finance').
- Provide a brief, one-sentence summary of the file's purpose or main topic. If no content is provided, summarize based on the filename and MIME type.

File Details:
File Name: {{{fileName}}}
{{#if fileMimeType}}MIME Type: {{{fileMimeType}}}{{/if}}
{{#if fileContent}}Content: {{{fileContent}}}{{/if}}
`,
});

const intelligentFileTaggingFlow = ai.defineFlow(
  {
    name: 'intelligentFileTaggingFlow',
    inputSchema: IntelligentFileTaggingInputSchema,
    outputSchema: IntelligentFileTaggingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate file tags and categories.');
    }
    return output;
  }
);
