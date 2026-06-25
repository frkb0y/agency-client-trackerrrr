import { ProgressGoal, Client } from '../types/client';

interface ProgressTrackerProps {
  goal: ProgressGoal | null;
  clients: Client[];
}

interface ProgressItem {
  label: string;
  current: number;
  goal: number;
  color: string;
}

export function ProgressTracker({ goal, clients }: ProgressTrackerProps) {
  const calculateProgress = () => {
    if (!goal) {
      return [
        { label: 'Research Contacts', current: 0, goal: 450, color: 'bg-blue-500' },
        { label: 'Approvals', current: 0, goal: 20, color: 'bg-green-500' },
        { label: 'New Clients', current: 0, goal: 60, color: 'bg-amber-500' },
        { label: 'Monthly Clients', current: 0, goal: 3, color: 'bg-purple-500' },
      ];
    }

    return [
      {
        label: 'Research Contacts',
        current: goal.contacts_count,
        goal: goal.contacts_goal,
        color: 'bg-blue-500',
      },
      {
        label: 'Approvals',
        current: goal.approvals_count,
        goal: goal.approvals_goal,
        color: 'bg-green-500',
      },
      {
        label: 'New Clients',
        current: goal.new_clients_count,
        goal: goal.new_clients_goal,
        color: 'bg-amber-500',
      },
      {
        label: 'Monthly Clients',
        current: goal.monthly_clients_count,
        goal: goal.monthly_clients_goal,
        color: 'bg-purple-500',
      },
    ];
  };

  const items = calculateProgress();
  const totalClients = clients.length;
  const approvedClients = clients.filter(c => c.status === 'approved').length;
  const monthlyClients = clients.filter(c => c.status === 'monthly_client').length;

  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      <h2 className="text-lg font-bold text-gray-800">Monthly Progress</h2>

      <div className="text-sm text-gray-600">
        {goal && <p>Month: {goal.month}</p>}
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-gray-700">{item.label}</span>
              <span className="text-gray-600 font-bold">
                {item.current} / {item.goal}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full ${item.color} transition-all duration-300`}
                style={{ width: `${Math.min((item.current / item.goal) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {Math.round((item.current / item.goal) * 100)}% complete
            </p>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Clients:</span>
          <span className="font-bold text-gray-800">{totalClients}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Approved:</span>
          <span className="font-bold text-green-600">{approvedClients}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Monthly Clients:</span>
          <span className="font-bold text-purple-600">{monthlyClients}</span>
        </div>
      </div>
    </div>
  );
}
