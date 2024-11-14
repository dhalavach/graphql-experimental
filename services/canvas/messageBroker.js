const amqp = require('amqplib');
require('dotenv').config();

let channel;

// Connect to RabbitMQ and create a channel
async function connectMessageBroker() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
  }
}

// Function to send messages to the message broker
function sendToMessageBroker(event, payload) {
  if (channel) {
    channel.publish('canvas_exchange', event, Buffer.from(JSON.stringify(payload)));
    console.log(`Message sent: ${event}`, payload);
  } else {
    console.error('RabbitMQ channel not initialized');
  }
}

module.exports = {
  connectMessageBroker,
  sendToMessageBroker,
};
