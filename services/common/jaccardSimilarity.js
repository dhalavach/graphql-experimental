const neo4j = require('neo4j-driver');

// Connect to Neo4j
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('Neo4j', 'Casablanca'));
const session = driver.session();

/**
 * Calculate the Jaccard similarity score between two nodes based on a relationship type.
 * @param {string} nodeId1 - The ID of the first node.
 * @param {string} nodeId2 - The ID of the second node.
 * @param {string} relationshipType - The type of relationship to consider.
 * @returns {Promise<number>} - Jaccard similarity score between the two nodes.
 */
async function calculateJaccardSimilarity(nodeId1, nodeId2, relationshipType) {
  try {
    // Get relationships of the first node
    const result1 = await session.run(
      `MATCH (a)-[:${relationshipType}]->(related)
       WHERE id(a) = $nodeId1
       RETURN collect(id(related)) AS neighbors1`,
      { nodeId1 }
    );

    const neighbors1 = result1.records[0].get('neighbors1');

    // Get relationships of the second node
    const result2 = await session.run(
      `MATCH (b)-[:${relationshipType}]->(related)
       WHERE id(b) = $nodeId2
       RETURN collect(id(related)) AS neighbors2`,
      { nodeId2 }
    );

    const neighbors2 = result2.records[0].get('neighbors2');

    // Calculate intersection and union
    const intersection = neighbors1.filter((x) => neighbors2.includes(x)).length;
    const union = new Set([...neighbors1, ...neighbors2]).size;

    // Calculate Jaccard similarity score
    const jaccardScore = intersection / union;

    return jaccardScore;
  } catch (error) {
    console.error('Error calculating Jaccard similarity:', error);
  } finally {
    await session.close();
  }
}

// Example
calculateJaccardSimilarity(1, 2, 'RELATED_TO')
  .then((score) => console.log('Jaccard Similarity Score:', score))
  .catch((error) => console.error('Error:', error))
  .finally(() => driver.close());
