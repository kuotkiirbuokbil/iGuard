# iGuard - Data Access Gateway

## Overview

iGuard is a secure, paid API gateway platform that enables creators to monetize their data sources through micropayments. The application provides two primary interfaces: a Creator Dashboard for managing data sources and monitoring earnings, and an Agent Console for consuming protected APIs with spend controls.

The platform is designed as a developer-focused fintech tool that emphasizes clarity, trust, and efficiency through a clean, professional interface inspired by Stripe's dashboard design principles.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system variables
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

**Design System**:
- Based on the "New York" variant of shadcn/ui
- Custom color palette using HSL variables for light/dark mode support
- Typography: Inter font family (Google Fonts) with JetBrains Mono for code
- Follows Material Design principles for data-dense components
- Component examples included for rapid development

**Key Pages**:
- Creator Dashboard: Data source management, earnings statistics, access logs
- Agent Console: API key management, gateway testing, request logs

### Backend Architecture

**Runtime**: Node.js with Express framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints under `/api` namespace
- **Request Logging**: Custom middleware for API request tracking
- **Development**: Hot module replacement via Vite in dev mode

**Storage Strategy**: Dual-mode architecture
- **Primary**: Firestore (Firebase) for production persistence
- **Fallback**: In-memory storage when Firestore credentials unavailable
- **Interface**: Abstracted `IStorage` interface allowing seamless switching

**Data Models**:
- Creators: User accounts managing data sources
- Agents: API consumers with authentication keys
- Data Sources: Protected endpoints with pricing configuration
- Access Logs: Transaction history for auditing and analytics

### Database & Schema

**ORM**: Drizzle ORM with PostgreSQL dialect
- Schema defined in `shared/schema.ts` for type safety
- Zod integration for runtime validation
- Migration support via drizzle-kit

**Collections/Tables**:
- `users`: Authentication (username/password)
- `creators`: Content/data owners
- `agents`: API consumers with Locus wallet integration
- `data_sources`: Protected endpoints with pricing (USDC per request)
- `access_logs`: Request history with payment status

**Shared Types**: TypeScript types exported from schema for frontend/backend consistency

### Authentication & Authorization

Currently implements basic structure with:
- API key generation for agents
- Creator/agent identity separation
- Planned integration: Anthropic Agent SDK for identity verification

### Payment Architecture (Planned)

**Micropayments**: Coinbase Commerce Developer Platform (CDP)
- Currency: USDC on Base blockchain
- Protocol: x402 payment standard
- Per-request pricing model

**Spend Controls**: Locus integration
- Wallet ID association with agents
- Budget management and limits

**Payouts**: Stripe integration for creator earnings distribution

## External Dependencies

### Core Infrastructure

**Replit**: Primary hosting and development environment
- Monorepo structure (client + server)
- Environment variable management
- Built-in database provisioning support

### Database Services

**Firebase/Firestore**: NoSQL document database
- Service account authentication via environment variables
- Real-time capabilities (not currently utilized)
- Graceful degradation to in-memory storage

**PostgreSQL**: Configured via Drizzle but not actively used
- Schema defined for future migration
- Connection via `DATABASE_URL` environment variable

### Frontend Libraries

**shadcn/ui**: Component library
- 40+ Radix UI-based components
- Accessible, customizable primitives
- Includes: dialogs, forms, tables, navigation, data display

**TanStack Query**: Data fetching and caching
- API request management
- Automatic refetching and invalidation
- Optimistic updates support

**Additional UI**:
- `date-fns`: Date formatting and manipulation
- `lucide-react`: Icon system
- `embla-carousel-react`: Carousel components
- `cmdk`: Command palette (not currently used in main app)

### Payment & Blockchain (Planned)

**Coinbase CDP**: Cryptocurrency payment processing
- Base network integration
- USDC stablecoin transactions

**Locus**: Spend control and wallet management
- Agent budget enforcement
- Transaction limits

**Stripe**: Fiat currency payouts to creators

### Development Tools

**Build Tools**:
- Vite: Frontend bundler with HMR
- esbuild: Backend bundling for production
- TypeScript: Type checking across stack

**Replit Plugins**:
- Runtime error overlay
- Cartographer (code navigation)
- Dev banner

### Session & Security

**connect-pg-simple**: PostgreSQL session store (configured but not actively used)
- Designed for Express session management
- Future authentication implementation

## Recent Changes

### Phase 1 Complete (November 15, 2025)
iGuard Phase 1 is now fully functional and production-ready:

✅ **Backend Infrastructure**
- Firestore client initialized with graceful fallback to in-memory storage
- Complete storage layer with IStorage interface abstraction
- All CRUD operations for creators, agents, data sources, and access logs
- Type-safe null handling across all Firestore read/write operations
- Consistent timestamp handling (stored as Firestore Timestamp, read as ISO strings)

✅ **API Routes**
- Creator operations: GET creator, GET/POST data sources, GET access logs
- Agent operations: GET agent, POST generate API key, GET access logs
- Demo endpoint for loading test data
- Request validation using Zod schemas
- Proper error handling throughout

✅ **Frontend-Backend Integration**
- TanStack Query for all data fetching with proper type safety
- No `any` types - end-to-end type safety maintained
- Mutations with cache invalidation working correctly
- Loading states and error handling implemented

✅ **End-to-End Testing**
- Comprehensive Playwright test suite passed
- Creator Dashboard: viewing stats, data sources, access logs, adding new sources
- Agent Console: viewing agent details, generating API keys, access logs
- All core functionality verified working

### Current Implementation Status
- ✅ Design system and UI components
- ✅ Frontend pages and routing  
- ✅ Backend API integration
- ✅ Database persistence (Firestore with in-memory fallback)
- ✅ End-to-end functionality verified
- ⏳ Payment integration (Phase 2)
- ⏳ Gateway proxy (Phase 2)

### Authentication Pages Added (November 15, 2025)
Added complete authentication UI flow:

✅ **Landing Page**
- Professional hero section introducing iGuard platform
- 6 feature cards highlighting key capabilities
- CTA buttons for signup and login
- Responsive design matching dashboard aesthetic

✅ **Login Page**
- Email/password form with validation
- Currently simulated authentication (redirects to /creator after 1s delay)
- Clean, centered card layout
- Link to signup for new users

✅ **Signup Page**
- Account type selection (Creator vs Agent)
- Registration form with name, email, password fields
- Redirects to appropriate dashboard based on account type
- Link to login for existing users

✅ **Navigation Updates**
- Conditional rendering based on current route
- Landing page: Shows login/signup buttons
- Auth pages: No navigation (clean experience)
- Dashboard pages: Shows dashboard navigation

### Phase 2 In Progress (November 15, 2025)
Working on authentication backend integration:

✅ **Database Setup Complete**
- PostgreSQL database provisioned and connected via Drizzle ORM
- Database schema updated with users and sessions tables
- DatabaseStorage implementation replaces Firestore/MemStorage
- Schema includes userId foreign keys linking users to creators/agents

✅ **Replit Auth Integration**
- Authentication middleware configured (supports Google, GitHub, X, Apple, email/password login)
- Session management with PostgreSQL session store
- Auth routes: /api/login, /api/logout, /api/callback, /api/auth/user
- Account setup endpoint: /api/setup-account for creator/agent type selection

✅ **Frontend Auth Infrastructure**
- useAuth hook for checking authentication state
- Account setup page for new users to choose creator or agent role
- Auth utilities for error handling

✅ **Complete - Phase 2 Authentication**
- Login/signup pages redirect to Replit Auth (/api/login)
- Authenticated "me" endpoints for creators and agents
- Protected route guards with proper redirects
- Cross-role navigation prevents unauthorized access
- End-to-end authentication flow tested and verified
- Demo data endpoint removed (all data now user-scoped)

### Authentication Guard Implementation

The dashboard routing uses a carefully sequenced guard system to handle all authentication scenarios:

**Guard Sequence**:
1. `isRedirecting` state tracks when a redirect is in progress
2. Single unified `useEffect` handles all redirects in order:
   - Wait for `authLoading` to complete
   - Redirect unauthenticated → `/login`
   - Redirect no profile → `/account-setup`
   - Redirect wrong role → correct dashboard
3. Component shows loading/redirecting states appropriately
4. Only renders dashboard when user has the correct profile

**Cross-Role Protection**:
- Agents visiting `/creator` are automatically redirected to `/agent`
- Creators visiting `/agent` are automatically redirected to `/creator`
- Users with no profile are redirected to `/account-setup`

This design ensures the redirect `useEffect` executes before any conditional returns, preventing infinite loading spinners and ensuring smooth navigation.

### Next Steps for Phase 3 (Payment Integration)
1. **Payment Integration**: Implement x402 payment protocol with Coinbase CDP  
2. **Gateway Proxy**: Build gateway proxy endpoint for protected API calls
3. **Spend Controls**: Integrate Locus for budget management
4. **Creator Payouts**: Add Stripe payout integration for creator earnings