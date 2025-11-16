import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TransactionLinkProps {
  transactionHash: string;
  network?: string;
  className?: string;
  variant?: "default" | "badge" | "button" | "inline";
}

/**
 * Get the block explorer URL for a transaction
 */
function getExplorerUrl(txHash: string, network: string = "base-sepolia"): string {
  const explorers: Record<string, string> = {
    "base": "https://basescan.org",
    "base-sepolia": "https://sepolia.basescan.org",
    "base-mainnet": "https://basescan.org",
    "ethereum": "https://etherscan.io",
    "sepolia": "https://sepolia.etherscan.io",
  };

  const baseUrl = explorers[network] || explorers["base-sepolia"];
  return `${baseUrl}/tx/${txHash}`;
}

/**
 * Shorten a transaction hash for display
 */
function shortenHash(hash: string, chars: number = 6): string {
  if (hash.length <= chars * 2 + 2) return hash;
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}

/**
 * Component to display a clickable transaction link
 */
export function TransactionLink({
  transactionHash,
  network = "base-sepolia",
  className = "",
  variant = "default"
}: TransactionLinkProps) {
  const explorerUrl = getExplorerUrl(transactionHash, network);
  const shortHash = shortenHash(transactionHash);

  const openTransaction = () => {
    window.open(explorerUrl, "_blank", "noopener,noreferrer");
  };

  if (variant === "badge") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              className={`cursor-pointer hover:bg-accent ${className}`}
              onClick={openTransaction}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              {shortHash}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>View on {network === "base-sepolia" ? "BaseScan (Testnet)" : "BaseScan"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (variant === "button") {
    return (
      <Button
        variant="outline"
        size="sm"
        className={className}
        onClick={openTransaction}
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        View Transaction
      </Button>
    );
  }

  if (variant === "inline") {
    return (
      <a
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center text-primary hover:underline ${className}`}
      >
        {shortHash}
        <ExternalLink className="w-3 h-3 ml-1" />
      </a>
    );
  }

  // Default variant
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <code className="text-xs bg-muted px-2 py-1 rounded">
        {shortHash}
      </code>
      <Button
        variant="ghost"
        size="sm"
        onClick={openTransaction}
        className="h-6 w-6 p-0"
      >
        <ExternalLink className="w-3 h-3" />
        <span className="sr-only">View on BaseScan</span>
      </Button>
    </div>
  );
}

interface PaymentMetadata {
  transactionHash: string;
  network: string;
  explorerUrl: string;
  walletUrl: string;
  viewTransaction: string;
}

interface PaymentInfoProps {
  payment: PaymentMetadata;
  className?: string;
}

/**
 * Component to display comprehensive payment information
 */
export function PaymentInfo({ payment, className = "" }: PaymentInfoProps) {
  return (
    <div className={`rounded-lg border bg-card p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Payment Received</h3>
        <Badge variant="secondary">
          {payment.network === "base-sepolia" ? "Base Sepolia" : "Base"}
        </Badge>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Transaction:</span>
          <TransactionLink
            transactionHash={payment.transactionHash}
            network={payment.network}
            variant="inline"
          />
        </div>

        <div className="flex gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => window.open(payment.explorerUrl, "_blank")}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Transaction
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => window.open(payment.walletUrl, "_blank")}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Wallet
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to extract payment metadata from API response
 */
export function usePaymentMetadata(data: any): PaymentMetadata | null {
  if (!data || !data._payment) {
    return null;
  }
  return data._payment as PaymentMetadata;
}
