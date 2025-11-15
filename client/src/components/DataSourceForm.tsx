import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface DataSourceFormProps {
  onSubmit?: (data: {
    url: string;
    pricePerRequest: string;
    rateLimit?: number;
  }) => void;
}

export default function DataSourceForm({ onSubmit }: DataSourceFormProps) {
  const [url, setUrl] = useState("");
  const [pricePerRequest, setPricePerRequest] = useState("");
  const [rateLimit, setRateLimit] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url || !pricePerRequest) {
      toast({
        title: "Error",
        description: "URL and Price are required",
        variant: "destructive",
      });
      return;
    }

    const data = {
      url,
      pricePerRequest,
      rateLimit: rateLimit ? parseInt(rateLimit) : undefined,
    };

    if (onSubmit) {
      onSubmit(data);
    }

    toast({
      title: "Data Source Added",
      description: `${url} has been connected successfully.`,
    });

    setUrl("");
    setPricePerRequest("");
    setRateLimit("");
  };

  return (
    <Card data-testid="card-data-source-form">
      <CardHeader>
        <CardTitle className="text-lg">Connect Data Source</CardTitle>
        <CardDescription>Add a new data source to monetize your content</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Data Source URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://api.example.com/data"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              data-testid="input-url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price per Request (USDC)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="0.05"
              value={pricePerRequest}
              onChange={(e) => setPricePerRequest(e.target.value)}
              data-testid="input-price"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rateLimit">Rate Limit (optional)</Label>
            <Input
              id="rateLimit"
              type="number"
              placeholder="100"
              value={rateLimit}
              onChange={(e) => setRateLimit(e.target.value)}
              data-testid="input-rate-limit"
            />
            <p className="text-sm text-muted-foreground">Maximum requests per hour</p>
          </div>

          <Button type="submit" className="w-full" data-testid="button-add-source">
            <Plus className="mr-2 h-4 w-4" />
            Add Data Source
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
