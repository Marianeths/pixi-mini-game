import { Application, Sprite, Point } from "pixi.js";

export function setupPointerControl(app: Application, player: Sprite) {
  const target = new Point(player.x, player.y);
  let isMouseDown = false;

  const canvas = app.canvas as HTMLCanvasElement;

  function updateTargetFromEvent(e: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    target.set(e.clientX - rect.left, e.clientY - rect.top);
  }

  canvas.addEventListener("pointerdown", (e: PointerEvent) => {
    isMouseDown = true;
    updateTargetFromEvent(e);
  });

  document.addEventListener("pointerup", () => {
    isMouseDown = false;
  });

  canvas.addEventListener("pointermove", (e: PointerEvent) => {
    if (!isMouseDown) return;
    updateTargetFromEvent(e);
  });

  return target;
}
