export function log(message: unknown, ...optionalParams: unknown[]) {
  // eslint-disable-next-line no-console -- Log entry point
  console.log(message, ...optionalParams);
}
