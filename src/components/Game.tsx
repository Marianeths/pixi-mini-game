import { useEffect, useRef } from "react";
import { GameController } from "../core/initGame";
import { GAME_CONFIG } from "../variables";

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameControllerRef = useRef<GameController | null>(null);

  useEffect(() => {
    if (!canvasRef.current || gameControllerRef.current) {
      return;
    }

    const gameController = new GameController(canvasRef.current);
    gameControllerRef.current = gameController;

    (async () => {
      await gameController.init({
        width: GAME_CONFIG.SIZE,
        height: GAME_CONFIG.SIZE,
        autoStart: false,
        backgroundColor: 0x228b22,
      });

      gameController.start();
    })();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONFIG.SIZE}
      height={GAME_CONFIG.SIZE}
    />
  );
}
