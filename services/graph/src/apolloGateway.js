import { ApolloServer } from 'apollo-server';
import { ApolloGateway } from '@apollo/gateway';

const gateway = new ApolloGateway({
  serviceList: [
    { name: 'sensors', url: 'http://localhost:4001/graphql' },
   // { name: 'compressors', url: 'http://localhost:4002/graphql' },
  ],
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
});

server.listen().then(({ url }) => {
  console.log(`Gateway running at ${url}`);
});
