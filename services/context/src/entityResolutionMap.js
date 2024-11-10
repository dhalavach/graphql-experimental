// Define equipment types and their associated keywords based on the ontology
const equipmentMap = new Map([
  ['StorageTank', ['tank', 'storage', 'oil storage']],
  ['Separator', ['separator', 'gas-oil separation']],
  ['GasWell', ['gas well', 'oil well']],
  ['Compressor', ['compressor', 'gas compressor']],
  ['GasProcessingPlant', ['processing plant', 'natural gas processing']],
  ['NGLFractionationUnit', ['fractionation unit', 'NGL separation']],
  ['Sensor', ['sensor', 'measurement device']],
  ['Pump', ['pump', 'fluid pump', 'pressure pump']],
]);

// Helper function to identify equipment type based on message content
function identifyEquipmentType(message) {
  for (const [type, keywords] of equipmentMap.entries()) {
    for (const keyword of keywords) {
      if (JSON.stringify(message).toLowerCase().includes(keyword)) {
        return type;
      }
    }
  }
  return null; // Return null if no match is found
}

// Simulate processing hardcoded messages
function processMessages() {
  const messages = [
    {
      Timestamp: '2024-10-20T13:28:04Z',
      Value: 85.5,
      UnitsAbbreviation: 'PSI',
      Good: true,
      Questionable: false,
      Substituted: false,
      Annotated: false,
    },
    {
      Timestamp: '2024-10-21T08:45:10Z',
      Value: -20.3,
      UnitsAbbreviation: 'Celsius',
      Good: true,
      Questionable: false,
      Substituted: true,
      Annotated: false,
    },
    {
      Timestamp: '2024-10-22T05:12:32Z',
      Value: 2100,
      UnitsAbbreviation: 'US gal/min',
      Good: false,
      Questionable: true,
      Substituted: false,
      Annotated: true,
    },
    {
      EquipmentType: 'Pump',
      TemplateID: 'template_001',
      Parameters: {
        FlowRate: '1000 US gal/min',
        PressureLimit: '150 PSI',
        TemperatureRange: '-10 to 100 Celsius',
      },
      Description: 'Standard pump template for oil extraction',
    },
    {
      EquipmentType: 'Compressor',
      TemplateID: 'template_002',
      Parameters: {
        MaxPressure: '200 PSI',
        TemperatureRange: '-20 to 150 Celsius',
      },
      Description: 'High-capacity compressor template',
    },
    {
      EquipmentType: 'Valve',
      TemplateID: 'template_003',
      Parameters: {
        MaxFlowRate: '2000 US gal/min',
        PressureTolerance: '250 PSI',
      },
      Description: 'Heavy-duty valve for high-pressure environments',
    },
  ];

  messages.forEach((content) => {
    console.log('Received message:', content);

    // Identify equipment type
    const equipmentType = identifyEquipmentType(content);
    if (equipmentType) {
      console.log(`Identified Equipment Type: ${equipmentType}`);
    } else {
      console.log('No matching equipment type found.');
    }
  });
}

// Run the message processing function
processMessages();
