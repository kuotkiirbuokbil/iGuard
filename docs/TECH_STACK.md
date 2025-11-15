# iGuard Technology Stack

## Platform: Replit

iGuard is built entirely on the Replit platform, leveraging several key Replit technologies:

### Replit Auth
- **What it is**: OpenID Connect (OIDC) authentication provider built into Replit
- **How we use it**: Powers all user authentication with support for:
  - Google login
  - GitHub login
  - X (Twitter) login
  - Apple login
  - Email/password authentication
- **Why we chose it**: Zero-config authentication with built-in session management and PostgreSQL integration
- **Implementation**: `openid-client` library with Passport.js strategy

### Replit PostgreSQL Database
- **What it is**: Managed PostgreSQL database (Neon-backed) provisioned directly in Replit
- **How we use it**: 
  - User accounts and authentication sessions
  - Creator and agent profiles
  - Data sources catalog
  - Access logs and transaction history
- **Connection**: Automatic via `DATABASE_URL` environment variable
- **ORM**: Drizzle ORM for type-safe database queries

### Replit Deployments
- **What it is**: Built-in deployment system for publishing web applications
- **How we use it**: One-click deployment to production with:
  - Automatic TLS/SSL certificates
  - Custom domain support
  - Environment variable management
  - Production database separation

## Frontend Technologies

### React + TypeScript
- **Framework**: React 18 with TypeScript for type safety
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter (lightweight alternative to React Router)

### UI Components
- **Component Library**: shadcn/ui built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Icons**: Lucide React
- **Typography**: Inter (UI) and JetBrains Mono (code)

### State Management
- **Server State**: TanStack Query (React Query v5)
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Toast notifications via shadcn/ui

## Backend Technologies

### Node.js + Express
- **Runtime**: Node.js v20
- **Framework**: Express.js for RESTful API
- **Language**: TypeScript with ES modules
- **Hot Reload**: tsx for development

### Database
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Migrations**: Schema-first migrations via `drizzle-kit push`
- **Type Safety**: Generated TypeScript types from schema
- **Validation**: Zod schemas with Drizzle integration

### Session Management
- **Store**: connect-pg-simple (PostgreSQL session store)
- **Middleware**: express-session with secure cookies
- **Duration**: 7-day sessions with automatic renewal

## Payment Technologies (Planned - Phase 2)

### Coinbase Commerce Developer Platform (CDP)
- **What it is**: Cryptocurrency payment infrastructure on Base blockchain
- **How we'll use it**: 
  - Accept USDC payments for API requests
  - On-chain settlement for creators
  - Real-time payment verification
- **Protocol**: x402 payment standard for HTTP micropayments

### x402 Protocol
- **What it is**: HTTP status code 402 "Payment Required" implementation
- **How it works**:
  1. Agent makes API request through iGuard gateway
  2. Gateway returns 402 with payment details (amount, wallet address)
  3. Agent pays in USDC on Base blockchain
  4. Gateway verifies payment on-chain
  5. Gateway forwards request to creator's API
- **Benefits**:
  - Micropayments (as low as $0.01 per request)
  - Instant settlement
  - No chargebacks
  - Global accessibility

### Locus Wallet Integration
- **What it is**: Programmable wallet infrastructure for spend controls
- **How we'll use it**:
  - Budget limits for agents
  - Spending analytics
  - Multi-signature approvals for teams
  - Automatic top-ups

### Stripe Connect
- **What it is**: Payments platform for marketplaces
- **How we'll use it**: Creator payouts in fiat currency
- **Features**:
  - Convert USDC earnings to USD
  - Bank account transfers
  - Tax documentation (1099s)
  - International payouts

## Development Tools

### Type Safety
- **TypeScript**: End-to-end type safety from database to frontend
- **Shared Types**: Types exported from `shared/schema.ts` used across stack
- **Zod**: Runtime validation matching TypeScript types

### Code Quality
- **Linting**: Built-in TypeScript compiler checks
- **Formatting**: Automatic via Replit
- **Git**: Version control integrated into Replit

### Replit-Specific Tools
- **Cartographer**: Code navigation and search
- **Runtime Error Modal**: Development error overlay
- **Dev Banner**: Environment indicator

## Architecture Decisions

### Monorepo Structure
- Single repository contains both client and server
- Shared types in `shared/` directory
- Vite serves both frontend and backend on same port in dev

### API Design
- RESTful endpoints under `/api` namespace
- JSON request/response format
- Zod validation on all inputs
- Consistent error handling

### Security
- HTTPS-only cookies
- CSRF protection via same-site cookies
- SQL injection prevention via parameterized queries (Drizzle)
- XSS protection via React's automatic escaping
- API key rotation supported
- Session expiration and renewal

## Performance Optimizations

### Frontend
- Code splitting via Vite
- React Query caching and deduplication
- Optimistic updates for better UX
- Lazy loading of routes

### Backend
- Connection pooling (Neon serverless)
- Database indexing on foreign keys
- Efficient query patterns (avoid N+1)
- Session store in PostgreSQL (no memory leaks)

## Environment Variables

### Required for Development
- `DATABASE_URL`: PostgreSQL connection string (auto-provisioned by Replit)
- `SESSION_SECRET`: Session encryption key (auto-provisioned by Replit)
- `REPL_ID`: Replit project identifier (automatic)

### Required for Production
- `ISSUER_URL`: Replit OIDC issuer (defaults to https://replit.com/oidc)
- All development variables above

### Optional
- `FIREBASE_SERVICE_ACCOUNT`: For Firestore fallback (not currently used)

## Deployment Flow

1. **Development**: 
   - Run `npm run dev`
   - Express + Vite dev server on port 5000
   - Hot module replacement for instant feedback

2. **Database Migrations**:
   - Update `shared/schema.ts`
   - Run `npm run db:push`
   - Schema changes deployed automatically

3. **Production**:
   - Click "Publish" in Replit
   - Automatic build optimization
   - Environment variable separation
   - Production database isolation
   - Custom domain configuration (optional)

## Hackathon Highlights

### Built Entirely on Replit
- Zero external hosting required
- No manual infrastructure setup
- Automatic scaling and reliability
- Built-in database and authentication

### Rapid Development
- From idea to working prototype in hours
- Type-safe full-stack development
- Production-ready deployment in one click
- Real-time collaboration support

### Production-Quality
- Enterprise-grade database (Neon/PostgreSQL)
- Secure authentication (OIDC standard)
- Professional UI (shadcn/ui)
- Scalable architecture
