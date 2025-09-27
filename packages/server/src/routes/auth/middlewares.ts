import { hashToken } from '@/contexts/auth/app/hash-token';
import { GSApiError } from '@/contexts/shared/domain/error';
import { container } from '@/di';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  userId: string;
  email: string;
  fullName: string;
}

export async function createAuthMiddleware(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  const config = container.get('config');
  const tokenRepository = container.get('tokenRepository');

  const authHeader = req.headers.authorization;

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!authHeader?.startsWith('Bearer ')) {
    throw new GSApiError(
      'Unauthorized: Missing or invalid Authorization header.',
      401,
    );
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret, {
      issuer: config.rpID,
    }) as jwt.JwtPayload;
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
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new GSApiError(
        'Unauthorized: Missing or invalid Authorization header.',
        401,
      );
    }
    throw new GSApiError('Internal Server Error', 500);
  }
}
