import { GUI } from "three/addons/libs/lil-gui.module.min.js";

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

  gui.onChange(() => {
    button.generate();
  });
}
