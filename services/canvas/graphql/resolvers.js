import { Driver, Session } from 'neo4j-driver';

export const resolvers = (driver) => ({
  Query: {
    async entities(_, { filter }) {
      const session = driver.session();
      const query = `
        MATCH (e:Entity)
        WHERE ($type IS NULL OR e.type = $type)
          AND ($name IS NULL OR e.name CONTAINS $name)
        RETURN e
      `;
      try {
        const result = await session.run(query, filter || {});
        return result.records.map((record) => record.get('e').properties);
      } finally {
        await session.close();
      }
    },

    async entityById(_, { id }) {
      const session = driver.session();
      const query = 'MATCH (e:Entity {id: $id}) RETURN e';
      try {
        const result = await session.run(query, { id });
        const record = result.records[0];
        return record ? record.get('e').properties : null;
      } finally {
        await session.close();
      }
    },
  },

  Mutation: {
    async addEntity(_, { name, type, position, properties, attributes }) {
      const session = driver.session();
      const query = `
        CREATE (e:Entity {
          id: randomUUID(),
          name: $name,
          type: $type,
          position: $position,
          properties: $properties,
          attributes: $attributes
        })
        RETURN e
      `;
      try {
        const result = await session.run(query, {
          name,
          type,
          position,
          properties,
          attributes,
        });
        return result.records[0].get('e').properties;
      } finally {
        await session.close();
      }
    },

    async deleteEntity(_, { id }) {
      const session = driver.session();
      const query = 'MATCH (e:Entity {id: $id}) DETACH DELETE e';
      try {
        await session.run(query, { id });
        return true;
      } catch {
        return false;
      } finally {
        await session.close();
      }
    },
  },
});
