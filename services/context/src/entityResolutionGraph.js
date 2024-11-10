import { jaroWinkler } from './../../common/jaroWinklerDistance.js';
import neo4j from 'neo4j-driver';

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'Casablanca'));
const session = driver.session();
async function getEntitiesByType(label) {
  try {
    // Run a query to match nodes with the given label
    const result = await session.run(`MATCH (n:${label}) RETURN n`);

    // Extract and return the nodes
    const nodes = result.records.map((record) => record.get('n').properties);
    return nodes;
  } catch (error) {
    console.error('Error reading entities:', error);
  } finally {
    // Close the session
    //await session.close();
  }
}

// Entity resolution function that updates Neo4j
async function resolveEntities(entities, similarityThreshold, minThreshold) {
  for (const entity1 of entities) {
    for (const entity2 of entities) {
      if (entity1.id === entity2.id && entity1 !== entity2) {
        // Strong identifier match, create SAME_AS relationship
        await session.run(
          `MATCH (a {id: $id1}), (b {id: $id2})
           MERGE (a)-[:SAME_AS]->(b)`,
          { id1: entity1.id, id2: entity2.id }
        );
      } else {
        // Weak identifier comparison
        let similarScore = 0;
        if (entity1.alias && entity2.alias && entity1 !== entity2) {
          similarScore = jaroWinkler(entity1.alias, entity2.alias);
        }

        if (similarScore >= similarityThreshold) {
          // Correcting factor for non-identifying feature match
          if (entity1.someNonIdentifyingFeature && entity2.someNonIdentifyingFeature) {
            const nonIdentifyingScore = jaroWinkler(
              entity1.someNonIdentifyingFeature,
              entity2.someNonIdentifyingFeature
            );
            similarScore += 0.1 * nonIdentifyingScore;
          }

          // Create SIMILAR relationship if score is above min threshold
          if (similarScore >= minThreshold) {
            await session.run(
              `MATCH (a {id: $id1}), (b {id: $id2})
               MERGE (a)-[r:SIMILAR]->(b)
               ON CREATE SET r.weight = $weight
               ON MATCH SET r.weight = $weight`,
              { id1: entity1.id, id2: entity2.id, weight: similarScore }
            );
          }
        }
      }
    }
  }
}

// Example usage

const entities = await getEntitiesByType('Sensor');
// console.log(entities);
const similarityThreshold = 0.5; //for test purposes, real threshold should be 0.8-0.95
const minThreshold = 0.1; // also should be higher

await resolveEntities(entities, similarityThreshold, minThreshold)
  .then(() => console.log('Entity resolution completed'))
  .catch((error) => console.error('Error in entity resolution:', error));

await session.close();
await driver.close();
