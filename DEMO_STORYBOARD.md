# iGuard Demo Visual Storyboard

## Screen Flow & Transitions

---

## SCENE 1: Opening (0:00 - 0:20)

### Screen: Landing Page or Creator Dashboard
**Visual:**
```
┌─────────────────────────────────────────┐
│  iGuard - Data Access Gateway          │
│                                         │
│  [Creator Dashboard] [Agent Console]    │
│                                         │
│  Stats Cards:                           │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│  │ $X   │ │  X   │ │  X   │ │  X%  │   │
│  │Earn  │ │Reqs  │ │Srcs  │ │Rate  │   │
│  └──────┘ └──────┘ └──────┘ └──────┘   │
└─────────────────────────────────────────┘
```

**Talking Point:**
> "What if AI agents could pay for data access in real-time? That's iGuard - a payment gateway enabling micropayments for API access using cryptocurrency."

**Transition:** Navigate to Creator Dashboard

---

## SCENE 2: Creator Dashboard (0:20 - 0:50)

### Screen 2A: Stats Overview
**Visual:**
```
┌─────────────────────────────────────────┐
│  Creator Dashboard                       │
│  Manage your data sources and earnings   │
│                                         │
│  ┌──────────┐ ┌──────────┐              │
│  │ $1,234.56│ │   1,234  │              │
│  │ Earnings │ │ Requests │              │
│  └──────────┘ └──────────┘              │
│  ┌──────────┐ ┌──────────┐              │
│  │    5     │ │   98%    │              │
│  │  Sources │ │  Success │              │
│  └──────────┘ └──────────┘              │
└─────────────────────────────────────────┘
```

**Talking Point:**
> "Here's the Creator Dashboard. Creators can monitor earnings in real-time, track total requests, and see their active data sources."

**Action:** Scroll down or point to data sources

---

### Screen 2B: Data Sources Table
**Visual:**
```
┌─────────────────────────────────────────┐
│  Your Data Sources                       │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ URL              │ Price │ Status │ │
│  ├───────────────────────────────────┤ │
│  │ api.example.com  │ $0.05 │ Active │ │
│  │ data.xyz.com     │ $0.10 │ Active │ │
│  │ premium.io       │ $0.25 │ Active │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Talking Point:**
> "Creators can add data sources with custom pricing per request. Each source can have different rates."

**Action:** Scroll to access logs

---

### Screen 2C: Access Logs with Transactions
**Visual:**
```
┌─────────────────────────────────────────┐
│  Access Logs                            │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Time    │ Agent │ Amount │ Status │ │
│  ├───────────────────────────────────┤ │
│  │ 10:23   │ A123  │ $0.05  │ ✅     │ │
│  │         │       │        │ 🔗 tx  │ │
│  ├───────────────────────────────────┤ │
│  │ 10:22   │ B456  │ $0.10  │ ✅     │ │
│  │         │       │        │ 🔗 tx  │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Talking Point:**
> "Every payment is recorded on-chain. See these transaction links? Each one represents a real USDC transfer on the Base blockchain."

**Action:** Click transaction link

---

### Screen 2D: BaseScan Transaction View
**Visual:**
```
┌─────────────────────────────────────────┐
│  BaseScan - Transaction Details          │
│                                         │
│  Transaction Hash: 0x1234...            │
│  Status: ✅ Success                     │
│  From: 0xAgent...                       │
│  To: 0xCreator...                       │
│  Amount: 0.05 USDC                      │
│  Timestamp: 2 seconds ago                │
│                                         │
│  [View on BaseScan]                     │
└─────────────────────────────────────────┘
```

**Talking Point:**
> "Click any transaction to see it on BaseScan - the Base blockchain explorer. This is real money, settled instantly with near-zero fees."

**Transition:** Navigate to Agent Console

---

## SCENE 3: Agent Console (0:50 - 1:20)

### Screen 3A: Agent Details
**Visual:**
```
┌─────────────────────────────────────────┐
│  Agent Console                           │
│  Manage credentials and test gateway     │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Agent Details                      │ │
│  │                                    │ │
│  │ Agent ID: agent_abc123            │ │
│  │                                    │ │
│  │ API Key: sk_live_...              │ │
│  │ [Copy] [Regenerate]                │ │
│  │                                    │ │
│  │ Locus Wallet: 0x6A27...           │ │
│  │ Balance: 100.50 USDC               │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Talking Point:**
> "Now let's see the Agent Console. AI agents can generate API keys for authenticated access and manage their Locus wallet for payments."

**Action:** Scroll to Test Gateway card

---

### Screen 3B: Test Gateway
**Visual:**
```
┌─────────────────────────────────────────┐
│  Test Gateway                           │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Data Source: [Select ▼]          │ │
│  │ Path: /api/data                   │ │
│  │ Purpose: Fetch user data          │ │
│  │                                    │ │
│  │ [Test Gateway]                    │ │
│  │                                    │ │
│  │ Response:                          │ │
│  │ {                                  │ │
│  │   "status": "success",             │ │
│  │   "data": {...},                   │ │
│  │   "txHash": "0x..."                │ │
│  │ }                                  │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Talking Point:**
> "Agents can test the gateway directly. When they request data, the system handles the entire payment flow automatically."

**Action:** Show access logs

---

### Screen 3C: Agent Access Logs
**Visual:**
```
┌─────────────────────────────────────────┐
│  Your Access Logs                       │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Time    │ Source │ Amount │ Status│ │
│  ├───────────────────────────────────┤ │
│  │ 10:25   │ DS_001 │ $0.05  │ ✅    │ │
│  │ 10:24   │ DS_002 │ $0.10  │ ✅    │ │
│  │ 10:23   │ DS_001 │ $0.05  │ ✅    │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Total Spent: $0.20 USDC                │
│  Remaining Budget: $99.80 USDC           │
└─────────────────────────────────────────┘
```

**Talking Point:**
> "Agents can monitor all their requests and spending. The Locus wallet enforces budget limits to prevent overspending."

**Transition:** Technical highlights

---

## SCENE 4: Technical Highlights (1:20 - 1:50)

### Screen 4A: Code or Architecture Diagram
**Visual Options:**

**Option 1: Code Snippet**
```
┌─────────────────────────────────────────┐
│  server/x402.ts                         │
│                                         │
│  // x402 Payment Middleware             │
│  app.use('/api', x402Middleware({      │
│    walletAddress: '0x...',              │
│    network: 'base',                    │
│    pricing: {...}                       │
│  }));                                   │
│                                         │
│  // Returns 402 with payment details    │
│  // Verifies on-chain transactions      │
└─────────────────────────────────────────┘
```

**Option 2: Architecture Diagram**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Agent   │────▶│  iGuard  │────▶│ Creator  │
│          │     │ Gateway  │     │ API   │
└──────────┘     └──────────┘     └──────────┘
     │                │                 │
     │                │                 │
     ▼                ▼                 ▼
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Locus   │     │  x402   │     │  Base    │
│  Wallet  │     │ Protocol│     │ Blockchain│
└──────────┘     └──────────┘     └──────────┘
```

**Talking Point:**
> "Built entirely on Replit with Replit Auth and PostgreSQL. Integrated with Coinbase x402 for payments and Locus for spend controls."

---

## SCENE 5: Closing (1:50 - 2:00)

### Screen 5A: Final Stats or Landing
**Visual:**
```
┌─────────────────────────────────────────┐
│  iGuard - The Future of API Payments    │
│                                         │
│  ✅ Micropayments as low as $0.01       │
│  ✅ Instant USDC settlement             │
│  ✅ Autonomous AI agents                 │
│  ✅ New revenue streams                 │
│                                         │
│  Built on Replit                        │
│  Powered by Coinbase x402               │
│  Secured with Locus                     │
└─────────────────────────────────────────┘
```

**Talking Point:**
> "This is the future of API monetization - where AI agents and data creators transact seamlessly on-chain. Built on Replit, powered by Coinbase x402, and secured with Locus wallets. Thank you!"

---

## KEY VISUAL ELEMENTS TO HIGHLIGHT

### 1. Stats Cards
- **Color:** Primary color for numbers
- **Icons:** Dollar sign, activity, database, trending
- **Animation:** Subtle hover effects

### 2. Transaction Links
- **Style:** Badge or button with BaseScan icon
- **Color:** Link color (blue)
- **Action:** Opens in new tab

### 3. Data Tables
- **Style:** Clean, striped rows
- **Highlight:** Hover on rows
- **Icons:** Status indicators (✅, ❌)

### 4. Forms
- **Style:** Clean inputs with labels
- **Validation:** Real-time feedback
- **Buttons:** Primary color

### 5. Code Snippets (if shown)
- **Style:** Monospace font
- **Syntax:** Highlighted
- **Focus:** Key lines highlighted

---

## TRANSITION NOTES

### Smooth Transitions:
1. **Landing → Creator:** Click navigation link
2. **Creator → Agent:** Click "Agent Console" in nav
3. **Agent → Technical:** Switch to code view or diagram
4. **Technical → Closing:** Fade to final screen

### Timing:
- **Screen changes:** 1-2 seconds
- **Scrolls:** Smooth, not rushed
- **Clicks:** Deliberate, not frantic
- **Pauses:** 1-2 seconds after key points

---

## BACKUP VISUALS

If live demo fails, have ready:
1. **Screenshots** of each screen
2. **Video** of payment flow
3. **BaseScan** transaction page
4. **Architecture diagram**
5. **Code snippets** in editor

---

## AUDIO CUES (Optional)

- **0:00:** "Let me show you..."
- **0:20:** "Here's how it works..."
- **0:50:** "Now let's see..."
- **1:20:** "Under the hood..."
- **1:50:** "In summary..."

---

## FINAL CHECKLIST

- [ ] All screens tested
- [ ] Navigation works smoothly
- [ ] Transaction links functional
- [ ] Stats show real data
- [ ] Timing practiced
- [ ] Backup visuals ready
- [ ] Audio clear (if recording)

---

**Remember: Show, don't just tell! Point to specific UI elements and click through real workflows.**

