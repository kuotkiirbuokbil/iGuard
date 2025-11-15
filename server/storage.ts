import type { 
  Creator, 
  InsertCreator, 
  Agent, 
  InsertAgent, 
  DataSource, 
  InsertDataSource,
  AccessLog,
  InsertAccessLog,
  User,
  UpsertUser
} from "@shared/schema";
import {
  users,
  creators,
  agents,
  dataSources,
  accessLogs
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getCreatorByUserId(userId: string): Promise<Creator | undefined>;
  getAgentByUserId(userId: string): Promise<Agent | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Creator operations
  getCreator(id: string): Promise<Creator | undefined>;
  createCreator(userId: string, creator: InsertCreator): Promise<Creator>;
  
  // Agent operations
  getAgent(id: string): Promise<Agent | undefined>;
  getAgentByApiKey(apiKey: string): Promise<Agent | undefined>;
  createAgent(userId: string, agent: InsertAgent): Promise<Agent>;
  updateAgent(id: string, updates: Partial<Agent>): Promise<Agent>;
  
  // Data source operations
  getDataSource(id: string): Promise<DataSource | undefined>;
  getDataSourcesByCreator(creatorId: string): Promise<DataSource[]>;
  createDataSource(dataSource: InsertDataSource): Promise<DataSource>;
  
  // Access log operations
  getAccessLogsByCreator(creatorId: string): Promise<AccessLog[]>;
  getAccessLogsByAgent(agentId: string): Promise<AccessLog[]>;
  createAccessLog(log: InsertAccessLog): Promise<AccessLog>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getCreatorByUserId(userId: string): Promise<Creator | undefined> {
    const [creator] = await db.select().from(creators).where(eq(creators.userId, userId));
    return creator;
  }

  async getAgentByUserId(userId: string): Promise<Agent | undefined> {
    const [agent] = await db.select().from(agents).where(eq(agents.userId, userId));
    return agent;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // First check if a user with this ID or email exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.id, userData.id!))
      .limit(1);

    if (existing.length > 0) {
      // Update existing user
      const [user] = await db
        .update(users)
        .set({
          ...userData,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userData.id!))
        .returning();
      return user;
    } else {
      // Create new user
      const [user] = await db
        .insert(users)
        .values(userData)
        .returning();
      return user;
    }
  }

  // Creator operations
  async getCreator(id: string): Promise<Creator | undefined> {
    const [creator] = await db.select().from(creators).where(eq(creators.id, id));
    return creator;
  }

  async createCreator(userId: string, insertCreator: InsertCreator): Promise<Creator> {
    const [creator] = await db
      .insert(creators)
      .values({ ...insertCreator, userId })
      .returning();
    return creator;
  }

  // Agent operations
  async getAgent(id: string): Promise<Agent | undefined> {
    const [agent] = await db.select().from(agents).where(eq(agents.id, id));
    return agent;
  }

  async getAgentByApiKey(apiKey: string): Promise<Agent | undefined> {
    const [agent] = await db
      .select()
      .from(agents)
      .where(eq(agents.apiKey, apiKey));
    return agent;
  }

  async createAgent(userId: string, insertAgent: InsertAgent): Promise<Agent> {
    const [agent] = await db
      .insert(agents)
      .values({ ...insertAgent, userId, apiKey: null, locusWalletId: null })
      .returning();
    return agent;
  }

  async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent> {
    const [agent] = await db
      .update(agents)
      .set(updates)
      .where(eq(agents.id, id))
      .returning();
    
    if (!agent) {
      throw new Error('Agent not found');
    }
    return agent;
  }

  // Data source operations
  async getDataSource(id: string): Promise<DataSource | undefined> {
    const [dataSource] = await db
      .select()
      .from(dataSources)
      .where(eq(dataSources.id, id));
    return dataSource;
  }

  async getDataSourcesByCreator(creatorId: string): Promise<DataSource[]> {
    const results = await db
      .select()
      .from(dataSources)
      .where(eq(dataSources.creatorId, creatorId))
      .orderBy(desc(dataSources.createdAt));
    return results;
  }

  async createDataSource(insertDataSource: InsertDataSource): Promise<DataSource> {
    const [dataSource] = await db
      .insert(dataSources)
      .values({
        ...insertDataSource,
        createdAt: new Date().toISOString()
      })
      .returning();
    return dataSource;
  }

  // Access log operations
  async getAccessLogsByCreator(creatorId: string): Promise<AccessLog[]> {
    // First get all data sources for this creator
    const creatorDataSources = await this.getDataSourcesByCreator(creatorId);
    const dataSourceIds = creatorDataSources.map(ds => ds.id);
    
    if (dataSourceIds.length === 0) return [];

    const results = await db
      .select()
      .from(accessLogs)
      .where(inArray(accessLogs.dataSourceId, dataSourceIds))
      .orderBy(desc(accessLogs.timestamp));
    return results;
  }

  async getAccessLogsByAgent(agentId: string): Promise<AccessLog[]> {
    const results = await db
      .select()
      .from(accessLogs)
      .where(eq(accessLogs.agentId, agentId))
      .orderBy(desc(accessLogs.timestamp));
    return results;
  }

  async createAccessLog(insertLog: InsertAccessLog): Promise<AccessLog> {
    const [log] = await db
      .insert(accessLogs)
      .values({
        ...insertLog,
        timestamp: new Date().toISOString()
      })
      .returning();
    return log;
  }
}

export const storage = new DatabaseStorage();
