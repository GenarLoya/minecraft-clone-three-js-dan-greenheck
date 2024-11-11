import * as THREE from "three";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise.js";
import { RNG } from "./rng.js";
import { BLOCKS } from "./blocks.js";

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshLambertMaterial();

export class World extends THREE.Group {
  /**
   * @type {{
   *   id: number,
   *   instanceid: number
   * }[][][]}
   */
  data = [];
  threshold = 0.5;

  params = {
    seed: 0,
    terrain: {
      scale: 30,
      magnitude: 0.5,
      offset: 0.2,
    },
  };

  constructor(size = { width: 32, height: 32 }) {
    super();
    this.size = size;
  }

  generate() {
    this.inititlizeTerrain();
    this.generateTerrain();
    this.generateMeshes();
  }

  inititlizeTerrain() {
    this.data = [];
    for (let x = 0; x < this.size.width; x++) {
      const slice = [];
      for (let y = 0; y < this.size.height; y++) {
        const row = [];
        for (let z = 0; z < this.size.width; z++) {
          row.push({
            id: BLOCKS.AIR.id,
            instanceid: null,
          });
        }
        slice.push(row);
      }
      this.data.push(slice);
    }
  }

  generateTerrain() {
    const rng = new RNG(this.params.seed);
    const noiseGenerator = new SimplexNoise(rng);
    for (let x = 0; x < this.size.width; x++) {
      for (let z = 0; z < this.size.width; z++) {
        // Compute noise value at this x-z location
        const value = noiseGenerator.noise(
          x / this.params.terrain.scale,
          z / this.params.terrain.scale
        );

        // Scale noise based on the magnitude and add in the offset
        const scaledNoise =
          this.params.terrain.offset + this.params.terrain.magnitude * value;

        // Compute final height of terrain at this location
        let height = this.size.height * scaledNoise;

        // Clamp between 0 and max height
        height = Math.max(
          0,
          Math.min(Math.floor(height), this.size.height - 1)
        );

        // Starting at the terrain height, fill in all the blocks below that height
        for (let y = 0; y < this.size.height; y++) {
          if (y === height) {
            this.setBlockId(x, y, z, BLOCKS.GRASS.id);
          } else if (y <= height) {
            this.setBlockId(x, y, z, BLOCKS.DIRT.id);
          } else {
            this.setBlockId(x, y, z, BLOCKS.AIR.id);
          }
        }
      }
    }
  }

  generateMeshes() {
    this.clear();
    const maxCount = this.size.width * this.size.height * this.size.width;
    const mesh = new THREE.InstancedMesh(geometry, material, maxCount);
    mesh.count = 0;
    const matrix = new THREE.Matrix4();
    for (let x = 0; x < this.size.width; x++) {
      for (let y = 0; y < this.size.height; y++) {
        for (let z = 0; z < this.size.width; z++) {
          const blockId = this.data[x][y][z].id;
          const blockType =
            Object.entries(BLOCKS).find(
              ([, value]) => value.id === blockId
            )?.[1] ?? null;

          if (!blockType) {
            throw new Error(
              "Invalid block type in " +
                x +
                ", " +
                y +
                ", " +
                z +
                ": " +
                blockId
            );
          }

          const instanceId = mesh.count;
          if (blockId !== BLOCKS.AIR.id && !this.isBlockObscured(x, y, z)) {
            matrix.setPosition(x + 0.5, y + 0.5, z + 0.5);
            mesh.setColorAt(instanceId, new THREE.Color(blockType.color));
            mesh.setMatrixAt(instanceId, matrix);
            this.setBlockInstanceId(x, y, z, instanceId);
            mesh.count++;
          }
        }
      }
    }

    this.add(mesh);
  }

  getBlock(x, y, z) {
    if (this.inBounds(x, y, z)) {
      return this.data[x][y][z];
    } else {
      return null;
    }
  }

  setBlockId(x, y, z, id) {
    if (this.inBounds(x, y, z)) {
      this.data[x][y][z].id = id;
    } else {
      console.warn("Tried to set block out of bounds");
    }
  }

  setBlockInstanceId(x, y, z, instanceId) {
    if (this.inBounds(x, y, z)) {
      this.data[x][y][z].instanceid = instanceId;
    } else {
      console.warn("Tried to set block out of bounds");
    }
  }

  inBounds(x, y, z) {
    return (
      x >= 0 &&
      x < this.size.width &&
      y >= 0 &&
      y < this.size.height &&
      z >= 0 &&
      z < this.size.width
    );
  }

  isBlockObscured(x, y, z) {
    const up = this.getBlock(x, y + 1, z)?.id ?? BLOCKS.AIR.id;
    const down = this.getBlock(x, y - 1, z)?.id ?? BLOCKS.AIR.id;
    const left = this.getBlock(x + 1, y, z)?.id ?? BLOCKS.AIR.id;
    const right = this.getBlock(x - 1, y, z)?.id ?? BLOCKS.AIR.id;
    const forward = this.getBlock(x, y, z + 1)?.id ?? BLOCKS.AIR.id;
    const back = this.getBlock(x, y, z - 1)?.id ?? BLOCKS.AIR.id;

    return !(
      up === BLOCKS.AIR.id ||
      down === BLOCKS.AIR.id ||
      left === BLOCKS.AIR.id ||
      right === BLOCKS.AIR.id ||
      forward === BLOCKS.AIR.id ||
      back === BLOCKS.AIR.id
    );
  }
}
