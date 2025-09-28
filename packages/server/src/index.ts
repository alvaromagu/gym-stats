import express, { Router } from 'express';
import { catchErrors, routeLogger } from './routes/index.js';
import cors from 'cors';
import { container } from './di/index.js';
import { registerAuthRoutes } from './routes/auth/auth.route.js';
import type { AddressInfo } from 'node:net';

const expressApp = express();
const router = Router();

const origin = process.env.ORIGIN;
const origins = origin?.split(',') ?? [];
expressApp.use(
  cors({
    origin: origins,
  }),
);

expressApp.use(express.json());

const containerPromise = container
  .register()
  .then(async () => {
    console.log('Dependency Injection container registered');
  })
  .catch((error: unknown) => {
    console.error('Error registering Dependency Injection container:', error);
    process.exit(1);
  });

expressApp.use(async (_, __, next) => {
  await containerPromise;
  next();
});

expressApp.use(routeLogger);
registerAuthRoutes(router);
expressApp.use(router);
expressApp.use(catchErrors);

const http = expressApp.listen(process.env.PORT ?? 8080, () => {
  const { port } = http.address() as AddressInfo;
  console.log(`🚀 Application running on http://localhost:${port}`);
});

export default expressApp;
