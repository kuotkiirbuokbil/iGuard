# iGuard Payment System - Testing Guide

Complete guide to test Locus and x402 payments with **verifiable on-chain evidence**.

## 🎯 Quick Start

### Option 1: Web Interface (Recommended)

1. **Start the server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Open the demo page**:
   ```
   http://localhost:3000/demo
   ```

3. **Follow the on-screen instructions** to test payments with visual feedback and direct BaseScan links.

### Option 2: Command Line

Run the automated test script:
```bash
./test-payments.sh
```

This will automatically:
- Check your wallet balance
- Execute a test transfer
- Show BaseScan links for verification
- Display before/after balances

## 💰 Funding Your Wallet

**Your Locus Wallet:** `0x6A2747102A2fDCCF4d05b3Ba74193EBe8FEF1CfD`

You need two things to test:

### 1. USDC (for payments)
Send at least **1 USDC** to test transfers.

**How to get USDC on Base:**
- **Coinbase**: Buy USDC → Withdraw to Base network
- **Bridge**: Use https://bridge.base.org/ to bridge from Ethereum
- **Swap**: Use any Base DEX to swap ETH for USDC

### 2. ETH (for gas fees)
Send at least **0.001 ETH** to cover transaction fees.

**How to get ETH on Base:**
- **Coinbase**: Buy ETH → Withdraw to Base network
- **Bridge**: Bridge from Ethereum mainnet
- **Faucet**: For testnet only (we're on mainnet)

## 🧪 Testing Locus Payments

### Test 1: Check Wallet Balance

**cURL:**
```bash
curl http://localhost:3000/api/locus/wallet | python3 -m json.tool
```

**Expected Response:**
```json
{
  "address": "0x6A2747102A2fDCCF4d05b3Ba74193EBe8FEF1CfD",
  "balances": {
    "ETH": "0.001",
    "USDC": "1.0"
  },
  "explorerUrl": "https://basescan.org/address/0x6A2747..."
}
```

**Evidence:**
Click the `explorerUrl` to see your wallet on BaseScan with real-time balances.

---

### Test 2: Send USDC Transfer

**cURL:**
```bash
curl -X POST http://localhost:3000/api/locus/transfer/usdc \
  -H "Content-Type: application/json" \
  -d '{
    "to": "0xA8Cb16414454D41707ACFB8B38a192DF83d8aED9",
    "amount": "0.10"
  }' | python3 -m json.tool
```

**Expected Response:**
```json
{
  "transactionHash": "0xabc123def456...",
  "from": "0x6A2747102A2fDCCF4d05b3Ba74193EBe8FEF1CfD",
  "to": "0xA8Cb16414454D41707ACFB8B38a192DF83d8aED9",
  "amount": "0.10",
  "explorerUrl": "https://basescan.org/tx/0xabc123def456...",
  "success": true
}
```

**Evidence:**
Open the `explorerUrl` to see:
- ✅ Transaction hash
- ✅ From/To addresses
- ✅ Amount transferred (0.10 USDC)
- ✅ Block number and timestamp
- ✅ Gas used
- ✅ Transaction status (Success ✓)

**Server Logs:**
```
[Locus] Transferring 0.10 USDC to 0xA8Cb16414454D41707ACFB8B38a192DF83d8aED9
[Locus] Transaction hash: 0xabc123def456...
[Locus] ✅ USDC transfer confirmed: https://basescan.org/tx/0xabc123def456...
```

---

### Test 3: View Transaction Details

**cURL:**
```bash
curl http://localhost:3000/api/locus/transaction/0xYOUR_TX_HASH | python3 -m json.tool
```

**Expected Response:**
```json
{
  "transaction": {
    "hash": "0xabc123...",
    "from": "0x6A2747...",
    "to": "0x833589..." // USDC contract
  },
  "receipt": {
    "status": 1, // Success
    "blockNumber": 12345678
  },
  "explorerUrl": "https://basescan.org/tx/0xabc123..."
}
```

---

## 🎫 Testing x402 Payments

### Step 1: Enable x402

Edit `.env`:
```bash
X402_ENABLED=true
```

Restart server:
```bash
npm run dev
```

### Step 2: Test 402 Payment Required

**cURL:**
```bash
curl -v http://localhost:3000/api/creator/me/data-sources
```

**Expected Response:**
```
HTTP/1.1 402 Payment Required
X-PAYMENT-REQUIRED: {"price": "$0.10", ...}
```

This shows x402 is working - endpoints now require payment!

### Step 3: Make Payment with x402 Client

```typescript
import { Client } from "@coinbase/x402";

const client = new Client({
  privateKey: "your_private_key",
  network: "base"
});

// This will automatically pay and return the data
const response = await client.get(
  "http://localhost:3000/api/creator/me/data-sources"
);

console.log("Payment metadata:", response._payment);
// Shows transaction hash and BaseScan link!
```

---

## 📊 Evidence Checklist

For each test, you get multiple forms of proof:

### 1. API Response ✅
- Transaction hash
- From/to addresses
- Amount
- Success status
- BaseScan URL

### 2. BaseScan (On-Chain) ✅
- Full transaction details
- Block confirmation
- Contract interaction
- Gas used
- Timestamp

### 3. Server Logs ✅
- Transaction initiation
- Hash confirmation
- Clickable BaseScan links

### 4. Updated Balances ✅
- Before/after comparison
- Real-time blockchain data

---

## 🎬 Complete Demo Flow

Here's a complete test scenario that shows everything working:

```bash
# 1. Check initial balance
curl http://localhost:3000/api/locus/wallet

# Output:
# {
#   "balances": {"USDC": "10.0"}
# }

# 2. Send payment
curl -X POST http://localhost:3000/api/locus/transfer/usdc \
  -H "Content-Type: application/json" \
  -d '{"to": "0xA8Cb16414454D41707ACFB8B38a192DF83d8aED9", "amount": "0.50"}'

# Output:
# {
#   "transactionHash": "0xabc123...",
#   "explorerUrl": "https://basescan.org/tx/0xabc123..."
# }

# 3. View transaction
# Open explorerUrl in browser → See on-chain proof!

# 4. Check updated balance
curl http://localhost:3000/api/locus/wallet

# Output:
# {
#   "balances": {"USDC": "9.5"}  // 10.0 - 0.50 = 9.5 ✓
# }
```

---

## 🌐 Web Interface Features

Visit `http://localhost:3000/demo` for:

- 📊 **Live wallet balance** with refresh button
- 💸 **Interactive payment form** with customizable amounts
- 🔗 **One-click BaseScan links** for instant verification
- ✅ **Real-time transaction status** with success/error messages
- 📱 **Mobile-responsive design** for testing on any device

---

## 🔍 Troubleshooting

### "Wallet needs funding"
**Solution:** Send USDC and ETH to `0x6A2747102A2fDCCF4d05b3Ba74193EBe8FEF1CfD`

### "Insufficient funds for gas"
**Solution:** Send more ETH (at least 0.001 ETH)

### "Transfer amount exceeds balance"
**Solution:** Send more USDC or reduce transfer amount

### Transaction pending forever
**Solution:**
- Check BaseScan - Base confirms in 2-5 seconds
- If stuck, gas price may be too low (rare on Base)

---

## 🎯 What You've Proven

After running these tests, you have:

1. ✅ **On-chain payment proof** - Every transaction visible on BaseScan
2. ✅ **Working Locus integration** - AI agents can make autonomous payments
3. ✅ **Working x402 integration** - HTTP-native micropayments functional
4. ✅ **Complete transparency** - All transactions tracked and viewable
5. ✅ **Production-ready system** - Real USDC transfers on Base mainnet

---

## 📈 Gas Costs (Reference)

All tests use real ETH for gas on Base mainnet:

- **USDC Transfer:** ~$0.002-0.005 per transaction
- **ETH Transfer:** ~$0.001-0.003 per transaction
- **x402 Payment:** ~$0.002-0.005 per transaction

Base network is very cheap compared to Ethereum mainnet!

---

## 🚀 Next Steps

1. **Run the tests** using the web interface or command line
2. **Share BaseScan links** as proof of working payments
3. **Enable x402** to test HTTP-native payments
4. **Integrate with AI** (Claude API coming next)
5. **Deploy to production** - Everything is ready!

---

## 🔗 Important Links

- **Your Wallet:** https://basescan.org/address/0x6A2747102A2fDCCF4d05b3Ba74193EBe8FEF1CfD
- **x402 Wallet:** https://basescan.org/address/0xA8Cb16414454D41707ACFB8B38a192DF83d8aED9
- **USDC Contract:** https://basescan.org/token/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
- **Base Bridge:** https://bridge.base.org/
- **Demo Page:** http://localhost:3000/demo

---

**Ready to test?** Fund your wallet and run `./test-payments.sh` or visit `http://localhost:3000/demo`!
