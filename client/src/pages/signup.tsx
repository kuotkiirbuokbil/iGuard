import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [accountType, setAccountType] = useState<"creator" | "agent">("creator");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          accountType
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Success",
          description: "Account created successfully! Redirecting...",
        });
        // Update the query cache with the user data from signup response
        queryClient.setQueryData(["/api/auth/user"], data.user);
        // Redirect to appropriate dashboard based on account type
        setTimeout(() => {
          setLocation(accountType === "creator" ? "/creator" : "/agent");
        }, 500);
      } else {
        const error = await response.json();
        toast({
          title: "Signup failed",
          description: error.message || "Could not create account",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred. Please try again.",
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
          <h1 className="text-2xl font-bold mb-2">Create your account</h1>
          <p className="text-muted-foreground">
            Start monetizing your data sources today
          </p>
        </div>

        <Card data-testid="card-signup">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Create your account to start using iGuard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div className="space-y-3">
                <Label>I want to...</Label>
                <RadioGroup value={accountType} onValueChange={(value: any) => setAccountType(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="creator" id="creator" />
                    <Label htmlFor="creator" className="font-normal cursor-pointer">
                      Monetize my data (Creator)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="agent" id="agent" />
                    <Label htmlFor="agent" className="font-normal cursor-pointer">
                      Consume APIs (Agent)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
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
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={8}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                data-testid="button-signup"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login">
                <span className="text-primary font-medium hover:underline" data-testid="link-login">
                  Log in
                </span>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
