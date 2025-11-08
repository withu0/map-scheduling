export type PaymentStatus = "paid" | "pending" | "overdue" | "partial";

export type Job = {
  id: string;
  customerName: string;
  address: string;
  scheduledTime: string;
  coordinates: [number, number]; // [longitude, latitude]
  estimatedArrivalTime?: string;
  date: string; // YYYY-MM-DD format
  // Customer/Contact Info
  contactInfo: {
    email: string;
    phone: string;
    contactPerson?: string;
  };
  // Payment Status
  paymentStatus: PaymentStatus;
  paymentAmount?: number;
  paymentDueDate?: string; // YYYY-MM-DD format
  notes?: string;
};

export interface MapboxRoute {
  geometry: {
    coordinates: [number, number][];
    type: string;
  };
  legs: {
    summary: string;
    weight: number;
    duration: number;
    steps: any[];
    distance: number;
  }[];
  weight_name: string;
  weight: number;
  duration: number;
  distance: number;
}
