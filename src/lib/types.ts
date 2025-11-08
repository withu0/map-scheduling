export type Job = {
  id: string;
  customerName: string;
  address: string;
  scheduledTime: string;
  coordinates: [number, number]; // [longitude, latitude]
  estimatedArrivalTime?: string;
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
