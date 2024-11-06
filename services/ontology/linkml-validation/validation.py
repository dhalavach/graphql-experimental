import yaml
import jsonschema
from jsonschema import validate
import json

# Load the YAML file
with open("ontology_file.yaml", "r") as yaml_file:
    yaml_data = yaml.safe_load(yaml_file)

# Load the JSON Schema
with open("schema_file.json", "r") as schema_file:
    schema = json.load(schema_file)

# Validate the YAML data against the schema
try:
    validate(instance=yaml_data, schema=schema)
    print("YAML file is valid according to the JSON Schema.")
except jsonschema.exceptions.ValidationError as e:
    print(f"YAML file is invalid: {e}")