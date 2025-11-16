# iGuard Demo Script (2 Minutes)

## Overview
**Total Time:** 2 minutes  
**Structure:** Problem → Solution → Live Demo → Technical Highlights

---

## SEGMENT 1: Problem & Solution (0:00 - 0:20)

### Opening Hook (0:00 - 0:10)
> "What if AI agents could pay for data access in real-time, just like humans pay for coffee? That's iGuard - a payment gateway that enables micropayments for API access using cryptocurrency."

### The Problem (0:10 - 0:20)
> "Today, creators struggle to monetize their APIs. Traditional payment systems like Stripe have high fees and minimums that make micropayments impossible. Meanwhile, AI agents need seamless, autonomous payment systems to access premium data."

### The Solution (0:20 - 0:30)
> "iGuard solves this with three key innovations:
> 1. **x402 Protocol** - HTTP-native payments using the 402 Payment Required status code
> 2. **Base Blockchain** - Instant USDC settlements with near-zero fees
> 3. **Locus Wallets** - Programmable spend controls for autonomous agents"

---

## SEGMENT 2: Live Demo - Creator Side (0:30 - 0:50)

### Show Creator Dashboard (0:30 - 0:40)
**Action:** Navigate to `/creator` dashboard

**Talking Points:**
> "Let me show you the Creator Dashboard. Here, data creators can:
> - **Add data sources** with custom pricing per request
> - **Monitor earnings** in real-time with USDC payments
> - **Track access logs** showing every API request and payment"

**Visual Highlights:**
- Show the stats cards (Total Earnings, Total Requests, Active Sources)
- Point out the "Add Data Source" form
- Show the data sources table with pricing
- Highlight access logs with transaction hashes

### Show Payment Integration (0:40 - 0:50)
**Action:** Click on an access log entry or show transaction link

**Talking Points:**
> "Every payment is recorded on-chain. See this transaction hash? Click it to view the actual USDC transfer on BaseScan - the Base blockchain explorer. This is real money, settled instantly."

**Visual Highlights:**
- Show transaction link component
- Click to open BaseScan (if possible, or show screenshot)
- Point out the USDC amount and timestamp

---

## SEGMENT 3: Live Demo - Agent Side (0:50 - 1:20)

### Show Agent Console (0:50 - 1:05)
**Action:** Navigate to `/agent` console

**Talking Points:**
> "Now let's see the Agent Console. AI agents can:
> - **Generate API keys** for authenticated access
> - **Test the gateway** to fetch data from creator APIs
> - **Monitor spending** with Locus wallet integration
> - **View transaction history** for all payments made"

**Visual Highlights:**
- Show agent details card with API key
- Show "Generate API Key" button (if not generated)
- Point out the Test Gateway card
- Show access logs from agent perspective

### Demonstrate Payment Flow (1:05 - 1:20)
**Action:** Use Test Gateway card to make a request (if implemented) OR explain the flow

**Talking Points:**
> "When an agent requests data, here's what happens:
> 1. Agent sends request to iGuard gateway
> 2. Gateway returns **402 Payment Required** with amount
> 3. Agent's wallet automatically pays in USDC on Base
> 4. Gateway verifies payment on-chain
> 5. Request is forwarded to creator's API
> 6. Data is returned to the agent"

**Visual Highlights:**
- Show the gateway test interface
- Explain the 402 → payment → 200 flow
- Point out how Locus wallet controls spending limits

---

## SEGMENT 4: Technical Highlights (1:20 - 1:50)

### Replit Integration (1:20 - 1:30)
**Action:** Show code or mention Replit features

**Talking Points:**
> "Built entirely on Replit:
> - **Replit Auth** for OIDC authentication
> - **Replit PostgreSQL** for data persistence
> - **One-click deployment** to production
> - **Built-in development tools** for rapid iteration"

### x402 Protocol (1:30 - 1:40)
**Action:** Show payment middleware or mention Coinbase integration

**Talking Points:**
> "x402 protocol integration:
> - **Coinbase CDP** for payment infrastructure
> - **Base network** for low-cost transactions
> - **HTTP-native** - no special wallets needed
> - **Instant verification** via on-chain checks"

### Locus Wallet (1:40 - 1:50)
**Action:** Show wallet balance or mention Locus features

**Talking Points:**
> "Locus wallet integration:
> - **Programmable spend controls** for agents
> - **Budget limits** to prevent overspending
> - **Autonomous payments** without human intervention
> - **Transaction tracking** on BaseScan"

---

## SEGMENT 5: Impact & Closing (1:50 - 2:00)

### Real-World Impact (1:50 - 1:55)
**Talking Points:**
> "iGuard enables:
> - **Micropayments** as low as $0.01 per request
> - **Global access** with instant settlement
> - **Autonomous AI agents** that can pay for data themselves
> - **New revenue streams** for data creators"

### Call to Action (1:55 - 2:00)
**Talking Points:**
> "This is the future of API monetization - where AI agents and data creators transact seamlessly on-chain. Built on Replit, powered by Coinbase x402, and secured with Locus wallets. Thank you!"

---

## DEMO CHECKLIST

### Before Recording:
- [ ] Test Creator Dashboard - ensure data sources are visible
- [ ] Test Agent Console - ensure API key generation works
- [ ] Verify access logs show transaction hashes
- [ ] Test transaction links open BaseScan correctly
- [ ] Ensure stats cards show real data
- [ ] Have BaseScan explorer ready (or screenshots)
- [ ] Prepare code snippets if showing technical details

### During Demo:
- [ ] Speak clearly and at moderate pace
- [ ] Pause briefly after key points
- [ ] Use cursor/mouse to highlight UI elements
- [ ] Show actual data, not just empty states
- [ ] Click through real workflows
- [ ] Show transaction links and BaseScan integration

### Key Visuals to Capture:
1. Creator Dashboard with stats and data sources
2. Access logs table with transaction hashes
3. Transaction link opening BaseScan
4. Agent Console with API key
5. Stats showing earnings and requests
6. Payment flow (402 → payment → 200)

---

## ALTERNATIVE SHORT VERSION (If Running Long)

### Quick Version (90 seconds):
- **0:00-0:15:** Problem & Solution
- **0:15-0:45:** Creator Dashboard walkthrough
- **0:45-1:05:** Agent Console walkthrough
- **1:05-1:25:** Technical highlights (Replit, x402, Locus)
- **1:25-1:30:** Closing

---

## TALKING POINTS REFERENCE

### Key Phrases to Use:
- "HTTP-native payments"
- "Instant USDC settlements"
- "Autonomous AI agents"
- "Micropayments as low as $0.01"
- "Built entirely on Replit"
- "Powered by Coinbase x402"
- "Secured with Locus wallets"
- "Real-time on-chain verification"
- "Programmable spend controls"

### Numbers to Mention:
- Transaction fees: < $0.01
- Settlement time: 2-3 seconds
- Minimum payment: $0.01
- Platform fee: 2%
- Network: Base (L2 blockchain)

---

## TECHNICAL DEMO FLOW (If Showing Code)

If you want to show code snippets:

1. **Show x402 middleware** (`server/x402.ts`)
   - Point out payment verification
   - Show 402 response logic

2. **Show Locus integration** (`server/locus.ts`)
   - Point out wallet operations
   - Show USDC transfer code

3. **Show Replit Auth** (`server/replitAuth.ts`)
   - Point out OIDC integration
   - Show session management

4. **Show Transaction Component** (`client/src/components/TransactionLink.tsx`)
   - Point out BaseScan integration
   - Show payment metadata extraction

---

## NOTES FOR PRESENTATION

### Tone:
- Professional but enthusiastic
- Technical but accessible
- Confident and clear

### Pacing:
- Don't rush through features
- Pause after key points
- Allow time for visuals to load

### Emphasis:
- Highlight the **innovation** (x402 protocol)
- Emphasize **real-world use** (AI agents paying for data)
- Show **actual transactions** (BaseScan links)
- Demonstrate **seamless UX** (one-click payments)

---

## BACKUP PLAN

If something doesn't work during demo:

1. **If dashboard is slow:** Have screenshots ready
2. **If transaction links fail:** Show BaseScan manually
3. **If API key generation fails:** Use pre-generated key
4. **If access logs are empty:** Use seed data or explain the flow
5. **If payment flow isn't working:** Explain the architecture instead

---

## POST-DEMO TALKING POINTS

If judges ask questions:

### "How does x402 work?"
> "x402 extends HTTP's 402 status code to include payment details. When an agent requests data, the server responds with 402 and payment instructions. The agent pays in USDC, includes proof in headers, and retries. The server verifies on-chain and returns data."

### "Why Base blockchain?"
> "Base offers near-instant confirmations, extremely low fees, and native USDC support. It's perfect for micropayments where traditional payment systems fail."

### "How do Locus wallets help?"
> "Locus provides programmable spend controls. Agents can set daily budgets, require approvals for large payments, and track spending. This prevents runaway costs and enables autonomous operation."

### "What's the business model?"
> "Creators set prices per request. Agents pay in USDC. iGuard takes a 2% platform fee. The rest goes directly to creators with instant settlement - no waiting for payouts."

---

## FINAL CHECKLIST

- [ ] Script reviewed and practiced
- [ ] Demo environment tested
- [ ] Screenshots/backups prepared
- [ ] Transaction links verified
- [ ] Timing practiced (2 minutes)
- [ ] Key talking points memorized
- [ ] Backup plan ready

---

**Good luck with your demo! 🚀**

