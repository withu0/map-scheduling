import type { Job, MapboxRoute } from './types';

export async function getDirections(jobs: Job[]): Promise<MapboxRoute | null> {
  if (jobs.length < 2) {
    return null;
  }
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('Mapbox token not provided.');
  }

  const coordinates = jobs.map(job => job.coordinates.join(',')).join(';');
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&overview=full&steps=false&access_token=${accessToken}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error fetching directions from Mapbox.');
    }
    const data = await response.json();
    if (data.routes && data.routes.length > 0) {
      return data.routes[0] as MapboxRoute;
    }
    return null;
  } catch (error) {
    console.error('Mapbox API error:', error);
    if (error instanceof Error) {
      throw new Error(`Mapbox API error: ${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching directions.');
  }
}

export interface GeocodeResult {
  coordinates: [number, number]; // [longitude, latitude]
  address: string;
}

export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('Mapbox token not provided.');
  }

  const encodedAddress = encodeURIComponent(address);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${accessToken}&limit=1`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error geocoding address.');
    }
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      return {
        coordinates: feature.center as [number, number],
        address: feature.place_name || address,
      };
    }
    return null;
  } catch (error) {
    console.error('Mapbox geocoding error:', error);
    if (error instanceof Error) {
      throw new Error(`Geocoding error: ${error.message}`);
    }
    throw new Error('An unknown error occurred while geocoding the address.');
  }
}

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @returns Distance in kilometers
 */
export function calculateDistance(
  coord1: [number, number], // [longitude, latitude]
  coord2: [number, number]  // [longitude, latitude]
): number {
  const R = 6371; // Earth's radius in kilometers
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}