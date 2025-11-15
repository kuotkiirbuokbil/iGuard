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

  // TEMPORARILY DISABLED - auth redirects disabled for development
  // useEffect(() => {
  //   if (authLoading) return; // Wait for auth to load
  //   
  //   if (!isAuthenticated) {
  //     setIsRedirecting(true);
  //     setLocation("/login");
  //     return;
  //   }
  //   
  //   if (!user) return; // Should not happen if isAuthenticated, but be safe
  //   
  //   if (!user.creatorId && !user.agentId) {
  //     setIsRedirecting(true);
  //     setLocation("/account-setup");
  //     return;
  //   }
  //   
  //   if (user.creatorId && !user.agentId) {
  //     setIsRedirecting(true);
  //     setLocation("/creator");
  //     return;
  //   }
  // }, [authLoading, isAuthenticated, user, setLocation]);

  // Fetch agent profile - TEMPORARILY DISABLED auth requirement
  const { data: agent, isLoading: loadingAgent } = useQuery<Agent>({
    queryKey: ['/api/agent/me'],
    enabled: true // Always enabled for now
  });

  // Fetch access logs - TEMPORARILY DISABLED auth requirement
  const { data: accessLogs = [], isLoading: loadingLogs } = useQuery({
    queryKey: ['/api/agent/me/access-logs'],
    enabled: true // Always enabled for now
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

  // TEMPORARILY DISABLED - show loading only while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Show loading while agent data is being fetched
  if (loadingAgent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading your agent profile...</p>
        </div>
      </div>
    );
  }
  
  // Use mock agent if not available
  const displayAgent = agent || {
    id: 'dev-agent-123',
    userId: 'dev-user-123',
    name: 'Dev Agent',
    apiKey: null,
    locusWalletId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

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
              agentId={displayAgent.id}
              agentName={displayAgent.name}
              apiKey={displayAgent.apiKey || undefined}
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
