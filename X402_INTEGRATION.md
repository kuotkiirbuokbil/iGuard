# x402 Payment Integration Guide

This document describes how the Coinbase x402 payment protocol has been integrated into the iGuard application.

## What is x402?

x402 is a payment protocol that enables instant USDC payments directly over HTTP. It allows APIs, apps, and AI agents to transact seamlessly by embedding payments into HTTP requests using the `402 Payment Required` status code.

### Key Features

- **HTTP-Native**: Payments are embedded directly in HTTP requests
- **Instant Settlement**: Near-instant USDC payments on Base network
- **Low Cost**: Minimal transaction fees (fractions of a cent)
- **Developer-Friendly**: Simple middleware integration
- **Chain Agnostic**: Works with Base, Ethereum, Solana, and other chains

## Architecture

The integration consists of three main components:

1. **x402 Middleware** (`server/x402.ts`) - Configuration and setup
2. **Express Integration** (`server/index.ts`) - Middleware application
3. **Environment Configuration** (`.env`) - Runtime settings

## How It Works

### Payment Flow

1. **Client Request**: A client makes an HTTP request to a protected endpoint
2. **Payment Required**: Server responds with `402 Payment Required` and payment details
3. **Payment Submission**: Client constructs payment and includes it in `X-PAYMENT` header
4. **Verification**: Coinbase facilitator verifies the payment on-chain
5. **Resource Delivery**: Server validates and returns the requested resource

### Request/Response Cycle

```http
# 1. Initial request (no payment)
GET /api/creator/me/data-sources
→ 402 Payment Required
  X-PAYMENT-REQUIRED: {payment_details}

# 2. Request with payment
GET /api/creator/me/data-sources
X-PAYMENT: {payment_payload}
→ 200 OK
  {data}
  X-PAYMENT-RESPONSE: {transaction_hash}
```

## Configuration

### Environment Variables

Add these to your `.env` file:

```bash
# Enable/disable x402 payments
X402_ENABLED=true

# Your wallet address (Base network)
X402_WALLET_ADDRESS=0xYourWalletAddressHere

# Network: "base" (mainnet) or "base-sepolia" (testnet)
X402_NETWORK=base-sepolia

# Default price for unspecified endpoints
X402_DEFAULT_PRICE=$0.01

# Optional: Coinbase Developer Platform credentials
CDP_API_KEY_ID=your_api_key_id
CDP_API_KEY_SECRET=your_api_key_secret
```

### Getting a Wallet Address

1. **Option 1: Coinbase Wallet**
   - Download Coinbase Wallet app
   - Create a new wallet
   - Copy your Ethereum address
   - Ensure it's configured for Base network

2. **Option 2: MetaMask**
   - Install MetaMask browser extension
   - Create/import a wallet
   - Add Base network to MetaMask
   - Copy your wallet address

3. **Option 3: Coinbase Developer Platform**
   - Sign up at [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
   - Create a new wallet in the dashboard
   - Get API credentials for facilitator service

### Network Configuration

**Base Sepolia (Testnet)**
- Network ID: `base-sepolia`
- Use for development and testing
- Get free test USDC from [Base Sepolia faucet](https://faucet.circle.com/)

**Base Mainnet (Production)**
- Network ID: `base`
- Use for production
- Real USDC transactions

## Pricing Configuration

Current endpoint pricing is defined in `server/x402.ts`:

```typescript
export const DEFAULT_PRICING = {
  // Data source operations
  "/api/creator/me/data-sources": { price: "$0.10" },
  "/api/creators/:id/data-sources": { price: "$0.05" },

  // Agent operations
  "/api/agent/me": { price: "$0.02" },
  "/api/agents/:id": { price: "$0.02" },
  "/api/agent/me/generate-key": { price: "$0.50" },

  // Access logs
  "/api/creator/me/access-logs": { price: "$0.05" },
  "/api/agents/:id/access-logs": { price: "$0.05" },

  // Access log creation
  "/api/access-logs": { price: "$0.01" }
};
```

### Customizing Prices

You can customize prices by:

1. **Editing DEFAULT_PRICING** in `server/x402.ts`
2. **Environment Variables** - Set `X402_DEFAULT_PRICE` for all endpoints
3. **Runtime Configuration** - Pass custom pricing to `setupX402()`

Example:

```typescript
setupX402(app, {
  walletAddress: process.env.X402_WALLET_ADDRESS!,
  network: "base-sepolia",
  endpoints: {
    "/api/premium-feature": { price: "$1.00" },
    "/api/bulk-export": { price: "$5.00" }
  }
});
```

## Testing

### 1. Enable x402 in Development

Update `.env`:

```bash
X402_ENABLED=true
X402_WALLET_ADDRESS=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
X402_NETWORK=base-sepolia
```

### 2. Start the Server

```bash
npm run dev
```

You should see:
```
[x402] Payment middleware enabled for wallet: 0x742d...
[x402] Network: base-sepolia
[x402] Protected endpoints: [...]
```

### 3. Test with cURL

```bash
# Request without payment - should return 402
curl -v http://localhost:3000/api/creator/me/data-sources

# Check response headers for payment details
```

### 4. Test with x402 Client

The `@coinbase/x402` package includes a client for making payments:

```typescript
import { Client } from "@coinbase/x402";

const client = new Client({
  privateKey: "your_private_key",
  network: "base-sepolia"
});

const response = await client.get(
  "http://localhost:3000/api/creator/me/data-sources"
);
```

## Transaction Viewing

Every successful payment includes transaction metadata in the response and console logs:

### Server-Side Logs

When a payment is received, the server logs:

```
[x402] ✅ Payment received for /api/creator/me/data-sources
[x402] 💰 View transaction: https://sepolia.basescan.org/tx/0x1234...
```

### API Response

All paid API responses include a `_payment` object with transaction details:

```json
{
  "id": "creator-123",
  "name": "John Doe",
  "email": "john@example.com",
  "_payment": {
    "transactionHash": "0x1234567890abcdef...",
    "network": "base-sepolia",
    "explorerUrl": "https://sepolia.basescan.org/tx/0x1234...",
    "walletUrl": "https://sepolia.basescan.org/address/0x742d...",
    "viewTransaction": "https://sepolia.basescan.org/tx/0x1234..."
  }
}
```

### Response Headers

Transaction information is also available in headers:

- `X-Transaction-Hash`: The transaction hash
- `X-Transaction-Url`: Direct link to view on BaseScan
- `X-Wallet-Url`: Link to view the receiving wallet
- `X-Payment-Response`: Original x402 payment response

### Block Explorers

Transactions are viewable on:

- **Base Mainnet**: [basescan.org](https://basescan.org)
- **Base Sepolia (Testnet)**: [sepolia.basescan.org](https://sepolia.basescan.org)

## Client Integration

### React Components

The integration includes ready-to-use React components for displaying transaction links:

```tsx
import { TransactionLink, PaymentInfo, usePaymentMetadata } from "@/components/TransactionLink";

function MyComponent() {
  const { data } = useQuery("/api/creator/me/data-sources");
  const payment = usePaymentMetadata(data);

  return (
    <div>
      {/* Display payment transaction badge */}
      {payment && (
        <TransactionLink
          transactionHash={payment.transactionHash}
          network={payment.network}
          variant="badge"
        />
      )}

      {/* Or show complete payment info */}
      {payment && <PaymentInfo payment={payment} />}

      {/* Your content */}
    </div>
  );
}
```

**Available Variants:**
- `badge` - Compact badge with click to view
- `button` - Full button with "View Transaction" text
- `inline` - Inline link in text
- `default` - Code display with icon button

See `client/src/components/examples/PaymentTransactionExample.tsx` for more examples.

### JavaScript/TypeScript Client

```typescript
import { Client } from "@coinbase/x402";

// Initialize client with wallet
const client = new Client({
  privateKey: process.env.PRIVATE_KEY,
  network: "base-sepolia"
});

// Make paid requests
async function fetchDataSources() {
  try {
    const response = await client.get(
      "https://your-api.com/api/creator/me/data-sources"
    );
    return response.data;
  } catch (error) {
    console.error("Payment failed:", error);
  }
}
```

### React Integration

```tsx
import { useX402 } from "@coinbase/x402-react";

function DataSourcesList() {
  const { makeRequest, loading, error } = useX402();

  const fetchData = async () => {
    const data = await makeRequest(
      "/api/creator/me/data-sources"
    );
    return data;
  };

  // ... rest of component
}
```

## Security Considerations

### 1. Wallet Security

- **Never commit private keys** to version control
- Store wallet credentials securely (environment variables, secret managers)
- Use separate wallets for development/production
- Consider using a dedicated wallet for each service

### 2. Payment Verification

The Coinbase facilitator handles:
- On-chain payment verification
- Double-spend prevention
- Transaction confirmation
- Settlement to your wallet

### 3. Price Validation

- Always validate payment amounts on the server
- Don't trust client-provided prices
- Use the middleware's built-in verification

### 4. Rate Limiting

Consider adding rate limiting alongside x402:

```typescript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use("/api/", limiter);
```

## Monitoring and Analytics

### Track Payments

You can monitor payments by:

1. **Blockchain Explorer**
   - View transactions on [BaseScan](https://basescan.org/)
   - Search by your wallet address

2. **Coinbase Developer Dashboard**
   - View payment analytics
   - Track revenue and volume
   - Monitor failed payments

3. **Custom Analytics**

```typescript
app.use((req, res, next) => {
  res.on("finish", () => {
    if (req.headers["x-payment"]) {
      // Log successful payment
      console.log({
        endpoint: req.path,
        amount: req.headers["x-payment-amount"],
        timestamp: new Date(),
        txHash: res.getHeader("x-payment-response")
      });
    }
  });
  next();
});
```

## Troubleshooting

### Common Issues

**1. "X402_WALLET_ADDRESS environment variable is required"**
- Ensure `.env` has `X402_WALLET_ADDRESS` set
- Check that the address is a valid Ethereum address

**2. Payments not being verified**
- Verify network configuration matches (testnet vs mainnet)
- Check CDP API credentials if using them
- Ensure wallet has sufficient balance for gas fees

**3. 402 responses but client can't pay**
- Verify client has USDC on the correct network
- Check client wallet configuration
- Ensure prices are formatted correctly ("$0.01" not "0.01")

**4. Middleware not loading**
- Check `X402_ENABLED=true` in `.env`
- Verify imports in `server/index.ts`
- Check server logs for initialization errors

### Debug Mode

Enable detailed logging:

```typescript
// server/x402.ts
export function setupX402(app: Express, config: PaymentConfig) {
  // ... existing code ...

  console.log("[x402] Debug:", {
    walletAddress: config.walletAddress,
    network: config.network,
    endpoints: Object.keys(config.endpoints || {})
  });
}
```

## Performance Considerations

### Impact on Latency

x402 adds minimal latency:
- **First request**: ~100-200ms (402 response generation)
- **Paid request**: ~500ms-1s (on-chain verification)
- **Cached verification**: ~50-100ms

### Optimizations

1. **Facilitator Caching**: The facilitator caches recent payments
2. **Parallel Requests**: Batch multiple requests when possible
3. **WebSocket Fallback**: Consider WebSockets for high-frequency requests

## Production Deployment

### Checklist

- [ ] Set `X402_ENABLED=true`
- [ ] Update `X402_WALLET_ADDRESS` with production wallet
- [ ] Set `X402_NETWORK=base` (mainnet)
- [ ] Configure CDP API credentials
- [ ] Test payment flow on testnet first
- [ ] Monitor initial transactions closely
- [ ] Set up payment analytics
- [ ] Configure backup payment methods
- [ ] Document pricing for API users

### Environment Variables

```bash
# Production .env
X402_ENABLED=true
X402_WALLET_ADDRESS=0xYourProductionWallet
X402_NETWORK=base
CDP_API_KEY_ID=prod_key_id
CDP_API_KEY_SECRET=prod_key_secret
```

## Resources

- [x402 Official Website](https://www.x402.org/)
- [Coinbase Developer Docs](https://docs.cdp.coinbase.com/x402/welcome)
- [GitHub Repository](https://github.com/coinbase/x402)
- [Base Network](https://base.org/)
- [Base Sepolia Faucet](https://faucet.circle.com/)

## Support

For issues specific to x402:
- GitHub Issues: https://github.com/coinbase/x402/issues
- Coinbase Developer Discord: https://discord.gg/coinbase-developers

For iGuard-specific integration questions, contact your development team.
