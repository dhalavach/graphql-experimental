import { ApolloServer } from 'apollo-server';
import { Neo4jGraphQL } from '@neo4j/graphql';
import { driver as _driver, auth } from 'neo4j-driver';

const driver = _driver('bolt://localhost:7687', auth.basic('Neo4j', 'Casablanca'));

const typeDefs = `
  type Sensor @key(fields: "id") {
    id: ID!
    sensor_type: String!
    reading: String!
    unit: String!
    accuracy: String

    location: [Facility] @relationship(type: "LOCATED_AT", direction: OUT)
  }
`;

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });
const server = new ApolloServer({ schema: neoSchema.schema });

server.listen().then(({ url }) => {
  console.log(`Subgraph running at ${url}`);
});
