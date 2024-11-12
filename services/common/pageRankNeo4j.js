const neo4j = require('neo4j-driver');

// Setup the Neo4j driver
const uri = 'bolt://localhost:7687'; // Replace with your Neo4j instance URI
const user = 'neo4j'; // Replace with your Neo4j username
const password = 'your_password'; // Replace with your Neo4j password

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

async function calculatePageRank() {
  const session = driver.session();

  try {
    // Load the PageRank algorithm from the GDS library
    // Run PageRank algorithm on all nodes and relationships
    const result = await session.run(`
      CALL gds.pageRank.stream({
        nodeProjection: 'Page',        // Replace 'Page' with the actual label of your nodes
        relationshipProjection: {
          LINK: {
            type: 'LINK',             // Replace 'LINK' with the actual relationship type in your graph
            orientation: 'NATURAL'     // Direction of relationships
          }
        },
        maxIterations: 20,             // Number of iterations
        dampingFactor: 0.85            // Damping factor
      })
      YIELD nodeId, score
      RETURN gds.util.asNode(nodeId).id AS id, score
      ORDER BY score DESC
    `);

    // Print results
    console.log('PageRank Results:');
    result.records.forEach((record) => {
      console.log(`Node ID: ${record.get('id')}, PageRank Score: ${record.get('score')}`);
    });
  } catch (error) {
    console.error('Error calculating PageRank:', error);
  } finally {
    await session.close();
  }
}

// Run the PageRank calculation
calculatePageRank()
  .then(() => console.log('PageRank calculation complete.'))
  .catch(console.error)
  .finally(() => driver.close());
