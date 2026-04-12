/**
 * Structural Color Engine - Main Entry Point
 * WebGL laboratory for structural color and iridescence
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'stats.js';

// Import shaders
import vertexShader from './shaders/vertex_template.vert';
import thinFilmFragment from './shaders/thin_film_acid.frag';

// Configuration
const CONFIG = {
  camera: {
    fov: 75,
    near: 0.1,
    far: 100,
    position: [0, 0, 4]
  },
  renderer: {
    antialias: true,
    alpha: true,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
  },
  controls: {
    enableDamping: true,
    dampingFactor: 0.05,
    autoRotate: false,
    autoRotateSpeed: 1.0
  }
};

// Global variables
let scene, camera, renderer, controls, stats;
let clock, uniforms;
let currentMesh, currentMaterial;
let gui;

// Shader library
const SHADERS = {
  thinFilm: {
    name: 'Thin-Film Interference',
    vertex: vertexShader,
    fragment: thinFilmFragment
  }
};

/**
 * Initialize the application
 */
function init() {
  // Create scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050505);

  // Create camera
  camera = new THREE.PerspectiveCamera(
    CONFIG.camera.fov,
    window.innerWidth / window.innerHeight,
    CONFIG.camera.near,
    CONFIG.camera.far
  );
  camera.position.set(...CONFIG.camera.position);

  // Create renderer
  renderer = new THREE.WebGLRenderer({
    antialias: CONFIG.renderer.antialias,
    alpha: CONFIG.renderer.alpha
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(CONFIG.renderer.pixelRatio);
  document.getElementById('app').appendChild(renderer.domElement);

  // Create controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = CONFIG.controls.enableDamping;
  controls.dampingFactor = CONFIG.controls.dampingFactor;

  // Create stats
  stats = new Stats();
  stats.showPanel(0);
  document.body.appendChild(stats.dom);

  // Initialize clock
  clock = new THREE.Clock();

  // Setup uniforms
  uniforms = {
    u_time: { value: 0.0 },
    u_resolution: { 
      value: new THREE.Vector2(window.innerWidth, window.innerHeight) 
    },
    u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
    u_scale: { value: 1.0 },
    u_paramA: { value: -1.4 },
    u_paramB: { value: 1.6 },
    u_paramC: { value: 1.0 },
    u_paramD: { value: 0.7 }
  };

  // Create initial mesh
  createMesh('torusKnot');

  // Setup event listeners
  setupEventListeners();

  // Hide loading screen
  document.getElementById('loading').style.display = 'none';

  // Start animation loop
  animate();
}

/**
 * Create a mesh with the specified geometry
 */
function createMesh(geometryType) {
  // Remove existing mesh
  if (currentMesh) {
    scene.remove(currentMesh);
    currentMesh.geometry.dispose();
  }

  // Create geometry
  let geometry;
  switch (geometryType) {
    case 'sphere':
      geometry = new THREE.SphereGeometry(1.5, 128, 128);
      break;
    case 'torus':
      geometry = new THREE.TorusGeometry(1.2, 0.4, 64, 128);
      break;
    case 'torusKnot':
      geometry = new THREE.TorusKnotGeometry(1, 0.4, 256, 64);
      break;
    case 'icosahedron':
      geometry = new THREE.IcosahedronGeometry(1.5, 4);
      break;
    case 'plane':
      geometry = new THREE.PlaneGeometry(4, 4, 128, 128);
      break;
    default:
      geometry = new THREE.TorusKnotGeometry(1, 0.4, 256, 64);
  }

  // Create material
  currentMaterial = new THREE.ShaderMaterial({
    vertexShader: SHADERS.thinFilm.vertex,
    fragmentShader: SHADERS.thinFilm.fragment,
    uniforms: uniforms,
    side: THREE.DoubleSide,
    wireframe: false
  });

  // Create mesh
  currentMesh = new THREE.Mesh(geometry, currentMaterial);
  scene.add(currentMesh);
}

/**
 * Change the current shader
 */
function changeShader(shaderName) {
  if (SHADERS[shaderName]) {
    currentMaterial.vertexShader = SHADERS[shaderName].vertex;
    currentMaterial.fragmentShader = SHADERS[shaderName].fragment;
    currentMaterial.needsUpdate = true;
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Window resize
  window.addEventListener('resize', onWindowResize);

  // Mouse movement
  window.addEventListener('mousemove', onMouseMove);

  // Keyboard shortcuts
  window.addEventListener('keydown', onKeyDown);
}

/**
 * Handle window resize
 */
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
}

/**
 * Handle mouse movement
 */
function onMouseMove(event) {
  uniforms.u_mouse.value.x = event.clientX / window.innerWidth;
  uniforms.u_mouse.value.y = 1.0 - event.clientY / window.innerHeight;
}

/**
 * Handle keyboard input
 */
function onKeyDown(event) {
  switch (event.key) {
    case '1':
      createMesh('sphere');
      break;
    case '2':
      createMesh('torus');
      break;
    case '3':
      createMesh('torusKnot');
      break;
    case '4':
      createMesh('icosahedron');
      break;
    case '5':
      createMesh('plane');
      break;
    case 'w':
      currentMaterial.wireframe = !currentMaterial.wireframe;
      break;
    case ' ':
      controls.autoRotate = !controls.autoRotate;
      break;
  }
}

/**
 * Animation loop
 */
function animate() {
  requestAnimationFrame(animate);

  stats.begin();

  // Update uniforms
  uniforms.u_time.value = clock.getElapsedTime();

  // Rotate mesh slowly
  if (currentMesh && !controls.autoRotate) {
    currentMesh.rotation.y += 0.002;
    currentMesh.rotation.x += 0.001;
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  stats.end();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Export for module usage
export { init, createMesh, changeShader, uniforms };
