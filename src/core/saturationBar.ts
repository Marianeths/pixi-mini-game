import { Graphics, type PointData, Container } from "pixi.js";

export class SaturationBar {
  private readonly bar = new Graphics();
  private readonly saturationBarOffset: number;

  constructor(saturationBarOffset: number) {
    this.saturationBarOffset = saturationBarOffset;
  }

  public mount(container: Container) {
    container.addChild(this.bar);
  }

  public draw(anchorPosition: PointData, fillPercent: number) {
    this.bar.clear();

    this.bar.position.set(
      anchorPosition.x,
      anchorPosition.y - this.saturationBarOffset
    );
    this.bar.setStrokeStyle(2);
    this.bar.rect(-25, 0, 50, 6).fill(0xff0000);
    this.bar.rect(-25, 0, 50 * fillPercent, 6).fill(0x00ff00);
  }
}
