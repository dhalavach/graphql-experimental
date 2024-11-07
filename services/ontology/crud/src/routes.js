"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var multer_1 = require("multer");
var service_1 = require("./service");
var router = express_1.default.Router();
var upload = (0, multer_1.default)({ dest: 'uploads/' });
var ontologyService = new service_1.OntologyService();
// Create an ontology
router.post('/ontologies', upload.single('file'), function (req, res) {
    var _a = req.body, name = _a.name, type = _a.type, description = _a.description;
    var file = req.file;
    if (!file || !name)
        return res.status(400).send('Name and file are required.');
    var ontology = ontologyService.create(name, type, description, file.path);
    res.status(201).json(ontology);
});
// Read an ontology by ID
router.get('/ontologies/:id', function (req, res) {
    var ontology = ontologyService.read(req.params.id);
    if (!ontology)
        return res.status(404).send('Ontology not found.');
    res.json(ontology);
});
// Update an ontology
router.put('/ontologies/:id', upload.single('file'), function (req, res) {
    var _a = req.body, name = _a.name, type = _a.type, description = _a.description;
    var file = req.file;
    var ontology = ontologyService.update(req.params.id, name, type, description, file === null || file === void 0 ? void 0 : file.path);
    if (!ontology)
        return res.status(404).send('Ontology not found.');
    res.json(ontology);
});
// Delete an ontology
router.delete('/ontologies/:id', function (req, res) {
    var success = ontologyService.delete(req.params.id);
    if (!success)
        return res.status(404).send('Ontology not found.');
    res.status(204).send();
});
exports.default = router;
