import { Aggregate } from '@/contexts/shared/domain/aggregate.js';
import type {
  ISODateTime,
  Primitives,
} from '@/contexts/shared/domain/primitives.js';

export class CredentialRequest extends Aggregate {
  constructor(
    public readonly id: string,
    public readonly expiresAt: Date,
    public readonly userId: string,
  ) {
    super();
  }

  toPrimitives(): Primitives<CredentialRequest> {
    return {
      id: this.id,
      expiresAt: this.expiresAt.toISOString() as ISODateTime,
      userId: this.userId,
    };
  }
}
