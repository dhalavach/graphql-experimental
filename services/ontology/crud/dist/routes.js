"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const service_1 = require("./service");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const ontologyService = new service_1.OntologyService();
// Create an ontology
router.post('/ontologies', upload.single('file'), (req, res) => {
    const { name, type, description } = req.body;
    const file = req.file;
    if (!file || !name)
        return res.status(400).send('Name and file are required.');
    const ontology = ontologyService.create(name, type, description, file.path);
    res.status(201).json(ontology);
});
// Read an ontology by ID
router.get('/ontologies/:id', (req, res) => {
    const ontology = ontologyService.read(req.params.id);
    if (!ontology)
        return res.status(404).send('Ontology not found.');
    res.json(ontology);
});
// Update an ontology
router.put('/ontologies/:id', upload.single('file'), (req, res) => {
    const { name, type, description } = req.body;
    const file = req.file;
    const ontology = ontologyService.update(req.params.id, name, type, description, file?.path);
    if (!ontology)
        return res.status(404).send('Ontology not found.');
    res.json(ontology);
});
// Delete an ontology
router.delete('/ontologies/:id', (req, res) => {
    const success = ontologyService.delete(req.params.id);
    if (!success)
        return res.status(404).send('Ontology not found.');
    res.status(204).send();
});
exports.default = router;
