import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import DataSourceForm from "@/components/DataSourceForm";
import DataSourcesTable from "@/components/DataSourcesTable";
import AccessLogsTable from "@/components/AccessLogsTable";
import { DollarSign, Activity, Database, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { DataSource, AccessLog, Creator } from "@shared/schema";

export default function CreatorDashboard() {
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
  //   if (user.agentId && !user.creatorId) {
  //     setIsRedirecting(true);
  //     setLocation("/agent");
  //     return;
  //   }
  // }, [authLoading, isAuthenticated, user, setLocation]);

  // Fetch creator profile - TEMPORARILY DISABLED auth requirement
  const { data: creator } = useQuery<Creator>({
    queryKey: ['/api/creator/me'],
    enabled: true // Always enabled for now
  });

  // Fetch data sources - TEMPORARILY DISABLED auth requirement
  const { data: dataSources = [], isLoading: loadingDataSources } = useQuery({
    queryKey: ['/api/creator/me/data-sources'],
    enabled: true // Always enabled for now
  });

  // Fetch access logs - TEMPORARILY DISABLED auth requirement
  const { data: accessLogs = [], isLoading: loadingLogs } = useQuery({
    queryKey: ['/api/creator/me/access-logs'],
    enabled: true // Always enabled for now
  });

  // Create data source mutation
  const createDataSourceMutation = useMutation({
    mutationFn: async (data: { url: string; pricePerRequest: string; rateLimit?: number }) => {
      const res = await apiRequest('POST', '/api/creator/me/data-sources', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/creator/me/data-sources'] });
      toast({
        title: "Success",
        description: "Data source created successfully",
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

  const handleAddDataSource = (data: { url: string; pricePerRequest: string; rateLimit?: number }) => {
    createDataSourceMutation.mutate(data);
  };

  // Calculate stats
  const totalRequests = accessLogs.filter(log => log.status === 'success').length;
  const totalEarnings = accessLogs
    .filter(log => log.status === 'success' && log.amount)
    .reduce((sum, log) => sum + parseFloat(log.amount || '0'), 0)
    .toFixed(2);

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 lg:px-8 py-8 max-w-7xl">
        <div className="space-y-8">
          <PageHeader
            title="Creator Dashboard"
            description="Manage your data sources and monitor earnings"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Earnings"
              value={`$${totalEarnings}`}
              icon={DollarSign}
            />
            <StatCard
              title="Total Requests"
              value={totalRequests}
              icon={Activity}
            />
            <StatCard
              title="Active Sources"
              value={dataSources.length}
              icon={Database}
            />
            <StatCard
              title="Success Rate"
              value={totalRequests > 0 ? `${Math.round((totalRequests / accessLogs.length) * 100)}%` : '0%'}
              icon={TrendingUp}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <DataSourceForm onSubmit={handleAddDataSource} />
            </div>
            <div className="lg:col-span-2">
              {loadingDataSources ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              ) : (
                <DataSourcesTable dataSources={dataSources} />
              )}
            </div>
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
