import type { Bounds } from "pixi.js";

export type BoundingBox = Pick<Bounds, "x" | "y" | "width" | "height">;

export const hitAABB = (r1: BoundingBox, r2: BoundingBox) =>
  r1.x < r2.x + r2.width &&
  r1.x + r1.width > r2.x &&
  r1.y < r2.y + r2.height &&
  r1.y + r1.height > r2.y;
