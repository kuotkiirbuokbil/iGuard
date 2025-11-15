import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import PageHeader from "@/components/PageHeader";
import AgentDetailsCard from "@/components/AgentDetailsCard";
import TestGatewayCard from "@/components/TestGatewayCard";
import AccessLogsTable from "@/components/AccessLogsTable";
import { useToast } from "@/hooks/use-toast";
import type { Agent, AccessLog } from "@shared/schema";

export default function AgentConsole() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Handle redirects based on auth state
  useEffect(() => {
    if (authLoading) return; // Wait for auth to load
    
    if (!isAuthenticated) {
      setIsRedirecting(true);
      setLocation("/login");
      return;
    }
    
    if (!user) return; // Should not happen if isAuthenticated, but be safe
    
    if (!user.creatorId && !user.agentId) {
      setIsRedirecting(true);
      setLocation("/account-setup");
      return;
    }
    
    if (user.creatorId && !user.agentId) {
      setIsRedirecting(true);
      setLocation("/creator");
      return;
    }
  }, [authLoading, isAuthenticated, user, setLocation]);

  // Fetch agent profile
  const { data: agent, isLoading: loadingAgent } = useQuery<Agent>({
    queryKey: ['/api/agent/me'],
    enabled: !!user?.agentId
  });

  // Fetch access logs
  const { data: accessLogs = [], isLoading: loadingLogs } = useQuery({
    queryKey: ['/api/agent/me/access-logs'],
    enabled: !!user?.agentId
  });

  // Generate API key mutation
  const generateKeyMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/agent/me/generate-key');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/agent/me'] });
      toast({
        title: "Success",
        description: "API key generated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleGenerateKey = () => {
    generateKeyMutation.mutate();
  };

  const handleTestGateway = (data: { dataSourceId: string; path: string; purpose: string }) => {
    console.log('Testing gateway:', data);
    toast({
      title: "Gateway Test",
      description: "This will call the /api/gateway/fetch endpoint in Phase 2",
    });
  };

  // Show loading only while auth is being checked or redirecting
  if (authLoading || isRedirecting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">{isRedirecting ? 'Redirecting...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  // Safeguard: If somehow we get here without an agent profile, show loading
  // (the redirect effect should have already triggered)
  if (!user?.agentId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Show loading while agent data is being fetched
  if (loadingAgent || !agent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading your agent profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 lg:px-8 py-8 max-w-7xl">
        <div className="space-y-8">
          <PageHeader
            title="Agent Console"
            description="Manage your agent credentials and test gateway access"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AgentDetailsCard
              agentId={agent?.id}
              agentName={agent?.name}
              apiKey={agent?.apiKey || undefined}
              onGenerateKey={handleGenerateKey}
            />
            <TestGatewayCard onTest={handleTestGateway} />
          </div>

          {loadingLogs ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Loading logs...</p>
            </div>
          ) : (
            <AccessLogsTable logs={accessLogs} />
          )}
        </div>
      </div>
    </div>
  );
}
