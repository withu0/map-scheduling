'use server';

/**
 * @fileOverview A route optimization AI agent that reorders stops based on real-time ETAs.
 *
 * - optimizeRouteWithLLM - A function that handles the route optimization process.
 * - OptimizeRouteInput - The input type for the optimizeRouteWithLLM function.
 * - OptimizeRouteOutput - The return type for the optimizeRouteWithLLM function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeRouteInputSchema = z.object({
  jobList: z
    .array(
      z.object({
        id: z.string(),
        customerName: z.string(),
        address: z.string(),
        scheduledTime: z.string(),
        estimatedArrivalTime: z.string().optional(),
      })
    )
    .describe('A list of jobs with customer details and scheduled times.'),
});
export type OptimizeRouteInput = z.infer<typeof OptimizeRouteInputSchema>;

const OptimizeRouteOutputSchema = z.object({
  optimizedJobList: z
    .array(
      z.object({
        id: z.string(),
        customerName: z.string(),
        address: z.string(),
        scheduledTime: z.string(),
        estimatedArrivalTime: z.string().optional(),
      })
    )
    .describe('The optimized order of jobs based on estimated arrival times.'),
});
export type OptimizeRouteOutput = z.infer<typeof OptimizeRouteOutputSchema>;

export async function optimizeRouteWithLLM(input: OptimizeRouteInput): Promise<OptimizeRouteOutput> {
  return optimizeRouteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeRoutePrompt',
  input: {schema: OptimizeRouteInputSchema},
  output: {schema: OptimizeRouteOutputSchema},
  prompt: `You are an expert route optimization specialist. Given a list of jobs with their details and estimated arrival times, determine the optimal order of the jobs to minimize travel time and resource usage.

  JobList:
  {{#each jobList}}
  - ID: {{id}}, Customer: {{customerName}}, Address: {{address}}, Scheduled Time: {{scheduledTime}}{{#if estimatedArrivalTime}}, ETA: {{estimatedArrivalTime}}{{/if}}
  {{/each}}

  Based on the estimated arrival times and scheduled times, reorder the jobs to create an optimized route. Consider factors like minimizing distance, reducing idle time, and adhering to scheduled time constraints.

  Return the optimized job list in the same format as the input.
  Make sure the the ID field remains the same, as it is used as a lookup key.
  Make sure that you include estimated arrival times in the output, if they are present in the input.
  Make sure that the order of elements is the only thing that changes.
  Do not make any modifications to the address, customer name, or scheduled time.
  Do not add any other commentary or explanation, return ONLY valid JSON.
  `,
});

const optimizeRouteFlow = ai.defineFlow(
  {
    name: 'optimizeRouteFlow',
    inputSchema: OptimizeRouteInputSchema,
    outputSchema: OptimizeRouteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
