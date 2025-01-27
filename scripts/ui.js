import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { BLOCKS } from "./blocks.js";

export function createUI(world) {
  const gui = new GUI();

  const button = {
    generate: () => {
      world.generate();
    },
  };

  gui.add(world.size, "width", 8, 128, 1).name("width");
  gui.add(world.size, "height", 8, 64, 1).name("height");

  const terrain = gui.addFolder("Terrain");
  terrain.add(world.params, "seed", 0, 10000, 1).name("Seed");
  terrain.add(world.params.terrain, "scale", 10, 100).name("Scale");
  terrain.add(world.params.terrain, "magnitude", 0, 1).name("Magnitude");
  terrain.add(world.params.terrain, "offset", 0, 1).name("Offset");

  const resources = gui.addFolder("Resources");
  const stone = resources.addFolder("Stone");
  stone.add(BLOCKS.STONE, "scarcity", 0, 1).name("Scarcity");
  const scaleStone = stone.addFolder("Scale");
  scaleStone.add(BLOCKS.STONE.scale, "x", 10, 100).name("X");
  scaleStone.add(BLOCKS.STONE.scale, "y", 10, 100).name("Y");
  scaleStone.add(BLOCKS.STONE.scale, "z", 10, 100).name("Z");

  gui.add(button, "generate").name("Generate");
}
