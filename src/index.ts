import mongoose from 'mongoose';
import app from './app';
import config from './config/config';
import logger from './modules/logger/logger';
//import { startProductCreatedConsumer } from './modules/rabbit/consumers/productCreated.consumer';
import { getRabbitConnection } from './modules/rabbit/rabbit.connection';

let server: any;
mongoose.connect(config.mongoose.url).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

async function bootstrap() {
  await getRabbitConnection()
  .then(() => {
    logger.info("RabbitMQ conectado");
  })
  .catch(err => {
    console.error("Error al conectar RabbitMQ:", err);
    process.exit(1);
  });

  //await startProductCreatedConsumer();
}
bootstrap().catch((err) => {
  console.error("Fallo al iniciar app:", err);
  process.exit(1);
});


const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: string) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
