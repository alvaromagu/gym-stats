import type { Request as ERequest } from 'express';

declare module 'express' {
  export interface Request extends ERequest {
    user?: {
      userId: string;
      email: string;
      fullName: string;
    };
  }
}
