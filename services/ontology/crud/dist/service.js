"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OntologyService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const models_1 = require("./models");
const yamljs_1 = __importDefault(require("yamljs"));
const semver_1 = __importDefault(require("semver"));
const ONTOLOGY_DIR = path_1.default.join(__dirname, '../ontologies');
// Ensure directory exists
if (!fs_1.default.existsSync(ONTOLOGY_DIR))
    fs_1.default.mkdirSync(ONTOLOGY_DIR);
class OntologyService {
    // Create a new ontology
    create(name, type, description, filePath) {
        const content = yamljs_1.default.load(filePath);
        const ontology = (0, models_1.createOntology)(name, type, description, content);
        // Save to file system
        this.saveToFile(ontology);
        return ontology;
    }
    // Read an ontology by ID
    read(id) {
        const filePath = path_1.default.join(ONTOLOGY_DIR, `${id}.json`);
        if (!fs_1.default.existsSync(filePath))
            return null;
        return JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
    }
    // Update an ontology
    update(id, name, type, description, newFilePath) {
        const ontology = this.read(id);
        if (!ontology)
            return null;
        // Update fields if provided
        if (name)
            ontology.name = name;
        if (type)
            ontology.type = type;
        if (description)
            ontology.description = description;
        if (newFilePath)
            ontology.content = yamljs_1.default.load(newFilePath);
        // Increment version
        ontology.version = semver_1.default.inc(ontology.version, 'patch') || ontology.version;
        // Save updates
        this.saveToFile(ontology);
        return ontology;
    }
    // Delete an ontology
    delete(id) {
        const filePath = path_1.default.join(ONTOLOGY_DIR, `${id}.json`);
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
            return true;
        }
        return false;
    }
    // Utility to save ontology to the file system
    saveToFile(ontology) {
        const filePath = path_1.default.join(ONTOLOGY_DIR, `${ontology.id}.json`);
        fs_1.default.writeFileSync(filePath, JSON.stringify(ontology, null, 2));
    }
}
exports.OntologyService = OntologyService;
