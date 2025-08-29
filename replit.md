# Overview

A comprehensive classroom tablet monitoring system for educational environments. This application enables teachers to monitor student tablet activity in real-time, track usage patterns, manage security policies, and generate detailed reports. The system provides live monitoring capabilities, content filtering, alert management, and administrative controls for educational tablet management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

## Backend Architecture
- **Runtime**: Node.js with Express.js REST API
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon serverless PostgreSQL
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Session Management**: Express sessions with PostgreSQL storage

## Database Design
The schema includes core entities for educational monitoring:
- **Users**: Teacher accounts with role-based access
- **Students**: Student profiles with tablet assignments
- **Tablets**: Device tracking with real-time status monitoring
- **Activities**: Detailed logging of student interactions
- **Alerts**: Security and behavioral notifications
- **Blocked Sites**: Content filtering and restriction management
- **Security Policies**: Configurable monitoring and restriction rules

## Key Features
- **Real-time Monitoring**: Live tracking of tablet status and student activity
- **Content Management**: Website blocking and application restrictions
- **Alert System**: Automated notifications for inappropriate content or concerning behavior
- **Reporting**: Comprehensive analytics and exportable reports
- **Emergency Controls**: Instant tablet locking and restriction capabilities
- **Multi-language Support**: Spanish-language interface for educational environments

## Development Architecture
- **Monorepo Structure**: Shared schema and types between client and server
- **Build System**: Vite for frontend bundling, esbuild for server compilation
- **Development Tools**: TypeScript for type safety, ESM modules throughout
- **Hot Reload**: Vite HMR with development middleware integration

# External Dependencies

## Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connectivity
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management and caching
- **express**: Node.js web application framework

## UI and Component Libraries
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library for React

## Development and Build Tools
- **vite**: Frontend build tool and development server
- **typescript**: Static type checking
- **esbuild**: Fast JavaScript bundler for server builds
- **@replit/vite-plugin-runtime-error-modal**: Development error handling

## Form and Validation
- **react-hook-form**: Performant forms with minimal re-renders
- **@hookform/resolvers**: Validation resolvers for React Hook Form
- **zod**: TypeScript-first schema validation
- **drizzle-zod**: Integration between Drizzle ORM and Zod validation

## Additional Utilities
- **date-fns**: Date utility library
- **clsx**: Conditional className utility
- **cmdk**: Command palette component
- **wouter**: Minimalist routing library