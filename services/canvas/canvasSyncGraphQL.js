import { ApolloServer } from '@apollo/server';
import { Neo4jGraphQL } from '@neo4j/graphql';
import neo4j from 'neo4j-driver';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import express from 'express';
import http from 'http';
import { expressMiddleware } from '@apollo/server/express4';

import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import path from 'path';

// Initialize Neo4j Driver
const driver = neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic('neo4j', 'Casablanca'));

// Define GraphQL schema for equipment and relationships
// const typeDefs = `
//   type Equipment {
//     id: ID!
//     name: String
//     type: String
//     status: String
//   }

//   type Subscription {
//     equipmentUpdated: Equipment
//   }

//   type Query {
//     equipment(id: ID!): Equipment
//     allEquipment: [Equipment]
//   }
// `;

const typeDefs = loadSchemaSync(path.resolve('./services/canvas/schema.graphql'), {
  loaders: [new GraphQLFileLoader()],
});

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
      //const result = await session.run('MATCH (n:Sensor {id: $id}) RETURN n', { id });
      const result = await session.run('MATCH ((n)-[r]->(m) RETURN n, m, r');
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
const app = express();

const httpServer = http.createServer(app);
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
// (async () => {
//   await server.start();
//   server.applyMiddleware({ app: httpServer });
//   httpServer.listen(4000, () => {
//     console.log(`Server is running at http://localhost:4000${server.graphqlPath}`);
//   });
//   simulateDataChange(); // Simulate database updates
// })();

(async () => {
  await server.start(); // Start the Apollo Server

  // Manually connect Apollo Server to the Express app
  app.use('/graphql', (req, res) => {
    //return server.createGraphQLHandler()(req, res);  // Use the createGraphQLHandler() method
    return expressMiddleware(server);
  });

  // Start the HTTP server
  httpServer.listen(4000, () => {
    console.log(`Server is running at http://localhost:4000/graphql`);
  });

  // WebSocket server connection for subscriptions
  // Setup WebSocket server to handle GraphQL subscriptions
  // wsServer and Apollo subscriptions configuration would go here.

  simulateDataChange(); // Simulate database updates
})();
