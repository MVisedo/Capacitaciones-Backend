import amqp from 'amqplib';

let connection: amqp.ChannelModel;

export async function getRabbitConnection(): Promise<amqp.ChannelModel> {
  if (!connection) {
    connection = await amqp.connect('amqp://localhost');
  }
  return connection;
}