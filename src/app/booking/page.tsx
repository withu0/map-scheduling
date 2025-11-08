import { BookingForm } from "@/components/booking-form";
import { Header } from "@/components/header";

export default function BookingPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="container mx-auto max-w-4xl">
          <BookingForm />
        </div>
      </main>
    </div>
  );
}

