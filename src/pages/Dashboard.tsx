import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, getClients, deleteClient } from '../lib/supabase';
import type { Client } from '../types/client';

interface DashboardProps {
  user: { id: string; email: string };
}

export function Dashboard({ user }: DashboardProps) {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await getClients();
      setClients(data);
    } catch (error) {
      console.error('Failed to load clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return;

    try {
      await deleteClient(id);
      setClients(clients.filter(c => c.id !== id));
    } catch (error) {
      alert('Failed to delete client');
    }
  };

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              Dashboard
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
              Welcome, {user?.email}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate('/map')}
              style={{
                backgroundColor: '#8b5cf6',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              📍 View Map
            </button>
            <button
              onClick={handleSignOut}
              style={{
                backgroundColor: '#ef4444',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Progress Goals */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: '0 0 20px 0' }}>
            📊 Monthly Goals Progress
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {/* Research Contacts Card */}
            <div style={{
              backgroundColor: '#f0f9ff',
              border: '2px solid #bfdbfe',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <p style={{ fontSize: '16px', fontWeight: '700', color: '#1e40af', margin: 0 }}>
                  🎯 Research Contacts
                </p>
                <p style={{ fontSize: '16px', fontWeight: '700', color: '#3b82f6', margin: 0 }}>
                  {Math.round((clients.length / 450) * 100)}%
                </p>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{
                  width: '100%',
                  height: '12px',
                  backgroundColor: '#dbeafe',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: '1px solid #93c5fd'
                }}>
                  <div style={{
                    height: '100%',
                    backgroundColor: 'linear-gradient(90deg, #3b82f6 0%, #1e40af 100%)',
                    backgroundImage: 'linear-gradient(90deg, #3b82f6 0%, #1e40af 100%)',
                    width: `${Math.min((clients.length / 450) * 100, 100)}%`,
                    transition: 'width 0.5s ease',
                    borderRadius: '6px'
                  }}></div>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#1e40af', fontWeight: '600', margin: 0 }}>
                {clients.length} / 450
              </p>
            </div>

            {/* Approvals Card */}
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '2px solid #bbf7d0',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <p style={{ fontSize: '16px', fontWeight: '700', color: '#166534', margin: 0 }}>
                  ✅ Approvals
                </p>
                <p style={{ fontSize: '16px', fontWeight: '700', color: '#10b981', margin: 0 }}>
                  {Math.round((clients.filter(c => c.status === 'approved').length / 20) * 100)}%
                </p>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{
                  width: '100%',
                  height: '12px',
                  backgroundColor: '#dcfce7',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: '1px solid #86efac'
                }}>
                  <div style={{
                    height: '100%',
                    backgroundImage: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                    width: `${Math.min((clients.filter(c => c.status === 'approved').length / 20) * 100, 100)}%`,
                    transition: 'width 0.5s ease',
                    borderRadius: '6px'
                  }}></div>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#166534', fontWeight: '600', margin: 0 }}>
                {clients.filter(c => c.status === 'approved').length} / 20
              </p>
            </div>

            {/* New Clients Card */}
            <div style={{
              backgroundColor: '#fffbeb',
              border: '2px solid #fcd34d',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <p style={{ fontSize: '16px', fontWeight: '700', color: '#92400e', margin: 0 }}>
                  🆕 New Clients
                </p>
                <p style={{ fontSize: '16px', fontWeight: '700', color: '#f59e0b', margin: 0 }}>
                  {Math.round((clients.filter(c => c.status === 'new').length / 60) * 100)}%
                </p>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{
                  width: '100%',
                  height: '12px',
                  backgroundColor: '#fef3c7',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: '1px solid #fde68a'
                }}>
                  <div style={{
                    height: '100%',
                    backgroundImage: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
                    width: `${Math.min((clients.filter(c => c.status === 'new').length / 60) * 100, 100)}%`,
                    transition: 'width 0.5s ease',
                    borderRadius: '6px'
                  }}></div>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#92400e', fontWeight: '600', margin: 0 }}>
                {clients.filter(c => c.status === 'new').length} / 60
              </p>
            </div>

            {/* Monthly Clients Card */}
            <div style={{
              backgroundColor: '#faf5ff',
              border: '2px solid #e9d5ff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <p style={{ fontSize: '16px', fontWeight: '700', color: '#6b21a8', margin: 0 }}>
                  🔄 Monthly Clients
                </p>
                <p style={{ fontSize: '16px', fontWeight: '700', color: '#8b5cf6', margin: 0 }}>
                  {Math.round((clients.filter(c => c.status === 'monthly_client').length / 3) * 100)}%
                </p>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{
                  width: '100%',
                  height: '12px',
                  backgroundColor: '#f3e8ff',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: '1px solid #ddd6fe'
                }}>
                  <div style={{
                    height: '100%',
                    backgroundImage: 'linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%)',
                    width: `${Math.min((clients.filter(c => c.status === 'monthly_client').length / 3) * 100, 100)}%`,
                    transition: 'width 0.5s ease',
                    borderRadius: '6px'
                  }}></div>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#6b21a8', fontWeight: '600', margin: 0 }}>
                {clients.filter(c => c.status === 'monthly_client').length} / 3
              </p>
            </div>
          </div>
        </div>

        {/* Clients Section */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              Clients
            </h2>
            <button
              onClick={() => navigate('/clients/new')}
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
              + Add Client
            </button>
          </div>

          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              marginBottom: '16px',
              boxSizing: 'border-box'
            }}
          />

          {loading ? (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>Loading clients...</p>
          ) : filteredClients.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>
              {clients.length === 0 ? 'No clients yet. Add one to get started!' : 'No clients match your search.'}
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Email</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Phone</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Status</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.id} style={{ borderBottom: '1px solid #e5e7eb', hover: { backgroundColor: '#f9fafb' } }}>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#1f2937' }}>{client.name}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>{client.email}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>{client.phone}</td>
                      <td style={{ padding: '12px', fontSize: '12px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: client.status === 'new' ? '#dbeafe' :
                                          client.status === 'contacted' ? '#fef3c7' :
                                          client.status === 'approved' ? '#dcfce7' :
                                          '#e9d5ff',
                          color: client.status === 'new' ? '#1e40af' :
                                 client.status === 'contacted' ? '#92400e' :
                                 client.status === 'approved' ? '#166534' :
                                 '#6b21a8',
                          fontWeight: '600'
                        }}>
                          {client.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px' }}>
                        <button
                          onClick={() => navigate(`/clients/${client.id}`)}
                          style={{
                            backgroundColor: '#3b82f6',
                            color: '#ffffff',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            border: 'none',
                            fontSize: '12px',
                            cursor: 'pointer',
                            marginRight: '8px'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(client.id)}
                          style={{
                            backgroundColor: '#ef4444',
                            color: '#ffffff',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            border: 'none',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
