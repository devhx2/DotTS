import { Config, DotTS } from "@dotts";

const config: Config = {
  canvas: {
    id: "game-screen",
    width: 16 * 80,
    height: 9 * 80,
    scale: 8,
  },
  fps: 30,
};

const game = new DotTS(config);

game.run();
