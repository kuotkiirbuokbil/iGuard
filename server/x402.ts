import { facilitator } from "@coinbase/x402";
import { paymentMiddleware } from "x402-express";
import type { Express, Request, Response, NextFunction } from "express";

/**
 * x402 Payment Configuration
 * This module sets up the Coinbase x402 payment protocol for API endpoints
 */

/**
 * Get the block explorer URL for a given network
 */
export function getBlockExplorerUrl(network: string): string {
  const explorers: Record<string, string> = {
    "base": "https://basescan.org",
    "base-sepolia": "https://sepolia.basescan.org",
    "base-mainnet": "https://basescan.org",
    "ethereum": "https://etherscan.io",
    "sepolia": "https://sepolia.etherscan.io",
    "arbitrum": "https://arbiscan.io",
    "optimism": "https://optimistic.etherscan.io",
    "polygon": "https://polygonscan.com",
  };

  return explorers[network] || explorers["base-sepolia"];
}

/**
 * Generate a transaction view URL for BaseScan
 */
export function getTransactionUrl(txHash: string, network: string): string {
  const baseUrl = getBlockExplorerUrl(network);
  return `${baseUrl}/tx/${txHash}`;
}

/**
 * Generate a wallet address view URL for BaseScan
 */
export function getAddressUrl(address: string, network: string): string {
  const baseUrl = getBlockExplorerUrl(network);
  return `${baseUrl}/address/${address}`;
}

export interface PaymentConfig {
  /**
   * Wallet address to receive payments
   */
  walletAddress: string;

  /**
   * Network to use for payments (e.g., "base", "base-sepolia")
   * Default: "base-sepolia" for testing
   */
  network?: string;

  /**
   * Default price for unspecified endpoints
   */
  defaultPrice?: string;

  /**
   * Endpoint-specific pricing configuration
   */
  endpoints?: {
    [path: string]: {
      price: string;
      network?: string;
    };
  };
}

/**
 * Sets up x402 payment middleware for the Express app
 *
 * @param app - Express application instance
 * @param config - Payment configuration
 *
 * @example
 * ```ts
 * setupX402(app, {
 *   walletAddress: "0xYourAddress",
 *   network: "base-sepolia",
 *   defaultPrice: "$0.01",
 *   endpoints: {
 *     "/api/creator/me/data-sources": { price: "$0.05" },
 *     "/api/agents/:id": { price: "$0.02" }
 *   }
 * });
 * ```
 */
export function setupX402(app: Express, config: PaymentConfig) {
  const {
    walletAddress,
    network = "base-sepolia",
    defaultPrice = "$0.01",
    endpoints = {}
  } = config;

  if (!walletAddress) {
    throw new Error("X402_WALLET_ADDRESS environment variable is required");
  }

  // Build endpoint configuration
  const endpointConfig: any = {};

  // Add custom endpoint configurations
  Object.entries(endpoints).forEach(([path, config]) => {
    endpointConfig[path] = {
      price: config.price,
      network: config.network || network
    };
  });

  // Apply x402 payment middleware
  // This will intercept requests and require payment via the x402 protocol
  app.use(
    paymentMiddleware(
      walletAddress as `0x${string}`,
      endpointConfig as any,
      facilitator
    )
  );

  // Add middleware to enhance responses with transaction links
  app.use((req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);

    res.json = function(body: any) {
      // Check if this was a paid request (has X-PAYMENT-RESPONSE header)
      const txHash = res.getHeader('x-payment-response') as string;

      if (txHash) {
        // Add transaction metadata to response
        const transactionMeta = {
          transactionHash: txHash,
          network: network,
          explorerUrl: getTransactionUrl(txHash, network),
          walletUrl: getAddressUrl(walletAddress, network),
          viewTransaction: getTransactionUrl(txHash, network)
        };

        // Enhance response body with transaction info
        const enhancedBody = {
          ...body,
          _payment: transactionMeta
        };

        // Also set custom headers for easy access
        res.setHeader('X-Transaction-Hash', txHash);
        res.setHeader('X-Transaction-Url', transactionMeta.explorerUrl);
        res.setHeader('X-Wallet-Url', transactionMeta.walletUrl);

        // Log successful payment with link
        console.log(`[x402] ✅ Payment received for ${req.path}`);
        console.log(`[x402] 💰 View transaction: ${transactionMeta.explorerUrl}`);

        return originalJson(enhancedBody);
      }

      return originalJson(body);
    };

    next();
  });

  const walletUrl = getAddressUrl(walletAddress, network);
  console.log(`[x402] Payment middleware enabled for wallet: ${walletAddress}`);
  console.log(`[x402] Network: ${network}`);
  console.log(`[x402] View wallet: ${walletUrl}`);
  console.log(`[x402] Protected endpoints:`, Object.keys(endpointConfig));
}

/**
 * Default pricing configuration for iGuard endpoints
 * Adjust these prices based on your business model
 */
export const DEFAULT_PRICING = {
  // Data source operations
  "/api/creator/me/data-sources": { price: "$0.10" },
  "/api/creators/:id/data-sources": { price: "$0.05" },

  // Agent operations
  "/api/agent/me": { price: "$0.02" },
  "/api/agents/:id": { price: "$0.02" },
  "/api/agent/me/generate-key": { price: "$0.50" },

  // Access logs (analytics)
  "/api/creator/me/access-logs": { price: "$0.05" },
  "/api/agents/:id/access-logs": { price: "$0.05" },

  // Access log creation
  "/api/access-logs": { price: "$0.01" }
};
