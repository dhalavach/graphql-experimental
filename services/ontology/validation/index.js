const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const yaml = require('js-yaml');

const app = express();
app.use(bodyParser.json());

let ontology;

// Asynchronous function to load the ontology file
async function loadOntology(filePath) {
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    return yaml.load(fileContent);
  } catch (err) {
    console.error('Failed to load ontology file:', err);
    process.exit(1);
  }
}

// Helper to validate an instance against the ontology
function validateInstance(instance, className) {
  const classDef = ontology.classes[className];
  if (!classDef) return { valid: false, message: `Class ${className} not found.` };

  const errors = [];

  // Validate inherited attributes from parent class or mixins
  const validateAttributes = (attributes, scope) => {
    for (const [key, def] of Object.entries(attributes || {})) {
      const value = instance[key];
      if (def.required && value === undefined) {
        errors.push(`Missing required field: ${scope}.${key}`);
        continue;
      }
      if (value !== undefined) {
        if (def.range && ontology.types[def.range]) {
          // Validate against the defined type
          const typeDef = ontology.types[def.range];
          if (typeDef.typeof === 'float' && typeof value !== 'number') {
            errors.push(`Field ${scope}.${key} must be a float.`);
          } else if (typeDef.typeof === 'string' && typeof value !== 'string') {
            errors.push(`Field ${scope}.${key} must be a string.`);
          } else if (typeDef.union_of && !typeDef.union_of.includes(typeof value)) {
            errors.push(`Field ${scope}.${key} must be one of: ${typeDef.union_of.join(', ')}.`);
          }
        }
      }
    }
  };

  // Validate attributes in the class
  validateAttributes(classDef.attributes, className);

  // Check parent classes and mixins
  if (classDef.is_a) {
    const parentDef = ontology.abstract_classes[classDef.is_a];
    validateAttributes(parentDef.attributes, classDef.is_a);
  }
  if (classDef.mixins) {
    for (const mixin of classDef.mixins) {
      const mixinDef = ontology.mixins[mixin];
      validateAttributes(mixinDef.attributes, mixin);
    }
  }

  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}

// Endpoint to validate an entity instance
app.post('/validate', async (req, res) => {
  const { instance, className } = req.body;

  if (!instance || !className) {
    return res.status(400).json({ error: 'Instance and className are required.' });
  }

  const result = validateInstance(instance, className);
  res.json(result);
});

// Start the server and load ontology
const PORT = 3000;
const ontologyFilePath = './equipment.yaml';

(async () => {
  try {
    ontology = await loadOntology(ontologyFilePath);
    app.listen(PORT, () => {
      console.log(`Ontology validator running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize the service:', err);
    process.exit(1);
  }
})();
