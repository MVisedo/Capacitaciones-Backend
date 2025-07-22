import amqp, { ConsumeMessage } from 'amqplib';
import { getRabbitConnection } from './rabbit.connection';
import { logger } from '../logger';


let channel: amqp.Channel;

export async function consumeExchange(
  queue: string,
  routingKey:string,
  callback: (msg: ConsumeMessage) => Promise<void>
) {
  if (!channel) {
    const connection = await getRabbitConnection();
    channel = await connection.createChannel();
    await channel.assertExchange('stock', 'topic', { durable: true });
  }

  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, 'stock', routingKey);

  channel.consume(queue, async (msg) => {
     if (msg) {
      try {
        await callback(msg);
        channel.ack(msg);
        logger.info(`CONSUMED from ${queue}`);
      } catch (err) {
        logger.error('Error handling message:', err);
        channel.nack(msg);
      }
    }
  });
}