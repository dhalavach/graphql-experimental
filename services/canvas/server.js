import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import cors from 'cors';
import { schema } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';
import { connectToNeo4j } from './neo4j/connection.js';

const startServer = async () => {
  // Create Neo4j driver
  const driver = connectToNeo4j();

  // Initialize Apollo Server
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers: resolvers(driver),
  });

  await server.start();

  // Set up Express
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  // Add Apollo middleware
  app.use('/graphql', expressMiddleware(server));

  // Start server
  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`GraphQL server running at http://localhost:${PORT}/graphql`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
});
