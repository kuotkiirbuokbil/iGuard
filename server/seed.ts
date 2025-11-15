import { storage } from "./storage";
import { randomUUID } from "crypto";
import { db } from "./db";
import { creators, agents } from "@shared/schema";

export async function seedDatabase() {
  try {
    // Check if demo data already exists
    const existingCreators = await db.select().from(creators).limit(1);
    if (existingCreators.length > 0) {
      console.log('Demo data already exists, skipping seed...');
      
      // Return the first creator and agent IDs for demo purposes
      const allCreators = await db.select().from(creators).limit(1);
      const allAgents = await db.select().from(agents).limit(1);
      
      if (allCreators.length > 0 && allAgents.length > 0) {
        return {
          creatorId: allCreators[0].id,
          agentId: allAgents[0].id
        };
      }
    }

    console.log('Seeding database with demo data...');

    // Create demo creator user
    const creatorUser = await storage.upsertUser({
      id: randomUUID(),
      email: "creator@demo.iguard.dev",
      firstName: "Demo",
      lastName: "Creator",
      accountType: "creator"
    });
    console.log('✓ Created demo creator user:', creatorUser.id);

    // Create demo creator profile
    const demoCreator = await storage.createCreator(creatorUser.id, {
      name: "Demo Creator",
      email: "creator@demo.iguard.dev"
    });
    console.log('✓ Created demo creator:', demoCreator.id);

    // Create demo agent user
    const agentUser = await storage.upsertUser({
      id: randomUUID(),
      email: "agent@demo.iguard.dev",
      firstName: "Demo",
      lastName: "Agent",
      accountType: "agent"
    });
    console.log('✓ Created demo agent user:', agentUser.id);

    // Create demo agent profile
    const demoAgent = await storage.createAgent(agentUser.id, {
      name: "Demo Agent"
    });
    console.log('✓ Created demo agent:', demoAgent.id);

    // Create some sample data sources for the creator
    const dataSource1 = await storage.createDataSource({
      creatorId: demoCreator.id,
      url: "https://api.example.com/premium-data",
      pricePerRequest: "0.05",
      rateLimit: 100
    });
    console.log('✓ Created data source:', dataSource1.id);

    const dataSource2 = await storage.createDataSource({
      creatorId: demoCreator.id,
      url: "https://api.myservice.io/analytics",
      pricePerRequest: "0.10"
    });
    console.log('✓ Created data source:', dataSource2.id);

    // Create some sample access logs
    await storage.createAccessLog({
      agentId: demoAgent.id,
      dataSourceId: dataSource1.id,
      path: "/api/v1/data",
      status: "success",
      amount: "0.05"
    });

    await storage.createAccessLog({
      agentId: demoAgent.id,
      dataSourceId: dataSource1.id,
      path: "/api/v1/analytics",
      status: "success",
      amount: "0.05"
    });

    await storage.createAccessLog({
      agentId: demoAgent.id,
      dataSourceId: dataSource2.id,
      status: "failed"
    });

    console.log('✓ Database seeding complete');
    console.log('');
    console.log('Demo Creator ID:', demoCreator.id);
    console.log('Demo Agent ID:', demoAgent.id);
    console.log('');

    return { 
      creatorId: demoCreator.id, 
      agentId: demoAgent.id 
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}
