import { Config, DotTS } from "@dotts";

const config: Config = {
  canvas: {
    id: "game-screen",
    width: 640,
    height: 480,
    scale: 4,
  },
  fps: 30,
};

const game = new DotTS(config);

game.run();
