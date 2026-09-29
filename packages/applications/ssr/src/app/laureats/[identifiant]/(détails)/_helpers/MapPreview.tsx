'use client';

import L from 'leaflet';
import { AttributionControl, MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
});

type MapPreviewProps = {
  latitude: number;
  longitude: number;
};

const ZoomControls = () => {
  const map = useMap();

  return (
    <div className="leaflet-control leaflet-bar leaflet-control-zoom">
      <button type="button" onClick={() => map.zoomIn()} aria-label="Zoom avant">
        +
      </button>
      <button type="button" onClick={() => map.zoomOut()} aria-label="Zoom arrière">
        −
      </button>
    </div>
  );
};

export const MapPreview = ({ latitude, longitude }: MapPreviewProps) => {
  return (
    <div className="mt-2 h-48 w-full overflow-hidden rounded-lg print:hidden">
      <MapContainer
        center={[latitude, longitude]}
        zoom={10}
        scrollWheelZoom
        dragging
        zoomControl={false}
        attributionControl={false}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Marker position={[latitude, longitude]} />

        <ZoomControls />

        <AttributionControl prefix={false} />
      </MapContainer>
    </div>
  );
};
