"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOntology = createOntology;
var uuid_1 = require("uuid");
function createOntology(name, type, description, content) {
    return {
        id: (0, uuid_1.v4)(),
        name: name,
        version: '1.0.0',
        type: type,
        description: description,
        content: content,
    };
}
