
'use server';
/**
 * @fileOverview Generates an image for a feature based on a text prompt.
 *
 * - generateFeatureImage - A function that takes a prompt and returns an image data URI.
 * - GenerateFeatureImageInput - The input type.
 * - GenerateFeatureImageOutput - The output type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFeatureImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from.'),
});
export type GenerateFeatureImageInput = z.infer<typeof GenerateFeatureImageInputSchema>;

const GenerateFeatureImageOutputSchema = z.object({
  imageUrl: z.string().describe('The generated image as a data URI.'),
});
export type GenerateFeatureImageOutput = z.infer<typeof GenerateFeatureImageOutputSchema>;

export async function generateFeatureImage(input: GenerateFeatureImageInput): Promise<GenerateFeatureImageOutput> {
  return generateFeatureImageFlow(input);
}

const generateFeatureImageFlow = ai.defineFlow(
  {
    name: 'generateFeatureImageFlow',
    inputSchema: GenerateFeatureImageInputSchema,
    outputSchema: GenerateFeatureImageOutputSchema,
  },
  async (input) => {
    // Add safety settings to allow more creative image generation
    // if specific prompts are being blocked by default filters.
    // For generic feature images, default safety settings are usually fine.
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp', // Ensure this exact model for image generation
      prompt: input.prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // Must include both
         // Example safety settings if needed:
        // safetySettings: [
        //   { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        //   { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        //   { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        //   { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        // ],
      },
    });

    if (!media || !media.url) {
      console.error('Image generation failed or returned no media URL for prompt:', input.prompt);
      // Fallback or throw error
      // For now, we'll let it potentially return undefined and handle on client
      // but a robust app might throw or return a default/error image placeholder
      return { imageUrl: "https://placehold.co/700x500.png?text=Error+Generating" };
    }
    return { imageUrl: media.url };
  }
);
