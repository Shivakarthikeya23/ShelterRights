import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set access token
mapboxgl.accessToken = (import.meta as any).env.VITE_MAPBOX_TOKEN || 'placeholder';

interface MapProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  onMapLoad?: (map: mapboxgl.Map) => void;
}

const PropertyMap: React.FC<MapProps> = ({ 
  center = [-97.7431, 30.2672], // Austin, TX default
  zoom = 12,
  className = "w-full h-full rounded-xl overflow-hidden",
  onMapLoad 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: center,
      zoom: zoom,
    });

    map.current.on('load', () => {
      if (map.current) {
        onMapLoad?.(map.current);
      }
    });

    return () => {
      map.current?.remove();
    };
  }, [center, zoom, onMapLoad]);

  return (
    <div className={className}>
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};

export default PropertyMap;
