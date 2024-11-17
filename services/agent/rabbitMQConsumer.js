async function consumeFromQueue() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'aveva-pi-messages';

  await channel.assertQueue(queue, { durable: true });

  console.log('Waiting for messages...');
  channel.consume(queue, (msg) => {
    if (msg) {
      const message = JSON.parse(msg.content.toString());
      console.log(`Received message: ${JSON.stringify(message)}`);
      channel.ack(msg); // Acknowledge the message
    }
  });
}

consumeFromQueue();
