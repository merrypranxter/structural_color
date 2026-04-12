/**
 * GyroidMesh.js
 * Creates triply periodic minimal surface geometries
 * Based on the gyroid equation: sin(x)cos(y) + sin(y)cos(z) + sin(z)cos(x) = 0
 */

import * as THREE from 'three';

/**
 * Gyroid Signed Distance Function
 * @param {THREE.Vector3} p - Point to evaluate
 * @returns {number} Signed distance
 */
function gyroidSDF(p) {
  const scale = 2.0;
  const x = p.x * scale;
  const y = p.y * scale;
  const z = p.z * scale;
  
  return (
    Math.sin(x) * Math.cos(y) +
    Math.sin(y) * Math.cos(z) +
    Math.sin(z) * Math.cos(x)
  ) / scale;
}

/**
 * Schwarz P (Primitive) Surface
 * cos(x) + cos(y) + cos(z) = 0
 */
function schwarzPSDF(p) {
  const scale = 2.0;
  const x = p.x * scale;
  const y = p.y * scale;
  const z = p.z * scale;
  
  return (Math.cos(x) + Math.cos(y) + Math.cos(z)) / scale;
}

/**
 * Schwarz D (Diamond) Surface
 */
function schwarzDSDF(p) {
  const scale = 2.0;
  const x = p.x * scale;
  const y = p.y * scale;
  const z = p.z * scale;
  
  return (
    Math.sin(x) * Math.sin(y) * Math.sin(z) +
    Math.sin(x) * Math.cos(y) * Math.cos(z) +
    Math.cos(x) * Math.sin(y) * Math.cos(z) +
    Math.cos(x) * Math.cos(y) * Math.sin(z)
  ) / scale;
}

/**
 * Neovius Surface
 */
function neoviusSDF(p) {
  const scale = 2.0;
  const x = p.x * scale;
  const y = p.y * scale;
  const z = p.z * scale;
  
  return (
    3 * (Math.cos(x) + Math.cos(y) + Math.cos(z)) +
    4 * Math.cos(x) * Math.cos(y) * Math.cos(z)
  ) / scale;
}

/**
 * Generate gyroid mesh using marching cubes
 * @param {number} resolution - Grid resolution
 * @param {number} bounds - Bounding box size
 * @param {number} thickness - Surface thickness
 * @returns {THREE.BufferGeometry}
 */
function generateGyroidMesh(resolution = 64, bounds = 2, thickness = 0.1) {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const normals = [];
  const uvs = [];
  
  const step = (bounds * 2) / resolution;
  
  // Sample the SDF on a grid
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      for (let k = 0; k < resolution; k++) {
        const x = -bounds + i * step;
        const y = -bounds + j * step;
        const z = -bounds + k * step;
        
        const p = new THREE.Vector3(x, y, z);
        const dist = Math.abs(gyroidSDF(p));
        
        // If point is near the surface, add to mesh
        if (dist < thickness) {
          // Calculate normal using gradient
          const eps = 0.01;
          const dx = gyroidSDF(new THREE.Vector3(x + eps, y, z)) - 
                     gyroidSDF(new THREE.Vector3(x - eps, y, z));
          const dy = gyroidSDF(new THREE.Vector3(x, y + eps, z)) - 
                     gyroidSDF(new THREE.Vector3(x, y - eps, z));
          const dz = gyroidSDF(new THREE.Vector3(x, y, z + eps)) - 
                     gyroidSDF(new THREE.Vector3(x, y, z - eps));
          
          const normal = new THREE.Vector3(dx, dy, dz).normalize();
          
          vertices.push(x, y, z);
          normals.push(normal.x, normal.y, normal.z);
          uvs.push(i / resolution, j / resolution);
        }
      }
    }
  }
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  
  return geometry;
}

/**
 * Create a simple torus knot mesh (for performance)
 * @param {THREE.Material} material
 * @returns {THREE.Mesh}
 */
export function createComplexMesh(material) {
  // Use a torus knot for good variation in surface normals
  const geometry = new THREE.TorusKnotGeometry(1, 0.4, 256, 64);
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

/**
 * Create a sphere mesh
 * @param {THREE.Material} material
 * @returns {THREE.Mesh}
 */
export function createSphereMesh(material) {
  const geometry = new THREE.SphereGeometry(1.5, 128, 128);
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

/**
 * Create an icosahedron mesh
 * @param {THREE.Material} material
 * @returns {THREE.Mesh}
 */
export function createIcosahedronMesh(material) {
  const geometry = new THREE.IcosahedronGeometry(1.5, 4);
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

/**
 * Create a plane mesh
 * @param {THREE.Material} material
 * @returns {THREE.Mesh}
 */
export function createPlaneMesh(material) {
  const geometry = new THREE.PlaneGeometry(4, 4, 128, 128);
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

/**
 * Create a gyroid approximation using instanced spheres
 * @param {THREE.Material} material
 * @returns {THREE.InstancedMesh}
 */
export function createGyroidInstancedMesh(material) {
  const sphereGeometry = new THREE.SphereGeometry(0.05, 8, 8);
  const count = 10000;
  const mesh = new THREE.InstancedMesh(sphereGeometry, material, count);
  
  const dummy = new THREE.Object3D();
  let index = 0;
  
  // Sample points on gyroid surface
  for (let x = -3; x < 3; x += 0.1) {
    for (let y = -3; y < 3; y += 0.1) {
      for (let z = -3; z < 3; z += 0.1) {
        if (index >= count) break;
        
        const p = new THREE.Vector3(x, y, z);
        const dist = Math.abs(gyroidSDF(p));
        
        if (dist < 0.05) {
          dummy.position.set(x, y, z);
          dummy.updateMatrix();
          mesh.setMatrixAt(index++, dummy.matrix);
        }
      }
    }
  }
  
  mesh.instanceMatrix.needsUpdate = true;
  return mesh;
}

export {
  gyroidSDF,
  schwarzPSDF,
  schwarzDSDF,
  neoviusSDF,
  generateGyroidMesh
};
