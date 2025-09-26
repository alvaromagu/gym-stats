export async function delay(ms: number) {
  // eslint-disable-next-line promise/avoid-new
  return await new Promise((resolve) => setTimeout(resolve, ms));
}
