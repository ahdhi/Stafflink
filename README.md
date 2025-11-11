# StaffGrid - Healthcare Staffing Management Platform

A comprehensive healthcare staffing management platform built with React + TypeScript (frontend) and .NET Core 9 (backend).

## 🏗️ Project Structure

```
staffgrid/
├── frontend/                    # React + TypeScript + Vite
│   ├── src/
│   │   ├── api/                # API client and endpoints
│   │   ├── components/         # Reusable UI components
│   │   ├── features/           # Feature-based modules
│   │   │   ├── auth/          # Authentication
│   │   │   ├── dashboard/     # Role-based dashboards
│   │   │   ├── shifts/        # Shift management
│   │   │   ├── staff/         # Staff management
│   │   │   ├── agencies/      # Agency management
│   │   │   ├── facilities/    # Facility management
│   │   │   └── reports/       # Analytics & reporting
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility functions
│   │   ├── routes/            # Route definitions
│   │   ├── store/             # Zustand state management
│   │   └── types/             # TypeScript definitions
│   └── package.json
│
├── backend/                     # .NET Core 9 Web API
│   ├── StaffGrid.API/          # API layer (Controllers, Hubs)
│   ├── StaffGrid.Core/         # Domain entities and interfaces
│   ├── StaffGrid.Application/  # Business logic and DTOs
│   └── StaffGrid.Infrastructure/ # Data access and services
│
└── docs/                        # Documentation

```

## 🚀 Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Zustand (auth) + TanStack Query (server state)
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod validation
- **HTTP Client:** Axios
- **Real-time:** Socket.io Client
- **Charts:** Recharts
- **UI Components:** Shadcn/ui + Lucide Icons
- **Notifications:** Sonner

### Backend
- **.NET:** Core 9.0
- **API:** ASP.NET Core Web API
- **ORM:** Entity Framework Core 9
- **Database:** SQL Server (planned)
- **Authentication:** JWT Bearer
- **Real-time:** SignalR (planned)
- **API Documentation:** Swagger/OpenAPI

## 📋 Prerequisites

- **Node.js:** v18+
- **.NET SDK:** 9.0+
- **SQL Server:** 2019+ or SQL Server Express
- **Git:** Latest version

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd staffgrid
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3000`

### 3. Backend Setup

```bash
cd backend

# Restore packages
dotnet restore

# Update connection string in appsettings.json

# Run migrations (once implemented)
dotnet ef database update --project StaffGrid.Infrastructure --startup-project StaffGrid.API

# Start API
dotnet run --project StaffGrid.API
```

The API will run on `http://localhost:5000`

## 🎯 User Roles

### 1. Super Admin
- System-wide administration
- Approve user creation requests
- Manage corporates, facilities, and agencies
- Access to all system analytics

### 2. Corporate Admin
- Manage multiple facilities
- Request facility users and agency partnerships
- Corporate-wide reporting
- Resource optimization across organization

### 3. Facility User
- Day-to-day shift management
- Create and broadcast shifts
- Staff assignment and tracking
- Direct agency communication

### 4. Agency User
- Receive and fulfill shift requests
- Manage staff roster
- Submit staff proposals
- Performance monitoring

## 📊 Key Features

### Shift Management
- Create, edit, and duplicate shifts
- Recurring shift patterns
- Shift templates
- Bulk operations
- Real-time status tracking

### Agency Tier System
- **Tier 1 (Premium):** 4-hour exclusivity, first access
- **Tier 2 (Standard):** Secondary access after Tier 1
- **Tier 3 (Supplementary):** Access to remaining shifts
- Performance-based tier progression

### Broadcasting System
- Tiered broadcasting (Tier 1 → 2 → 3)
- Direct agency requests
- Automatic escalation
- SLA tracking and monitoring

### Staff Management
- Comprehensive profiles
- Qualifications and certifications
- Availability management
- Performance tracking
- Assignment history

### Analytics & Reporting
- Role-specific dashboards
- Fill rate analytics
- Agency performance metrics
- Cost analysis
- Export capabilities (PDF, Excel, CSV)

### Real-time Notifications
- In-app alerts
- Email notifications
- Priority-based routing
- Notification center
- User preferences

## 🔐 Authentication

JWT-based authentication with:
- Access tokens (60-minute expiry)
- Refresh tokens
- Automatic token refresh
- Role-based authorization

## 📁 Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=StaffGrid;Trusted_Connection=true;"
  },
  "JwtSettings": {
    "Secret": "your-secret-key-here",
    "Issuer": "StaffGrid",
    "Audience": "StaffGridUsers",
    "ExpiryMinutes": 60
  }
}
```

## 🧪 Development

### Frontend Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend Commands
```bash
dotnet build                    # Build solution
dotnet run                      # Run API
dotnet watch                    # Run with hot reload
dotnet test                     # Run tests
dotnet ef migrations add <name> # Add migration
dotnet ef database update       # Apply migrations
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Shifts
- `GET /api/shifts` - Get all shifts (paginated)
- `GET /api/shifts/{id}` - Get shift by ID
- `POST /api/shifts` - Create shift
- `PUT /api/shifts/{id}` - Update shift
- `POST /api/shifts/{id}/broadcast` - Broadcast shift
- `GET /api/shifts/{id}/responses` - Get agency responses

### Agencies
- `GET /api/agencies` - Get all agencies
- `GET /api/agencies/{id}` - Get agency by ID
- `POST /api/agencies` - Create agency
- `PUT /api/agencies/{id}/tier` - Update tier
- `GET /api/agencies/{id}/performance` - Get performance metrics

### Staff
- `GET /api/staff` - Get all staff
- `GET /api/staff/{id}` - Get staff by ID
- `POST /api/staff` - Create staff
- `GET /api/staff/{id}/availability` - Get availability
- `GET /api/staff/{id}/certifications` - Get certifications

### Facilities
- `GET /api/facilities` - Get all facilities
- `GET /api/facilities/{id}` - Get facility by ID
- `POST /api/facilities` - Create facility
- `GET /api/facilities/{id}/departments` - Get departments

### Users
- `GET /api/users` - Get all users
- `POST /api/users/request` - Request user creation
- `GET /api/users/pending-approvals` - Get pending approvals
- `POST /api/users/approve` - Approve/reject user

## 🗺️ Implementation Roadmap (4 Months)

### Phase 1: Foundation (Month 1) ✅
- [x] Project structure setup
- [x] Authentication system
- [x] User management with approval workflows
- [x] Base UI components

### Phase 2: Core Features (Month 2)
- [ ] Shift management system
- [ ] Agency tier system
- [ ] Staff profile management
- [ ] Basic broadcasting

### Phase 3: Advanced Features (Month 3)
- [ ] Advanced shift management
- [ ] Performance tracking
- [ ] Real-time notifications
- [ ] Analytics dashboards

### Phase 4: Finalization (Month 4)
- [ ] Export functionality
- [ ] Mobile responsiveness
- [ ] Testing and bug fixes
- [ ] Deployment

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## 📄 License

Proprietary - All rights reserved

## 👥 Team

Development Team - StaffGrid Platform

---

**Built with ❤️ for Healthcare Staffing Excellence**
