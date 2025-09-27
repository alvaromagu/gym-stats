import express, { Router } from 'express';
import cors from 'cors';
import type * as http from 'node:http';
import type { AddressInfo } from 'node:net';
import type { Logger } from '@shared/domain/logger';
import type { Config } from '@shared/domain/config';
import { catchErrors, registerRoutes, routeLogger } from './routes/index';

export class Server {
  private readonly express = express();
  private readonly router = Router();
  http!: http.Server;

  constructor(
    private readonly config: Config,
    private readonly logger: Logger,
  ) {
    this.express.use(
      cors({
        origin: this.config.origins,
      }),
    );
    this.express.use(express.json());
    this.express.use(routeLogger);
    this.express.use(this.router);
    this.express.use(catchErrors);
  }

  async start(): Promise<void> {
    await registerRoutes(this.router);
    // eslint-disable-next-line promise/avoid-new
    await new Promise<void>((resolve) => {
      this.http = this.express.listen(this.config.port, () => {
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
