import { Aggregate } from '../../../contexts/shared/domain/aggregate.js';
import type { Primitives } from '../../../contexts/shared/domain/primitives.js';
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
      transports: this.transports,
    };
  }
}
