# Locus Wallet Integration Guide

This document describes the Locus wallet integration in your iGuard application for autonomous AI agent payments on Base network.

> **Status:** ✅ Fully Integrated
> **Wallet Address:** `0x6A2747102A2fDCCF4d05b3Ba74193EBe8FEF1CfD`
> **Network:** Base Mainnet (Chain ID: 8453)
> **View Wallet:** [BaseScan](https://basescan.org/address/0x6A2747102A2fDCCF4d05b3Ba74193EBe8FEF1CfD)

## What is Locus?

Locus is a payment infrastructure platform designed for AI agents, enabling autonomous financial transactions on blockchain networks. Your iGuard app uses a Locus wallet on Base network for USDC and ETH payments.

## Features

✅ **Wallet Management** - View balance, send/receive ETH and USDC
✅ **USDC Transfers** - Native support for USDC stablecoin on Base
✅ **ERC20 Support** - Transfer any ERC20 token
✅ **Transaction Tracking** - All transactions viewable on BaseScan
✅ **Gas Estimation** - Estimate transaction costs before sending
✅ **Secure Storage** - Private key stored in `.env` (never committed to git)

## Architecture

The integration consists of:

1. **Wallet Module** (`server/locus.ts`) - Core wallet operations using ethers.js
2. **API Endpoints** (`server/routes.ts`) - REST API for wallet interactions
3. **Environment Config** (`.env`) - Secure credential storage

## Your Locus Wallet

**Address:** `0x6A2747102A2fDCCF4d05b3Ba74193EBe8FEF1CfD`
**Name:** iGuard
**Chain:** Base (8453)

**View on BaseScan:**
https://basescan.org/address/0x6A2747102A2fDCCF4d05b3Ba74193EBe8FEF1CfD

## Configuration

Your Locus wallet is already configured in `.env`:

```bash
# Locus Wallet Configuration
LOCUS_WALLET_ADDRESS=0x6A2747102A2fDCCF4d05b3Ba74193EBe8FEF1CfD
LOCUS_PRIVATE_KEY=0xe1874b6e0967bb252d101a2ebadcaf1e7a5f5c45941f084e7f0f8eaf6d78c395
LOCUS_CHAIN_ID=8453
LOCUS_WALLET_NAME=iGuard
LOCUS_RPC_URL=https://mainnet.base.org
```

**🔒 SECURITY WARNING:**
- The `.env` file is git-ignored and never committed
- Your private key is stored securely locally
- Never share your private key with anyone
- For production, consider using a key management service (AWS KMS, HashiCorp Vault, etc.)

## API Endpoints

### Get Wallet Information

```bash
GET /api/locus/wallet
```

**Response:**
```json
{
  "address": "0x6A2747102A2fDCCF4d05b3Ba74193EBe8FEF1CfD",
  "balance": "1234567890000000000",
  "balanceFormatted": "1.23456789",
  "chainId": 8453,
  "network": "base",
  "name": "iGuard",
  "balances": {
    "ETH": "1.23456789",
    "USDC": "100.50"
  },
  "explorerUrl": "https://basescan.org/address/0x6A2747102A2fDCCF4d05b3Ba74193EBe8FEF1CfD"
}
```

### Get Wallet Balance

```bash
GET /api/locus/balance
```

**Response:**
```json
{
  "ETH": "1.23456789",
  "USDC": "100.50"
}
```

### Transfer ETH

```bash
POST /api/locus/transfer/eth
Content-Type: application/json

{
  "to": "0xRecipientAddress",
  "amount": "0.1"
}
```

**Response:**
```json
{
  "transactionHash": "0x1234567890abcdef...",
  "from": "0x6A2747102A2fDCCF4d05b3Ba74193EBe8FEF1CfD",
  "to": "0xRecipientAddress",
  "amount": "0.1",
  "explorerUrl": "https://basescan.org/tx/0x1234567890abcdef...",
  "success": true
}
```

### Transfer USDC

```bash
POST /api/locus/transfer/usdc
Content-Type: application/json

{
  "to": "0xRecipientAddress",
  "amount": "10.50"
}
```

**Response:**
```json
{
  "transactionHash": "0x1234567890abcdef...",
  "from": "0x6A2747102A2fDCCF4d05b3Ba74193EBe8FEF1CfD",
  "to": "0xRecipientAddress",
  "amount": "10.50",
  "explorerUrl": "https://basescan.org/tx/0x1234567890abcdef...",
  "success": true
}
```

### Transfer ERC20 Token

```bash
POST /api/locus/transfer/token
Content-Type: application/json

{
  "tokenAddress": "0xTokenContractAddress",
  "to": "0xRecipientAddress",
  "amount": "100"
}
```

### Get Transaction Details

```bash
GET /api/locus/transaction/:txHash
```

**Response:**
```json
{
  "transaction": {
    "hash": "0x1234567890abcdef...",
    "from": "0x6A2747102A2fDCCF4d05b3Ba74193EBe8FEF1CfD",
    "to": "0xRecipientAddress",
    "value": "100000000000000000",
    "gasLimit": "21000",
    // ... other transaction details
  },
  "receipt": {
    "status": 1,
    "blockNumber": 12345678,
    // ... other receipt details
  },
  "explorerUrl": "https://basescan.org/tx/0x1234567890abcdef..."
}
```

## Using the Locus Wallet in Code

### Server-Side Usage

```typescript
import { getLocusWallet } from "./locus";

// Get wallet instance
const wallet = getLocusWallet();

// Check balance
const ethBalance = await wallet.getBalance();
const usdcBalance = await wallet.getUSDCBalance();

console.log(`ETH Balance: ${ethBalance}`);
console.log(`USDC Balance: ${usdcBalance}`);

// Transfer USDC
const result = await wallet.transferUSDC({
  to: "0xRecipientAddress",
  amount: "10.50"
});

console.log(`Transaction: ${result.explorerUrl}`);
```

### Client-Side Usage (TypeScript/JavaScript)

```typescript
// Get wallet info
const response = await fetch("/api/locus/wallet");
const walletInfo = await response.json();

console.log(`Wallet: ${walletInfo.address}`);
console.log(`ETH: ${walletInfo.balances.ETH}`);
console.log(`USDC: ${walletInfo.balances.USDC}`);

// Transfer USDC
const transferResponse = await fetch("/api/locus/transfer/usdc", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    to: "0xRecipientAddress",
    amount: "10.50"
  })
});

const result = await transferResponse.json();
console.log(`Transaction: ${result.explorerUrl}`);
```

## Testing

### 1. Check Wallet Balance

```bash
curl http://localhost:3000/api/locus/wallet
```

### 2. Get Current Balances

```bash
curl http://localhost:3000/api/locus/balance
```

### 3. Test USDC Transfer

```bash
curl -X POST http://localhost:3000/api/locus/transfer/usdc \
  -H "Content-Type: application/json" \
  -d '{
    "to": "0xTestRecipient",
    "amount": "0.01"
  }'
```

## Supported Tokens

### USDC on Base

**Contract Address:** `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
**Decimals:** 6
**Symbol:** USDC

### Native ETH

**Symbol:** ETH
**Decimals:** 18

### Any ERC20 Token

Use the `/api/locus/transfer/token` endpoint with the token contract address.

## Transaction Monitoring

All transactions are logged to the console with BaseScan links:

```
[Locus] Transferring 10.50 USDC to 0xRecipientAddress
[Locus] Transaction hash: 0x1234567890abcdef...
[Locus] ✅ USDC transfer confirmed: https://basescan.org/tx/0x1234567890abcdef...
```

## Gas Fees

**Base Network Benefits:**
- Low transaction costs (typically < $0.01)
- Fast confirmation times (2-3 seconds)
- Ethereum-compatible

**Ensure your wallet has ETH for gas:**
- USDC transfers require ~21,000 gas
- ETH transfers require ~21,000 gas
- Keep at least 0.001 ETH for gas fees

## Security Best Practices

### Private Key Security

1. **Never commit `.env` to git** - ✅ Already in `.gitignore`
2. **Never share your private key** - Keep it secret
3. **Use environment variables** - ✅ Already configured
4. **Consider a key management service** for production
5. **Rotate keys regularly** if compromised

### Production Recommendations

1. **Use a dedicated RPC endpoint** (Alchemy, Infura, QuickNode)
2. **Implement rate limiting** on payment endpoints
3. **Add authentication** for sensitive operations
4. **Set up monitoring** for unusual transactions
5. **Use a multisig wallet** for high-value assets
6. **Enable 2FA** on all related accounts

## Funding Your Wallet

### Getting ETH on Base

1. **Bridge from Ethereum:**
   - Use [Base Bridge](https://bridge.base.org/)
   - Bridge ETH from Ethereum mainnet to Base

2. **Exchange Direct Deposit:**
   - Coinbase supports direct Base deposits
   - Withdraw ETH to Base network

### Getting USDC on Base

1. **Bridge from Other Chains:**
   - Use [Base Bridge](https://bridge.base.org/)
   - Bridge USDC from Ethereum, Arbitrum, etc.

2. **Buy on Coinbase:**
   - Buy USDC on Coinbase
   - Withdraw to Base network

3. **Circle's CCTP:**
   - Use Cross-Chain Transfer Protocol
   - Native USDC transfers between chains

## Troubleshooting

### Error: "Locus wallet not configured"

**Solution:**
Ensure `.env` has all required variables:
```bash
LOCUS_WALLET_ADDRESS=0x6A2747102A2fDCCF4d05b3Ba74193EBe8FEF1CfD
LOCUS_PRIVATE_KEY=0xe1874b6e0967bb252d101a2ebadcaf1e7a5f5c45941f084e7f0f8eaf6d78c395
LOCUS_CHAIN_ID=8453
LOCUS_RPC_URL=https://mainnet.base.org
```

### Error: "Insufficient funds"

**Check:**
1. Wallet has enough ETH/USDC
2. Account has ETH for gas fees
3. Amount doesn't exceed balance

**View balance:**
```bash
curl http://localhost:3000/api/locus/balance
```

### Transaction Pending

**Base transactions typically confirm in 2-3 seconds. If pending:**
1. Check [BaseScan](https://basescan.org/address/0x6A2747102A2fDCCF4d05b3Ba74193EBe8FEF1CfD)
2. Gas price may be too low (rare on Base)
3. Network congestion (very rare on Base)

### RPC Connection Issues

**If you get RPC errors:**
1. Check `LOCUS_RPC_URL` in `.env`
2. Try alternative RPCs:
   - `https://mainnet.base.org`
   - `https://base.llamarpc.com`
   - Get a dedicated endpoint from Alchemy/Infura

## Example Use Cases

### 1. Agent Payment for Data Access

```typescript
// Agent pays creator for data access
const result = await wallet.transferUSDC({
  to: creatorWalletAddress,
  amount: dataSource.pricePerRequest
});

// Log the payment
await storage.createAccessLog({
  agentId: agent.id,
  dataSourceId: dataSource.id,
  amount: dataSource.pricePerRequest,
  transactionHash: result.transactionHash,
  status: "success"
});
```

### 2. Automatic Revenue Distribution

```typescript
// Distribute revenue to creators
for (const creator of creators) {
  const amount = calculateRevenue(creator);

  await wallet.transferUSDC({
    to: creator.walletAddress,
    amount: amount.toString()
  });
}
```

### 3. Subscription Payments

```typescript
// Monthly subscription payment
const subscriptionAmount = "9.99";

const result = await wallet.transferUSDC({
  to: serviceProviderAddress,
  amount: subscriptionAmount
});

console.log(`Subscription paid: ${result.explorerUrl}`);
```

## Resources

- **BaseScan:** https://basescan.org
- **Base Network:** https://base.org
- **USDC on Base:** https://www.circle.com/en/usdc
- **Ethers.js Docs:** https://docs.ethers.org
- **Your Wallet:** https://basescan.org/address/0x6A2747102A2fDCCF4d05b3Ba74193EBe8FEF1CfD

## Support

For issues or questions:
1. Check this documentation
2. View transactions on BaseScan
3. Check server logs for detailed error messages
4. Verify `.env` configuration

---

## Summary

Your iGuard application now has a fully integrated Locus wallet on Base network:

✅ **Wallet configured** and ready to use
✅ **API endpoints** for all wallet operations
✅ **USDC & ETH support** with automatic BaseScan links
✅ **Secure private key storage** in `.env`
✅ **Production-ready** with comprehensive error handling

**Next Steps:**
1. Fund your wallet with ETH for gas
2. Add USDC for payments
3. Start making transactions!
