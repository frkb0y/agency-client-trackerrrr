import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Client } from '../types/client';
import { addClient } from '../lib/supabase';

interface ClientRegistryProps {
  clients: Client[];
  onClientAdded: (client: Client) => void;
  onClientSelect: (client: Client) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ClientRegistry({
  clients,
  onClientAdded,
  onClientSelect,
  searchQuery,
  onSearchChange,
}: ClientRegistryProps) {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    lat: 0,
    lng: 0,
    notes: '',
  });

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const newClient = await addClient({
        ...formData,
        status: 'new',
        date_added: new Date().toISOString(),
        last_contact: null,
      });

      onClientAdded(newClient);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        lat: 0,
        lng: 0,
        notes: '',
      });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add client:', error);
      alert('Failed to add client');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Search Bar */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Client List */}
      <div className="flex-1 overflow-y-auto">
        {filteredClients.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {clients.length === 0 ? 'No clients yet' : 'No matches found'}
          </div>
        ) : (
          <div className="divide-y">
            {filteredClients.map((client) => (
              <button
                key={client.id}
                onClick={() => onClientSelect(client)}
                className="w-full p-4 text-left hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-sm">{client.name}</h3>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    client.status === 'new' ? 'bg-blue-100 text-blue-700' :
                    client.status === 'contacted' ? 'bg-amber-100 text-amber-700' :
                    client.status === 'approved' ? 'bg-green-100 text-green-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {client.status}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{client.email}</p>
                <p className="text-xs text-gray-600">{client.phone}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Add Client Button */}
      <div className="p-4 border-t">
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600"
        >
          <Plus size={20} />
          Add New Client
        </button>
      </div>

      {/* Add Client Form */}
      {showForm && (
        <div className="border-t p-4 space-y-3 max-h-[400px] overflow-y-auto">
          <input
            type="text"
            placeholder="Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email *"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            placeholder="Phone *"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Address *"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Latitude"
            value={formData.lat}
            onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
            step="0.0001"
            className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Longitude"
            value={formData.lng}
            onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
            step="0.0001"
            className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-green-500 text-white py-2 rounded font-semibold hover:bg-green-600 disabled:opacity-50 text-sm"
            >
              {isSubmitting ? 'Adding...' : 'Add Client'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded font-semibold hover:bg-gray-400 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
