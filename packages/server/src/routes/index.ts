import type { NextFunction, Router, Request, Response } from 'express';
import { glob } from 'glob';
import { validationResult } from 'express-validator';
import httpStatus from 'http-status';
import path from 'node:path';

export async function registerRoutes(router: Router): Promise<void> {
  const globPattern =
    path.dirname('src/routes').replace(/\\/gi, '/') + '/**/*.route.*';
  const routes = glob.sync(globPattern, {});
  await Promise.all(
    routes
      .map((route) => route.replace(/\\/gi, '/').replace('src/routes/', './'))
      .map(async (route) => {
        await register(route, router);
      }),
  );
}

async function register(routePath: string, router: Router): Promise<void> {
  const route = await import(routePath).catch(() => {
    console.error(`error resolving route on path ${routePath}`);
  });
  if (route == null || typeof route.register !== 'function') {
    console.warn(`route ${routePath} doesnt have a register exported function`);
    return;
  }
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
