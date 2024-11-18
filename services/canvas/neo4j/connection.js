import neo4j, { Driver } from 'neo4j-driver';

export const connectToNeo4j = () => {
  const uri = 'bolt://localhost:7687';
  const user = 'neo4j';
  const password = 'Casablanca';

  return neo4j.driver(uri, neo4j.auth.basic(user, password));
};
