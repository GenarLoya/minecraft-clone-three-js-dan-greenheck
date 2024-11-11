import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { World } from "./world.js";
import { createUI } from "./ui.js";

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(globalThis.devicePixelRatio);
renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
renderer.setClearColor(0x80a0e0);
document.body.appendChild(renderer.domElement);

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  globalThis.innerWidth / globalThis.innerHeight,
  0.1,
  1000
);
camera.position.set(32, 16, 50);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(16, 0, 16);
controls.update();

// Scene setup
const scene = new THREE.Scene();
const world = new World();
world.generate();
scene.add(world);

function setupLighting() {
  const light1 = new THREE.DirectionalLight();
  light1.position.set(1, 1, 1);
  scene.add(light1);

  const light2 = new THREE.DirectionalLight();
  light2.position.set(-1, 1, 1);
  scene.add(light2);

  const ambient = new THREE.AmbientLight();
  ambient.intensity = 0.3;
  scene.add(ambient);
}

// Render loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

setupLighting();
createUI(world);
animate();

// Events
globalThis.addEventListener("resize", () => {
  // Resize camera aspect ratio and renderer size to the new globalThis size
  camera.aspect = globalThis.innerWidth / globalThis.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
});
