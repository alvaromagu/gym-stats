export class TrekError extends Error {
  constructor(readonly message: string) {
    super(message);
  }
}
