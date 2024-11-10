import { jaroWinkler } from './../../common/jaroWinklerDistance.js';
import neo4j from 'neo4j-driver';

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'Casablanca'));
const session = driver.session();

// Entity resolution function that updates Neo4j
async function resolveEntities(entities, similarityThreshold, minThreshold) {
  for (const entity1 of entities) {
    for (const entity2 of entities) {
      if (entity1.id === entity2.id && entity1 !== entity2) {
        // Strong identifier match, create SAME_AS relationship
        await session.run(
          `MATCH (a:Entity {id: $id1}), (b:Entity {id: $id2})
           MERGE (a)-[:SAME_AS]->(b)`,
          { id1: entity1.id, id2: entity2.id }
        );
      } else {
        // Weak identifier comparison
        let similarScore = 0;
        if (entity1.equipmentType && entity2.equipmentType) {
          similarScore = jaroWinkler(entity1.equipmentType, entity2.equipmentType);
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
              `MATCH (a:Entity {id: $id1}), (b:Entity {id: $id2})
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

  // Close the Neo4j session
  await session.close();
  await driver.close();
}

// Example usage
const entities = [
  { id: 'A123', equipmentType: 'Compressor', someNonIdentifyingFeature: 'HighPower' },
  { id: 'A124', equipmentType: 'Compressor', someNonIdentifyingFeature: 'LowPower' },
  { id: 'A123', equipmentType: 'Compressor', someNonIdentifyingFeature: 'MediumPower' },
];

const similarityThreshold = 0.85;
const minThreshold = 0.75;

resolveEntities(entities, similarityThreshold, minThreshold)
  .then(() => console.log('Entity resolution completed'))
  .catch((error) => console.error('Error in entity resolution:', error));
