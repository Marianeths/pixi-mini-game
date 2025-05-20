import { Application, Sprite, Point } from "pixi.js";

export function setupPointerControl(app: Application, player: Sprite) {
  const target = new Point(player.x, player.y);
  let isMouseDown = false;

  const canvas = app.canvas as HTMLCanvasElement;

  const calculateTargetCoordinate = (
    pointerCoord: number,
    rectCoord: number,
    rectSize: number,
    deadZone: number
  ) => {
    return Math.min(
      Math.max(pointerCoord - rectCoord, deadZone),
      rectSize - deadZone
    );
  };

  function updateTargetFromEvent(e: PointerEvent) {
    const halfWidth = player.width * player.anchor.x;
    const halfHeight = player.height * player.anchor.y;

    const rect = canvas.getBoundingClientRect();

    target.set(
      calculateTargetCoordinate(e.clientX, rect.left, rect.width, halfWidth),
      calculateTargetCoordinate(e.clientY, rect.top, rect.height, halfHeight)
    );
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
