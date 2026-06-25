# Agency Client Tracker

A React + TypeScript web application for managing agency client information, tracking progress toward monthly goals, and visualizing client locations on an interactive map.

## Features

✨ **Interactive Map**
- View all clients on a map with markers color-coded by status
- Click markers to view detailed client information
- Leaflet integration for smooth, responsive mapping

📊 **Progress Tracking**
- Monitor monthly goals:
  - 450 Research Contacts
  - 20 Approvals
  - 60 New Clients
  - 3 Monthly Clients
- Real-time progress bars and percentage completion
- Client status breakdown

👥 **Client Management**
- Add new clients with location, contact info, and notes
- Search and filter clients by name, email, or phone
- Update client status (new → contacted → approved → monthly_client)
- Track last contact date and add notes
- View comprehensive client information in modal

📱 **Responsive Design**
- **Desktop View**: Sidebar with client registry + full-screen map
- **Mobile View**: Stacked layout with collapsible sections
- Automatic detection and adaptation to screen size

🔄 **Real-time Sync**
- Supabase integration for cloud data storage
- Automatic data loading and synchronization
- Secure client authentication

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Tailwind CSS
- **Mapping**: Leaflet + React Leaflet
- **Backend**: Supabase
- **Build Tool**: Vite
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 16+
- Supabase account

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
# Edit .env.local with your Supabase credentials
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Supabase Setup

You need to create two tables in your Supabase project:

### 1. Clients Table
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  lat DECIMAL(10, 6),
  lng DECIMAL(10, 6),
  status VARCHAR(50) NOT NULL DEFAULT 'new',
  notes TEXT,
  date_added TIMESTAMP DEFAULT NOW(),
  last_contact TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Progress Tracking Table
```sql
CREATE TABLE progress_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month VARCHAR(7) NOT NULL UNIQUE,
  contacts_goal INT DEFAULT 450,
  approvals_goal INT DEFAULT 20,
  new_clients_goal INT DEFAULT 60,
  monthly_clients_goal INT DEFAULT 3,
  contacts_count INT DEFAULT 0,
  approvals_count INT DEFAULT 0,
  new_clients_count INT DEFAULT 0,
  monthly_clients_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Usage

### Adding a Client
1. Click "Add New Client" button
2. Fill in client details (name, email, phone, address, coordinates)
3. Click "Add Client" to save

### Viewing Client Details
- Click on a marker on the map
- Click on a client in the registry list
- Use the modal to view or edit information

### Updating Progress
- Client counts update automatically based on status changes
- Edit client status in the modal to track progress toward goals

### Searching Clients
- Use the search bar to filter by name, email, or phone
- Results update in real-time

## Project Structure

```
src/
├── components/
│   ├── Map.tsx           # Interactive map component
│   ├── ClientModal.tsx   # Client details modal
│   ├── ClientRegistry.tsx # Client list and add form
│   ├── ProgressTracker.tsx # Goals and progress display
│   └── Sidebar.tsx       # Combined sidebar component
├── lib/
│   └── supabase.ts       # Supabase client and queries
├── types/
│   └── client.ts         # TypeScript types
├── styles/
│   └── index.css         # Tailwind CSS setup
├── App.tsx               # Main app component
└── main.tsx              # React entry point
```

## Status Colors

- 🔵 **New** (Blue): Newly added clients
- 🟠 **Contacted** (Amber): Contacted but not yet approved
- 🟢 **Approved** (Green): Approved clients
- 🟣 **Monthly Client** (Purple): Recurring monthly clients

## Tips

- **Geocoding**: For latitude/longitude, you can use Google Maps, OpenStreetMap, or other geocoding services
- **Data Export**: Supabase provides built-in data export and API access
- **Mobile Optimization**: App works great on tablets and mobile devices with responsive design

## License

MIT

## Support

For issues or feature requests, please create an issue in the repository.
