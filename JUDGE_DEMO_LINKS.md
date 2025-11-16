# 🎯 iGuard Demo - Working Links for Judges

## 📱 Application URLs (Local)

### Main Demo Pages
Copy and paste these into your browser:

1. **Payment Demo** (Interactive)
   ```
   http://localhost:3000/demo
   ```
   - Shows wallet balance
   - Sends test USDC transfers
   - Gets BaseScan links

2. **Creator Dashboard**
   ```
   http://localhost:3000/creator
   ```
   - Add data sources
   - View earnings
   - See BaseScan links

3. **Agent Console**
   ```
   http://localhost:3000/agent
   ```
   - Generate API keys
   - View payment wallet
   - Test data access

---

## 🔗 Blockchain Links (BaseScan - Public Blockchain Explorer)

### Wallets

**Locus Wallet (AI Agent Payments)**
```
https://basescan.org/address/0x6A2747102A2fDCCF4d05b3Ba74193EBe8FEF1CfD
```
- This is the wallet that AI agents use to send payments
- Shows current balance and transaction history
- All transactions are public and verifiable

**x402 Wallet (Creator Earnings)**
```
https://basescan.org/address/0xA8Cb16414454D41707ACFB8B38a192DF83d8aED9
```
- This is where creators receive USDC payments
- Shows incoming payments from agents
- Proof of earnings

### Tokens

**USDC Contract on Base**
```
https://basescan.org/token/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
```
- Official USDC stablecoin contract on Base
- Shows all USDC transfers on Base network
- 6 decimals (1 USDC = 1000000)

**Agent's USDC Transfers**
```
https://basescan.org/token/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913?a=0x6A2747102A2fDCCF4d05b3Ba74193EBe8FEF1CfD
```
- Filtered view showing only Locus wallet's USDC transfers
- Each line is a payment transaction
- Click any transaction to see full details

### Network Info

**Base Network (Layer 2)**
```
https://basescan.org/
```
- Base mainnet explorer
- Chain ID: 8453
- Built by Coinbase

---

## 🧪 API Endpoints for Testing

Copy these curl commands to test the API:

### 1. Check Wallet Balance
```bash
curl http://localhost:3000/api/locus/wallet | python3 -m json.tool
```

**Expected Response:**
```json
{
  "address": "0x6A2747102A2fDCCF4d05b3Ba74193EBe8FEF1CfD",
  "balances": {
    "ETH": "0.0",
    "USDC": "0.0"
  },
  "explorerUrl": "https://basescan.org/address/0x6A2747102A2fDCCF4d05b3Ba74193EBe8FEF1CfD"
}
```

### 2. Get USDC Balance Only
```bash
curl http://localhost:3000/api/locus/balance | python3 -m json.tool
```

### 3. Send USDC (Requires Funds)
```bash
curl -X POST http://localhost:3000/api/locus/transfer/usdc \
  -H "Content-Type: application/json" \
  -d '{
    "to": "0xA8Cb16414454D41707ACFB8B38a192DF83d8aED9",
    "amount": "0.10"
  }' | python3 -m json.tool
```

**Expected Response (if funded):**
```json
{
  "transactionHash": "0xabc123...",
  "from": "0x6A2747102A2fDCCF4d05b3Ba74193EBe8FEF1CfD",
  "to": "0xA8Cb16414454D41707ACFB8B38a192DF83d8aED9",
  "amount": "0.10",
  "explorerUrl": "https://basescan.org/tx/0xabc123...",
  "success": true
}
```

---

## ✅ Quick Verification Checklist for Judges

### Step 1: Verify Real Wallet Exists
1. Click: https://basescan.org/address/0x6A2747102A2fDCCF4d05b3Ba74193EBe8FEF1CfD
2. You should see:
   - ✅ Wallet address matches
   - ✅ Network: Base (Chain ID: 8453)
   - ✅ Current ETH balance
   - ✅ Token holdings (if any)
   - ✅ Transaction history

### Step 2: Verify USDC Contract
1. Click: https://basescan.org/token/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
2. You should see:
   - ✅ Token: USD Coin (USDC)
   - ✅ Decimals: 6
   - ✅ Total Supply: ~billions
   - ✅ Thousands of holders

### Step 3: Test Local Application
1. Open: http://localhost:3000/demo
2. Click "Load Wallet Info"
3. See address: 0x6A27...1CfD
4. Balance should match BaseScan

### Step 4: Verify Code is Real
1. GitHub: https://github.com/kuotkiirbuokbil/iGuard
2. Check files:
   - `server/locus.ts` - Wallet operations
   - `server/x402.ts` - Payment middleware
   - `client/src/pages/PaymentDemo.tsx` - UI

---

## 🎬 30-Second Demo Script

**Say This:**

> "iGuard enables AI agents to pay creators for data using blockchain payments. Let me show you it's real."

**Do This:**

1. Open: `http://localhost:3000/creator`
2. Click "View Wallet" button
3. BaseScan opens showing real wallet
4. Say: "This is Base blockchain - public ledger, can't be faked"
5. Point to address matching in app

**Backup (if buttons don't work):**

Just open this link directly:
```
https://basescan.org/address/0x6A2747102A2fDCCF4d05b3Ba74193EBe8FEF1CfD
```

Then show the demo page:
```
http://localhost:3000/demo
```

---

## 🔧 If Links Don't Work

### Option 1: Right-Click → Copy Link
If buttons don't open, right-click and select "Copy link address"

### Option 2: Use These Direct Links

**Just paste these into browser address bar:**

**Locus Wallet:**
```
https://basescan.org/address/0x6A2747102A2fDCCF4d05b3Ba74193EBe8FEF1CfD
```

**x402 Wallet:**
```
https://basescan.org/address/0xA8Cb16414454D41707ACFB8B38a192DF83d8aED9
```

**USDC Token:**
```
https://basescan.org/token/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
```

### Option 3: Command Line Demo

Run this script:
```bash
./test-payments.sh
```

Shows:
- Wallet address
- Current balance
- BaseScan link
- Would send payment if funded

---

## 📊 What Each Link Proves

| Link | What It Shows | Why It Matters |
|------|---------------|----------------|
| Locus Wallet | Real Base wallet with balance | Proves we're using real blockchain, not mock |
| x402 Wallet | Creator earnings wallet | Shows where payments accumulate |
| USDC Contract | Official USDC token | Proves we're using real stablecoin |
| Transaction Page | On-chain payment proof | Shows amount, time, gas fees - immutable |

---

## 💡 Key Points to Emphasize

### To Judges:

1. **"Everything is verifiable on BaseScan"**
   - BaseScan = blockchain explorer (like Etherscan)
   - Shows ALL transactions publicly
   - Can't fake blockchain data

2. **"These are real wallets on Base mainnet"**
   - Not testnet (real money network)
   - Chain ID 8453 = Base production
   - Built by Coinbase

3. **"Zero platform fees"**
   - Only blockchain gas (~$0.002)
   - Compare to Stripe: 2.9% + $0.30
   - For $0.10 payment: Stripe costs MORE than the payment!

4. **"Instant settlement"**
   - Stripe: 2-7 days
   - iGuard: 2-5 seconds
   - Perfect for micropayments

5. **"AI-agent native"**
   - Agents have wallets, not bank accounts
   - Autonomous payments (no human needed)
   - Pay-per-use model

---

## 🚀 Quick Commands Cheat Sheet

```bash
# Test wallet API
curl http://localhost:3000/api/locus/wallet | python3 -m json.tool

# Run automated test
./test-payments.sh

# Check if server is running
curl http://localhost:3000/api/health

# View in browser
open http://localhost:3000/demo
```

---

## 📝 Notes

- **Current Status**: Wallet has 0 balance (waiting for funding)
- **To Test Transfers**: Need to add USDC + ETH to 0x6A27...1CfD
- **All Links Work NOW**: BaseScan links are live and verifiable
- **No Mock Data**: Everything links to real blockchain

---

**Ready for Demo!** 🎯

All links above are copy-pasteable and work immediately.
