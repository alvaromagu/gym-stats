import express, { Router, type Express } from 'express';
import cors from 'cors';
import type * as http from 'node:http';
import type { AddressInfo } from 'node:net';
import type { Logger } from './contexts/shared/domain/logger.js';
import type { Config } from './contexts/shared/domain/config.js';
import { catchErrors, registerRoutes, routeLogger } from './routes/index.js';

export class Server {
  http!: http.Server;

  constructor(
    private readonly config: Config,
    private readonly logger: Logger,
  ) {}

  async start(expressApp: Express): Promise<void> {
    const router = Router();
    expressApp.use(
      cors({
        origin: this.config.origins,
      }),
    );
    expressApp.use(express.json());
    expressApp.use(routeLogger);
    expressApp.use(router);
    expressApp.use(catchErrors);

    await registerRoutes(router);
    // eslint-disable-next-line promise/avoid-new
    await new Promise<void>((resolve) => {
      this.http = expressApp.listen(this.config.port, () => {
        const { port } = this.http.address() as AddressInfo;
        this.logger.info(`🚀 Application running on http://localhost:${port}`);
        resolve();
      });
    });
  }

  async stop(): Promise<void> {
    // eslint-disable-next-line promise/avoid-new
    await new Promise<void>((resolve, reject) => {
      this.logger.info('Stopping http server...');
      this.http.close((err) => {
        if (err != null) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
}
