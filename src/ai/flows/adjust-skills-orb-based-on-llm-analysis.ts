'use server';

/**
 * @fileOverview Adjusts the visual prominence of skills in the 3D skills orb based on LLM analysis of project code and descriptions.
 *
 * - adjustSkillsOrb - A function that handles the adjustment of the skills orb.
 * - AdjustSkillsOrbInput - The input type for the adjustSkillsOrb function.
 * - AdjustSkillsOrbOutput - The return type for the adjustSkillsOrb function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustSkillsOrbInputSchema = z.object({
  projectCode: z
    .string()
    .describe('The code of the project to analyze.'),
  projectDescription: z.string().describe('The description of the project.'),
  skills: z.array(z.string()).describe('A list of skills to consider.'),
});
export type AdjustSkillsOrbInput = z.infer<typeof AdjustSkillsOrbInputSchema>;

const AdjustSkillsOrbOutputSchema = z.array(
  z.object({
    skill: z.string().describe('The skill being adjusted.'),
    prominence: z
      .number()
      .describe(
        'A numerical value indicating the visual prominence of the skill.'
      ),
  })
);
export type AdjustSkillsOrbOutput = z.infer<typeof AdjustSkillsOrbOutputSchema>;

export async function adjustSkillsOrb(input: AdjustSkillsOrbInput): Promise<AdjustSkillsOrbOutput> {
  return adjustSkillsOrbFlow(input);
}

const analyzeSkillsPrompt = ai.definePrompt({
  name: 'analyzeSkillsPrompt',
  input: {schema: AdjustSkillsOrbInputSchema},
  output: {schema: AdjustSkillsOrbOutputSchema},
  prompt: `You are an expert in analyzing code and project descriptions to determine the proficiency level in various skills.

  Analyze the provided project code and description to assess the developer's expertise in the following skills:
  {{#each skills}}
  - {{this}}
  {{/each}}

  Based on your analysis, determine a prominence score for each skill. The prominence score should be a number between 0 and 1, where 0 indicates no proficiency and 1 indicates expert proficiency.

  Project Description: {{{projectDescription}}}
  Project Code: {{{projectCode}}}

  Return a JSON array where each object has a skill and prominence property.
  For example:
  [
    {
      "skill": "React",
      "prominence": 0.9
    },
    {
      "skill": "Three.js",
      "prominence": 0.7
    }
  ]
  `,
});

const adjustSkillsOrbFlow = ai.defineFlow(
  {
    name: 'adjustSkillsOrbFlow',
    inputSchema: AdjustSkillsOrbInputSchema,
    outputSchema: AdjustSkillsOrbOutputSchema,
  },
  async input => {
    const {output} = await analyzeSkillsPrompt(input);
    return output!;
  }
);
