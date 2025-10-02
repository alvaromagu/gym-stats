import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { hashToken } from '../../contexts/auth/app/hash-token.js';
import { GSApiError } from '../../contexts/shared/domain/error.js';
import { container } from '../../di/index.js';
import { getToken } from '../index.js';

export async function authMiddleware(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  const config = container.get('config');
  const tokenRepository = container.get('tokenRepository');
  const token = getToken(req);
  if (token == null) {
    throw new GSApiError(
      'Unauthorized: Missing or invalid Authorization header.',
      401,
    );
  }
  let decoded: jwt.JwtPayload | undefined = undefined;
  try {
    decoded = jwt.verify(token, config.jwtSecret, {
      issuer: config.rpID,
    }) as jwt.JwtPayload;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new GSApiError(
        'Unauthorized: Missing or invalid Authorization header.',
        401,
      );
    }
    throw new GSApiError('Internal Server Error', 500);
  }
  const hashedToken = hashToken(token);
  const dbToken = await tokenRepository.findByHash(hashedToken);
  if (dbToken == null) {
    throw new GSApiError(
      'Unauthorized: Missing or invalid Authorization header.',
      401,
    );
  }
  req.user = {
    userId: decoded.userId as string,
    email: decoded.email as string,
    fullName: decoded.fullName as string,
  };
  next();
}
