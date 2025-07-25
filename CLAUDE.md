# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

**Phase 1-3 Complete**: JBC Building Cloud frontend with comprehensive workflow system implemented.

Current status:
- ✅ Authentication system with mock users (JSON-based)
- ✅ Role-based routing and protected routes
- ✅ All 4 role-specific dashboards (Owner, Management, Tenant, Broker)
- ✅ Calendar system with event management (CRUD operations)
- ✅ Room booking system with approval workflow
- ✅ Request & approval workflow system
- ✅ Interactive UI components and modals
- ✅ Development server running on http://localhost:5174/

## Architecture Overview

The system is designed as a **multi-tenant SaaS platform** with four distinct user roles:
- **OWNER**: Building owners with full administrative access
- **MGMT**: Management companies handling building operations  
- **TENANT**: Building tenants with booking and communication features
- **BROKER**: Real estate brokers with limited property access

### Core System Components

**Data Hierarchy**: USER → TENANT → LEASE and OWNER → BUILDING → FLOOR → ROOM
**Key Features**: Dashboard/calendar system, workflow approvals, room booking, document management, emergency communications
**Architecture Style**: API-first microservices with event-driven booking/approval workflows

## Key Documentation

- **`doc.md`**: Complete requirements specification including user roles, functional requirements, API endpoints, data models, and UI screen definitions

## Development Notes

When implementing this system:
- Follow the role-based permissions matrix defined in doc.md
- Implement the RESTful API endpoints as specified
- Use the entity relationship model for database design
- Reference the screen definitions for UI implementation
- The JSON schema system for dynamic UI generation is a key architectural component

## Frontend Tech Stack

- **React 18** + **TypeScript** for type-safe component development
- **Vite** for fast development and build
- **Tailwind CSS** for responsive styling
- **React Router** for client-side routing
- **Zustand** for lightweight state management

## Commands

```bash
# Development
npm run dev         # Start development server (http://localhost:5174/)
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint (if configured)
npm run typecheck  # TypeScript type checking

# Project structure
jbc-frontend/
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/        # Page components
│   ├── stores/       # Zustand stores
│   ├── types/        # TypeScript type definitions
│   ├── data/         # Mock data and utilities
│   └── utils/        # Helper functions
```

## Mock Authentication

Test accounts:
- Owner: `owner@example.com` / `password`
- Management: `mgmt@example.com` / `password`  
- Tenant: `tenant@example.com` / `password`
- Broker: `broker@example.com` / `password`

## Current Features

**Calendar System** (`/calendar`)
- Monthly calendar view with event display
- Event creation, editing, and deletion
- Event categorization (meeting, maintenance, inspection, training)
- Status management (scheduled, in_progress, completed, cancelled)
- Role-based permissions for event management

**Room Booking System** (`/bookings` - Tenant only)
- Room availability checking
- Booking request submission
- Real-time conflict detection
- Booking status tracking (pending, approved, rejected)
- Equipment and capacity information

**Request & Approval Workflow**
- **Tenant Side** (`/apply`): Request creation form for maintenance, construction, move-in/out, equipment
- **Management Side** (`/requests`): Approval interface with comment system
- Priority-based request handling (urgent, high, medium, low)
- Status tracking (submitted, under_review, approved, rejected, completed)
- Document attachment support and comment threads

**State Management**
- Zustand stores for auth, events, bookings, and requests
- Persistent mock data with CRUD operations
- Role-based data filtering and permissions

## Next Implementation Steps

**Phase 4**: Advanced Features
1. Emergency contact system
2. Document management and file upload
3. Real-time notifications
4. Advanced reporting and analytics
5. Vacancy information system for brokers
6. Building maintenance scheduling
7. Tenant communication portal