import { Application, Sprite, Texture, Container } from "pixi.js";
import { Sound } from "@pixi/sound";
import { GAME_CONFIG } from "../variables";
import { hitAABB } from "../utils/hitAABB";

type Fruit = { sprite: Sprite };

export function createFruitManager(
  app: Application,
  player: Sprite,
  fruitTex: Texture,
  pickSnd: Sound,
  saturationRef: React.MutableRefObject<number>,
  count: number
) {
  const fruits: Fruit[] = [];
  const container = new Container();
  app.stage.addChild(container);

  const overlapsOtherFruits = (sprite: Sprite) => {
    return fruits.some((f) => hitAABB(f.sprite, sprite));
  };

  const spawnFruit = () => {
    let apple: Sprite;
    let attempts = 0;

    do {
      apple = new Sprite(fruitTex);
      apple.anchor.set(0.5);
      apple.width = apple.height = GAME_CONFIG.FRUIT_SIZE;
      apple.position.set(
        40 + Math.random() * (GAME_CONFIG.SIZE - 80),
        40 + Math.random() * (GAME_CONFIG.SIZE - 80)
      );
      attempts++;
    } while (
      (hitAABB(player, apple) || overlapsOtherFruits(apple)) &&
      attempts < 100
    );

    if (attempts >= 100) return;

    container.addChild(apple);
    fruits.push({ sprite: apple });
  };

  for (let i = 0; i < count; i++) spawnFruit();

  const checkCollision = () => {
    for (let i = fruits.length - 1; i >= 0; i--) {
      const f = fruits[i];
      if (hitAABB(player, f.sprite)) {
        if (saturationRef.current < 1) {
          pickSnd.play();
          saturationRef.current = Math.min(
            1,
            Math.round((saturationRef.current + 0.1) * 1000) / 1000
          );
        }

        container.removeChild(f.sprite);
        f.sprite.destroy();
        fruits.splice(i, 1);
        spawnFruit();
      }
    }
  };

  return {
    checkCollision,
  };
}
