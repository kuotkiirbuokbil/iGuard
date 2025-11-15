import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Success",
          description: "Logged in successfully",
        });

        // Redirect based on account type
        if (data.user?.accountType === 'creator') {
          setLocation("/creator");
        } else if (data.user?.accountType === 'agent') {
          setLocation("/agent");
        } else {
          setLocation("/account-setup");
        }
      } else {
        const error = await response.json();
        toast({
          title: "Login failed",
          description: error.message || "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-flex items-center gap-2 mb-4 hover-elevate active-elevate-2 rounded-md px-3 py-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">iGuard</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground">
            Log in to your account to continue
          </p>
        </div>

        <Card data-testid="card-login">
          <CardHeader>
            <CardTitle>Log In</CardTitle>
            <CardDescription>
              Sign in with your email and password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                data-testid="button-login"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </form>

          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup">
                <span className="text-primary font-medium hover:underline" data-testid="link-signup">
                  Sign up
                </span>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
