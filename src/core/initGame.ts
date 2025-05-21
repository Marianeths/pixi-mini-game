import { Application, Assets, Texture } from "pixi.js";
import { Sound } from "@pixi/sound";
import { Player } from "./player";
import { FruitManager } from "./fruitManager";
import { CollisionSystem } from "./collisionSystem";
import { PointerController } from "./pointerControl.ts";

import { GAME_CONFIG } from "../variables.ts";

export class GameController {
  private readonly app = new Application();
  private readonly canvas: HTMLCanvasElement;

  private readonly collisionSystem = new CollisionSystem();
  private fruitManager: FruitManager;
  private player: Player;
  private pointerController: PointerController;

  private readonly assetSources = [
    "assets/player.png",
    "assets/apple.png",
    "sounds/walk.mp3",
    "sounds/pick.mp3",
  ] as const;
  private assets: Record<(typeof this.assetSources)[number], Texture>;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  public async init({
    autoStart,
    backgroundColor,
    height,
    width,
  }: {
    width: number;
    height: number;
    backgroundColor: number;
    autoStart: boolean;
  }) {
    await this.app.init({
      canvas: this.canvas,
      width,
      height,
      backgroundColor,
      autoStart,
    });

    await this.initAssets();
    this.initPlayer();
    this.player.mount(this.app.stage);

    this.initFruitManager();
    this.initPointerController();

    this.fruitManager.mountFruits(this.app.stage);
    this.fruitManager.spawnMany(this.player.bounds, GAME_CONFIG.FRUIT_COUNT);

    this.listenTicker();
  }

  public start() {
    this.app.start();
  }

  private async initAssets() {
    this.assets = await Assets.load(this.assetSources);
  }

  private initPlayer() {
    this.player = new Player({
      width: GAME_CONFIG.PLAYER_SIZE.width,
      height: GAME_CONFIG.PLAYER_SIZE.height,
      texture: this.assets["assets/player.png"],
      position: {
        x: GAME_CONFIG.SIZE / 2,
        y: GAME_CONFIG.SIZE / 2,
      },
      pickSound: Sound.from({
        url: "sounds/pick.mp3",
        volume: 0.3,
      }),
      saturationBarOffset: GAME_CONFIG.SATURATION_BAR_OFFSET,
      walkSound: Sound.from({
        url: "sounds/walk.mp3",
        preload: true,
        volume: 0.1,
      }),
    });
  }

  private initFruitManager() {
    this.fruitManager = new FruitManager(this.assets["assets/apple.png"]);
  }

  private initPointerController() {
    const playerBounds = this.player.bounds;

    const halfWidth = playerBounds.width * this.player.anchor.x;
    const halfHeight = playerBounds.height * this.player.anchor.y;

    this.pointerController = new PointerController(
      this.canvas,
      {
        x: playerBounds.x + halfWidth,
        y: playerBounds.y + halfHeight,
      },
      {
        x: halfWidth,
        y: halfHeight,
      }
    );
  }

  private listenTicker() {
    this.app.ticker.add(() => {
      this.collisionSystem.check(
        this.player.bounds,
        this.fruitManager.getFruits(),
        (fruit) => {
          this.player.onCollisionWithFruit();

          this.fruitManager.remove(fruit);
          this.fruitManager.spawn(this.player.bounds);
        }
      );

      this.player.move(this.app.ticker.deltaMS, this.pointerController.target);
    });
  }
}
