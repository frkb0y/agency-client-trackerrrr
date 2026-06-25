import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

interface MapPickerProps {
  lat: number;
  lng: number;
  onLocationSelect: (lat: number, lng: number) => void;
}

const LocationMarker = ({ lat, lng, onLocationSelect }: { lat: number; lng: number; onLocationSelect: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  if (lat === 0 && lng === 0) return null;

  return (
    <Marker position={[lat, lng]} icon={L.icon({
      iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSIxNiIgZmlsbD0iIzJmOTdlMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIi8+PGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iOCIgZmlsbD0id2hpdGUiLz48L3N2Zz4=',
      iconSize: [48, 48],
      iconAnchor: [24, 48],
      popupAnchor: [0, -48],
    })} />
  );
};

export function MapPicker({ lat, lng, onLocationSelect }: MapPickerProps) {
  const [useGps, setUseGps] = useState(false);

  const handleGps = () => {
    if (!navigator.geolocation) {
      alert('GPS not available in your browser');
      return;
    }

    setUseGps(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationSelect(latitude, longitude);
        setUseGps(false);
      },
      (error) => {
        alert('Could not get GPS location: ' + error.message);
        setUseGps(false);
      }
    );
  };

  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
        <button
          type="button"
          onClick={handleGps}
          disabled={useGps}
          style={{
            backgroundColor: useGps ? '#9ca3af' : '#ec4899',
            color: '#ffffff',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '13px',
            fontWeight: '600',
            cursor: useGps ? 'not-allowed' : 'pointer',
            flex: 1
          }}
        >
          {useGps ? '🔄 Getting Location...' : '📍 Get GPS Location'}
        </button>
      </div>

      <p style={{ fontSize: '12px', color: '#6b7280', margin: '8px 0' }}>
        💡 Or click on the map below to select a location
      </p>

      <div style={{
        borderRadius: '8px',
        overflow: 'hidden',
        border: '2px solid #d1d5db',
        height: '300px',
        marginBottom: '12px'
      }}>
        <MapContainer
          center={[lat || 36.8089, lng || 11.0695]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <LocationMarker lat={lat} lng={lng} onLocationSelect={onLocationSelect} />
        </MapContainer>
      </div>

      {lat !== 0 && lng !== 0 && (
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '6px',
          padding: '12px',
          fontSize: '13px',
          color: '#166534'
        }}>
          ✅ Location selected: <strong>{lat.toFixed(6)}, {lng.toFixed(6)}</strong>
        </div>
      )}
    </div>
  );
}
