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
  prompt: `You are an expert route optimization specialist. Your primary goal is to reorder a list of jobs to create the most efficient route possible, minimizing both total travel time and distance.

  You will be given a list of jobs with their details, including scheduled times and, if available, estimated arrival times (ETAs) based on the current order.

  Use the job addresses and scheduled times to determine the optimal sequence. Pay close attention to the geographical location of each address to minimize travel between stops. While adhering to scheduled times is important, your main objective is to find the shortest and quickest route.

  JobList:
  {{#each jobList}}
  - ID: {{id}}, Customer: {{customerName}}, Address: {{address}}, Scheduled: {{scheduledTime}}{{#if estimatedArrivalTime}}, Current ETA: {{estimatedArrivalTime}}{{/if}}
  {{/each}}

  Your task:
  1. Analyze the list of jobs.
  2. Reorder the jobs to create an optimized route that minimizes travel distance and time.
  3. Return the reordered list of jobs as a valid JSON object.

  Important constraints:
  - The output must be ONLY the JSON object for 'optimizedJobList'.
  - Do not change the content of any job object (id, customerName, address, etc.). Only change the order of the jobs in the array.
  - The ID field must remain unchanged as it is a unique identifier.
  - If the input included estimated arrival times, you must also include them in your output for each job.
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
