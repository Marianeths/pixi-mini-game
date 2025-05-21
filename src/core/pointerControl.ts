import { Point, type PointData } from "pixi.js";
import { clamp } from "../utils/clamp";

export class PointerController {
  public readonly target: Point = new Point();

  private isMouseDown = false;
  private readonly canvas: HTMLCanvasElement;

  private boundingConstraint: PointData;

  constructor(
    canvas: HTMLCanvasElement,
    position: PointData,
    boundingConstraint: PointData
  ) {
    this.canvas = canvas;
    this.target.set(position.x, position.y);

    this.boundingConstraint = boundingConstraint;

    this.attachListeners();
  }

  private attachListeners() {
    this.canvas.addEventListener("pointerdown", this.onPointerDown);
    document.addEventListener("pointerup", this.onPointerUp);
    this.canvas.addEventListener("pointermove", this.onPointerMove);
  }

  private detachListeners() {
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    document.removeEventListener("pointerup", this.onPointerUp);
    this.canvas.removeEventListener("pointermove", this.onPointerMove);
  }

  private onPointerDown = (e: PointerEvent) => {
    this.isMouseDown = true;
    this.updateTargetFromEvent(e);
  };

  private onPointerUp = () => {
    this.isMouseDown = false;
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.isMouseDown) return;
    this.updateTargetFromEvent(e);
  };

  private updateTargetFromEvent(e: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();

    const x = clamp(
      e.clientX - rect.left,
      this.boundingConstraint.x,
      rect.width - this.boundingConstraint.x
    );
    const y = clamp(
      e.clientY - rect.top,
      this.boundingConstraint.y,
      rect.height - this.boundingConstraint.y
    );

    this.target.set(x, y);
  }

  public destroy() {
    this.detachListeners();
  }
}
