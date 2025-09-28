import express, { Router } from 'express';
import { catchErrors, routeLogger } from './routes/index.js';
import cors from 'cors';
import { container } from './di/index.js';
import { registerAuthRoutes } from './routes/auth/auth.route.js';
import type { AddressInfo } from 'node:net';
import useragent from 'express-useragent';

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
expressApp.use(useragent.express());

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

const http = expressApp.listen(process.env.PORT ?? 3000, () => {
  const { port } = http.address() as AddressInfo;
  console.log(`🚀 Application running on http://localhost:${port}`);
});

export default expressApp;
