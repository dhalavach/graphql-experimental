const amqp = require('amqplib');
const { Readable } = require('stream');

// Create a readable stream that simulates receiving data from Aveva PI
class AvevaPIStream extends Readable {
  constructor(options) {
    super(options);
    this.counter = 0;
  }

  _read(size) {
    // Simulate sending messages every second (e.g., simulated sensor data)
    if (this.counter < 5) {
      this.counter++;
      const message = {
        sensorId: `sensor-${this.counter}`,
        timestamp: new Date().toISOString(),
        value: Math.random() * 100, // Simulated sensor data value
      };

      // Push the JSON-encoded message as a chunk into the stream
      this.push(JSON.stringify(message));
    } else {
      // End the stream after sending 5 messages
      this.push(null);
    }
  }
}

// Function to connect to RabbitMQ and send messages
async function sendToQueue(messageStream) {
  try {
    // Connect to RabbitMQ server
    const connection = await amqp.connect('amqp://localhost'); // Use your RabbitMQ URL
    const channel = await connection.createChannel();
    const queue = 'aveva-pi-messages';

    // Assert queue (create if not exists)
    await channel.assertQueue(queue, { durable: true });

    // Handle stream events and publish to RabbitMQ
    messageStream.on('data', (message) => {
      const parsedMessage = JSON.parse(message.toString());
      console.log(`Sending message: ${JSON.stringify(parsedMessage)}`);

      // Publish message to RabbitMQ
      channel.sendToQueue(queue, Buffer.from(message), {
        persistent: true, // Ensure messages are not lost
      });
    });

    messageStream.on('end', () => {
      console.log('All messages sent.');
      channel.close();
      connection.close();
    });
  } catch (error) {
    console.error('Error in sending to RabbitMQ:', error);
  }
}

// Simulate the Aveva PI stream and send to RabbitMQ
const avevaStream = new AvevaPIStream();
sendToQueue(avevaStream);
