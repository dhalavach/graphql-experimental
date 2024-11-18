export const schema = `
  type Query {
    entities(filter: EntityFilterInput): [Entity]
    entityById(id: ID!): Entity
    searchGraph(query: String!): [GraphEntity]
  }

  type Mutation {
    addEntity(
      name: String!
      type: String!
      position: PositionInput
      properties: [PropertyInput!]
    ): Entity
    updateEntity(
      id: ID!
      name: String
      type: String
      position: PositionInput
      properties: [PropertyInput!]
      attributes: AttributesInput
    ): Entity
    deleteEntity(id: ID!): Boolean
    createLink(input: CreateLinkInput!): Link
    updateLink(id: ID!, input: UpdateLinkInput!): Link
    deleteLink(id: ID!): Boolean
    applyChanges: Boolean
  }

  interface Entity {
    id: ID!
    name: String!
    type: String!
    description: String
    position: Position
    properties: [Property!]
    links: [Link!]
  }

  type Equipment implements Entity {
    id: ID!
    name: String!
    type: String!
    description: String
    position: Position
    properties: [Property!]
    links: [Link!]
    attributes: Attributes
  }

  type LinkEntity implements Entity {
    id: ID!
    name: String!
    type: String!
    description: String
    position: Position
    properties: [Property!]
    links: [Link!]
    source: ID!
    target: ID!
  }

  type GraphEntity {
    id: ID!
    name: String
    type: String
    properties: [Property!]
  }

  type Link {
    id: ID!
    source: ID!
    target: ID!
    type: String!
    properties: [Property!]
  }

  type Property {
    key: String!
    value: String!
  }

  type Position {
    x: Float!
    y: Float!
  }

  input PositionInput {
    x: Float!
    y: Float!
  }

  input PropertyInput {
    key: String!
    value: String!
  }

  type Attributes {
    flow_rate: String
    power: String
    discharge_pressure: String
    pressure: String
    temperature: String
    efficiency: Float
    capacity: String
    contents: String
  }

  input AttributesInput {
    flow_rate: String
    power: String
    discharge_pressure: String
    pressure: String
    temperature: String
    efficiency: Float
    capacity: String
    contents: String
  }

  input CreateLinkInput {
    source: ID!
    target: ID!
    type: String!
    properties: [PropertyInput!]
  }

  input UpdateLinkInput {
    properties: [PropertyInput!]
  }

  input EntityFilterInput {
    type: String
    name: String
    attributeKey: String
    attributeValue: String
  }
`;
