import type {
  ISODateTime,
  Primitives,
} from '@/contexts/shared/domain/primitives.js';
import { Aggregate } from '../../shared/domain/aggregate.js';

export class Token extends Aggregate {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly credentialId: string,
    readonly hash: string,
    readonly expiresAt: Date,
    readonly createdAt: Date,
  ) {
    super();
  }

  toPrimitives(): Primitives<Token> {
    return {
      id: this.id,
      userId: this.userId,
      credentialId: this.credentialId,
      hash: this.hash,
      expiresAt: this.expiresAt.toISOString() as ISODateTime,
      createdAt: this.createdAt.toISOString() as ISODateTime,
    };
  }
}
