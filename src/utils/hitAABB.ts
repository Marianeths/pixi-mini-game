import { Sprite } from "pixi.js";

export function hitAABB(a: Sprite, b: Sprite): boolean {
  const r1 = a.getBounds();
  const r2 = b.getBounds();
  return (
    r1.x < r2.x + r2.width &&
    r1.x + r1.width > r2.x &&
    r1.y < r2.y + r2.height &&
    r1.y + r1.height > r2.y
  );
}
