import { Client, ProgressGoal } from '../types/client';
import { ClientRegistry } from './ClientRegistry';
import { ProgressTracker } from './ProgressTracker';

interface SidebarProps {
  clients: Client[];
  goal: ProgressGoal | null;
  onClientAdded: (client: Client) => void;
  onClientSelect: (client: Client) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isMobile?: boolean;
}

export function Sidebar({
  clients,
  goal,
  onClientAdded,
  onClientSelect,
  searchQuery,
  onSearchChange,
  isMobile = false,
}: SidebarProps) {
  return (
    <div className={`flex flex-col ${isMobile ? 'h-[50vh]' : 'h-screen'} bg-gray-50 border-r`}>
      {/* Tabs or sections */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 flex flex-col overflow-hidden">
          <ClientRegistry
            clients={clients}
            onClientAdded={onClientAdded}
            onClientSelect={onClientSelect}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
          />
        </div>
      </div>

      {/* Progress tracker at bottom */}
      <div className="border-t p-4 bg-white">
        <ProgressTracker goal={goal} clients={clients} />
      </div>
    </div>
  );
}
