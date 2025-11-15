import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Play } from "lucide-react";

interface TestGatewayCardProps {
  onTest?: (data: {
    dataSourceId: string;
    path: string;
    purpose: string;
  }) => void;
}

export default function TestGatewayCard({ onTest }: TestGatewayCardProps) {
  const [dataSourceId, setDataSourceId] = useState("");
  const [path, setPath] = useState("");
  const [purpose, setPurpose] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dataSourceId || !path || !purpose) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    const testData = { dataSourceId, path, purpose };
    
    if (onTest) {
      onTest(testData);
    }

    setTimeout(() => {
      setResponse(JSON.stringify({
        success: true,
        data: "Mock content for path: " + path,
        charged: "0.05 USDC",
        timestamp: new Date().toISOString(),
      }, null, 2));
      setIsLoading(false);
      toast({
        title: "Request Successful",
        description: "Gateway request completed",
      });
    }, 1000);
  };

  return (
    <Card data-testid="card-test-gateway">
      <CardHeader>
        <CardTitle className="text-lg">Test Gateway</CardTitle>
        <CardDescription>Test your connection to the iGuard gateway</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleTest} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dataSourceId">Data Source ID</Label>
            <Input
              id="dataSourceId"
              placeholder="ds-abc123"
              value={dataSourceId}
              onChange={(e) => setDataSourceId(e.target.value)}
              data-testid="input-data-source-id"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="path">Path</Label>
            <Input
              id="path"
              placeholder="/api/v1/data"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              data-testid="input-path"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Textarea
              id="purpose"
              placeholder="Describe why you need this data..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={3}
              data-testid="input-purpose"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading} data-testid="button-test-request">
            <Play className="mr-2 h-4 w-4" />
            {isLoading ? "Testing..." : "Test Request"}
          </Button>
        </form>

        {response && (
          <div className="space-y-2">
            <Label>Response</Label>
            <pre className="rounded-md bg-muted p-4 font-mono text-xs overflow-auto" data-testid="text-response">
              {response}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
