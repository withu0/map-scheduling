"use client";

import * as React from "react";
import type { Job, MapboxRoute } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Hourglass,
  Loader,
  Route as RouteIcon,
  Bot,
  PlusCircle,
} from "lucide-react";
import { JobCard } from "./job-card";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface JobPanelProps {
  jobs: Job[];
  route: MapboxRoute | null;
  status: "idle" | "loading" | "optimizing";
  onOptimize: () => void;
  candidateJobs: Job[];
  onAddJob: (jobId: string) => void;
  selectedDate?: string;
  onJobClick?: (job: Job) => void;
}

export function JobPanel({
  jobs,
  route,
  status,
  onOptimize,
  candidateJobs,
  onAddJob,
  selectedDate,
  onJobClick,
}: JobPanelProps) {
  const totalDistance = route ? route.distance / 1000 : 0; // meters to km
  const totalDuration = route ? route.duration / 60 : 0; // seconds to minutes
  const [selectedCandidate, setSelectedCandidate] = React.useState("");

  const handleAddJob = () => {
    if (selectedCandidate) {
      onAddJob(selectedCandidate);
      setSelectedCandidate("");
    }
  };

  const jobIds = React.useMemo(() => jobs.map((j) => j.id), [jobs]);

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <div className="p-4 border-b shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold font-headline">
              Job Itinerary
            </h2>
            <p className="text-sm text-muted-foreground">
              {selectedDate
                ? `Schedule for ${selectedDate}`
                : "Your daily schedule and optimized route."}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-2 space-y-1.5">
          <SortableContext
            items={jobIds}
            strategy={verticalListSortingStrategy}
          >
            {jobs.map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                index={index}
                onJobClick={onJobClick}
              />
            ))}
          </SortableContext>
        </div>
      </div>

      <div className="p-4 border-t shrink-0">
        <h3 className="mb-2 font-semibold text-md">Add a Job</h3>
        <div className="flex gap-2">
          <Select
            value={selectedCandidate}
            onValueChange={setSelectedCandidate}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a location..." />
            </SelectTrigger>
            <SelectContent>
              {candidateJobs.map((job) => (
                <SelectItem key={job.id} value={job.id}>
                  {job.customerName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleAddJob}
            disabled={!selectedCandidate || status !== "idle"}
            variant="outline"
            size="icon"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="sr-only">Add Job</span>
          </Button>
        </div>
      </div>

      <div className="p-4 mt-auto border-t bg-card">
        <div className="space-y-4">
          <h3 className="font-semibold text-md">Route Summary</h3>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <RouteIcon className="w-4 h-4" /> Total Distance
            </span>
            <span className="font-medium">
              {status === "loading" ? (
                <Loader className="animate-spin w-4 h-4" />
              ) : (
                `${totalDistance.toFixed(1)} km`
              )}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Hourglass className="w-4 h-4" /> Total Travel Time
            </span>
            <span className="font-medium">
              {status === "loading" ? (
                <Loader className="animate-spin w-4 h-4" />
              ) : (
                `${Math.round(totalDuration)} mins`
              )}
            </span>
          </div>
        </div>
        <Separator className="my-4" />
        <Button
          onClick={onOptimize}
          disabled={status !== "idle" || jobs.length < 2}
          className="w-full font-semibold bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-accent"
        >
          {status === "optimizing" && (
            <Bot className="w-5 h-5 mr-2 animate-pulse" />
          )}
          {status === "optimizing"
            ? "Optimizing with AI..."
            : "Optimize Route with AI"}
        </Button>
      </div>
    </div>
  );
}
