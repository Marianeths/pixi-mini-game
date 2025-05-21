import { Sprite, Texture, Container } from "pixi.js";
import { GAME_CONFIG } from "../variables";
import { type BoundingBox, hitAABB } from "../utils/hitAABB";
import { range } from "../utils/range";
import { getRandomIntInRange } from "../utils/getRandomIntInRange";

type Fruit = { sprite: Sprite };

export class FruitManager {
  private fruits: Fruit[] = [];
  private readonly container = new Container();
  private readonly fruitTex: Texture;

  constructor(fruitTex: Texture) {
    this.fruitTex = fruitTex;
  }

  public getFruits(): readonly Fruit[] {
    return this.fruits;
  }

  public mountFruits(container: Container) {
    container.addChild(this.container);
  }

  private isOverlapsOtherFruits(fruitBounds: BoundingBox) {
    return this.fruits.some((f) => hitAABB(f.sprite.getBounds(), fruitBounds));
  }

  private genFruitPosition() {
    return getRandomIntInRange(
      GAME_CONFIG.FRUIT_SPAWN_OFFSET_LIMIT,
      GAME_CONFIG.SIZE - GAME_CONFIG.FRUIT_SPAWN_OFFSET_LIMIT
    );
  }

  public spawn(spawnExclusionZone: BoundingBox) {
    let apple: Sprite;
    let appleBounds: BoundingBox;

    let attempts = 0;

    do {
      apple = new Sprite(this.fruitTex);
      apple.anchor.set(0.5);
      apple.width = apple.height = GAME_CONFIG.FRUIT_SIZE;
      apple.position.set(this.genFruitPosition(), this.genFruitPosition());
      appleBounds = apple.getBounds();
      attempts++;
    } while (
      (hitAABB(spawnExclusionZone, appleBounds) ||
        this.isOverlapsOtherFruits(appleBounds)) &&
      attempts < 100
    );

    if (attempts >= 100) return;

    this.container.addChild(apple);
    this.fruits.push({ sprite: apple });
  }

  public spawnMany(spawnExclusionZone: BoundingBox, numberOfFruits: number) {
    range(numberOfFruits).forEach(() => this.spawn(spawnExclusionZone));
  }

  public remove(fruit: Fruit) {
    this.fruits = this.fruits.filter((f) => f !== fruit);
    this.container.removeChild(fruit.sprite);
    fruit.sprite.destroy();
  }
}
