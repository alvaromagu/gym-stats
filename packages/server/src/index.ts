import { container } from './di/index.js';
import express from 'express';

const expressApp = express();

container
  .register()
  .then(async () => {
    const server = container.get('server');
    await server.start(expressApp);
  })
  .catch((error: unknown) => {
    console.error('Error registering Dependency Injection container:', error);
    process.exit(1);
  });

export default expressApp;
