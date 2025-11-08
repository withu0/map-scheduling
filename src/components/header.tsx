import { Route } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b shadow-sm shrink-0 bg-card">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary text-primary-foreground">
          <Route className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold md:text-2xl font-headline text-foreground">
          RouteWise
        </h1>
      </div>
      <p className="hidden text-sm sm:block text-muted-foreground">
        Smart Route Optimizer Demo
      </p>
    </header>
  );
}
