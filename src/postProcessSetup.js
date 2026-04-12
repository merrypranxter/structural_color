/**
 * Post-Processing Setup
 * Configures VHS chromatic aberration and CRT effects
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

// VHS vertex shader
const vhsVertexShader = `
  varying vec2 v_uv;
  
  void main() {
    v_uv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// VHS chromatic aberration fragment shader
const vhsFragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float u_time;
  uniform float u_intensity;
  
  varying vec2 v_uv;
  
  float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  void main() {
    vec2 uv = v_uv;
    
    // VHS tracking distortion
    float wave = sin(uv.y * 12.0 + u_time * 4.0) * 0.003 * u_intensity;
    wave += sin(uv.y * 45.0 - u_time * 8.0) * 0.001 * u_intensity;
    
    // Random horizontal stutter
    if (rand(vec2(floor(u_time * 10.0), 0.0)) > 0.92) {
      wave += 0.04 * rand(vec2(uv.y, u_time)) * u_intensity;
    }
    
    uv.x += wave;
    
    // Chromatic aberration
    float splitAmount = (0.006 + abs(wave) * 2.0) * u_intensity;
    
    float r = texture2D(tDiffuse, vec2(uv.x + splitAmount, uv.y)).r;
    float g = texture2D(tDiffuse, uv).g;
    float b = texture2D(tDiffuse, vec2(uv.x - splitAmount, uv.y)).b;
    
    // CRT scanlines
    float scanline = sin(uv.y * 800.0) * 0.03 * u_intensity;
    
    vec3 color = vec3(r, g, b) - scanline;
    
    // Vignette
    float vignette = 1.0 - length(v_uv - 0.5) * 0.5;
    color *= vignette;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Bloom shader (simplified)
const bloomFragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float u_threshold;
  uniform float u_intensity;
  
  varying vec2 v_uv;
  
  void main() {
    vec3 color = texture2D(tDiffuse, v_uv).rgb;
    
    // Extract bright areas
    float brightness = dot(color, vec3(0.299, 0.587, 0.114));
    vec3 bright = brightness > u_threshold ? color : vec3(0.0);
    
    // Simple blur (4 samples)
    vec2 texel = vec2(1.0) / vec2(textureSize(tDiffuse, 0));
    vec3 blur = vec3(0.0);
    blur += texture2D(tDiffuse, v_uv + vec2(-1.0, -1.0) * texel).rgb;
    blur += texture2D(tDiffuse, v_uv + vec2(1.0, -1.0) * texel).rgb;
    blur += texture2D(tDiffuse, v_uv + vec2(-1.0, 1.0) * texel).rgb;
    blur += texture2D(tDiffuse, v_uv + vec2(1.0, 1.0) * texel).rgb;
    blur *= 0.25;
    
    // Combine
    vec3 bloom = bright * blur * u_intensity;
    
    gl_FragColor = vec4(color + bloom, 1.0);
  }
`;

/**
 * Setup post-processing pipeline
 * @param {THREE.WebGLRenderer} renderer
 * @param {THREE.Scene} scene
 * @param {THREE.Camera} camera
 * @returns {Object} Composer and passes
 */
export function setupPostProcessing(renderer, scene, camera) {
  const composer = new EffectComposer(renderer);
  
  // Base render pass
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
  
  // Bloom pass
  const bloomShader = {
    uniforms: {
      tDiffuse: { value: null },
      u_threshold: { value: 0.5 },
      u_intensity: { value: 0.5 }
    },
    vertexShader: vhsVertexShader,
    fragmentShader: bloomFragmentShader
  };
  const bloomPass = new ShaderPass(bloomShader);
  composer.addPass(bloomPass);
  
  // VHS pass
  const vhsShader = {
    uniforms: {
      tDiffuse: { value: null },
      u_time: { value: 0.0 },
      u_intensity: { value: 0.3 }
    },
    vertexShader: vhsVertexShader,
    fragmentShader: vhsFragmentShader
  };
  const vhsPass = new ShaderPass(vhsShader);
  composer.addPass(vhsPass);
  
  return {
    composer,
    bloomPass,
    vhsPass,
    update(time) {
      vhsPass.uniforms.u_time.value = time;
    },
    setVHSIntensity(intensity) {
      vhsPass.uniforms.u_intensity.value = intensity;
    },
    setBloomIntensity(intensity) {
      bloomPass.uniforms.u_intensity.value = intensity;
    },
    setBloomThreshold(threshold) {
      bloomPass.uniforms.u_threshold.value = threshold;
    }
  };
}

export { vhsVertexShader, vhsFragmentShader, bloomFragmentShader };
