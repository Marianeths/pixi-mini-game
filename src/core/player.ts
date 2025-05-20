import { Texture, Sprite } from "pixi.js";
import { Sound } from "@pixi/sound";
import { GAME_CONFIG } from "../variables";

export function createPlayer(texture: Texture) {
  const player = new Sprite(texture);
  player.width = GAME_CONFIG.PLAYER_SIZE.width;
  player.height = GAME_CONFIG.PLAYER_SIZE.height;
  player.anchor.set(0.5);
  player.position.set(400, 400);

  const walkSound = Sound.from({
    url: "sounds/walk.mp3",
    preload: true,
    volume: 0.1,
  });

  let isRequested = false;
  let isPlaying = false;

  function playWalkSound() {
    isRequested = true;

    if (!isPlaying) {
      isPlaying = true;
      walkSound.play({
        complete: () => {
          isPlaying = false;
          if (isRequested) {
            playWalkSound();
          }
        },
      });
    }
  }

  function stopWalkSound() {
    isRequested = false;
  }

  return Object.assign(player, {
    playWalkSound,
    stopWalkSound,
  });
}
