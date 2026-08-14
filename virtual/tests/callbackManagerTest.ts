//@ts-nocheck
export default async function test(t: number): Promise<boolean> {
    await new Promise((r) => setTimeout(r, t * 11))
    return time > 9 && time < 12
}
