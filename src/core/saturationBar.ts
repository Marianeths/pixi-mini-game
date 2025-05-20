import { Application, Sprite, Graphics } from "pixi.js";
import { GAME_CONFIG } from "../variables.ts";

export function createSaturationBar(
  app: Application,
  player: Sprite,
  saturationRef: React.MutableRefObject<number>
) {
  const bar = new Graphics();
  app.stage.addChild(bar);

  return function drawBar() {
    bar.clear();
    bar.position.set(player.x, player.y - GAME_CONFIG.SATURATION_BAR_OFFSET);
    bar.setStrokeStyle(2);
    bar.rect(-25, 0, 50, 6).fill(0xff0000);
    bar.rect(-25, 0, 50 * saturationRef.current, 6).fill(0x00ff00);
  };
}
