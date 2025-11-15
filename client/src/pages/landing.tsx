import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, DollarSign, Lock, BarChart3, Wallet } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm">
              <Shield className="h-4 w-4" />
              <span className="font-medium">Secure API Gateway Platform</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Monetize Your Data Sources with Micropayments
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              iGuard is a paid API gateway that enables creators to protect their data sources 
              and get paid per request using USDC micropayments on Base blockchain.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" data-testid="button-get-started">
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" data-testid="button-login">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Everything you need to monetize your APIs
            </h2>
            <p className="text-lg text-muted-foreground">
              Built for creators and developers who want to earn from their data
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card data-testid="card-feature-payments">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Micropayment Gateway</CardTitle>
                <CardDescription>
                  Get paid per API request using USDC on Base blockchain. Set your own pricing with flexible rate limits.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card data-testid="card-feature-security">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Secure Access Control</CardTitle>
                <CardDescription>
                  API key authentication and request validation ensure only authorized agents can access your data sources.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card data-testid="card-feature-analytics">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Real-time Analytics</CardTitle>
                <CardDescription>
                  Track earnings, monitor request patterns, and view detailed access logs in your creator dashboard.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card data-testid="card-feature-instant">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Instant Settlements</CardTitle>
                <CardDescription>
                  Payments are processed instantly on-chain with the x402 protocol. No waiting for monthly payouts.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card data-testid="card-feature-spend">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Spend Controls</CardTitle>
                <CardDescription>
                  Agents can set budget limits with Locus wallet integration to prevent overspending on API calls.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card data-testid="card-feature-simple">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Developer Friendly</CardTitle>
                <CardDescription>
                  Simple integration with clear documentation. Protect any HTTP endpoint in minutes.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Ready to start earning?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join creators who are monetizing their data sources with iGuard
            </p>
            <Link href="/signup">
              <Button size="lg" data-testid="button-signup-cta">
                Create Your Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
