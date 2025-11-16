/**
 * Example of how to display x402 transaction links in your UI
 *
 * This component demonstrates various ways to show transaction information
 * when your API responses include payment metadata.
 */

import { useState } from "react";
import { TransactionLink, PaymentInfo, usePaymentMetadata } from "@/components/TransactionLink";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ApiResponseWithPayment {
  // Your actual data
  id: string;
  name: string;
  email: string;

  // Payment metadata (added by x402 middleware)
  _payment?: {
    transactionHash: string;
    network: string;
    explorerUrl: string;
    walletUrl: string;
    viewTransaction: string;
  };
}

export function PaymentTransactionExample() {
  const { toast } = useToast();
  const [data, setData] = useState<ApiResponseWithPayment | null>(null);

  // Extract payment metadata from response
  const paymentMeta = usePaymentMetadata(data);

  const fetchPaidData = async () => {
    try {
      // Example: Fetching data that requires payment
      const response = await fetch("/api/creator/me/data-sources");

      if (response.status === 402) {
        // Payment required - handle with x402 client
        toast({
          title: "Payment Required",
          description: "This endpoint requires payment via x402",
          variant: "default"
        });
        return;
      }

      const result = await response.json();
      setData(result);

      // Show success notification with transaction link
      if (result._payment) {
        toast({
          title: "Payment Successful",
          description: (
            <div className="flex items-center gap-2">
              <span>Transaction:</span>
              <TransactionLink
                transactionHash={result._payment.transactionHash}
                network={result._payment.network}
                variant="inline"
              />
            </div>
          ),
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>x402 Transaction Display Examples</CardTitle>
          <CardDescription>
            Different ways to display transaction links in your UI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Example 1: Badge variant */}
          <div>
            <h3 className="text-sm font-medium mb-2">Badge Variant (Compact)</h3>
            <div className="flex gap-2">
              <TransactionLink
                transactionHash="0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
                network="base-sepolia"
                variant="badge"
              />
              <TransactionLink
                transactionHash="0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
                network="base"
                variant="badge"
              />
            </div>
          </div>

          {/* Example 2: Button variant */}
          <div>
            <h3 className="text-sm font-medium mb-2">Button Variant</h3>
            <TransactionLink
              transactionHash="0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
              network="base-sepolia"
              variant="button"
            />
          </div>

          {/* Example 3: Inline variant */}
          <div>
            <h3 className="text-sm font-medium mb-2">Inline Variant (In text)</h3>
            <p className="text-sm text-muted-foreground">
              Payment successful! View your transaction:{" "}
              <TransactionLink
                transactionHash="0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
                network="base-sepolia"
                variant="inline"
              />
            </p>
          </div>

          {/* Example 4: Default variant */}
          <div>
            <h3 className="text-sm font-medium mb-2">Default Variant</h3>
            <TransactionLink
              transactionHash="0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
              network="base-sepolia"
            />
          </div>

          {/* Example 5: Full payment info card */}
          <div>
            <h3 className="text-sm font-medium mb-2">Complete Payment Info</h3>
            {paymentMeta ? (
              <PaymentInfo payment={paymentMeta} />
            ) : (
              <PaymentInfo
                payment={{
                  transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
                  network: "base-sepolia",
                  explorerUrl: "https://sepolia.basescan.org/tx/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
                  walletUrl: "https://sepolia.basescan.org/address/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
                  viewTransaction: "https://sepolia.basescan.org/tx/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
                }}
              />
            )}
          </div>

          {/* Example 6: Live API call */}
          <div>
            <h3 className="text-sm font-medium mb-2">Test with Live Data</h3>
            <Button onClick={fetchPaidData}>
              Fetch Data (May Require Payment)
            </Button>
            {data && (
              <div className="mt-4">
                <pre className="text-xs bg-muted p-4 rounded overflow-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Example 7: In a table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Example of displaying transactions in a table
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left font-medium">Date</th>
                  <th className="p-2 text-left font-medium">Amount</th>
                  <th className="p-2 text-left font-medium">Transaction</th>
                  <th className="p-2 text-left font-medium">Network</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">2025-11-15 10:30 AM</td>
                  <td className="p-2">$0.10 USDC</td>
                  <td className="p-2">
                    <TransactionLink
                      transactionHash="0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
                      network="base-sepolia"
                      variant="badge"
                    />
                  </td>
                  <td className="p-2">Base Sepolia</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">2025-11-15 09:15 AM</td>
                  <td className="p-2">$0.05 USDC</td>
                  <td className="p-2">
                    <TransactionLink
                      transactionHash="0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
                      network="base-sepolia"
                      variant="badge"
                    />
                  </td>
                  <td className="p-2">Base Sepolia</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Usage in your actual components:
 *
 * ```tsx
 * import { TransactionLink, usePaymentMetadata } from "@/components/TransactionLink";
 *
 * function MyComponent() {
 *   const { data } = useQuery("/api/creator/me/data-sources");
 *   const payment = usePaymentMetadata(data);
 *
 *   return (
 *     <div>
 *       {payment && (
 *         <div className="mb-4">
 *           <p>Payment transaction:</p>
 *           <TransactionLink
 *             transactionHash={payment.transactionHash}
 *             network={payment.network}
 *             variant="badge"
 *           />
 *         </div>
 *       )}
 *
 *       {/* Your component content }
 *     </div>
 *   );
 * }
 * ```
 */
