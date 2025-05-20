import { Application, Assets } from "pixi.js";
import { Sound } from "@pixi/sound";
import { createPlayer } from "./player.ts";
import { createFruitManager } from "./fruitManager.ts";
import { createSaturationBar } from "./saturationBar.ts";
import { setupPointerControl } from "./pointerControl.ts";
import { GAME_CONFIG } from "../variables.ts";

export async function initGame(
  app: Application,
  canvas: HTMLCanvasElement,
  saturationRef: React.MutableRefObject<number>
) {
  await app.init({
    canvas,
    width: GAME_CONFIG.SIZE,
    height: GAME_CONFIG.SIZE,
    backgroundColor: 0x228b22,
    autoStart: false,
  });

  const assets = await Assets.load([
    "assets/player.png",
    "assets/apple.png",
    "sounds/walk.mp3",
    "sounds/pick.mp3",
  ]);

  const player = createPlayer(assets["assets/player.png"]);
  const pickSnd = Sound.from({
    url: "sounds/pick.mp3",
    volume: 0.3,
  });

  app.stage.addChild(player);

  const fruits = createFruitManager(
    app,
    player,
    assets["assets/apple.png"],
    pickSnd,
    saturationRef,
    GAME_CONFIG.FRUIT_COUNT
  );
  const drawBar = createSaturationBar(app, player, saturationRef);
  const target = setupPointerControl(app, player);

  app.ticker.add(() => {
    drawBar();

    const dt = app.ticker.deltaMS / 1000;
    const dx = target.x - player.x;
    const dy = target.y - player.y;
    const dist = Math.hypot(dx, dy);
    const step = GAME_CONFIG.SPEED * dt;

    if (dist > step) {
      player.x += (dx / dist) * step;
      player.y += (dy / dist) * step;
      player.playWalkSound();
    } else {
      player.position.copyFrom(target);
      player.stopWalkSound();
    }

    fruits.checkCollision();
  });

  app.start();
}
