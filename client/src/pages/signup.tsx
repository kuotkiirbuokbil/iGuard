import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function Signup() {
  const handleSignup = () => {
    // Redirect to Replit Auth login endpoint (same as login - account setup happens after)
    window.location.href = "/api/login";
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
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You'll be redirected to Replit's secure authentication page where you can:
            </p>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
              <li>Sign up with Google</li>
              <li>Sign up with GitHub</li>
              <li>Create an account with email and password</li>
            </ul>
            <p className="text-sm text-muted-foreground pt-2">
              After authentication, you'll choose whether you're a Creator (monetizing data) or an Agent (consuming APIs).
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              onClick={handleSignup}
              className="w-full"
              data-testid="button-signup"
            >
              Continue to Sign Up
            </Button>
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
