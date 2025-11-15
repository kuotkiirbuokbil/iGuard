import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDataSourceSchema, insertAccessLogSchema } from "@shared/schema";
import { randomBytes } from "crypto";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up Replit Auth
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Check if user has a creator or agent profile
      const creator = await storage.getCreatorByUserId(userId);
      const agent = await storage.getAgentByUserId(userId);
      
      res.json({
        ...user,
        creatorId: creator?.id || null,
        agentId: agent?.id || null
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Account setup endpoint
  app.post('/api/setup-account', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { accountType } = req.body;

      if (!accountType || (accountType !== 'creator' && accountType !== 'agent')) {
        return res.status(400).json({ error: "Invalid account type" });
      }

      // Check if user already has a profile
      const creator = await storage.getCreatorByUserId(userId);
      const agent = await storage.getAgentByUserId(userId);

      if (creator || agent) {
        return res.status(400).json({ error: "Account already set up" });
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
  app.get("/api/creator/me", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const creator = await storage.getCreatorByUserId(userId);
      if (!creator) {
        return res.status(404).json({ error: "Creator profile not found" });
      }
      res.json(creator);
    } catch (error) {
      console.error("Error fetching creator:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/creator/me/data-sources", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const creator = await storage.getCreatorByUserId(userId);
      if (!creator) {
        return res.status(404).json({ error: "Creator profile not found" });
      }
      const dataSources = await storage.getDataSourcesByCreator(creator.id);
      res.json(dataSources);
    } catch (error) {
      console.error("Error fetching data sources:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/creator/me/data-sources", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  app.get("/api/creator/me/access-logs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const creator = await storage.getCreatorByUserId(userId);
      if (!creator) {
        return res.status(404).json({ error: "Creator profile not found" });
      }
      const logs = await storage.getAccessLogsByCreator(creator.id);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching access logs:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Authenticated Agent endpoints (/me endpoints)
  app.get("/api/agent/me", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const agent = await storage.getAgentByUserId(userId);
      if (!agent) {
        return res.status(404).json({ error: "Agent profile not found" });
      }
      res.json(agent);
    } catch (error) {
      console.error("Error fetching agent:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/agent/me/generate-key", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  app.get("/api/agent/me/access-logs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const agent = await storage.getAgentByUserId(userId);
      if (!agent) {
        return res.status(404).json({ error: "Agent profile not found" });
      }
      const logs = await storage.getAccessLogsByAgent(agent.id);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching access logs:", error);
      res.status(500).json({ error: "Internal server error" });
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

  const httpServer = createServer(app);

  return httpServer;
}
