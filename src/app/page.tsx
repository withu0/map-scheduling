"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Job, MapboxRoute } from '@/lib/types';
import { initialJobsA, initialJobsB } from '@/lib/mock-data';
import { getDirections } from '@/lib/mapbox';
import { optimizeRouteWithLLM } from '@/ai/flows/optimize-route-with-llm';
import type { OptimizeRouteInput } from '@/ai/flows/optimize-route-with-llm';

import { Header } from '@/components/header';
import { JobPanel } from '@/components/job-panel';
import { MapDisplay } from '@/components/map-display';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { List, Terminal, ArrowLeftRight } from 'lucide-react';

type RouteState = {
  jobs: Job[];
  route: MapboxRoute | null;
  status: 'idle' | 'loading' | 'optimizing';
};

export default function Home() {
  const [routeA, setRouteA] = useState<RouteState>({ jobs: initialJobsA, route: null, status: 'idle' });
  const [routeB, setRouteB] = useState<RouteState>({ jobs: initialJobsB, route: null, status: 'idle' });
  const [activeRoute, setActiveRoute] = useState<'A' | 'B'>('A');
  
  const [error, setError] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  
  const { jobs, route, status } = activeRoute === 'A' ? routeA : routeB;
  const setJobs = (newJobs: Job[] | ((prevJobs: Job[]) => Job[])) => {
    const setter = activeRoute === 'A' ? setRouteA : setRouteB;
    setter(prev => ({ ...prev, jobs: typeof newJobs === 'function' ? newJobs(prev.jobs) : newJobs }));
  };
  const setRoute = (newRoute: MapboxRoute | null) => {
    const setter = activeRoute === 'A' ? setRouteA : setRouteB;
    setter(prev => ({ ...prev, route: newRoute }));
  };
  const setStatus = (newStatus: 'idle' | 'loading' | 'optimizing') => {
    const setter = activeRoute === 'A' ? setRouteA : setRouteB;
    setter(prev => ({ ...prev, status: newStatus }));
  };

  const jobOrderKey = useMemo(() => jobs.map(j => j.id).join(','), [jobs]);
  
  const jobsWithEtas = useMemo(() => {
    if (!route) return jobs;

    let cumulativeDuration = 0;
    const startTimeStr = jobs.length > 0 ? jobs[0].scheduledTime : '09:00 AM';
    const [time, modifier] = startTimeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    const startTime = new Date();
    startTime.setHours(hours, minutes, 0, 0);

    return jobs.map((job, index) => {
      if (index > 0 && route.legs.length > index - 1) {
        cumulativeDuration += route.legs[index - 1].duration;
      }
      const arrivalDate = new Date(startTime.getTime() + cumulativeDuration * 1000);
      const estimatedArrivalTime = arrivalDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      return { ...job, estimatedArrivalTime };
    });
  }, [jobs, route]);

  useEffect(() => {
    if (!mapboxToken) {
      setError("Mapbox access token is not configured. Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your .env file.");
      return;
    }

    const fetchRoute = async () => {
      if (jobs.length < 2) {
        setRoute(null);
        return;
      };
      
      setStatus('loading');
      setError(null);
      try {
        const newRoute = await getDirections(jobs);
        if (newRoute) {
          setRoute(newRoute);
        } else {
          setRoute(null);
          // throw new Error("No route found between the given points.");
        }
      } catch (e: any) {
        const errorMessage = e.message || "Failed to fetch route data from Mapbox.";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
      } finally {
        setStatus('idle');
      }
    };

    fetchRoute();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobOrderKey, mapboxToken, activeRoute]);

  const handleOptimizeRoute = async () => {
    if (status !== 'idle' || jobs.length < 2) return;
    
    setStatus('optimizing');
    setError(null);

    const optimizeInput: OptimizeRouteInput = {
      jobList: jobsWithEtas.map(j => ({
        id: j.id,
        customerName: j.customerName,
        address: j.address,
        scheduledTime: j.scheduledTime,
        estimatedArrivalTime: j.estimatedArrivalTime || j.scheduledTime,
      }))
    };

    try {
      const result = await optimizeRouteWithLLM(optimizeInput);
      const optimizedIds = result.optimizedJobList.map(j => j.id);

      const jobMap = new Map(jobs.map(j => [j.id, j]));
      const reorderedJobs = optimizedIds.map(id => jobMap.get(id)!).filter(Boolean);

      if(reorderedJobs.length === jobs.length) {
        setJobs(reorderedJobs);
        toast({
          title: "Route Optimized!",
          description: `Route ${activeRoute} has been updated for maximum efficiency.`,
        });
      } else {
        throw new Error("AI optimization returned a different number of jobs.");
      }
    } catch (e: any) {
      const errorMessage = e.message || "Failed to optimize route with AI.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Optimization Failed",
        description: errorMessage,
      });
      setStatus('idle');
    }
  };

  const switchRoute = () => {
    setActiveRoute(prev => prev === 'A' ? 'B' : 'A');
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 min-h-0">
        <div className="hidden lg:flex lg:flex-col lg:col-span-1 xl:col-span-1 h-full border-r">
          <JobPanel 
            jobs={jobsWithEtas} 
            route={route} 
            status={status} 
            onOptimize={handleOptimizeRoute} 
            routeName={activeRoute}
            onSwitchRoute={switchRoute}
          />
        </div>
        
        <div className="col-span-1 lg:col-span-2 xl:col-span-3 h-full relative">
            {error && !mapboxToken && (
              <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                 <Alert variant="destructive" className="max-w-md shadow-lg">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Configuration Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}
            <MapDisplay mapboxToken={mapboxToken || ''} jobs={jobs} route={route} status={status} />
        </div>
        
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetContent side="left" className="p-0 w-[350px] sm:w-[400px]">
              <JobPanel 
                jobs={jobsWithEtas} 
                route={route} 
                status={status} 
                onOptimize={() => {
                  handleOptimizeRoute();
                  setIsSheetOpen(false);
                }}
                routeName={activeRoute}
                onSwitchRoute={() => {
                  switchRoute();
                  setIsSheetOpen(false);
                }}
              />
            </SheetContent>
        </Sheet>
      </main>

      <div className="lg:hidden absolute bottom-6 right-6 z-10 flex flex-col gap-4">
        <Button onClick={switchRoute} size="icon" className="rounded-full h-14 w-14 shadow-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-transform hover:scale-105 active:scale-95">
          <ArrowLeftRight className="h-6 w-6" />
          <span className="sr-only">Switch Route</span>
        </Button>
        <Button onClick={() => setIsSheetOpen(true)} size="icon" className="rounded-full h-16 w-16 shadow-lg bg-primary hover:bg-primary/90 transition-transform hover:scale-105 active:scale-95">
          <List className="h-7 w-7" />
          <span className="sr-only">Open Job List</span>
        </Button>
      </div>
    </div>
  );
}
