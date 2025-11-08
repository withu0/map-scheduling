"use client";

import type { Job, MapboxRoute } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Hourglass, Loader, Route as RouteIcon, Bot } from 'lucide-react';
import { JobCard } from './job-card';

interface JobPanelProps {
  jobs: Job[];
  route: MapboxRoute | null;
  status: 'idle' | 'loading' | 'optimizing';
  onOptimize: () => void;
}

export function JobPanel({ jobs, route, status, onOptimize }: JobPanelProps) {
  const totalDistance = route ? route.distance / 1000 : 0; // meters to km
  const totalDuration = route ? route.duration / 60 : 0; // seconds to minutes

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold font-headline">Job Itinerary</h2>
        <p className="text-sm text-muted-foreground">Your daily schedule and optimized route.</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {jobs.map((job, index) => (
            <JobCard key={job.id} job={job} index={index} />
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 mt-auto border-t bg-card">
        <div className="space-y-4">
          <h3 className="font-semibold text-md">Route Summary</h3>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <RouteIcon className="w-4 h-4" /> Total Distance
            </span>
            <span className="font-medium">
              {status === 'loading' ? <Loader className="animate-spin w-4 h-4" /> : `${totalDistance.toFixed(1)} km`}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Hourglass className="w-4 h-4" /> Total Travel Time
            </span>
            <span className="font-medium">
              {status === 'loading' ? <Loader className="animate-spin w-4 h-4" /> : `${Math.round(totalDuration)} mins`}
            </span>
          </div>
        </div>
        <Separator className="my-4" />
        <Button
          onClick={onOptimize}
          disabled={status !== 'idle'}
          className="w-full font-semibold bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-accent"
        >
          {status === 'optimizing' && <Bot className="w-5 h-5 mr-2 animate-pulse" />}
          {status === 'optimizing' ? 'Optimizing with AI...' : 'Recalculate Optimal Route'}
        </Button>
      </div>
    </div>
  );
}
