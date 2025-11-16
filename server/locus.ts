import { ethers } from "ethers";

/**
 * Locus Wallet Integration
 *
 * This module provides wallet functionality for AI agents using a Locus wallet on Base network.
 * The Locus wallet enables autonomous payments and transactions for AI agents.
 */

export interface LocusWalletConfig {
  address: string;
  privateKey: string;
  chainId: number;
  rpcUrl: string;
  name: string;
}

export interface LocusWalletInfo {
  address: string;
  balance: string;
  balanceFormatted: string;
  chainId: number;
  network: string;
  name: string;
}

export interface TransferParams {
  to: string;
  amount: string; // in ETH/USDC
  token?: string; // Optional: token contract address (for USDC transfers)
}

export interface TransferResult {
  transactionHash: string;
  from: string;
  to: string;
  amount: string;
  explorerUrl: string;
  success: boolean;
}

/**
 * ERC20 ABI for USDC transfers
 */
const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

/**
 * USDC Contract on Base Mainnet
 */
const USDC_CONTRACT_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

/**
 * Locus Wallet Manager
 * Handles all wallet operations for AI agents
 */
export class LocusWallet {
  private wallet: ethers.Wallet;
  private provider: ethers.JsonRpcProvider;
  private config: LocusWalletConfig;

  constructor(config: LocusWalletConfig) {
    this.config = config;
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
    this.wallet = new ethers.Wallet(config.privateKey, this.provider);
  }

  /**
   * Get wallet information
   */
  async getWalletInfo(): Promise<LocusWalletInfo> {
    const balance = await this.provider.getBalance(this.config.address);
    const network = await this.provider.getNetwork();

    return {
      address: this.config.address,
      balance: balance.toString(),
      balanceFormatted: ethers.formatEther(balance),
      chainId: Number(network.chainId),
      network: network.name,
      name: this.config.name
    };
  }

  /**
   * Get ETH balance
   */
  async getBalance(): Promise<string> {
    const balance = await this.provider.getBalance(this.config.address);
    return ethers.formatEther(balance);
  }

  /**
   * Get USDC balance
   */
  async getUSDCBalance(): Promise<string> {
    try {
      const usdcContract = new ethers.Contract(
        USDC_CONTRACT_ADDRESS,
        ERC20_ABI,
        this.provider
      );

      const balance = await usdcContract.balanceOf(this.config.address);
      const decimals = await usdcContract.decimals();

      return ethers.formatUnits(balance, decimals);
    } catch (error) {
      console.error("Error getting USDC balance:", error);
      return "0";
    }
  }

  /**
   * Get token balance for any ERC20 token
   */
  async getTokenBalance(tokenAddress: string): Promise<string> {
    try {
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ERC20_ABI,
        this.provider
      );

      const balance = await tokenContract.balanceOf(this.config.address);
      const decimals = await tokenContract.decimals();

      return ethers.formatUnits(balance, decimals);
    } catch (error) {
      console.error(`Error getting token balance for ${tokenAddress}:`, error);
      return "0";
    }
  }

  /**
   * Transfer ETH
   */
  async transferETH(params: TransferParams): Promise<TransferResult> {
    try {
      const tx = await this.wallet.sendTransaction({
        to: params.to,
        value: ethers.parseEther(params.amount)
      });

      console.log(`[Locus] Transferring ${params.amount} ETH to ${params.to}`);
      console.log(`[Locus] Transaction hash: ${tx.hash}`);

      const receipt = await tx.wait();

      const explorerUrl = `https://basescan.org/tx/${tx.hash}`;
      console.log(`[Locus] ✅ Transfer confirmed: ${explorerUrl}`);

      return {
        transactionHash: tx.hash,
        from: this.config.address,
        to: params.to,
        amount: params.amount,
        explorerUrl,
        success: receipt?.status === 1
      };
    } catch (error: any) {
      console.error("[Locus] Transfer failed:", error);
      throw new Error(`Transfer failed: ${error.message}`);
    }
  }

  /**
   * Transfer USDC
   */
  async transferUSDC(params: TransferParams): Promise<TransferResult> {
    try {
      const usdcContract = new ethers.Contract(
        USDC_CONTRACT_ADDRESS,
        ERC20_ABI,
        this.wallet
      );

      const decimals = await usdcContract.decimals();
      const amount = ethers.parseUnits(params.amount, decimals);

      console.log(`[Locus] Transferring ${params.amount} USDC to ${params.to}`);

      const tx = await usdcContract.transfer(params.to, amount);
      console.log(`[Locus] Transaction hash: ${tx.hash}`);

      const receipt = await tx.wait();

      const explorerUrl = `https://basescan.org/tx/${tx.hash}`;
      console.log(`[Locus] ✅ USDC transfer confirmed: ${explorerUrl}`);

      return {
        transactionHash: tx.hash,
        from: this.config.address,
        to: params.to,
        amount: params.amount,
        explorerUrl,
        success: receipt?.status === 1
      };
    } catch (error: any) {
      console.error("[Locus] USDC transfer failed:", error);
      throw new Error(`USDC transfer failed: ${error.message}`);
    }
  }

  /**
   * Transfer any ERC20 token
   */
  async transferToken(tokenAddress: string, params: TransferParams): Promise<TransferResult> {
    try {
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ERC20_ABI,
        this.wallet
      );

      const decimals = await tokenContract.decimals();
      const symbol = await tokenContract.symbol();
      const amount = ethers.parseUnits(params.amount, decimals);

      console.log(`[Locus] Transferring ${params.amount} ${symbol} to ${params.to}`);

      const tx = await tokenContract.transfer(params.to, amount);
      console.log(`[Locus] Transaction hash: ${tx.hash}`);

      const receipt = await tx.wait();

      const explorerUrl = `https://basescan.org/tx/${tx.hash}`;
      console.log(`[Locus] ✅ ${symbol} transfer confirmed: ${explorerUrl}`);

      return {
        transactionHash: tx.hash,
        from: this.config.address,
        to: params.to,
        amount: params.amount,
        explorerUrl,
        success: receipt?.status === 1
      };
    } catch (error: any) {
      console.error("[Locus] Token transfer failed:", error);
      throw new Error(`Token transfer failed: ${error.message}`);
    }
  }

  /**
   * Get transaction details
   */
  async getTransaction(txHash: string) {
    try {
      const tx = await this.provider.getTransaction(txHash);
      const receipt = await this.provider.getTransactionReceipt(txHash);

      return {
        transaction: tx,
        receipt,
        explorerUrl: `https://basescan.org/tx/${txHash}`
      };
    } catch (error) {
      console.error(`[Locus] Error fetching transaction ${txHash}:`, error);
      throw error;
    }
  }

  /**
   * Estimate gas for a transaction
   */
  async estimateGas(params: TransferParams): Promise<string> {
    try {
      const gasEstimate = await this.provider.estimateGas({
        to: params.to,
        value: ethers.parseEther(params.amount)
      });

      return ethers.formatEther(gasEstimate);
    } catch (error) {
      console.error("[Locus] Gas estimation failed:", error);
      throw error;
    }
  }
}

/**
 * Create a Locus Wallet instance from environment variables
 */
export function createLocusWallet(): LocusWallet {
  const config: LocusWalletConfig = {
    address: process.env.LOCUS_WALLET_ADDRESS!,
    privateKey: process.env.LOCUS_PRIVATE_KEY!,
    chainId: parseInt(process.env.LOCUS_CHAIN_ID || "8453"),
    rpcUrl: process.env.LOCUS_RPC_URL || "https://mainnet.base.org",
    name: process.env.LOCUS_WALLET_NAME || "iGuard"
  };

  if (!config.address || !config.privateKey) {
    throw new Error("Locus wallet not configured. Set LOCUS_WALLET_ADDRESS and LOCUS_PRIVATE_KEY in .env");
  }

  return new LocusWallet(config);
}

/**
 * Singleton instance (lazy loaded)
 */
let locusWalletInstance: LocusWallet | null = null;

export function getLocusWallet(): LocusWallet {
  if (!locusWalletInstance) {
    locusWalletInstance = createLocusWallet();
  }
  return locusWalletInstance;
}
