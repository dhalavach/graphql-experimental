import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Node {
    id: ID!
    name: String!
    type: String! # Machine, Tank, etc.
    location: String! # Store as "x y" for simplicity
  }

  type Pipe {
    id: ID!
    from: ID!
    to: ID!
  }

  type Query {
    nodes: [Node]
    pipes: [Pipe]
  }

  type Mutation {
    addNode(name: String!, type: String!, location: String!): Node
    addPipe(from: ID!, to: ID!): Pipe
    removeNode(id: ID!): Node
    removePipe(id: ID!): Pipe
  }
`;
