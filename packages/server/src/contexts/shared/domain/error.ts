export class GSError extends Error {}

export class GSNotFoundError extends GSError {}

export class GSConflictError extends GSError {}

export class GSGoneError extends GSError {}

export class GSPreconditionFailedError extends GSError {}

export class GSApiError extends GSError {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}
