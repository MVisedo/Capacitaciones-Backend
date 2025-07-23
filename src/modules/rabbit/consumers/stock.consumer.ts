import { consumeExchange } from '../rabbit.consumer';
import { logger } from '@/modules/logger';
import { stockService } from '@/modules/stock';


export async function startStockConsumer() {
  await consumeExchange('db-product-queue','stock.#', async (msg) => {
    const data = JSON.parse(msg.content.toString());
    const routingKey = msg.fields.routingKey;
    

    switch (routingKey) {
      case 'stock.stock.created':
        await stockService.createStock({productId:data._id,cantidad:0})
        break;
      case 'stock.stock.updated':
        await stockService.updateStockByProductId(data.productId, data.updateBody);
        break;
      case 'stock.stock.deleted':
        await stockService.deleteStockByProductId(data);
        break;

      default:
        console.warn(`Unknown routing key: ${routingKey}`);
    }
    logger.info(`CONSUMED from db-product-queue, whit key ${routingKey}`);
    

  });
}