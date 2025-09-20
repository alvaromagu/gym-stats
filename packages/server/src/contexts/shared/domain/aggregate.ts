export abstract class Aggregate {
  abstract toPrimitives(): Record<string, unknown>;
}
