import { v4 as uuidv4 } from 'uuid';

export interface Ontology {
  id: string;
  name: string;
  version: string; // Format: MAJOR.MINOR.PATCH
  type?: string;
  description?: string;
  content: object; // Parsed YAML content
}

export function createOntology(name: string, type: string, description: string, content: object): Ontology {
  return {
    id: uuidv4(),
    name,
    version: '1.0.0',
    type,
    description,
    content,
  };
}
