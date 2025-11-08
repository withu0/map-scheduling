"use client";

import * as React from 'react';
import Map, { Marker, Source, Layer, NavigationControl, FullscreenControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Job, MapboxRoute } from '@/lib/types';
import { Bot, Loader2 } from 'lucide-react';

interface MapDisplayProps {
  mapboxToken: string;
  jobs: Job[];
  route: MapboxRoute | null;
  status: 'idle' | 'loading' | 'optimizing';
}

const routeLayer: any = {
  id: 'route',
  type: 'line',
  source: 'route',
  layout: {
    'line-join': 'round',
    'line-cap': 'round'
  },
  paint: {
    'line-color': '#FF5722',
    'line-width': 5,
    'line-opacity': 0.9
  }
};

export function MapDisplay({ mapboxToken, jobs, route, status }: MapDisplayProps) {
  const [viewport, setViewport] = React.useState({
    longitude: -122.43,
    latitude: 37.79,
    zoom: 11.5,
  });

  const routeGeoJson = React.useMemo(() => {
    if (!route) return null;
    return {
      type: 'Feature' as const,
      properties: {},
      geometry: route.geometry,
    };
  }, [route]);
  
  React.useEffect(() => {
    if (jobs.length > 0) {
      const longitudes = jobs.map(j => j.coordinates[0]);
      const latitudes = jobs.map(j => j.coordinates[1]);
      const avgLongitude = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;
      const avgLatitude = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
      
      setViewport(v => ({
        ...v,
        longitude: avgLongitude,
        latitude: avgLatitude
      }));
    }
  }, [jobs]);

  return (
    <div className="relative w-full h-full bg-muted">
      <Map
        {...viewport}
        onMove={evt => setViewport(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={mapboxToken}
        attributionControl={false}
      >
        <FullscreenControl position="top-right" />
        <NavigationControl position="top-right" />

        {routeGeoJson && (
          <Source id="route" type="geojson" data={routeGeoJson}>
            <Layer {...routeLayer} />
          </Source>
        )}

        {jobs.map((job, index) => (
          <Marker
            key={`marker-${job.id}`}
            longitude={job.coordinates[0]}
            latitude={job.coordinates[1]}
            anchor="bottom"
          >
            <div className="flex flex-col items-center cursor-pointer transition-transform hover:scale-110 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-center w-8 h-8 font-bold text-white border-2 border-white rounded-full shadow-lg bg-primary">
                {index + 1}
              </div>
            </div>
          </Marker>
        ))}
      </Map>
      {(status === 'loading' || status === 'optimizing') && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-card shadow-lg">
            {status === 'optimizing' ? <Bot className="w-6 h-6 animate-pulse text-primary" /> : <Loader2 className="w-6 h-6 animate-spin text-primary" />}
            <span className="text-lg font-semibold">{status === 'loading' ? 'Calculating route...' : 'Optimizing with AI...'}</span>
          </div>
        </div>
      )}
    </div>
  );
}
