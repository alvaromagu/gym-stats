import type { NextFunction, Router, Request, Response } from 'express';
import { glob } from 'glob';
import { validationResult } from 'express-validator';
import httpStatus from 'http-status';
import { GSApiError, GSError } from '../contexts/shared/domain/error.js';

import { container } from '../di/index.js';
import { dirname, join } from 'node:path';

const currentModuleDir = dirname(import.meta.url);

export async function registerRoutes(router: Router): Promise<void> {
  const baseDir = currentModuleDir;
  const pattern = '**/*.route.*';
  const routes = glob.sync(pattern, { cwd: baseDir });
  await Promise.all(
    routes.map(async (route) => {
      await register(join(baseDir, route), router);
    }),
  );
}

async function register(routePath: string, router: Router): Promise<void> {
  const logger = container.get('logger');
  const route = await import(routePath).catch(() => {
    logger.error(`error resolving route on path ${routePath}`);
  });
  if (route == null || typeof route.register !== 'function') {
    logger.warning(
      `route ${routePath} doesnt have a register exported function`,
    );
    return;
  }
  logger.info(`registering route ${routePath}`);
  route.register(router);
}

export function validateReqSchema(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const validationErrors = validationResult(req);
  if (validationErrors.isEmpty()) {
    next();
    return;
  }
  const errors = validationErrors.array().map((err) => {
    if ('path' in err) {
      return { [err.path]: err.msg };
    }
    return { [err.type]: err.msg };
  });
  res.status(httpStatus.BAD_REQUEST).json({ errors });
}

export function catchErrors(
  err: unknown,
  _: Request,
  res: Response,
  __: NextFunction,
): void {
  const logger = container.get('logger');
  logger.error(err);
  if (err instanceof GSApiError) {
    res.status(err.status).json({ errors: [{ message: err.message }] });
  } else if (err instanceof GSError) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ errors: [{ message: err.message }] });
  } else {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ errors: [{ message: 'Unexpected server error' }] });
  }
}

export function routeLogger(
  req: Request,
  _: Response,
  next: NextFunction,
): void {
  const logger = container.get('logger');
  logger.info(`[${req.method}] ${req.originalUrl}`);
  next();
}

export function getToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!(authHeader?.startsWith('Bearer ') ?? false)) {
    return null;
  }
  return authHeader?.split(' ')[1] ?? null;
}
