import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, Wallet, Send, CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface WalletInfo {
  address: string;
  balances: {
    ETH: string;
    USDC: string;
  };
  explorerUrl: string;
}

interface TransactionResult {
  transactionHash: string;
  from: string;
  to: string;
  amount: string;
  explorerUrl: string;
  success: boolean;
}

export default function PaymentDemo() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferResult, setTransferResult] = useState<TransactionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usdcAmount, setUsdcAmount] = useState("0.10");
  const [recipient, setRecipient] = useState("0xA8Cb16414454D41707ACFB8B38a192DF83d8aED9");

  const loadWalletInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/locus/wallet");
      if (!response.ok) throw new Error("Failed to load wallet");
      const data = await response.json();
      setWalletInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const sendUSDC = async () => {
    setTransferLoading(true);
    setError(null);
    setTransferResult(null);

    try {
      const response = await fetch("/api/locus/transfer/usdc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipient,
          amount: usdcAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Transfer failed");
      }

      setTransferResult(data);
      // Reload wallet to show updated balance
      await loadWalletInfo();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setTransferLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">iGuard Payment Demo</h1>
          <p className="text-muted-foreground">
            Test Locus wallet and x402 payment functionality on Base mainnet
          </p>
        </div>

        {/* Wallet Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Locus Wallet
            </CardTitle>
            <CardDescription>Your iGuard AI agent wallet on Base</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!walletInfo ? (
              <Button onClick={loadWalletInfo} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load Wallet Info"
                )}
              </Button>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Address:</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {walletInfo.address.slice(0, 6)}...{walletInfo.address.slice(-4)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">ETH Balance:</span>
                    <span className="text-lg font-bold">{walletInfo.balances.ETH} ETH</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">USDC Balance:</span>
                    <span className="text-lg font-bold text-green-600">
                      ${walletInfo.balances.USDC} USDC
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(walletInfo.explorerUrl, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on BaseScan
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadWalletInfo}>
                    Refresh
                  </Button>
                </div>

                {walletInfo.balances.USDC === "0.0" && (
                  <Alert>
                    <AlertDescription>
                      <strong>Wallet needs funding!</strong>
                      <br />
                      Send USDC and ETH to <code className="text-xs">{walletInfo.address}</code> to
                      test transfers.
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Transfer Card */}
        {walletInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Send USDC Payment
              </CardTitle>
              <CardDescription>
                Transfer USDC on Base mainnet (transaction will be visible on BaseScan)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Address</Label>
                <Input
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="0x..."
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Default: x402 receive wallet (0xA8Cb...aED9)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USDC)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={usdcAmount}
                  onChange={(e) => setUsdcAmount(e.target.value)}
                  placeholder="0.10"
                />
              </div>

              <Button
                onClick={sendUSDC}
                disabled={transferLoading || parseFloat(walletInfo.balances.USDC) === 0}
                className="w-full"
              >
                {transferLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Transaction...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send ${usdcAmount} USDC
                  </>
                )}
              </Button>

              {parseFloat(walletInfo.balances.USDC) === 0 && (
                <p className="text-sm text-muted-foreground text-center">
                  Fund your wallet with USDC to enable transfers
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Result */}
        {transferResult && (
          <Card className="border-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                Transaction Successful!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction Hash:</span>
                  <code className="text-xs font-mono">
                    {transferResult.transactionHash.slice(0, 10)}...
                    {transferResult.transactionHash.slice(-8)}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">From:</span>
                  <code className="text-xs font-mono">
                    {transferResult.from.slice(0, 6)}...{transferResult.from.slice(-4)}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">To:</span>
                  <code className="text-xs font-mono">
                    {transferResult.to.slice(0, 6)}...{transferResult.to.slice(-4)}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-bold text-green-600">${transferResult.amount} USDC</span>
                </div>
              </div>

              <Button
                onClick={() => window.open(transferResult.explorerUrl, "_blank")}
                className="w-full"
                variant="default"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Transaction on BaseScan
              </Button>

              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  ✅ Your transaction is now on the Base blockchain!
                  <br />
                  Click the button above to see the transaction on BaseScan with full on-chain
                  proof.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <ol className="list-decimal list-inside space-y-2">
              <li>
                <strong>Fund your wallet:</strong> Send USDC and ETH (for gas) to your Locus wallet
                address
              </li>
              <li>
                <strong>Click "Load Wallet Info":</strong> Verify your balance shows up
              </li>
              <li>
                <strong>Enter amount and recipient:</strong> Default sends $0.10 to x402 wallet
              </li>
              <li>
                <strong>Click "Send USDC":</strong> Transaction will be submitted to Base blockchain
              </li>
              <li>
                <strong>View on BaseScan:</strong> Click the link to see your transaction with full
                on-chain proof
              </li>
            </ol>

            <Alert className="mt-4">
              <AlertDescription>
                <strong>Need funds?</strong> Send to:{" "}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                  0x6A2747102A2fDCCF4d05b3Ba74193EBe8FEF1CfD
                </code>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
