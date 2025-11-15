import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Shield, User, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

export default function AccountSetup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [accountType, setAccountType] = useState<"creator" | "agent">("creator");

  const setupMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/setup-account', {
        method: 'POST',
        body: JSON.stringify({ accountType }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Setup failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Account setup complete",
        description: `Your ${accountType} account is ready!`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setLocation(accountType === "creator" ? "/creator" : "/agent");
    },
    onError: (error: Error) => {
      toast({
        title: "Setup failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setupMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">iGuard</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome{(user as any)?.firstName ? `, ${(user as any).firstName}` : ''}!</h1>
          <p className="text-muted-foreground">
            Choose your account type to get started
          </p>
        </div>

        <Card data-testid="card-account-setup">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Account Type</CardTitle>
              <CardDescription>
                Select how you want to use iGuard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup 
                value={accountType} 
                onValueChange={(value) => setAccountType(value as "creator" | "agent")}
                data-testid="radio-account-type"
              >
                <div className="flex items-start space-x-3 p-4 rounded-lg border hover-elevate">
                  <RadioGroupItem value="creator" id="creator" data-testid="radio-creator" />
                  <Label htmlFor="creator" className="font-normal cursor-pointer flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-5 w-5 text-primary" />
                      <div className="font-semibold text-base">Creator</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Monetize your data sources and APIs. Set pricing, manage access, and earn from every request.
                    </div>
                  </Label>
                </div>
                <div className="flex items-start space-x-3 p-4 rounded-lg border hover-elevate">
                  <RadioGroupItem value="agent" id="agent" data-testid="radio-agent" />
                  <Label htmlFor="agent" className="font-normal cursor-pointer flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="h-5 w-5 text-primary" />
                      <div className="font-semibold text-base">Agent</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Access protected APIs with spend controls. Generate API keys and manage your budget with Locus wallet.
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={setupMutation.isPending}
                data-testid="button-continue"
              >
                {setupMutation.isPending ? "Setting up..." : "Continue"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
