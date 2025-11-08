"use client";

import { Route, Calendar } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function Header() {
  const pathname = usePathname();
  const isBookingPage = pathname === '/booking';

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b shadow-sm shrink-0 bg-card">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary text-primary-foreground">
            <Route className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold md:text-2xl font-headline text-foreground">
            RouteWise
          </h1>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <p className="hidden text-sm sm:block text-muted-foreground">
          Smart Route Optimizer Demo
        </p>
        <Link href={isBookingPage ? "/" : "/booking"}>
          <Button
            variant={isBookingPage ? "outline" : "default"}
            size="sm"
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            {isBookingPage ? "View Routes" : "New Booking"}
          </Button>
        </Link>
      </div>
    </header>
  );
}
