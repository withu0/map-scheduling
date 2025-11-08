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
