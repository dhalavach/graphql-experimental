import os
from azure.servicebus import ServiceBusClient, ServiceBusMessage

# Load connection string from environment variables
CONNECTION_STR = os.getenv("AZURE_SERVICE_BUS_CONNECTION_STRING")
QUEUE_NAME = "your-queue-name"  # Replace with your queue name
TOPIC_NAME = "your-topic-name"  # Replace with your topic name, if using topics
SUBSCRIPTION_NAME = "your-subscription-name"  # For topic subscriptions

# Initialize the ServiceBus client
servicebus_client = ServiceBusClient.from_connection_string(conn_str=CONNECTION_STR, logging_enable=True)

# Function to publish a message to a Service Bus queue or topic
def send_message_to_service_bus(message_content, queue_name=QUEUE_NAME, topic_name=None):
    with servicebus_client:
        if queue_name:
            sender = servicebus_client.get_queue_sender(queue_name=queue_name)
        elif topic_name:
            sender = servicebus_client.get_topic_sender(topic_name=topic_name)
        else:
            raise ValueError("Must specify either a queue or a topic name")
        
        with sender:
            # Create and send the message
            message = ServiceBusMessage(message_content)
            sender.send_messages(message)
            print(f"Message sent to Service Bus {queue_name or topic_name}")

# Function to receive messages from a Service Bus queue
def receive_messages_from_queue(queue_name=QUEUE_NAME, max_wait_time=5):
    with servicebus_client:
        receiver = servicebus_client.get_queue_receiver(queue_name=queue_name, max_wait_time=max_wait_time)
        with receiver:
            for message in receiver:
                print("Received message:", message)
                # Complete the message to remove it from the queue
                receiver.complete_message(message)

# Function to receive messages from a Service Bus topic subscription
def receive_messages_from_topic(topic_name=TOPIC_NAME, subscription_name=SUBSCRIPTION_NAME, max_wait_time=5):
    with servicebus_client:
        receiver = servicebus_client.get_subscription_receiver(
            topic_name=topic_name, subscription_name=subscription_name, max_wait_time=max_wait_time
        )
        with receiver:
            for message in receiver:
                print("Received message from topic:", message)
                # Complete the message to remove it from the subscription
                receiver.complete_message(message)

# Example usage:
# Send a message to a queue
send_message_to_service_bus("Test message to queue")

# Receive messages from a queue
receive_messages_from_queue()

# Send a message to a topic
send_message_to_service_bus("Test message to topic", queue_name=None, topic_name=TOPIC_NAME)

# Receive messages from a topic subscription
receive_messages_from_topic()