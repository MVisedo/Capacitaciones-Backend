import amqp from 'amqplib';
import { getRabbitConnection } from './rabbit.connection';
import { logger } from '../logger';

let channel:amqp.Channel;

export async function publishToExchange(routingKey: string, message: object) {
 if (!channel) {
    const connection = await getRabbitConnection();
    channel = await connection.createChannel();
    await channel.assertExchange('productAndUser', 'topic', { durable: true });
  }
  
  channel.publish('productAndUser',routingKey, Buffer.from(JSON.stringify(message)));
  logger.info('PUBLISHED to productAndUser, with key: '+routingKey);
}