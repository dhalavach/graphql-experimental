import { gql } from 'apollo-server-express';

export const schema = gql`
  # Schema for integrating Canvas app with BE service or Neo4j. Based on equipment ontology.

  type Query {
    # Fetch all equipment, processes, or facilities with optional filtering
    entities(filter: EntityFilterInput): [Entity]

    # Fetch a specific entity by ID
    entityById(id: ID!): Entity

    # Fetch equipment templates
    templates: [EquipmentTemplate]

    # Search the knowledge graph database for nodes and relationships
    searchGraph(query: String!): [GraphEntity]
  }

  type Mutation {
    # Add a new equipment, process, or facility
    addEntity(input: AddEntityInput!): Entity

    # Update an entity's properties or position
    updateEntity(id: ID!, input: UpdateEntityInput!): Entity

    # Delete an entity
    deleteEntity(id: ID!): Boolean

    # Create, update, or delete relationships (links) between entities
    createLink(input: CreateLinkInput!): Link
    updateLink(id: ID!, input: UpdateLinkInput!): Link
    deleteLink(id: ID!): Boolean

    # Import templates
    importTemplates(input: [NewTemplateInput!]!): [EquipmentTemplate]

    # Apply staged changes
    applyChanges: Boolean
  }

  # Base Types
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
    # Specific attributes for Equipment
    attributes: EquipmentAttributes
  }

  type Process implements Entity {
    id: ID!
    name: String!
    type: String!
    description: String
    position: Position
    properties: [Property!]
    links: [Link!]
    # Specific attributes for Processes
    attributes: ProcessAttributes
  }

  type Facility implements Entity {
    id: ID!
    name: String!
    type: String!
    description: String
    position: Position
    properties: [Property!]
    links: [Link!]
    # Specific attributes for Facilities
    attributes: FacilityAttributes
  }

  type EquipmentTemplate {
    id: ID!
    name: String!
    type: String!
    properties: [Property!]
  }

  type Link {
    id: ID!
    source: ID!
    target: ID!
    type: String!
    properties: [Property!]
  }

  type GraphEntity {
    id: ID!
    name: String
    type: String
    properties: [Property!]
  }

  # Supporting Types
  type Property {
    key: String!
    value: String!
  }

  type Position {
    x: Float!
    y: Float!
  }

  # Attribute Types (Based on Ontology)
  type EquipmentAttributes {
    flow_rate: String
    power: String
    discharge_pressure: String
  }

  type ProcessAttributes {
    pressure: String
    temperature: String
    efficiency: Float
  }

  type FacilityAttributes {
    capacity: String
    contents: String
  }

  # Input Types
  input AddEntityInput {
    name: String!
    type: String!
    position: PositionInput
    properties: [PropertyInput!]
    attributes: AttributesInput
  }

  input UpdateEntityInput {
    name: String
    type: String
    position: PositionInput
    properties: [PropertyInput!]
    attributes: AttributesInput
  }

  input PropertyInput {
    key: String!
    value: String!
  }

  input PositionInput {
    x: Float!
    y: Float!
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

  # filtering is unclear at this stage - might change in the future
  input EntityFilterInput {
    type: String
    name: String
    attributeKey: String
    attributeValue: String
  }

  input NewTemplateInput {
    name: String!
    type: String!
    properties: [PropertyInput!]
  }
`;
