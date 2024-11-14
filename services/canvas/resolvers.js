const { sendToMessageBroker } = require('./messageBroker');

const nodes = [];
const pipes = [];

const resolvers = {
  Query: {
    nodes: () => nodes,
    pipes: () => pipes,
  },

  Mutation: {
    addNode: (_, { name, type, location }) => {
      const node = { id: `node-${nodes.length + 1}`, name, type, location };
      nodes.push(node);

      // Send to message broker
      sendToMessageBroker('node.added', node);

      return node;
    },

    addPipe: (_, { from, to }) => {
      const pipe = { id: `pipe-${pipes.length + 1}`, from, to };
      pipes.push(pipe);

      // Send to message broker
      sendToMessageBroker('pipe.added', pipe);

      return pipe;
    },

    removeNode: (_, { id }) => {
      const index = nodes.findIndex((node) => node.id === id);
      if (index === -1) return null;
      const [removedNode] = nodes.splice(index, 1);

      // Send to message broker
      sendToMessageBroker('node.removed', removedNode);

      return removedNode;
    },

    removePipe: (_, { id }) => {
      const index = pipes.findIndex((pipe) => pipe.id === id);
      if (index === -1) return null;
      const [removedPipe] = pipes.splice(index, 1);

      // Send to message broker
      sendToMessageBroker('pipe.removed', removedPipe);

      return removedPipe;
    },
  },
};

module.exports = resolvers;
