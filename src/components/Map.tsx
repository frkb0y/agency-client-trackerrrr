import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Client } from '../types/client';

interface MapProps {
  clients: Client[];
  onMarkerClick: (client: Client) => void;
  center?: [number, number];
  zoom?: number;
}

const getMarkerColor = (status: Client['status']) => {
  const colors: Record<Client['status'], string> = {
    new: '#3b82f6',
    contacted: '#f59e0b',
    approved: '#10b981',
    monthly_client: '#8b5cf6',
  };
  return colors[status];
};

const createCustomMarker = (color: string, label: string) => {
  const svgIcon = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="2"/>
      <text x="16" y="20" text-anchor="middle" font-size="12" fill="white" font-weight="bold">${label}</text>
    </svg>
  `;

  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

export function Map({ clients, onMarkerClick, center = [20.5937, 78.9629], zoom = 5 }: MapProps) {
  return (
    <MapContainer center={center} zoom={zoom} className="w-full h-full">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {clients.map((client, idx) => (
        <Marker
          key={client.id}
          position={[client.lat, client.lng]}
          icon={createCustomMarker(getMarkerColor(client.status), String(idx + 1))}
          eventHandlers={{
            click: () => onMarkerClick(client),
          }}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-sm mb-1">{client.name}</h3>
              <p className="text-xs text-gray-600 mb-1">{client.address}</p>
              <p className="text-xs">
                <span className="font-semibold">Status:</span> {client.status}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
