const { ApolloServer } = require('@apollo/server');
const { Neo4jGraphQL } = require('@neo4j/graphql');
const neo4j = require('neo4j-driver');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { PubSub } = require('graphql-subscriptions');

// Initialize Neo4j Driver
const driver = neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic('neo4j', 'Casablanca'));

// Define GraphQL schema for equipment and relationships
const typeDefs = `
  type Equipment {
    id: ID!
    name: String
    type: String
    status: String
  }

  type Subscription {
    equipmentUpdated: Equipment
  }

  type Query {
    equipment(id: ID!): Equipment
    allEquipment: [Equipment]
  }
`;

// Setup PubSub instance for subscription publishing
const pubsub = new PubSub();

// Example Resolver
const resolvers = {
  Query: {
    allEquipment: async () => {
      const session = driver.session();
      const result = await session.run('MATCH (e:Equipment) RETURN e');
      session.close();
      return result.records.map((record) => record.get('e').properties);
    },
    equipment: async (_, { id }) => {
      const session = driver.session();
      const result = await session.run('MATCH (e:Equipment {id: $id}) RETURN e', { id });
      session.close();
      return result.records[0]?.get('e').properties;
    },
  },
  Subscription: {
    equipmentUpdated: {
      subscribe: () => pubsub.asyncIterator(['EQUIPMENT_UPDATED']),
    },
  },
};

// Create Apollo Server with WebSocket Subscriptions
const schema = makeExecutableSchema({ typeDefs, resolvers });
const server = new ApolloServer({ schema });
const httpServer = createServer();
const wsServer = new WebSocketServer({ server: httpServer, path: '/graphql' });

// Use WebSocket server with Apollo for Subscriptions
useServer({ schema, execute, subscribe }, wsServer);

// Simulate Data Changes (in a real scenario, this could be triggered by CDC or Webhook)
function simulateDataChange() {
  setInterval(async () => {
    const session = driver.session();
    const updatedEquipment = await session.run('MATCH (e:Equipment) RETURN e LIMIT 1');
    session.close();

    if (updatedEquipment.records.length) {
      const equipment = updatedEquipment.records[0].get('e').properties;
      pubsub.publish('EQUIPMENT_UPDATED', { equipmentUpdated: equipment });
    }
  }, 5000); // Update every 5 seconds
}

// Start HTTP and WebSocket Servers
(async () => {
  await server.start();
  server.applyMiddleware({ app: httpServer });
  httpServer.listen(4000, () => {
    console.log(`Server is running at http://localhost:4000${server.graphqlPath}`);
  });
  simulateDataChange(); // Simulate database updates
})();
