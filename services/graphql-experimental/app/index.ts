import { Neo4jGraphQL } from '@neo4j/graphql';
import { driver as _driver, auth } from 'neo4j-driver';
import { ApolloServer } from 'apollo-server';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import 'dotenv/config';

const NEO4J_BOLT_PORT = process.env.BOLT_PORT || 7687;
const NEO4J_LOGIN = process.env.NEO4J_LOGIN || 'neo4j';
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || 'password';
const APOLLO_HTTP_PORT = process.env.APOLLO_HTTP_PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const typeDefs = await fs.readFile(path.join(__dirname, 'schema.graphql'), {
  encoding: 'utf-8',
});

const driver = _driver(`bolt://neo4j:${NEO4J_BOLT_PORT}`, auth.basic(`${NEO4J_LOGIN}`, `${NEO4J_PASSWORD}`));
const neoSchema = new Neo4jGraphQL({
  typeDefs,
  driver,
});

const schema = await neoSchema.getSchema();

async function main() {
  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({ req }),
  });
  await server.listen(4000);
  console.log(`Apollo server listening at ${APOLLO_HTTP_PORT}`);
}

main();
