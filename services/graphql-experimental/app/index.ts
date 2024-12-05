import { Neo4jGraphQL } from '@neo4j/graphql';
import { driver as _driver, auth } from 'neo4j-driver';
import { ApolloServer } from 'apollo-server';
import fs from 'fs';
import path from 'path';

//adjust path to schema, if necessary
const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql'), {
  encoding: 'utf-8',
});

//adjust port, login, password, if necessary
const driver = _driver('bolt://neo4j:7687', auth.basic('neo4j', 'password'));

const neoSchema = new Neo4jGraphQL({
  typeDefs,
  driver,
});

async function main() {
  const schema = await neoSchema.getSchema();
  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({ req }),
  });
  await server.listen(4000);
  console.log('listening at 4000');
}

main();
