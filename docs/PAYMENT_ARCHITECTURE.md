# iGuard Payment Architecture (x402 Protocol)

## Overview

iGuard implements the x402 payment protocol for HTTP-based micropayments using cryptocurrency. This allows creators to charge agents per API request with instant settlement on the Base blockchain.

## What is x402?

The x402 protocol extends HTTP's `402 Payment Required` status code (historically unused) to enable pay-per-use APIs.

### Traditional HTTP Flow
```
Client → GET /api/data → Server
       ← 200 OK + Data ←
```

### x402 Flow
```
Agent → GET /api/data → Gateway → Check payment
       ← 402 Payment Required ←
       
Agent → Pay 0.05 USDC on-chain
       
Agent → GET /api/data (with proof) → Gateway → Verify payment
                                              → Forward to Creator API
       ← 200 OK + Data ←
```

## Architecture Components

### 1. iGuard Gateway (Proxy)
**Role**: Intermediary between agents and creator APIs

**Responsibilities**:
- Intercept all API requests
- Check for payment proof
- Return 402 if payment needed
- Verify on-chain payment
- Forward authorized requests to creator's API
- Log all access for analytics

**Implementation** (Planned Phase 2):
```typescript
// server/gateway.ts
app.all('/gateway/:dataSourceId/*', async (req, res) => {
  // 1. Get data source and pricing
  const dataSource = await storage.getDataSource(req.params.dataSourceId);
  const priceUSDC = parseFloat(dataSource.pricePerRequest);
  
  // 2. Check for payment proof in headers
  const paymentProof = req.headers['x-payment-proof'];
  
  if (!paymentProof) {
    // Return 402 with payment details
    return res.status(402).json({
      error: 'Payment Required',
      amount: priceUSDC,
      currency: 'USDC',
      recipient: dataSource.walletAddress,
      chain: 'base',
      requestId: generateRequestId()
    });
  }
  
  // 3. Verify payment on-chain
  const isValid = await verifyPayment(paymentProof, priceUSDC);
  if (!isValid) {
    return res.status(402).json({ error: 'Invalid payment' });
  }
  
  // 4. Forward to creator's API
  const response = await fetch(dataSource.url + req.params[0], {
    method: req.method,
    headers: filterHeaders(req.headers),
    body: req.body
  });
  
  // 5. Log the access
  await storage.createAccessLog({
    agentId: req.user.agentId,
    dataSourceId: dataSource.id,
    path: req.params[0],
    status: 'success',
    amount: priceUSDC.toString()
  });
  
  // 6. Return creator's response
  return res.status(response.status).json(await response.json());
});
```

### 2. Coinbase CDP Integration
**What**: Cryptocurrency payment infrastructure on Base L2 blockchain

**Why Base**:
- Low transaction fees ($0.001-0.01 per transaction)
- Fast confirmation (2-second blocks)
- Ethereum compatibility
- USDC native support
- Backed by Coinbase

**Smart Contract Flow**:
```solidity
// Simplified payment verification
contract PaymentGateway {
    mapping(bytes32 => bool) public processedPayments;
    
    function verifyPayment(
        address sender,
        address recipient,
        uint256 amount,
        bytes32 requestId,
        bytes memory signature
    ) public view returns (bool) {
        // 1. Check signature validity
        // 2. Verify USDC transfer on-chain
        // 3. Confirm requestId not reused
        // 4. Return true if all checks pass
    }
}
```

### 3. Agent SDK (Client Library)
**Purpose**: Simplify payment flow for API consumers

**Example Usage**:
```typescript
import { IGuardClient } from '@iguard/sdk';

const client = new IGuardClient({
  apiKey: 'sk_live_...',
  walletPrivateKey: process.env.WALLET_KEY,
  maxSpendPerDay: 100 // USDC
});

// Automatic payment handling
const data = await client.get(
  'https://gateway.iguard.dev/ds_abc123/premium-data'
);

// SDK handles:
// 1. Receives 402 response
// 2. Checks budget (Locus integration)
// 3. Pays required amount in USDC
// 4. Retries request with payment proof
// 5. Returns data to caller
```

### 4. Locus Wallet Integration
**What**: Programmable wallet infrastructure for spend controls

**Features**:
- **Budget Limits**: Daily/monthly USDC caps
- **Approval Rules**: Multi-sig for large payments
- **Analytics**: Spending breakdown by data source
- **Auto-top-up**: Maintain minimum balance
- **Team Wallets**: Shared budgets for organizations

**Integration**:
```typescript
// Check budget before payment
const canPay = await locusClient.checkBudget({
  agentId: agent.id,
  amount: 0.05,
  category: 'api-requests'
});

if (!canPay) {
  throw new Error('Budget exceeded for today');
}

// Record spend
await locusClient.recordSpend({
  agentId: agent.id,
  amount: 0.05,
  recipient: creator.walletAddress,
  dataSourceId: dataSource.id
});
```

## Payment Flow Sequence

### Step 1: Agent Makes Request
```
Agent → GET /gateway/ds_abc123/premium-data
        Headers: { Authorization: 'Bearer sk_live_...' }
```

### Step 2: Gateway Returns 402
```
← 402 Payment Required
  {
    "error": "Payment Required",
    "amount": 0.05,
    "currency": "USDC",
    "recipient": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "chain": "base",
    "requestId": "req_7f8g9h0i1j"
  }
```

### Step 3: Agent Pays On-Chain
```typescript
// Agent's SDK automatically:
const tx = await usdcContract.transfer(
  recipient: "0x742d35Cc...",
  amount: 50000 // 0.05 USDC (6 decimals)
);

const receipt = await tx.wait();
```

### Step 4: Agent Retries with Proof
```
Agent → GET /gateway/ds_abc123/premium-data
        Headers: {
          Authorization: 'Bearer sk_live_...',
          X-Payment-Proof: '{"tx":"0x...","requestId":"req_..."}'
        }
```

### Step 5: Gateway Verifies Payment
```typescript
// Check on-chain transaction
const tx = await baseProvider.getTransaction(proof.tx);

// Verify:
// - Transaction confirmed
// - Correct amount (0.05 USDC)
// - Correct recipient
// - RequestId matches
// - Not previously used
```

### Step 6: Forward to Creator API
```
Gateway → GET https://api.creator.com/premium-data
← 200 OK + Data
```

### Step 7: Return to Agent
```
← 200 OK
  {
    "data": [...],
    "cost": 0.05,
    "balance": 9.95
  }
```

## Security Considerations

### Replay Attack Prevention
- Each `requestId` can only be used once
- Stored in database after successful payment
- Expires after 5 minutes if unused

### Payment Verification
- All transactions verified on-chain (no trust required)
- Signature verification prevents tampering
- Amount must match exactly (no underpayment)

### Rate Limiting
- Per-agent rate limits stored in database
- Creator-defined limits per data source
- 429 Too Many Requests if exceeded

### API Key Security
- Keys hashed with bcrypt before storage
- Rotatable without losing access
- Revocable immediately

## Economic Model

### Pricing Structure
- **Creator Sets Price**: $0.01 - $10 per request
- **Platform Fee**: 2% of each transaction
- **Network Fee**: ~$0.001 (Base blockchain)

### Example Economics
```
Creator charges: $0.50 per request
Agent pays:      $0.50 in USDC
Network fee:     $0.001
Platform fee:    $0.01 (2%)
Creator nets:    $0.489

Agent makes 100 requests/day:
Daily cost:  $50
Monthly:     $1,500
Creator earns: $1,467/month from this agent
```

### Advantages Over Fiat
- **Instant Settlement**: No 2-7 day wait
- **Global**: No cross-border fees
- **Micro-transactions**: Viable at $0.01 (impossible with Stripe)
- **No Chargebacks**: Irreversible blockchain transactions
- **Programmable**: Smart contract automation

## Monitoring & Analytics

### Creator Dashboard Metrics
- Total earnings (USDC + USD equivalent)
- Requests per data source
- Top paying agents
- Revenue over time (charts)
- Failed requests analysis

### Agent Dashboard Metrics
- Total spend this month
- Cost per data source
- Request success rate
- Budget remaining
- Spend forecast

## Future Enhancements

### Subscription Model
- Monthly flat-rate access
- Unused credits roll over
- Volume discounts

### Batch Payments
- Pay for 100 requests upfront
- Reduced gas costs
- Faster repeated access

### Multi-Currency Support
- ETH, USDT, DAI
- Automatic conversion
- Creator chooses preferred currency

### Off-Chain Payments
- State channels for high-frequency access
- Settle batch on-chain periodically
- Near-zero cost per request

## References

- [x402 Protocol Specification](https://github.com/x402-protocol/spec)
- [Base Blockchain Docs](https://docs.base.org)
- [Coinbase CDP Docs](https://docs.cdp.coinbase.com)
- [USDC on Base](https://www.circle.com/en/usdc-on-base)
- [Locus Wallet](https://locus.xyz/docs)
