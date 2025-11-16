# iGuard - Hackathon Submission Content

## Short Paragraph: What is iGuard?

iGuard is a payment gateway platform that enables AI agents and developers to pay for API access using cryptocurrency micropayments. Built on the x402 protocol (HTTP 402 Payment Required), iGuard allows data creators to monetize their APIs with per-request pricing while agents can autonomously purchase data access in real-time. The platform integrates Coinbase's x402 protocol for HTTP-native payments, Base blockchain for instant USDC settlements with near-zero fees, and Locus wallets for programmable spend controls. Creators can set custom prices per API request, monitor earnings in real-time, and track all transactions on-chain, while agents can generate API keys, test gateway access, and manage spending budgets automatically. Every payment is verified on-chain and viewable on BaseScan, ensuring transparency and instant settlement without the high fees or minimums of traditional payment systems.

---

## Additional Notes for Judges

### Tech Stack & Approach

**Platform:** Built entirely on Replit, leveraging Replit Auth (OIDC) for zero-config authentication, Replit PostgreSQL (Neon-backed) for data persistence, and one-click deployment to production. This allowed rapid development from concept to working prototype in hours.

**Frontend:** React 18 + TypeScript with Vite for fast builds, shadcn/ui components for a professional Stripe-inspired dashboard design, and TanStack Query for efficient server state management. The UI emphasizes clarity and data density.

**Backend:** Node.js + Express with TypeScript, Drizzle ORM for type-safe database queries, and PostgreSQL session management. All API endpoints are validated with Zod schemas for runtime type safety.

**Payment Integration:** Fully integrated Coinbase x402 protocol middleware that returns HTTP 402 status codes with payment details, verifies on-chain USDC transactions on Base network, and logs all payments with transaction hashes. The x402 integration enables micropayments as low as $0.01 per request with instant settlement.

**Wallet Integration:** Locus wallet integration on Base mainnet for programmable spend controls, allowing agents to set daily budgets, track spending, and make autonomous payments. All transactions are viewable on BaseScan with direct explorer links in the UI.

**Architecture:** Monorepo structure with shared TypeScript types between frontend and backend, ensuring end-to-end type safety. The gateway acts as a proxy between agents and creator APIs, handling authentication, payment verification, and request forwarding.

### Rationale & Innovation

**Problem Solved:** Traditional payment systems like Stripe have high fees (2.9% + $0.30) and minimums that make micropayments economically unviable. AI agents need autonomous payment systems that work without human intervention. iGuard solves both problems by using blockchain-based micropayments with programmable wallet controls.

**Key Innovation:** The x402 protocol implementation is groundbreaking - it brings HTTP's unused 402 status code to life, enabling pay-per-use APIs that work seamlessly with existing HTTP clients. Combined with Base's low fees and fast confirmations, this makes micropayments viable for the first time.

**Real-World Impact:** Enables new business models where creators can monetize APIs at any price point, agents can autonomously purchase data access, and all transactions are transparent and verifiable on-chain. This opens up opportunities for data marketplaces, AI agent economies, and decentralized API monetization.

**Hackathon Highlights:** From idea to working prototype in hours, with real on-chain transactions, production-ready authentication, and a polished UI. The integration of Replit, Coinbase x402, and Locus demonstrates how modern developer tools can be combined to build innovative fintech solutions rapidly.

