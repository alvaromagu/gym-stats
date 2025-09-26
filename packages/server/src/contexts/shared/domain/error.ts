export class GSError extends Error {}

export class GSApiError extends GSError {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}
