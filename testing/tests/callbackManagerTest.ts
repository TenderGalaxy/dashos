export default async function test(t: number): Promise<any> {
  let counter = 0
  // @ts-expect-error
  dashos.callbacks.tick.push(() => counter++)
  await new Promise((r) => setTimeout(r, t * 11))
  return counter > 9 && counter < 12
}
