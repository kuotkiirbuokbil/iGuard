# x402 Transaction Viewing Guide

This guide explains how to view and track x402 payment transactions in your iGuard application.

## Quick Start

Every successful x402 payment generates a transaction on the blockchain that can be viewed on BaseScan.

### Viewing Transactions

**Where to look:**
1. **Server Console** - Transaction links are logged automatically
2. **API Response Body** - `_payment` object with full transaction details
3. **Response Headers** - Direct URLs in headers
4. **UI Components** - React components for displaying transactions

## Server-Side Logging

When x402 is enabled and a payment is received, the server automatically logs:

```bash
[x402] ✅ Payment received for /api/creator/me/data-sources
[x402] 💰 View transaction: https://sepolia.basescan.org/tx/0x1234567890abcdef...
```

On startup, you'll also see:

```bash
[x402] Payment middleware enabled for wallet: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
[x402] Network: base-sepolia
[x402] View wallet: https://sepolia.basescan.org/address/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
[x402] Protected endpoints: [ ... ]
```

## API Response Format

All paid API responses include transaction metadata:

### Response Body

```json
{
  "id": "creator-123",
  "name": "John Doe",
  "email": "john@example.com",

  "_payment": {
    "transactionHash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    "network": "base-sepolia",
    "explorerUrl": "https://sepolia.basescan.org/tx/0x1234567890abcdef...",
    "walletUrl": "https://sepolia.basescan.org/address/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "viewTransaction": "https://sepolia.basescan.org/tx/0x1234567890abcdef..."
  }
}
```

### Response Headers

```
X-Transaction-Hash: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
X-Transaction-Url: https://sepolia.basescan.org/tx/0x1234567890abcdef...
X-Wallet-Url: https://sepolia.basescan.org/address/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
X-Payment-Response: 0x1234567890abcdef...
```

## Using in React Components

### Basic Usage

```tsx
import { TransactionLink } from "@/components/TransactionLink";

function MyComponent({ data }) {
  return (
    <div>
      {data._payment && (
        <TransactionLink
          transactionHash={data._payment.transactionHash}
          network={data._payment.network}
          variant="badge"
        />
      )}
    </div>
  );
}
```

### All Available Variants

#### 1. Badge (Compact)

```tsx
<TransactionLink
  transactionHash={hash}
  network="base-sepolia"
  variant="badge"
/>
```

**Best for:** Tables, lists, compact displays

**Output:** `[🔗] 0x1234...cdef` (clickable badge)

#### 2. Button

```tsx
<TransactionLink
  transactionHash={hash}
  network="base-sepolia"
  variant="button"
/>
```

**Best for:** Call-to-action, prominent display

**Output:** `[View Transaction]` (full button)

#### 3. Inline

```tsx
<p>
  Transaction: <TransactionLink
    transactionHash={hash}
    network="base-sepolia"
    variant="inline"
  />
</p>
```

**Best for:** Within text, descriptions

**Output:** `0x1234...cdef 🔗` (inline link)

#### 4. Default

```tsx
<TransactionLink
  transactionHash={hash}
  network="base-sepolia"
/>
```

**Best for:** General purpose, code displays

**Output:** `0x1234...cdef [icon]` (code + icon button)

### Complete Payment Info Card

For a comprehensive payment display:

```tsx
import { PaymentInfo, usePaymentMetadata } from "@/components/TransactionLink";

function MyComponent({ data }) {
  const payment = usePaymentMetadata(data);

  return (
    <div>
      {payment && <PaymentInfo payment={payment} />}
    </div>
  );
}
```

This displays:
- Transaction hash with link
- Network badge
- "View Transaction" button
- "View Wallet" button

### In Tables

```tsx
<table>
  <thead>
    <tr>
      <th>Date</th>
      <th>Amount</th>
      <th>Transaction</th>
    </tr>
  </thead>
  <tbody>
    {transactions.map(tx => (
      <tr key={tx.id}>
        <td>{tx.date}</td>
        <td>{tx.amount}</td>
        <td>
          <TransactionLink
            transactionHash={tx.hash}
            network={tx.network}
            variant="badge"
          />
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

### With Toast Notifications

```tsx
import { useToast } from "@/hooks/use-toast";
import { TransactionLink } from "@/components/TransactionLink";

function MyComponent() {
  const { toast } = useToast();

  const handlePayment = async () => {
    const response = await fetch("/api/paid-endpoint");
    const data = await response.json();

    if (data._payment) {
      toast({
        title: "Payment Successful",
        description: (
          <div>
            <p>Transaction:</p>
            <TransactionLink
              transactionHash={data._payment.transactionHash}
              network={data._payment.network}
              variant="inline"
            />
          </div>
        ),
      });
    }
  };

  return <button onClick={handlePayment}>Make Payment</button>;
}
```

## Using with x402 Client

When using the `@coinbase/x402` client library:

```typescript
import { Client } from "@coinbase/x402";

const client = new Client({
  privateKey: process.env.PRIVATE_KEY,
  network: "base-sepolia"
});

const response = await client.get("http://localhost:3000/api/creator/me/data-sources");

// Access transaction info from headers
console.log("Transaction Hash:", response.headers["x-transaction-hash"]);
console.log("View on BaseScan:", response.headers["x-transaction-url"]);

// Or from response body
if (response.data._payment) {
  console.log("Explorer URL:", response.data._payment.explorerUrl);
  console.log("Wallet URL:", response.data._payment.walletUrl);
}
```

## Block Explorer URLs

### Base Sepolia (Testnet)

- **Explorer**: https://sepolia.basescan.org
- **Transaction**: `https://sepolia.basescan.org/tx/{hash}`
- **Address**: `https://sepolia.basescan.org/address/{address}`

### Base Mainnet (Production)

- **Explorer**: https://basescan.org
- **Transaction**: `https://basescan.org/tx/{hash}`
- **Address**: `https://basescan.org/address/{address}`

### Other Networks

The system also supports:
- Ethereum: etherscan.io
- Arbitrum: arbiscan.io
- Optimism: optimistic.etherscan.io
- Polygon: polygonscan.com

Network is automatically detected from the x402 configuration.

## What You Can See on BaseScan

When you click a transaction link, you'll see:

1. **Transaction Status** - Confirmed, pending, or failed
2. **From/To Addresses** - Who paid and who received
3. **Value** - Amount of USDC transferred
4. **Gas Fees** - Transaction cost (usually very low on Base)
5. **Timestamp** - When the transaction occurred
6. **Block Number** - Which block includes this transaction
7. **Transaction Hash** - Unique identifier

## Tracking Multiple Transactions

### Create a Transaction History Component

```tsx
import { TransactionLink } from "@/components/TransactionLink";

interface Transaction {
  id: string;
  hash: string;
  network: string;
  amount: string;
  timestamp: Date;
  endpoint: string;
}

function TransactionHistory({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Payment History</h3>
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-2 text-left">Time</th>
              <th className="p-2 text-left">Endpoint</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Transaction</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id} className="border-b">
                <td className="p-2">{tx.timestamp.toLocaleString()}</td>
                <td className="p-2 font-mono text-xs">{tx.endpoint}</td>
                <td className="p-2">{tx.amount} USDC</td>
                <td className="p-2">
                  <TransactionLink
                    transactionHash={tx.hash}
                    network={tx.network}
                    variant="badge"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### Store Transaction History

You can store transaction hashes in your database for later reference:

```typescript
// In your access logs schema
export const accessLogs = pgTable("access_logs", {
  id: varchar("id").primaryKey(),
  agentId: varchar("agent_id").notNull(),
  dataSourceId: varchar("data_source_id").notNull(),
  path: text("path"),
  status: text("status").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }),
  timestamp: text("timestamp").notNull(),

  // Add x402 transaction tracking
  transactionHash: text("transaction_hash"),
  paymentNetwork: text("payment_network")
});
```

Then log transactions when payments are received:

```typescript
app.use((req, res, next) => {
  res.on("finish", async () => {
    const txHash = res.getHeader("x-transaction-hash");

    if (txHash && req.path.startsWith("/api/")) {
      await storage.createAccessLog({
        agentId: req.user.agentId,
        dataSourceId: req.params.id,
        path: req.path,
        status: "success",
        amount: "0.10",
        transactionHash: txHash as string,
        paymentNetwork: process.env.X402_NETWORK || "base-sepolia"
      });
    }
  });

  next();
});
```

## Troubleshooting

### Transaction link not showing

**Check:**
1. x402 is enabled (`X402_ENABLED=true`)
2. Request actually required payment
3. Payment was successful (check server logs)
4. Response includes `_payment` object

### Wrong explorer URL

**Check:**
1. `X402_NETWORK` matches actual network
2. Using correct network constant (`base` vs `base-sepolia`)

### Can't find transaction on BaseScan

**Possible causes:**
1. Using wrong network (mainnet vs testnet)
2. Transaction still pending (wait a few seconds)
3. Network congestion (rare on Base)

## Examples

See the complete examples at:
- `client/src/components/TransactionLink.tsx` - React components
- `client/src/components/examples/PaymentTransactionExample.tsx` - Usage examples
- `examples/x402-client-example.ts` - Client-side examples

## Summary

Every x402 payment transaction is:
1. **Logged** to server console with BaseScan link
2. **Included** in API response body as `_payment` object
3. **Available** in response headers
4. **Displayable** via React components
5. **Viewable** on BaseScan block explorer

This provides complete transparency and auditability for all payments in your system.
