import { Aggregate } from '../../../contexts/shared/domain/aggregate.js';
import type {
  ISODateTime,
  Primitives,
} from '../../../contexts/shared/domain/primitives.js';
import type {
  AuthenticatorTransportFuture,
  Uint8Array_,
} from '@simplewebauthn/server';

export class Credential extends Aggregate {
  constructor(
    public readonly id: Base64URLString,
    public readonly publicKey: Uint8Array_,
    public readonly counter: number,
    public readonly deviceName: string,
    public readonly verified: boolean,
    public readonly createdAt: Date,
    public readonly transports?: AuthenticatorTransportFuture[],
  ) {
    super();
  }

  toPrimitives(): Primitives<Credential> {
    return {
      id: this.id,
      publicKey: Buffer.from(this.publicKey).toString('base64'),
      counter: this.counter,
      deviceName: this.deviceName,
      verified: this.verified,
      createdAt: this.createdAt.toISOString() as ISODateTime,
      transports: this.transports,
    };
  }
}
