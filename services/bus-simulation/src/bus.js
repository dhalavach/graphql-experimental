const EventEmitter = require('events');

// Define a simple MessageQueue class to simulate message broker functionality
class MessageQueue extends EventEmitter {
  constructor() {
    super();
    this.messages = [];
  }

  // Simulate sending a message to the queue
  sendMessage(message) {
    this.messages.push(message);
    this.emit('message', message);
  }

  // Simulate receiving messages from the queue
  receiveMessages(callback) {
    this.on('message', callback);
  }
}

// Instantiate the MessageQueue
const messageQueue = new MessageQueue();

// Sample producer to send messages to the queue
function sendMessageToQueue(content) {
  console.log(`Sending message: ${content}`);
  messageQueue.sendMessage({ body: content });
}

// Sample consumer to process messages from the queue
async function processMessages() {
  messageQueue.receiveMessages((message) => {
    console.log('Received message:', message.body);

    // Simulate the equipment type identification logic
    const equipmentType = identifyEquipmentType(message.body);
    if (equipmentType) {
      console.log(`Identified Equipment Type: ${equipmentType}`);
    } else {
      console.log('No matching equipment type found.');
    }
  });
}

// Equipment type mapping, as in the main service
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

// Function to identify equipment type based on message content
function identifyEquipmentType(message) {
  for (const [type, keywords] of equipmentMap.entries()) {
    for (const keyword of keywords) {
      if (message.toLowerCase().includes(keyword)) {
        return type;
      }
    }
  }
  return null;
}

// Start processing messages
processMessages();

// Simulate sending messages to the queue
setTimeout(() => sendMessageToQueue('This is a message about a gas compressor.'), 1000);
setTimeout(() => sendMessageToQueue('This is a message about an oil storage tank.'), 2000);
setTimeout(() => sendMessageToQueue('This is a message about a pressure sensor.'), 3000);
