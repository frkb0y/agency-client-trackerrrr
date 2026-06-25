import { useState } from 'react';
import { X } from 'lucide-react';
import { Client, ClientStatus } from '../types/client';
import { updateClient } from '../lib/supabase';

interface ClientModalProps {
  client: Client | null;
  onClose: () => void;
  onUpdate: (updatedClient: Client) => void;
}

const statuses: ClientStatus[] = ['new', 'contacted', 'approved', 'monthly_client'];

export function ClientModal({ client, onClose, onUpdate }: ClientModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(client);
  const [isSaving, setIsSaving] = useState(false);

  if (!client || !formData) return null;

  const handleSave = async () => {
    if (!formData) return;

    try {
      setIsSaving(true);
      const updated = await updateClient(formData.id, formData);
      onUpdate(updated);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update client:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">{formData.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {!isEditing ? (
            <>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Email</label>
                  <p className="text-sm">{formData.email}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Phone</label>
                  <p className="text-sm">{formData.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Address</label>
                  <p className="text-sm">{formData.address}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${
                    formData.status === 'new' ? 'bg-blue-500' :
                    formData.status === 'contacted' ? 'bg-amber-500' :
                    formData.status === 'approved' ? 'bg-green-500' :
                    'bg-purple-500'
                  }`}>
                    {formData.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Notes</label>
                  <p className="text-sm text-gray-700">{formData.notes || 'No notes'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Added</label>
                  <p className="text-sm text-gray-700">{new Date(formData.date_added).toLocaleDateString()}</p>
                </div>
                {formData.last_contact && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Last Contact</label>
                    <p className="text-sm text-gray-700">{new Date(formData.last_contact).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600"
              >
                Edit Client
              </button>
            </>
          ) : (
            <>
              <div>
                <label className="text-sm font-semibold text-gray-600">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as ClientStatus })}
                  className="w-full border rounded px-3 py-2 mt-1"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full border rounded px-3 py-2 mt-1 h-24 resize-none"
                  placeholder="Add notes about this client..."
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Last Contact</label>
                <input
                  type="date"
                  value={formData.last_contact?.split('T')[0] || ''}
                  onChange={(e) => setFormData({ ...formData, last_contact: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 bg-green-500 text-white py-2 rounded font-semibold hover:bg-green-600 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setFormData(client);
                    setIsEditing(false);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded font-semibold hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
