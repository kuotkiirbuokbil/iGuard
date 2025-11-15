// From blueprint:javascript_log_in_with_replit
import { useQuery } from "@tanstack/react-query";
import type { AuthUser } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading } = useQuery<AuthUser | null>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      const res = await fetch("/api/auth/user", {
        credentials: "include",
      });
      
      // Return null on 401 instead of throwing
      if (res.status === 401) {
        return null;
      }
      
      if (!res.ok) {
        throw new Error(`Failed to fetch user: ${res.statusText}`);
      }
      
      return res.json();
    },
    retry: false,
  });

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
  };
}
