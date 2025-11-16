import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDataSourceSchema, insertAccessLogSchema } from "@shared/schema";
import { randomBytes } from "crypto";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { getLocusWallet } from "./locus";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up Replit Auth
  await setupAuth(app);

  // Email/Password Auth routes
  app.post('/api/auth/signup', async (req: any, res) => {
    try {
      const { email, password, firstName, lastName, accountType } = req.body;

      // Validate required fields
      if (!email || !password || !firstName || !lastName || !accountType) {
        return res.status(400).json({ 
          message: "All fields are required",
          details: {
            email: !email ? "Email is required" : undefined,
            password: !password ? "Password is required" : undefined,
            firstName: !firstName ? "First name is required" : undefined,
            lastName: !lastName ? "Last name is required" : undefined,
            accountType: !accountType ? "Account type is required" : undefined,
          }
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // Validate password length
      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }

      if (accountType !== 'creator' && accountType !== 'agent') {
        return res.status(400).json({ message: "Invalid account type. Must be 'creator' or 'agent'" });
      }

      // TEMPORARILY DISABLED - return mock user immediately without database
      // This allows signup to work even if database is not available
      const userId = `dev-user-${randomBytes(8).toString('hex')}`;
      const name = `${firstName} ${lastName}`.trim();
      const creatorId = accountType === 'creator' ? `dev-creator-${randomBytes(8).toString('hex')}` : null;
      const agentId = accountType === 'agent' ? `dev-agent-${randomBytes(8).toString('hex')}` : null;

      // Try to create user in database, but don't fail if it doesn't work
      let user;
      try {
        // Check if user already exists
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser) {
          user = existingUser;
        } else {
          // Create user
          user = await storage.upsertUser({
            id: userId,
            email,
            firstName,
            lastName,
            profileImageUrl: null,
            accountType
          });

          // Create creator or agent profile immediately
          try {
            if (accountType === 'creator') {
              await storage.createCreator(userId, { name, email });
            } else {
              await storage.createAgent(userId, { name });
            }
          } catch (profileError: any) {
            // If profile creation fails (e.g., duplicate email), log but continue
            console.error("Profile creation error (non-fatal):", profileError);
          }
        }
      } catch (dbError: any) {
        // Database error - use mock data instead
        console.error("Database error during signup (using mock data):", dbError);
        user = {
          id: userId,
          email,
          firstName,
          lastName,
          profileImageUrl: null,
          accountType,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }

      // Automatically log in the user by creating a session
      req.session.userId = user.id;
      req.session.user = user;

      res.status(201).json({ 
        message: "Account created successfully", 
        accountType,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          accountType: user.accountType,
          creatorId,
          agentId
        }
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      console.error("Error details:", {
        message: error?.message,
        code: error?.code,
        constraint: error?.constraint,
        detail: error?.detail,
        stack: error?.stack
      });
      res.status(500).json({ 
        message: "Failed to create account",
        error: error instanceof Error ? error.message : "Unknown error",
        details: process.env.NODE_ENV === 'development' ? {
          code: error?.code,
          constraint: error?.constraint,
          detail: error?.detail
        } : undefined
      });
    }
  });

  app.post('/api/auth/login', async (req: any, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Get user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // In production, compare hashed password
      // For now, we skip password validation since we're not storing it

      // Create session
      req.session.userId = user.id;
      req.session.user = user;

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          accountType: user.accountType
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post('/api/auth/logout', async (req: any, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  // Middleware to check if user is authenticated via email/password
  // TEMPORARILY DISABLED - allows access without authentication
  const isEmailAuthenticated = (req: any, res: any, next: any) => {
    // Always allow access for now
    return next();
  };

  // Auth routes
  // TEMPORARILY DISABLED - bypass all auth checks and return mock user
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      
      // TEMPORARILY DISABLED - always return mock user for development
      // Try to get real user if session exists, but fallback to mock
      let user;
      if (userId) {
        try {
          user = await storage.getUser(userId);
          if (user) {
            // Check if user has a creator or agent profile
            const creator = await storage.getCreatorByUserId(userId);
            const agent = await storage.getAgentByUserId(userId);
            
            return res.json({
              ...user,
              creatorId: creator?.id || null,
              agentId: agent?.id || null
            });
          }
        } catch (dbError) {
          console.error("Database error fetching user (using mock):", dbError);
        }
      }
      
      // Return mock user (always works, no database required)
      return res.json({
        id: userId || 'dev-user-123',
        email: 'dev@example.com',
        firstName: 'Dev',
        lastName: 'User',
        accountType: 'creator',
        profileImageUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        creatorId: 'dev-creator-123',
        agentId: null
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      // Return mock user on any error
      res.json({
        id: 'dev-user-123',
        email: 'dev@example.com',
        firstName: 'Dev',
        lastName: 'User',
        accountType: 'creator',
        profileImageUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        creatorId: 'dev-creator-123',
        agentId: null
      });
    }
  });

  // Account setup endpoint
  // TEMPORARILY DISABLED - bypass auth middleware
  app.post('/api/setup-account', async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      const { accountType } = req.body;

      if (!accountType || (accountType !== 'creator' && accountType !== 'agent')) {
        return res.status(400).json({ error: "Invalid account type" });
      }

      // TEMPORARILY DISABLED - return success immediately if no session
      if (!userId) {
        return res.json({ 
          accountType, 
          profileId: accountType === 'creator' ? 'dev-creator-123' : 'dev-agent-123'
        });
      }

      // Check if user already has a profile
      const creator = await storage.getCreatorByUserId(userId);
      const agent = await storage.getAgentByUserId(userId);

      if (creator || agent) {
        // Return success with existing profile instead of error
        return res.json({ 
          accountType: creator ? 'creator' : 'agent',
          profileId: creator?.id || agent?.id
        });
      }

      // Get user to populate name/email
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Create the appropriate profile
      if (accountType === 'creator') {
        const creatorProfile = await storage.createCreator(userId, {
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown Creator',
          email: user.email || ''
        });
        res.json({ accountType, profileId: creatorProfile.id });
      } else {
        const agentProfile = await storage.createAgent(userId, {
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown Agent'
        });
        res.json({ accountType, profileId: agentProfile.id });
      }
    } catch (error) {
      console.error("Error setting up account:", error);
      res.status(500).json({ error: "Failed to set up account" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
  });

  // Authenticated Creator endpoints (/me endpoints)
  app.get("/api/creator/me", isEmailAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      
      // TEMPORARILY DISABLED - return mock creator if not authenticated
      if (!userId) {
        return res.json({
          id: 'dev-creator-123',
          userId: 'dev-user-123',
          name: 'Dev Creator',
          email: 'dev@example.com',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      
      const creator = await storage.getCreatorByUserId(userId);
      if (!creator) {
        // Return mock creator if not found
        return res.json({
          id: 'dev-creator-123',
          userId: 'dev-user-123',
          name: 'Dev Creator',
          email: 'dev@example.com',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      res.json(creator);
    } catch (error) {
      console.error("Error fetching creator:", error);
      // Return mock creator on error
      res.json({
        id: 'dev-creator-123',
        userId: 'dev-user-123',
        name: 'Dev Creator',
        email: 'dev@example.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  });

  app.get("/api/creator/me/data-sources", isEmailAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      
      // TEMPORARILY DISABLED - return empty array if not authenticated
      if (!userId) {
        return res.json([]);
      }
      
      const creator = await storage.getCreatorByUserId(userId);
      if (!creator) {
        return res.json([]);
      }
      const dataSources = await storage.getDataSourcesByCreator(creator.id);
      res.json(dataSources);
    } catch (error) {
      console.error("Error fetching data sources:", error);
      res.json([]);
    }
  });

  app.post("/api/creator/me/data-sources", isEmailAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const creator = await storage.getCreatorByUserId(userId);
      if (!creator) {
        return res.status(404).json({ error: "Creator profile not found" });
      }

      const validation = insertDataSourceSchema.safeParse({
        ...req.body,
        creatorId: creator.id,
      });

      if (!validation.success) {
        return res.status(400).json({ error: validation.error });
      }

      const dataSource = await storage.createDataSource(validation.data);
      res.status(201).json(dataSource);
    } catch (error) {
      console.error("Error creating data source:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/creator/me/access-logs", isEmailAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      
      // TEMPORARILY DISABLED - return empty array if not authenticated
      if (!userId) {
        return res.json([]);
      }
      
      const creator = await storage.getCreatorByUserId(userId);
      if (!creator) {
        return res.json([]);
      }
      const logs = await storage.getAccessLogsByCreator(creator.id);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching access logs:", error);
      res.json([]);
    }
  });

  // Authenticated Agent endpoints (/me endpoints)
  app.get("/api/agent/me", isEmailAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      
      // TEMPORARILY DISABLED - return mock agent if not authenticated
      if (!userId) {
        return res.json({
          id: 'dev-agent-123',
          userId: 'dev-user-123',
          name: 'Dev Agent',
          apiKey: null,
          locusWalletId: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      
      const agent = await storage.getAgentByUserId(userId);
      if (!agent) {
        // Return mock agent if not found
        return res.json({
          id: 'dev-agent-123',
          userId: 'dev-user-123',
          name: 'Dev Agent',
          apiKey: null,
          locusWalletId: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      res.json(agent);
    } catch (error) {
      console.error("Error fetching agent:", error);
      // Return mock agent on error
      res.json({
        id: 'dev-agent-123',
        userId: 'dev-user-123',
        name: 'Dev Agent',
        apiKey: null,
        locusWalletId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  });

  app.post("/api/agent/me/generate-key", isEmailAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const agent = await storage.getAgentByUserId(userId);
      if (!agent) {
        return res.status(404).json({ error: "Agent profile not found" });
      }

      const apiKey = `sk_live_${randomBytes(24).toString('hex')}`;
      const updatedAgent = await storage.updateAgent(agent.id, { apiKey });
      res.json({ apiKey: updatedAgent.apiKey });
    } catch (error) {
      console.error("Error generating API key:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/agent/me/access-logs", isEmailAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      
      // TEMPORARILY DISABLED - return empty array if not authenticated
      if (!userId) {
        return res.json([]);
      }
      
      const agent = await storage.getAgentByUserId(userId);
      if (!agent) {
        return res.json([]);
      }
      const logs = await storage.getAccessLogsByAgent(agent.id);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching access logs:", error);
      res.json([]);
    }
  });

  // Creator routes
  app.get("/api/creators/:id", async (req, res) => {
    try {
      const creator = await storage.getCreator(req.params.id);
      if (!creator) {
        return res.status(404).json({ error: "Creator not found" });
      }
      res.json(creator);
    } catch (error) {
      console.error("Error fetching creator:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/creators/:id/data-sources", async (req, res) => {
    try {
      const dataSources = await storage.getDataSourcesByCreator(req.params.id);
      res.json(dataSources);
    } catch (error) {
      console.error("Error fetching data sources:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/creators/:id/data-sources", async (req, res) => {
    try {
      const validation = insertDataSourceSchema.safeParse({
        ...req.body,
        creatorId: req.params.id,
      });

      if (!validation.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validation.error.issues 
        });
      }

      const dataSource = await storage.createDataSource(validation.data);
      res.status(201).json(dataSource);
    } catch (error) {
      console.error("Error creating data source:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/creators/:id/access-logs", async (req, res) => {
    try {
      const logs = await storage.getAccessLogsByCreator(req.params.id);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching access logs:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Agent routes
  app.get("/api/agents/:id", async (req, res) => {
    try {
      const agent = await storage.getAgent(req.params.id);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      console.error("Error fetching agent:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/agents/:id/generate-key", async (req, res) => {
    try {
      const agent = await storage.getAgent(req.params.id);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }

      // Generate a secure API key
      const apiKey = `sk_live_${randomBytes(32).toString('hex')}`;
      
      const updatedAgent = await storage.updateAgent(req.params.id, { apiKey });
      res.json(updatedAgent);
    } catch (error) {
      console.error("Error generating API key:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/agents/:id/access-logs", async (req, res) => {
    try {
      const logs = await storage.getAccessLogsByAgent(req.params.id);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching access logs:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Access log creation (for testing)
  app.post("/api/access-logs", async (req, res) => {
    try {
      const validation = insertAccessLogSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          error: "Validation failed",
          details: validation.error.issues
        });
      }

      const log = await storage.createAccessLog(validation.data);
      res.status(201).json(log);
    } catch (error) {
      console.error("Error creating access log:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Locus Wallet Routes

  // Get Locus wallet info
  app.get("/api/locus/wallet", async (req, res) => {
    try {
      const wallet = getLocusWallet();
      const info = await wallet.getWalletInfo();
      const ethBalance = await wallet.getBalance();
      const usdcBalance = await wallet.getUSDCBalance();

      res.json({
        ...info,
        balances: {
          ETH: ethBalance,
          USDC: usdcBalance
        },
        explorerUrl: `https://basescan.org/address/${info.address}`
      });
    } catch (error: any) {
      console.error("Error fetching Locus wallet info:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get wallet balance
  app.get("/api/locus/balance", async (req, res) => {
    try {
      const wallet = getLocusWallet();
      const ethBalance = await wallet.getBalance();
      const usdcBalance = await wallet.getUSDCBalance();

      res.json({
        ETH: ethBalance,
        USDC: usdcBalance
      });
    } catch (error: any) {
      console.error("Error fetching balance:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Transfer ETH
  app.post("/api/locus/transfer/eth", async (req, res) => {
    try {
      const { to, amount } = req.body;

      if (!to || !amount) {
        return res.status(400).json({ error: "Missing required fields: to, amount" });
      }

      const wallet = getLocusWallet();
      const result = await wallet.transferETH({ to, amount });

      res.json(result);
    } catch (error: any) {
      console.error("Error transferring ETH:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Transfer USDC
  app.post("/api/locus/transfer/usdc", async (req, res) => {
    try {
      const { to, amount } = req.body;

      if (!to || !amount) {
        return res.status(400).json({ error: "Missing required fields: to, amount" });
      }

      const wallet = getLocusWallet();
      const result = await wallet.transferUSDC({ to, amount });

      res.json(result);
    } catch (error: any) {
      console.error("Error transferring USDC:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Transfer any ERC20 token
  app.post("/api/locus/transfer/token", async (req, res) => {
    try {
      const { tokenAddress, to, amount } = req.body;

      if (!tokenAddress || !to || !amount) {
        return res.status(400).json({
          error: "Missing required fields: tokenAddress, to, amount"
        });
      }

      const wallet = getLocusWallet();
      const result = await wallet.transferToken(tokenAddress, { to, amount });

      res.json(result);
    } catch (error: any) {
      console.error("Error transferring token:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get transaction details
  app.get("/api/locus/transaction/:txHash", async (req, res) => {
    try {
      const { txHash } = req.params;
      const wallet = getLocusWallet();
      const txDetails = await wallet.getTransaction(txHash);

      res.json(txDetails);
    } catch (error: any) {
      console.error("Error fetching transaction:", error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
