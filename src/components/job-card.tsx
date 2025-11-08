import type { Job } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, GripVertical, MapPin } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

interface JobCardProps {
  job: Job;
  index: number;
}

export function JobCard({ job, index }: JobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className={cn("transition-shadow duration-300 shadow-sm hover:shadow-lg", isDragging && "shadow-2xl opacity-80")}>
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
             <div className="flex flex-col items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 font-bold rounded-full shrink-0 bg-primary text-primary-foreground">
                    {index + 1}
                </div>
                <div {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground">
                    <GripVertical className="w-5 h-5" />
                </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{job.customerName}</p>
              <div className="mt-1 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="truncate">{job.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Scheduled: {job.scheduledTime}</span>
                </div>
                {job.estimatedArrivalTime && (
                  <div className="flex items-center gap-2 font-semibold text-primary">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>ETA: {job.estimatedArrivalTime}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
