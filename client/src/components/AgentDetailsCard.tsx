import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Copy, Key, Check } from "lucide-react";

interface AgentDetailsCardProps {
  agentId: string;
  agentName: string;
  apiKey?: string;
  onGenerateKey?: () => void;
}

export default function AgentDetailsCard({ agentId, agentName, apiKey, onGenerateKey }: AgentDetailsCardProps) {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string, type: 'id' | 'key') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
    toast({
      title: "Copied",
      description: `${type === 'id' ? 'Agent ID' : 'API Key'} copied to clipboard`,
    });
  };

  const handleGenerateKey = () => {
    if (onGenerateKey) {
      onGenerateKey();
    }
    toast({
      title: "API Key Generated",
      description: "Your new API key has been created",
    });
  };

  return (
    <Card data-testid="card-agent-details">
      <CardHeader>
        <CardTitle className="text-lg">Agent Details</CardTitle>
        <CardDescription>Manage your agent credentials</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Agent Name</p>
            <Badge variant="secondary">Active</Badge>
          </div>
          <p className="text-lg font-semibold" data-testid="text-agent-name">{agentName}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Agent ID</p>
          <div className="flex items-center space-x-2">
            <code className="flex-1 rounded-md bg-muted px-3 py-2 font-mono text-sm" data-testid="text-agent-id">
              {agentId}
            </code>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(agentId, 'id')}
              data-testid="button-copy-id"
            >
              {copiedId ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {apiKey ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">API Key</p>
            <div className="flex items-center space-x-2">
              <code className="flex-1 rounded-md bg-muted px-3 py-2 font-mono text-sm" data-testid="text-api-key">
                {apiKey}
              </code>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(apiKey, 'key')}
                data-testid="button-copy-key"
              >
                {copiedKey ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Keep this key secure. It grants access to the iGuard gateway.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-medium">API Key</p>
            <Button onClick={handleGenerateKey} className="w-full" data-testid="button-generate-key">
              <Key className="mr-2 h-4 w-4" />
              Generate API Key
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
