## Neo4 and Apollo Server with GraphQL API

navigate to app directory  

run `npm run docker:pull` to pull images and start the Neo4j and Apollo Server GraphQL containers  


run `npm run docker:build` to rebuild the images (or `docker-compose up --build` )

access Apollo Studio to inspect the GraphQL API and work with Neo4j database in browser
by default, it is at: http://localhost:4000/  


access Neo4j Browser at http://localhost:7474/browser/  

default login: neo4j  

default password: password  


to get all nodes, run something like

```
MATCH (n)
RETURN n
```


