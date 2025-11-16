/**
 * x402 Client Example
 *
 * This example demonstrates how to make paid API requests to the iGuard API
 * using the Coinbase x402 payment protocol.
 *
 * Prerequisites:
 * 1. npm install @coinbase/x402
 * 2. Have a wallet with USDC on Base Sepolia testnet
 * 3. Set your PRIVATE_KEY environment variable
 */

import { Client } from "@coinbase/x402";

// Configuration
const API_BASE_URL = process.env.API_URL || "http://localhost:3000";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const NETWORK = process.env.X402_NETWORK || "base-sepolia";

if (!PRIVATE_KEY) {
  console.error("Error: PRIVATE_KEY environment variable is required");
  process.exit(1);
}

// Initialize x402 client
const client = new Client({
  privateKey: PRIVATE_KEY,
  network: NETWORK
});

/**
 * Example 1: Fetch creator data sources
 */
async function fetchCreatorDataSources(creatorId: string) {
  console.log("\n📦 Fetching creator data sources...");

  try {
    const response = await client.get(
      `${API_BASE_URL}/api/creators/${creatorId}/data-sources`
    );

    console.log("✅ Payment successful!");
    console.log("Transaction Hash:", response.headers["x-transaction-hash"]);
    console.log("View on BaseScan:", response.headers["x-transaction-url"]);
    console.log("View Wallet:", response.headers["x-wallet-url"]);

    // Payment metadata is also in the response body
    if (response.data._payment) {
      console.log("\n📊 Payment Details:");
      console.log("  Network:", response.data._payment.network);
      console.log("  Explorer URL:", response.data._payment.explorerUrl);
      console.log("  Transaction:", response.data._payment.transactionHash);
    }

    console.log("\nData:", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ Request failed:", error);
    throw error;
  }
}

/**
 * Example 2: Generate agent API key
 */
async function generateAgentKey(agentId: string) {
  console.log("\n🔑 Generating agent API key...");

  try {
    const response = await client.post(
      `${API_BASE_URL}/api/agents/${agentId}/generate-key`,
      {}
    );

    console.log("✅ Payment successful!");
    console.log("View Transaction:", response.headers["x-transaction-url"]);
    console.log("API Key:", response.data.apiKey);

    // Log payment info
    if (response.data._payment) {
      console.log("\n🔗 Transaction Link:", response.data._payment.explorerUrl);
    }

    return response.data.apiKey;
  } catch (error) {
    console.error("❌ Request failed:", error);
    throw error;
  }
}

/**
 * Example 3: Fetch access logs
 */
async function fetchAccessLogs(creatorId: string) {
  console.log("\n📊 Fetching access logs...");

  try {
    const response = await client.get(
      `${API_BASE_URL}/api/creators/${creatorId}/access-logs`
    );

    console.log("✅ Payment successful!");
    console.log("Transaction:", response.headers["x-payment-response"]);
    console.log(`Found ${response.data.length} access logs`);

    return response.data;
  } catch (error) {
    console.error("❌ Request failed:", error);
    throw error;
  }
}

/**
 * Example 4: Create data source
 */
async function createDataSource(creatorId: string) {
  console.log("\n➕ Creating new data source...");

  const newDataSource = {
    url: "https://api.example.com/data",
    pricePerRequest: "0.05",
    rateLimit: 100
  };

  try {
    const response = await client.post(
      `${API_BASE_URL}/api/creators/${creatorId}/data-sources`,
      newDataSource
    );

    console.log("✅ Payment successful!");
    console.log("Transaction:", response.headers["x-payment-response"]);
    console.log("Created data source:", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ Request failed:", error);
    throw error;
  }
}

/**
 * Example 5: Batch requests with error handling
 */
async function batchRequests(creatorId: string) {
  console.log("\n🔄 Making batch requests...");

  const results = await Promise.allSettled([
    fetchCreatorDataSources(creatorId),
    fetchAccessLogs(creatorId),
    client.get(`${API_BASE_URL}/api/creators/${creatorId}`)
  ]);

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`✅ Request ${index + 1} succeeded`);
    } else {
      console.log(`❌ Request ${index + 1} failed:`, result.reason.message);
    }
  });

  return results;
}

/**
 * Example 6: Check payment required details
 */
async function checkPaymentDetails(endpoint: string) {
  console.log(`\n💰 Checking payment details for ${endpoint}...`);

  try {
    // Make request without payment to get 402 response
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (response.status === 402) {
      const paymentRequired = response.headers.get("x-payment-required");
      console.log("Payment Required:", JSON.parse(paymentRequired || "{}"));
    } else {
      console.log("No payment required (status:", response.status, ")");
    }
  } catch (error) {
    console.error("❌ Request failed:", error);
  }
}

// Main execution
async function main() {
  console.log("🚀 x402 Client Example");
  console.log("======================");
  console.log(`API URL: ${API_BASE_URL}`);
  console.log(`Network: ${NETWORK}`);

  // Example creator ID (replace with actual ID)
  const exampleCreatorId = "dev-creator-123";
  const exampleAgentId = "dev-agent-123";

  try {
    // Check payment details for various endpoints
    await checkPaymentDetails("/api/creator/me/data-sources");

    // Uncomment to test actual payments
    // WARNING: These will spend real or test USDC!

    // await fetchCreatorDataSources(exampleCreatorId);
    // await generateAgentKey(exampleAgentId);
    // await fetchAccessLogs(exampleCreatorId);
    // await createDataSource(exampleCreatorId);
    // await batchRequests(exampleCreatorId);

    console.log("\n✅ All examples completed!");
  } catch (error) {
    console.error("\n❌ Error:", error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export {
  fetchCreatorDataSources,
  generateAgentKey,
  fetchAccessLogs,
  createDataSource,
  batchRequests,
  checkPaymentDetails
};
