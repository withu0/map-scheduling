import type { Job } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, MapPin } from 'lucide-react';

interface JobCardProps {
  job: Job;
  index: number;
}

export function JobCard({ job, index }: JobCardProps) {
  return (
    <Card className="transition-shadow duration-300 shadow-sm hover:shadow-lg">
      <CardContent className="p-3">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-8 h-8 font-bold rounded-full shrink-0 bg-primary text-primary-foreground">
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{job.customerName}</p>
            <div className="mt-2 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="truncate">{job.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Scheduled: {job.scheduledTime}</span>
              </div>
              {job.estimatedArrivalTime && (
                <div className="flex items-center gap-2 font-semibold text-primary-dark">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-primary">ETA: {job.estimatedArrivalTime}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
