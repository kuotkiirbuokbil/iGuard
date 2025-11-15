import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  
  // Don't show navigation on auth pages
  const isAuthPage = location === "/login" || location === "/signup";
  if (isAuthPage) {
    return null;
  }

  // Show different navigation based on route
  const isLanding = location === "/";
  const isDashboard = location === "/creator" || location === "/agent";

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-2 py-1">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold">iGuard</span>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            {isLanding && (
              <>
                <Link href="/login">
                  <Button variant="ghost" data-testid="link-login">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button data-testid="link-signup">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
            
            {isDashboard && (
              <>
                <Link href="/creator">
                  <Button
                    variant={location === "/creator" ? "default" : "ghost"}
                    data-testid="link-creator"
                  >
                    Creator Dashboard
                  </Button>
                </Link>
                <Link href="/agent">
                  <Button
                    variant={location === "/agent" ? "default" : "ghost"}
                    data-testid="link-agent"
                  >
                    Agent Console
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
