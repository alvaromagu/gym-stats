type LogFn = (message: unknown, ...optionalParams: unknown[]) => void;

export interface Logger {
  debug: LogFn;
  info: LogFn;
  error: LogFn;
  warning: LogFn;
}
