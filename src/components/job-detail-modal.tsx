"use client";

import * as React from "react";
import type { Job } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Clock,
  Mail,
  Phone,
  User,
  DollarSign,
  Calendar,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface JobDetailModalProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const paymentStatusConfig = {
  paid: { label: "Paid", variant: "default" as const, className: "bg-green-500" },
  pending: { label: "Pending", variant: "secondary" as const, className: "bg-yellow-500" },
  overdue: { label: "Overdue", variant: "destructive" as const, className: "bg-red-500" },
  partial: { label: "Partial", variant: "outline" as const, className: "bg-orange-500" },
};

export function JobDetailModal({ job, open, onOpenChange }: JobDetailModalProps) {
  if (!job) return null;

  const paymentConfig = paymentStatusConfig[job.paymentStatus];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{job.customerName}</span>
            <Badge
              variant={paymentConfig.variant}
              className={cn("ml-2", paymentConfig.className)}
            >
              {paymentConfig.label}
            </Badge>
          </DialogTitle>
          <DialogDescription>Job ID: {job.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Location & Schedule */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-0.5 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <p className="font-medium">Address</p>
                <p className="text-sm text-muted-foreground">{job.address}</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-0.5 text-muted-foreground shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">Scheduled Time</p>
                  <p className="text-sm text-muted-foreground">{job.scheduledTime}</p>
                </div>
              </div>
              {job.estimatedArrivalTime && (
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 mt-0.5 text-primary shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium">Estimated Arrival</p>
                    <p className="text-sm text-primary font-semibold">
                      {job.estimatedArrivalTime}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 mt-0.5 text-muted-foreground shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(job.date), "EEEE, MMMM d, yyyy")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Contact Information</h3>
            <div className="space-y-3">
              {job.contactInfo.contactPerson && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 mt-0.5 text-muted-foreground shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium">Contact Person</p>
                    <p className="text-sm text-muted-foreground">
                      {job.contactInfo.contactPerson}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5 text-muted-foreground shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">Email</p>
                  <a
                    href={`mailto:${job.contactInfo.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {job.contactInfo.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-0.5 text-muted-foreground shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">Phone</p>
                  <a
                    href={`tel:${job.contactInfo.phone}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {job.contactInfo.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Payment Information</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-muted-foreground" />
                  <p className="font-medium">Payment Status</p>
                </div>
                <Badge variant={paymentConfig.variant} className={paymentConfig.className}>
                  {paymentConfig.label}
                </Badge>
              </div>
              {job.paymentAmount !== undefined && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-semibold">${job.paymentAmount.toFixed(2)}</p>
                </div>
              )}
              {job.paymentDueDate && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium">
                    {format(new Date(job.paymentDueDate), "MMM d, yyyy")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {job.notes && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 mt-0.5 text-muted-foreground shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium mb-2">Notes</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {job.notes}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

