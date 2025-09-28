import { Aggregate } from '../../shared/domain/aggregate.js';

export class Token extends Aggregate {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly hash: string,
    readonly expiresAt: Date,
    readonly createdAt: Date,
  ) {
    super();
  }

  toPrimitives(): Record<string, unknown> {
    return {
      id: this.id,
      userId: this.userId,
      hash: this.hash,
      expiresAt: this.expiresAt,
      createdAt: this.createdAt,
    };
  }
}
