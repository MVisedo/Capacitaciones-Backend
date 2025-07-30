import { consumeExchange } from '../rabbit.consumer';
import { logger } from '../../../modules/logger';
import { stockService } from '../../../modules/stock';
import mongoose from 'mongoose';


export async function startStockConsumer() {
  await consumeExchange('db-product-queue','stock.#', async (msg) => {
    const data = JSON.parse(msg.content.toString());
    const routingKey = msg.fields.routingKey;
    
    logger.info(`CONSUMED from db-product-queue, whit key ${routingKey}`);
    
    switch (routingKey) {
      case 'stock.stock.created':
        await stockService.createStock({productId:data.productId,cantidad:0})
        break;
      case 'stock.stock.updated':
        const productId = new mongoose.Types.ObjectId(data.productId);
        await stockService.updateStockByProductId(productId, data.updateBody);
        break;
      case 'stock.stock.deleted':
        await stockService.deleteStockByProductId(data);
        break;

      default:
        console.warn(`Unknown routing key: ${routingKey}`);
    }
    
    

  });
}