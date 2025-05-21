import { Texture, Sprite, type PointData, type Container } from "pixi.js";
import { Sound } from "@pixi/sound";
import { SaturationBar } from "./saturationBar";
import { GAME_CONFIG } from "../variables";

export class Player {
  private readonly sprite: Sprite;
  private readonly bar: SaturationBar;

  private readonly pickSound: Sound;

  private readonly walkSound: Sound;
  private readonly walkSoundStatus = {
    isRequested: false,
    isPlaying: false,
  };

  private saturationBarFillPercent = 0;

  constructor({
    width,
    height,
    texture,
    position,
    walkSound,
    pickSound,
    saturationBarOffset,
  }: {
    width: number;
    height: number;
    texture: Texture;
    position: PointData;
    walkSound: Sound;
    pickSound: Sound;
    saturationBarOffset: number;
  }) {
    this.sprite = new Sprite(texture);
    this.sprite.width = width;
    this.sprite.height = height;
    this.sprite.anchor.set(0.5);
    this.sprite.position.set(position.x, position.y);

    this.walkSound = walkSound;
    this.pickSound = pickSound;

    this.bar = new SaturationBar(saturationBarOffset);
  }

  get bounds() {
    return this.sprite.getBounds();
  }

  get anchor(): PointData {
    return this.sprite.anchor;
  }

  public mount(container: Container) {
    container.addChild(this.sprite);
    this.bar.mount(container);
  }

  public move(deltaMs: number, target: PointData) {
    this.bar.draw(this.sprite, this.saturationBarFillPercent);

    const dt = deltaMs / 1_000;
    const dx = target.x - this.sprite.x;
    const dy = target.y - this.sprite.y;
    const dist = Math.hypot(dx, dy);
    const step = GAME_CONFIG.SPEED * dt;

    if (dist > step) {
      this.sprite.x += (dx / dist) * step;
      this.sprite.y += (dy / dist) * step;
      this.playWalkSound();
    } else {
      this.sprite.position.copyFrom(target);
      this.stopWalkSound();
    }
  }

  private playWalkSound() {
    this.walkSoundStatus.isRequested = true;

    if (this.walkSoundStatus.isPlaying) {
      return;
    }

    this.walkSoundStatus.isPlaying = true;
    this.walkSound.play({
      complete: () => {
        this.walkSoundStatus.isPlaying = false;
        if (this.walkSoundStatus.isRequested) {
          this.playWalkSound();
        }
      },
    });
  }

  private stopWalkSound() {
    this.walkSoundStatus.isRequested = false;
  }

  public onCollisionWithFruit() {
    if (this.saturationBarFillPercent >= 1) {
      return;
    }

    this.pickSound.play();
    this.saturationBarFillPercent = Math.min(
      1,
      Math.round((this.saturationBarFillPercent + 0.1) * 1_000) / 1_000
    );
  }
}
