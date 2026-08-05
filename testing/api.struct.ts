export type position = [number, number, number]
export interface itemAttributes {
  customDescription: string
}
export interface gameEngine {
  setStandardChestItemSlot(
    pos: position,
    idx: number,
    name: string,
    amount: number,
    id: number,
    val: itemAttributes,
  ): void
  getStandardChestItemSlot(pos: position, idx: number): itemAttributes
}
