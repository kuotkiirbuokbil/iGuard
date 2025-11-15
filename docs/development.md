## iGuard Development Plan (for AI Engineer)

This document breaks the build into clear **phases** so an AI engineer (or agentic assistant) can execute step‑by‑step.  
Each phase has:

- **Goal** – what we’re trying to accomplish.
- **Key tasks** – concrete steps.
- **Integration focus** – which external systems matter.
- **Completion criteria** – how we know we’re done.

The plan assumes:

- Frontend: **React + Vite + TypeScript** on Replit.
- Backend: **Node.js + Express**.
- Database: **PostgreSQL** (Replit managed).
- Payments: **Coinbase CDP + x402 on Base**.
- Spend control: **Locus**.
- Identity: **Anthropic Agent SDK**.
- Hosting: **Replit** (single monorepo with frontend + backend).

---

### Phase 0 – Project Bootstrap & Baseline

**Goal:** Have a running Replit project with a basic web UI and an Express backend, plus PostgreSQL database wired up.  
This is the foundation for all later integration work.

**Key tasks:**

1. **Create Replit project**
   - Start from a Node.js template (or create Node.js server and add React frontend).
   - Set Node version to **18+**.
2. **Set up PostgreSQL Database**
   - Provision Replit PostgreSQL database (automatic via `DATABASE_URL` environment variable).
   - Implement database client using Drizzle ORM (e.g., `server/db.ts`) that exposes helpers like:
     - `getCreatorById(id)`
     - `createDataSource(...)`
     - `logTransaction(...)`
3. **Define initial schema**
   - `creators`, `agents`, `data_sources`, `access_logs` tables as described in `shared/schema.ts`.
   - Use Drizzle migrations (`npm run db:push`) to create tables.
   - Create a simple seed script or manual inserts for one test creator and one agent.
4. **Basic routing**
   - Backend: create a health endpoint like `GET /api/health` returning `{ ok: true }`.
   - Frontend: basic `index` page that calls `/api/health` and renders the result.

**Completion criteria:**

- Replit app runs with:
  - Frontend served successfully.
  - Backend reachable via `/api/health`.
- PostgreSQL database is working (you can write and read a test record).

**Example:**  
Engineer can run the app and see "iGuard bootstrapped" and confirm a test record in PostgreSQL via console or logs.

---

### Phase 1 – Core Domain Models & Simple UIs

**Goal:** Represent creators, agents, and data sources in PostgreSQL and expose minimal UIs to manipulate them.  
This phase has *no payments yet*—just structure.

**Key tasks:**

1. **Creator Dashboard v0**
   - Route: `/creator` (React page component).
   - Features:
     - Hard‑coded "demo creator" (no full auth yet).
     - Form: "Connect Data Source"
       - Fields: `url`, `price_per_request` (USDC), optional `rate_limit`.
     - On submit:
       - Create a record in `data_sources` table linked to the demo creator.
2. **Agent Console v0**
   - Route: `/agent` (React page component).
   - Features:
     - Hard‑coded “demo agent”.
     - Button: "Generate API Key"
       - Creates a random token and stores it in `agents.api_key` column.
     - Display:
       - Agent ID.
       - API key with copy‑to‑clipboard.
3. **Access Logs Skeleton**
   - Backend function `logAccess({ agentId, dataSourceId, status })` that writes to `access_logs` table.
   - Creator dashboard page shows a simple list of access logs for the demo creator.

**Completion criteria:**

- You can:
  - Add a data source as the demo creator and see it persisted.
  - Generate an API key for the demo agent.
  - See at least some placeholder access logs rendering in the UI (even if manually inserted).

**Example:**  
Demo flow: add `https://example.com` with price `0.05`; refresh and see it in a “Your Data Sources” table.

---

### Phase 2 – Gateway Endpoint (Mocked Payments & Identity)

**Goal:** Implement the **iGuard gateway** (`/api/gateway/fetch`) with full control flow but using mocked identity and payment checks.  
This allows end‑to‑end integration before attaching real Coinbase/Locus/Anthropic.

**Key tasks:**

1. **Implement `/api/gateway/fetch`**
   - Method: `POST`.
   - Inputs:
     - Headers: `X-Agent-Key`, optional `X-Anthropic-Signature`.
     - Body: `{ data_source_id, path, purpose }`.
   - Steps (mocked):
     1. Look up the agent by `X-Agent-Key` (from `agents` collection).
     2. Look up data source by `data_source_id`.
     3. **Mock identity check:**
        - If `X-Anthropic-Signature` is missing, return `401`.
        - Otherwise, accept the signature without calling Anthropic yet.
     4. **Mock Locus spend check:**
        - Pretend each request costs `data_source.price_per_request`.
        - Deduct from a local `mock_spend_remaining` field on the agent in PostgreSQL.
        - If remaining balance < price, return `403`.
     5. **Mock payment:**
        - Do **not** call Coinbase yet; simply simulate a payment record.
     6. **Proxy fetch:**
        - (For now) instead of real network fetch, return dummy content like `"Mock content for path /..."`.
     7. **Log transaction:**
        - Write to `access_logs` table with status `success`.
2. **Update Creator Dashboard**
   - Show live (or periodically refreshed) access logs.
   - Each log row includes:
     - Time.
     - Agent ID.
     - URL/path.
     - “Mock paid” amount.
3. **Update Agent Console**
   - Add a “Test Gateway” form:
     - `data_source_id`, `path`, `purpose`.
   - Call `/api/gateway/fetch` and show response JSON inline.

**Completion criteria:**

- You can run a full mocked flow:
  - Create data source → generate agent key → call `/api/gateway/fetch` → see logs update.
- You get meaningful `401` / `403` errors when headers or mock spend are invalid.

**Example:**  
Engineer calls the endpoint with `curl` or from the Agent Console and sees:

- First: `200` with `"success": true` and mock data.
- Later (after many calls): `403` when mock spend is exceeded.

---

### Phase 3 – Coinbase CDP + x402 Integration

**Goal:** Replace mocked payment logic with **real or semi‑real** Coinbase CDP and x402 flows on Base.  
The identity and Locus checks can still be partly mocked if needed, but x402 should be visible in the HTTP behavior.

**Key tasks:**

1. **Set up Coinbase CDP**
   - Create a CDP project and obtain API keys.
   - Add credentials to Replit as secrets.
   - Use Coinbase’s Node SDK to:
     - Create a wallet for:
       - The **platform** (iGuard).
       - The **demo agent** (or reuse one).
2. **Define payment helper**
   - Function `chargeAgentForRequest({ agentWalletId, platformWalletId, amount })` that:
     - Creates a USDC transfer on Base from agent to platform.
     - Returns a transaction hash or payment ID.
3. **Implement x402 behavior**
   - Change `/api/gateway/fetch` logic:
     - On first call **without** `X-PAYMENT`, return:
       - Status `402`.
       - Body describing:
         - `amount_due` (USDC).
         - Payment instructions (e.g., what to sign / where to send).
     - On retry **with** `X-PAYMENT`:
       - Validate that the payment has been executed via Coinbase (or simulate in dev).
       - If valid, continue to data fetch and log transaction with `tx_hash`.
4. **Frontend awareness of 402**
   - Agent Console:
     - When a 402 is received, show a clear message and allow a “Pay & Retry” button.
     - For the hackathon, this can:
       - Call a backend helper that performs the Coinbase transfer and then retries internally.
5. **Transaction logging**
   - Store `tx_hash` and a `base_explorer_url` in `transactions`.
   - Display this in the creator dashboard (clickable link to Base explorer).

**Completion criteria:**

- At least one **end‑to‑end** flow where:
  - First request returns `402`.
  - After invoking a payment helper, the next call:
    - Completes payment via CDP.
    - Returns `200` with data.
  - Transaction log shows a real or realistic `tx_hash`.

**Example:**  
Agent Console shows:

- Step 1: “402 – payment required: 0.05 USDC”.  
- Step 2: After clicking “Pay & Retry”, it shows “200 – success” and includes a Base transaction hash.

---

### Phase 4 – Locus Spend Controls Integration

**Goal:** Replace the mock spend logic with real **Locus** wallet and policy checks so spend limits are enforced externally.

**Key tasks:**

1. **Integrate Locus SDK/API**
   - Add Locus credentials to Replit as secrets.
   - Create a helper library (e.g., `locusClient.ts`) that can:
     - Create a wallet for an agent.
     - Set a daily or total spend limit for that wallet.
     - Query remaining budget for a wallet.
2. **Attach Locus wallet IDs to agents**
   - When creating or seeding an agent, request a Locus wallet and store its ID in `agents.locus_wallet_id` column.
3. **Replace spend check in gateway**
   - In `/api/gateway/fetch`, before any x402/CB payment:
     - Call Locus to check:
       - Whether the agent has enough remaining budget for `price_per_request`.
     - If not, return `403 Forbidden` with a clear “spend limit exceeded” reason.
   - Optionally, record each authorized spend with Locus so its internal ledger stays consistent.
4. **UI updates**
   - Agent Console:
     - Show Locus wallet ID.
     - Show current spend limit and remaining budget.
   - Creator Dashboard:
     - Optionally show which requests were blocked due to spend limits (status `forbidden_spend_limit`).

**Completion criteria:**

- Locus is now part of the decision flow:
  - If Locus says “no budget”, the request is blocked **before** calling Coinbase.
- You can simulate hitting the limit and observe a 403 from iGuard.

**Example:**  
Set agent daily limit to `0.20 USDC`, price per request `0.05`. After four successful requests, the fifth should return `403` due to Locus policy.

---

### Phase 5 – Anthropic Agent SDK Integration

**Goal:** Replace the mocked identity signature with a real **Anthropic Agent SDK** flow and at least one demo agent that uses iGuard as a tool.

**Key tasks:**

1. **Set up Anthropic Agent SDK**
   - Add Anthropic API key to Replit.
   - Create a small service that wraps an Agent SDK instance (e.g., `anthropicAgent.ts`).
2. **Define a “fetchPaidData” skill**
   - The skill should:
     - Accept `data_source_id`, `path`, and `purpose`.
     - Sign a request or attach a token in a header (depending on SDK capabilities).
     - Call `/api/gateway/fetch` with `X-Agent-Key` and `X-Anthropic-Signature`.
     - Handle 402 responses by invoking the payment helper (from Phase 3) and retrying.
3. **Server‑side signature verification**
   - Adjust `/api/gateway/fetch`:
     - Instead of simply checking header presence, **verify** the payload using Anthropic’s recommended method (or a strongly documented mock if full verification is not feasible in hackathon time).
4. **Demo script integration**
   - Create a Node script or endpoint like `/api/demo/run-agent` that:
     - Instantiates the Anthropic agent.
     - Runs a prompt such as:
       - “Fetch and summarize the latest article from creator X using iGuard.”
     - Uses the `fetchPaidData` skill under the hood.

**Completion criteria:**

- You can trigger a single Anthropic agent run that:
  - Calls iGuard via `/api/gateway/fetch`.
  - Handles 402 and payments.
  - Returns content and summary to the console or UI.
- iGuard’s backend performs at least a basic signature/identity check rather than a pure mock.

**Example:**  
Running `node scripts/demoAgent.js` prints a natural‑language summary and logs a transaction in PostgreSQL with a valid Anthropic‑backed access.

---

### Phase 6 – Demo Experience, Deployment & Polishing

**Goal:** Make the project **judge‑ready**: smooth demo page, reliable deployment on Replit, and clear error handling.

**Key tasks:**

1. **Demo Page**
   - Build the split‑screen page described in `iGuard_combined_ideas.md`:
     - Left: embedded Creator Dashboard.
     - Right: Agent Console or live Anthropic agent output.
     - Center: “START DEMO” button that triggers:
       - The Anthropic agent run.
       - Live updates to both sides.
2. **Error surfacing**
   - Show friendly messages for:
     - 401 (identity issues).
     - 402 (payment required).
     - 403 (Locus spend limit).
     - Network or API errors.
3. **Replit deployment**
   - Ensure the Replit project:
     - Starts reliably from the “Run” button.
     - Exposes the correct port.
     - Uses environment variables correctly (no secrets in repo).
4. **Smoke tests**
   - Run through:
     - Fresh agent → Locus limit check → Coinbase payment → content fetch → log.
   - Fix any race conditions or UI glitches observed.

**Completion criteria:**

- Judges can watch a **single, smooth flow** on one URL (your Replit deployment) with:
  - Clear narrative.
  - No manual CLI steps mid‑demo.
  - All integrations at least partially live or convincingly simulated.

**Example:**  
An AI engineer (or agent) starting cold can open `development.md`, implement Phase 0 → Phase 6 in order, and end up with a complete demo flow featuring Replit infrastructure, Coinbase payments, Locus spend controls, and Anthropic agent integration without guessing the priorities or integration order.


