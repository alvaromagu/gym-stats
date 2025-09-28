import type { Primitives } from './primitives.js';

export abstract class Aggregate {
  abstract toPrimitives(): Primitives<unknown>;
}
