"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("@neo4j/graphql");
const neo4j_driver_1 = require("neo4j-driver");
const apollo_server_1 = require("apollo-server");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
//adjust path to schema, if necessary
const typeDefs = fs_1.default.readFileSync(path_1.default.join(__dirname, 'schema.graphql'), {
    encoding: 'utf-8',
});
//adjust port, login, password, if necessary
const driver = (0, neo4j_driver_1.driver)('bolt://localhost:7687', neo4j_driver_1.auth.basic('neo4j', 'password'));
const neoSchema = new graphql_1.Neo4jGraphQL({
    typeDefs,
    driver,
});
async function main() {
    const schema = await neoSchema.getSchema();
    const server = new apollo_server_1.ApolloServer({
        schema,
        context: ({ req }) => ({ req }),
    });
    await server.listen(4000);
    console.log('Listening at 4000');
}
main();
