import express, { Request, Response } from 'express';
import multer from 'multer';
import { OntologyService } from './service';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const ontologyService = new OntologyService();

// Create an ontology
router.post('/ontologies', upload.single('file'), (req: any, res: any) => {
  const { name, type, description } = req.body;
  const file = req.file;

  if (!file || !name) return res.status(400).send('Name and file are required.');

  const ontology = ontologyService.create(name, type, description, file.path);
  res.status(201).json(ontology);
});

// Read an ontology by ID
router.get('/ontologies/:id', (req: any, res: any) => {
  const ontology = ontologyService.read(req.params.id);
  if (!ontology) return res.status(404).send('Ontology not found.');
  res.json(ontology);
});

// Update an ontology
router.put('/ontologies/:id', upload.single('file'), (req: any, res: any) => {
  const { name, type, description } = req.body;
  const file = req.file;
  const ontology = ontologyService.update(req.params.id, name, type, description, file?.path);

  if (!ontology) return res.status(404).send('Ontology not found.');
  res.json(ontology);
});

// Delete an ontology
router.delete('/ontologies/:id', (req: any, res: any) => {
  const success = ontologyService.delete(req.params.id);
  if (!success) return res.status(404).send('Ontology not found.');
  res.status(204).send();
});

export default router;
