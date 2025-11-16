#!/bin/bash

# iGuard Payment System Test Script
# This script demonstrates the complete payment flow with BaseScan evidence

echo "🚀 iGuard Payment System - Live Test"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# API Base URL
API_URL="http://localhost:3000/api"

echo "${BLUE}Step 1: Checking Locus Wallet Status${NC}"
echo "--------------------------------------"
WALLET_INFO=$(curl -s $API_URL/locus/wallet)
echo "$WALLET_INFO" | python3 -m json.tool
echo ""

# Extract wallet address and balances
WALLET_ADDRESS=$(echo "$WALLET_INFO" | python3 -c "import sys, json; print(json.load(sys.stdin)['address'])" 2>/dev/null)
ETH_BALANCE=$(echo "$WALLET_INFO" | python3 -c "import sys, json; print(json.load(sys.stdin)['balances']['ETH'])" 2>/dev/null)
USDC_BALANCE=$(echo "$WALLET_INFO" | python3 -c "import sys, json; print(json.load(sys.stdin)['balances']['USDC'])" 2>/dev/null)
EXPLORER_URL=$(echo "$WALLET_INFO" | python3 -c "import sys, json; print(json.load(sys.stdin)['explorerUrl'])" 2>/dev/null)

echo "${GREEN}✓ Wallet Address:${NC} $WALLET_ADDRESS"
echo "${GREEN}✓ ETH Balance:${NC} $ETH_BALANCE ETH"
echo "${GREEN}✓ USDC Balance:${NC} \$$USDC_BALANCE USDC"
echo "${BLUE}🔗 View on BaseScan:${NC} $EXPLORER_URL"
echo ""

# Check if wallet has funds
if [ "$USDC_BALANCE" == "0.0" ] || [ -z "$USDC_BALANCE" ]; then
    echo "${YELLOW}⚠️  Wallet needs funding!${NC}"
    echo ""
    echo "To test payments, send to: ${GREEN}$WALLET_ADDRESS${NC}"
    echo "  • USDC: At least 1 USDC (for testing transfers)"
    echo "  • ETH: At least 0.001 ETH (for gas fees)"
    echo ""
    echo "You can send funds using:"
    echo "  1. Coinbase: Withdraw to Base network"
    echo "  2. Bridge: https://bridge.base.org/"
    echo "  3. Another Base wallet"
    echo ""
    echo "${BLUE}Once funded, run this script again to test transfers!${NC}"
    exit 0
fi

echo "${GREEN}✅ Wallet is funded! Proceeding with transfer test...${NC}"
echo ""

# Test USDC Transfer
echo "${BLUE}Step 2: Testing USDC Transfer${NC}"
echo "--------------------------------------"
RECIPIENT="0xA8Cb16414454D41707ACFB8B38a192DF83d8aED9"  # x402 wallet
AMOUNT="0.10"

echo "Transfer Details:"
echo "  From: $WALLET_ADDRESS"
echo "  To: $RECIPIENT (x402 receive wallet)"
echo "  Amount: \$$AMOUNT USDC"
echo ""
echo "${YELLOW}Submitting transaction to Base blockchain...${NC}"
echo ""

# Execute transfer
TRANSFER_RESULT=$(curl -s -X POST $API_URL/locus/transfer/usdc \
  -H "Content-Type: application/json" \
  -d "{\"to\": \"$RECIPIENT\", \"amount\": \"$AMOUNT\"}")

# Check if transfer was successful
if echo "$TRANSFER_RESULT" | grep -q "error"; then
    echo "${RED}❌ Transfer failed!${NC}"
    echo "$TRANSFER_RESULT" | python3 -m json.tool
    exit 1
fi

echo "${GREEN}✅ Transaction submitted successfully!${NC}"
echo ""
echo "$TRANSFER_RESULT" | python3 -m json.tool
echo ""

# Extract transaction details
TX_HASH=$(echo "$TRANSFER_RESULT" | python3 -c "import sys, json; print(json.load(sys.stdin)['transactionHash'])" 2>/dev/null)
TX_EXPLORER_URL=$(echo "$TRANSFER_RESULT" | python3 -c "import sys, json; print(json.load(sys.stdin)['explorerUrl'])" 2>/dev/null)

echo "${BLUE}Step 3: Transaction Evidence${NC}"
echo "--------------------------------------"
echo "${GREEN}✓ Transaction Hash:${NC} $TX_HASH"
echo "${GREEN}✓ Amount Sent:${NC} \$$AMOUNT USDC"
echo "${GREEN}✓ From:${NC} $WALLET_ADDRESS"
echo "${GREEN}✓ To:${NC} $RECIPIENT"
echo ""
echo "${BLUE}🔗 View Transaction on BaseScan:${NC}"
echo "$TX_EXPLORER_URL"
echo ""
echo "${GREEN}✅ Click the link above to see the transaction on-chain!${NC}"
echo ""

# Check updated balance
echo "${BLUE}Step 4: Verifying Updated Balance${NC}"
echo "--------------------------------------"
echo "Waiting 3 seconds for blockchain confirmation..."
sleep 3

UPDATED_WALLET=$(curl -s $API_URL/locus/wallet)
NEW_USDC=$(echo "$UPDATED_WALLET" | python3 -c "import sys, json; print(json.load(sys.stdin)['balances']['USDC'])" 2>/dev/null)

echo "${GREEN}✓ Previous USDC Balance:${NC} \$$USDC_BALANCE"
echo "${GREEN}✓ New USDC Balance:${NC} \$$NEW_USDC"
echo ""

echo "${GREEN}════════════════════════════════════${NC}"
echo "${GREEN}✅ Payment Test Complete!${NC}"
echo "${GREEN}════════════════════════════════════${NC}"
echo ""
echo "What you just did:"
echo "  1. ✅ Checked wallet balance on Base mainnet"
echo "  2. ✅ Sent \$$AMOUNT USDC to x402 wallet"
echo "  3. ✅ Transaction recorded on Base blockchain"
echo "  4. ✅ Transaction visible on BaseScan (on-chain proof)"
echo ""
echo "This demonstrates iGuard's payment infrastructure:"
echo "  • Locus wallet for autonomous payments"
echo "  • x402 protocol for HTTP-native micropayments"
echo "  • Complete transaction transparency"
echo "  • On-chain proof via BaseScan"
echo ""
echo "${BLUE}🌐 Test the web interface at:${NC} http://localhost:3000/demo"
echo ""
