import fs from 'fs';
import path from 'path';
import { Ontology, createOntology } from './models';
import YAML from 'yamljs';
import semver from 'semver';

const ONTOLOGY_DIR = path.join(__dirname, '../ontologies');

// Ensure directory exists
if (!fs.existsSync(ONTOLOGY_DIR)) fs.mkdirSync(ONTOLOGY_DIR);

export class OntologyService {
  // Create a new ontology
  create(name: string, type: string, description: string, filePath: string): Ontology {
    const content = YAML.load(filePath);
    const ontology = createOntology(name, type, description, content);

    // Save to file system
    this.saveToFile(ontology);
    return ontology;
  }

  // Read an ontology by ID
  read(id: string): Ontology | null {
    const filePath = path.join(ONTOLOGY_DIR, `${id}.json`);
    if (!fs.existsSync(filePath)) return null;

    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  // Update an ontology
  update(id: string, name?: string, type?: string, description?: string, newFilePath?: string): Ontology | null {
    const ontology = this.read(id);
    if (!ontology) return null;

    // Update fields if provided
    if (name) ontology.name = name;
    if (type) ontology.type = type;
    if (description) ontology.description = description;
    if (newFilePath) ontology.content = YAML.load(newFilePath);

    // Increment version
    ontology.version = semver.inc(ontology.version, 'patch') || ontology.version;

    // Save updates
    this.saveToFile(ontology);
    return ontology;
  }

  // Delete an ontology
  delete(id: string): boolean {
    const filePath = path.join(ONTOLOGY_DIR, `${id}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  }

  // Utility to save ontology to the file system
  private saveToFile(ontology: Ontology): void {
    const filePath = path.join(ONTOLOGY_DIR, `${ontology.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(ontology, null, 2));
  }
}
