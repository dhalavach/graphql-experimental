"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OntologyService = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var models_1 = require("./models");
var yamljs_1 = require("yamljs");
var semver_1 = require("semver");
var ONTOLOGY_DIR = path_1.default.join(__dirname, '../ontologies');
// Ensure directory exists
if (!fs_1.default.existsSync(ONTOLOGY_DIR))
    fs_1.default.mkdirSync(ONTOLOGY_DIR);
var OntologyService = /** @class */ (function () {
    function OntologyService() {
    }
    // Create a new ontology
    OntologyService.prototype.create = function (name, type, description, filePath) {
        var content = yamljs_1.default.load(filePath);
        var ontology = (0, models_1.createOntology)(name, type, description, content);
        // Save to file system
        this.saveToFile(ontology);
        return ontology;
    };
    // Read an ontology by ID
    OntologyService.prototype.read = function (id) {
        var filePath = path_1.default.join(ONTOLOGY_DIR, "".concat(id, ".json"));
        if (!fs_1.default.existsSync(filePath))
            return null;
        return JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
    };
    // Update an ontology
    OntologyService.prototype.update = function (id, name, type, description, newFilePath) {
        var ontology = this.read(id);
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
    };
    // Delete an ontology
    OntologyService.prototype.delete = function (id) {
        var filePath = path_1.default.join(ONTOLOGY_DIR, "".concat(id, ".json"));
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
            return true;
        }
        return false;
    };
    // Utility to save ontology to the file system
    OntologyService.prototype.saveToFile = function (ontology) {
        var filePath = path_1.default.join(ONTOLOGY_DIR, "".concat(ontology.id, ".json"));
        fs_1.default.writeFileSync(filePath, JSON.stringify(ontology, null, 2));
    };
    return OntologyService;
}());
exports.OntologyService = OntologyService;
