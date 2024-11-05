import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(globalThis.devicePixelRatio);
renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
document.body.appendChild(renderer.domElement);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  globalThis.innerWidth / globalThis.innerHeight
);
camera.position.set(-10, 16, -10);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(16, 0, 16);
controls.update();

// Scene
const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry();

// Light
function setupLights() {
  const ambientLight1 = new THREE.DirectionalLight();
  ambientLight1.position.set(1, 1, 1);
  scene.add(ambientLight1);

  const ambientLight2 = new THREE.DirectionalLight();
  ambientLight2.position.set(-1, 1, -0.5);
  scene.add(ambientLight2);

  const ambient = new THREE.AmbientLight();
  ambient.intensity = 0.1;
  scene.add(ambient);
}

function setupWorld(size) {
  for (let x = 0; x < size; x++) {
    for (let z = 0; z < size; z++) {
      // generate random color
      const color = Math.floor(Math.random() * 16777215);
      const material = new THREE.MeshLambertMaterial({ color });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(x, 0, z);
      scene.add(cube);
    }
  }
}

// Render
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

setupLights();
setupWorld(32);
animate();

// Resize
globalThis.addEventListener("resize", () => {
  camera.aspect = globalThis.innerWidth / globalThis.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
});
