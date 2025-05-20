import { useEffect, useRef } from "react";
import { Application } from "pixi.js";
import { initGame } from "../core/initGame";
import { GAME_CONFIG } from "../variables";

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const saturationRef = useRef(0);

  useEffect(() => {
    const app = new Application();

    const start = async () => {
      await initGame(app, canvasRef.current!, saturationRef);
    };

    start();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONFIG.SIZE}
      height={GAME_CONFIG.SIZE}
    />
  );
}
