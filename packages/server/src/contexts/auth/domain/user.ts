import { Aggregate } from '../../shared/domain/aggregate.js';
import type { WebAuthnCredential } from '@simplewebauthn/server';

function validateId(id: unknown): void {
  if (typeof id !== 'string') {
    throw new Error('Invalid id: must be a string');
  }

  if (id.trim().length === 0) {
    throw new Error('Invalid id: cannot be empty');
  }
}

function validateEmail(email: unknown): void {
  if (typeof email !== 'string') {
    throw new Error('Invalid email: must be a string');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
}

function validateFullName(fullName: unknown): void {
  if (typeof fullName !== 'string') {
    throw new Error('Invalid full name: must be a string');
  }
  if (fullName.trim().length === 0) {
    throw new Error('Invalid full name: cannot be empty');
  }
}

export class User extends Aggregate {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly fullName: string,
    public readonly credentials: WebAuthnCredential[],
    public readonly currentChallenge: string | null,
  ) {
    super();
    validateId(id);
    validateEmail(email);
    validateFullName(fullName);
  }

  toPrimitives(): Record<string, unknown> {
    return {
      id: this.id,
      email: this.email,
      fullName: this.fullName,
      credentials: this.credentials,
    };
  }
}
