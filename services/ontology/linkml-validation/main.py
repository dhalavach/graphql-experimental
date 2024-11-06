from linkml.validator import validate

instance = {
    id: 'a4359de4-661c-42ac-ab50-607c5e851a42',
    "webid":
      'F1EmiioOP55FG0ayt78sjWkfSwAOYCLnSX7xG6ggJSqVTAkwRUMyQU1BWi1DMUEzOEIyXEJLTyBSRUZJTkVSWVxFTlRFUlBSSVNFXFNUT1JBR0Ux',
    "parent": 'NGL Items',
    "description": 'Storage facility',
    "position": {
      "x": 70,
      "y": 72,
    },
    "inputs": ['ethane', 'propane', 'butane', 'iso-butane', 'natural gasoline'],
    "outputs": ['NGL products'],
    "volume": '1000000 gallons',
  }

report = validate(instance, "ontology_file.yaml", "StorageTank")

if not report.results:
    print('The instance is valid!')
else:
    for result in report.results:
        print(result.message)