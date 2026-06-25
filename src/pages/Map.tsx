import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getClients } from '../lib/supabase';
import type { Client } from '../types/client';

const MapAutoCenter = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    if (lat !== 0 && lng !== 0) {
      map.setView([lat, lng], 15);
    }
  }, [lat, lng, map]);
  return null;
};

const ClientAutoCenter = ({ client }: { client: any | null }) => {
  const map = useMap();
  useEffect(() => {
    if (client && client.lat && client.lng) {
      map.setView([client.lat, client.lng], 15);
    }
  }, [client?.id, map]);
  return null;
};

// Green marker for current location
const currentLocationIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0iIzEwYjk4MSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNSIgZmlsbD0id2hpdGUiLz48L3N2Zz4=',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

// Custom marker icons (pin style)
const createMarkerIcon = (color: string, number: number) => {
  const colors: Record<string, string> = {
    new: '#3b82f6',
    contacted: '#f59e0b',
    approved: '#10b981',
    monthly_client: '#8b5cf6'
  };

  const markerColor = colors[color] || '#3b82f6';

  const svgIcon = `
    <svg width="40" height="56" viewBox="0 0 40 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 0C12.268 0 6 6.268 6 14C6 22.836 20 40 20 40C20 40 34 22.836 34 14C34 6.268 27.732 0 20 0Z" fill="${markerColor}"/>
      <circle cx="20" cy="14" r="6" fill="white"/>
      <text x="20" y="17" text-anchor="middle" font-size="10" fill="${markerColor}" font-weight="bold">${number}</text>
    </svg>
  `;

  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
    iconSize: [40, 56],
    iconAnchor: [20, 56],
    popupAnchor: [0, -56],
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
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
  const [gpsLoading, setGpsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadClients();
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('GPS not available in your browser');
      return;
    }

    // Clear old marker
    setGpsCoords({ lat: 0, lng: 0 });
    setGpsLoading(true);

    // Get fresh GPS location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGpsCoords({ lat: latitude, lng: longitude });
        setGpsLoading(false);
      },
      (error) => {
        alert('Could not get GPS location: ' + error.message);
        setGpsLoading(false);
      }
    );
  };

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
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleLocateMe}
              disabled={gpsLoading}
              style={{
                backgroundColor: gpsLoading ? '#9ca3af' : '#ec4899',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: gpsLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {gpsLoading ? '🔄 Locating...' : '📍 Locate Me'}
            </button>
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

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '16px',
        padding: '16px',
        overflow: 'hidden'
      }}>
        {/* Map Container */}
        <div style={{
          flex: isMobile ? '0 0 auto' : 1,
          height: isMobile ? '300px' : '100%',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <MapContainer
            center={[gpsCoords.lat || 36.8089, gpsCoords.lng || 11.0695]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <MapAutoCenter lat={gpsCoords.lat} lng={gpsCoords.lng} />
            <ClientAutoCenter client={selectedClient} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {gpsCoords.lat !== 0 && gpsCoords.lng !== 0 && (
              <Marker
                position={[gpsCoords.lat, gpsCoords.lng]}
                icon={currentLocationIcon}
              >
                <Popup>
                  <div style={{ textAlign: 'center', minWidth: '150px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#10b981', margin: '0 0 8px 0' }}>
                      📍 Your Location
                    </p>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                      {gpsCoords.lat.toFixed(6)}, {gpsCoords.lng.toFixed(6)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}
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

        {/* Client List Sidebar / Mobile List */}
        <div style={{
          width: isMobile ? '100%' : '320px',
          flex: isMobile ? '1 1 auto' : 'initial',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Search Box */}
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
            />
          </div>

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

              <div>
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
            <>
              {(() => {
                const filteredClients = clients.filter((c: any) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase()));
                return (
                  <>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 12px 0' }}>
                      Clients ({filteredClients.length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                      {filteredClients.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px', margin: '24px 0' }}>
                          No clients found
                        </p>
                      ) : (
                        filteredClients.map((client: any) => (
                          <button
                            key={client.id}
                            onClick={() => setSelectedClient(client)}
                            style={{
                              backgroundColor: (selectedClient as any)?.id === client.id ? '#dbeafe' : '#f9fafb',
                              border: (selectedClient as any)?.id === client.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                              borderRadius: '6px',
                              padding: '10px',
                              textAlign: 'left',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937', marginBottom: '3px' }}>
                              {client.name}
                            </div>
                            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                              {client.email}
                            </div>
                            <span style={{
                              display: 'inline-block',
                              fontSize: '10px',
                              fontWeight: '600',
                              padding: '2px 6px',
                              borderRadius: '3px',
                              backgroundColor: getStatusColor(client.status) + '20',
                              color: getStatusColor(client.status)
                            }}>
                              {getStatusLabel(client.status)}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  </>
                );
              })()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
