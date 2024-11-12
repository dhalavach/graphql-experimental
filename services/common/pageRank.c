#include <stdio.h>
#include <stdlib.h>
#include <math.h>

#define N 4            // Number of nodes
#define DAMPING 0.85   // Damping factor
#define MAX_ITER 100   // Maximum number of iterations
#define TOLERANCE 1e-6 // Convergence tolerance

// Initialize adjacency matrix for the graph
int graph[N][N] = {
    {0, 1, 1, 0}, // Node 0 has edges to Node 1 and Node 2
    {0, 0, 1, 0}, // Node 1 has an edge to Node 2
    {0, 0, 0, 1}, // Node 2 has an edge to Node 3
    {1, 0, 0, 0}  // Node 3 has an edge to Node 0 (making it a cycle)
};

void calculatePageRank(double *rank)
{
  double temp_rank[N];
  double init_rank = 1.0 / N; // Initial rank for each node
  int out_degree[N] = {0};

  // Initialize ranks and calculate out-degree of each node
  for (int i = 0; i < N; i++)
  {
    rank[i] = init_rank;
    for (int j = 0; j < N; j++)
    {
      if (graph[i][j] == 1)
      {
        out_degree[i]++;
      }
    }
  }

  // PageRank iterations
  for (int iter = 0; iter < MAX_ITER; iter++)
  {
    int converged = 1;

    // Initialize temporary rank array for this iteration
    for (int i = 0; i < N; i++)
    {
      temp_rank[i] = (1.0 - DAMPING) / N;
    }

    // Calculate new ranks based on the graph's structure
    for (int i = 0; i < N; i++)
    {
      for (int j = 0; j < N; j++)
      {
        if (graph[j][i] == 1 && out_degree[j] > 0)
        {
          temp_rank[i] += DAMPING * rank[j] / out_degree[j];
        }
      }
    }

    // Check for convergence
    for (int i = 0; i < N; i++)
    {
      if (fabs(temp_rank[i] - rank[i]) > TOLERANCE)
      {
        converged = 0;
      }
      rank[i] = temp_rank[i];
    }

    if (converged)
    {
      printf("Converged after %d iterations.\n", iter + 1);
      break;
    }
  }
}

int main()
{
  double rank[N];

  // Run PageRank calculation
  calculatePageRank(rank);

  // Display the results
  printf("PageRank Scores:\n");
  for (int i = 0; i < N; i++)
  {
    printf("Node %d: %.6f\n", i, rank[i]);
  }

  return 0;
}