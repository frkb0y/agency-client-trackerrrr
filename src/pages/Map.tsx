import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getClients } from '../lib/supabase';
import type { Client } from '../types/client';

// Custom marker icons
const createMarkerIcon = (color: string, number: number) => {
  const colors: Record<string, string> = {
    new: '#3b82f6',
    contacted: '#f59e0b',
    approved: '#10b981',
    monthly_client: '#8b5cf6'
  };

  const markerColor = colors[color] || '#3b82f6';

  const svgIcon = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="16" fill="${markerColor}" stroke="white" stroke-width="3"/>
      <text x="20" y="25" text-anchor="middle" font-size="14" fill="white" font-weight="bold">${number}</text>
    </svg>
  `;

  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

const MapFitBounds = ({ clients }: { clients: Client[] }) => {
  const map = useMap();

  useEffect(() => {
    if (clients.length > 0) {
      const bounds = L.latLngBounds(
        clients.map(c => [c.lat, c.lng] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [clients, map]);

  return null;
};

export function Map() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await getClients();
      setClients(data);
    } catch (error) {
      console.error('Failed to load clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: '#3b82f6',
      contacted: '#f59e0b',
      approved: '#10b981',
      monthly_client: '#8b5cf6'
    };
    return colors[status] || '#3b82f6';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      new: '🔵 New',
      contacted: '🟠 Contacted',
      approved: '🟢 Approved',
      monthly_client: '🟣 Monthly'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <p style={{ color: '#6b7280' }}>Loading map...</p>
      </div>
    );
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f3f4f6'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        zIndex: 10
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              📍 Client Locations Map
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
              {clients.length} client(s) on map
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      {/* Legend */}
      <div style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '12px 24px',
        zIndex: 10
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></div>
            <span style={{ color: '#374151' }}>New</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
            <span style={{ color: '#374151' }}>Contacted</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
            <span style={{ color: '#374151' }}>Approved</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#8b5cf6' }}></div>
            <span style={{ color: '#374151' }}>Monthly Client</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '16px', padding: '16px', overflow: 'hidden' }}>
        {/* Map Container */}
        <div style={{ flex: 1, borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <MapContainer
            center={[36.8089, 11.0695]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {clients.map((client, idx) => (
              <Marker
                key={client.id}
                position={[client.lat, client.lng]}
                icon={createMarkerIcon(client.status, idx + 1)}
                eventHandlers={{
                  click: () => setSelectedClient(client),
                }}
              >
                <Popup>
                  <div style={{ minWidth: '220px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#1f2937' }}>
                      {client.name}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0' }}>
                      📧 {client.email}
                    </p>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0' }}>
                      📱 {client.phone}
                    </p>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0' }}>
                      📍 {client.address}
                    </p>
                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
                      <span style={{
                        display: 'inline-block',
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: getStatusColor(client.status) + '20',
                        color: getStatusColor(client.status)
                      }}>
                        {getStatusLabel(client.status)}
                      </span>
                    </div>
                    {client.notes && (
                      <p style={{ fontSize: '11px', color: '#374151', margin: '8px 0 0 0', fontStyle: 'italic' }}>
                        Note: {client.notes}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
            <MapFitBounds clients={clients} />
          </MapContainer>
        </div>

        {/* Client Details Sidebar */}
        <div style={{
          width: '280px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflowY: 'auto'
        }}>
          {selectedClient ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                  {selectedClient.name}
                </h3>
                <button
                  onClick={() => setSelectedClient(null)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#9ca3af',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    padding: '0',
                    width: '24px',
                    height: '24px'
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ space: '12px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                    Email
                  </p>
                  <p style={{ fontSize: '13px', color: '#1f2937', margin: 0, wordBreak: 'break-word' }}>
                    {selectedClient.email}
                  </p>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                    Phone
                  </p>
                  <p style={{ fontSize: '13px', color: '#1f2937', margin: 0 }}>
                    {selectedClient.phone}
                  </p>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                    Address
                  </p>
                  <p style={{ fontSize: '13px', color: '#1f2937', margin: 0 }}>
                    {selectedClient.address}
                  </p>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                    Status
                  </p>
                  <span style={{
                    display: 'inline-block',
                    fontSize: '12px',
                    fontWeight: '600',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: getStatusColor(selectedClient.status) + '20',
                    color: getStatusColor(selectedClient.status)
                  }}>
                    {getStatusLabel(selectedClient.status)}
                  </span>
                </div>

                {selectedClient.notes && (
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                      Notes
                    </p>
                    <p style={{ fontSize: '13px', color: '#1f2937', margin: 0, fontStyle: 'italic' }}>
                      {selectedClient.notes}
                    </p>
                  </div>
                )}

                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                    Location
                  </p>
                  <p style={{ fontSize: '12px', color: '#374151', margin: 0 }}>
                    {selectedClient.lat.toFixed(4)}, {selectedClient.lng.toFixed(4)}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/clients/${selectedClient.id}`)}
                  style={{
                    width: '100%',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '16px'
                  }}
                >
                  Edit Client
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#9ca3af', paddingTop: '40px' }}>
              <p style={{ fontSize: '14px', margin: 0 }}>Click a marker on the map to see client details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
