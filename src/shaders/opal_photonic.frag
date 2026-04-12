// Opal Photonic Crystal Shader
// Simulates the play-of-color in precious opals
// Author: Structural Color Engine
// Based on: 3D photonic crystal interference

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_scale;

varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_viewPosition;
varying vec3 v_position;

const float PI = 3.14159265359;

// 3D continuous lattice function (Gyroid-like)
float photonicLattice(vec3 p) {
    return sin(p.x) * cos(p.y) + 
           sin(p.y) * cos(p.z) + 
           sin(p.z) * cos(p.x);
}

// Cosine palette for opal colors
vec3 opalPalette(float t) {
    vec3 a = vec3(0.5);
    vec3 b = vec3(0.5);
    vec3 c = vec3(1.0, 0.9, 0.8);
    vec3 d = vec3(0.0, 0.25, 0.5);
    return a + b * cos(PI * 2.0 * (c * t + d));
}

// Hash function for random variation
float hash(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
             dot(p, vec3(269.5, 183.3, 246.1)),
             dot(p, vec3(113.5, 271.9, 124.6)));
    return fract(sin(p.x) * 43758.5453);
}

void main() {
    vec3 N = normalize(v_normal);
    vec3 V = normalize(v_viewPosition);
    
    // Scale position for lattice
    vec3 p = v_position * u_scale * 5.0 + u_time * 0.2;
    
    // Calculate 3D photonic lattice
    float lattice = photonicLattice(p);
    
    // Add some disorder (real opals have some randomness)
    float disorder = hash(floor(p * 2.0)) * 0.3;
    lattice += disorder;
    
    // Viewing angle through the structure
    float depthPhase = dot(N, V) * lattice;
    
    // Animate the phase for color play
    depthPhase += u_time * 0.1;
    
    // Map to opal color palette
    vec3 color = opalPalette(depthPhase * 3.0);
    
    // Add sparkle effect (small bright spots)
    float sparkle = smoothstep(0.7, 1.0, sin(p.x * 20.0) * sin(p.y * 20.0) * sin(p.z * 20.0));
    color += vec3(sparkle * 0.3);
    
    // View-dependent intensity (opal color changes with angle)
    float viewAngle = max(0.0, dot(N, V));
    color *= 0.5 + 0.5 * viewAngle;
    
    // Milky base color (common opal background)
    vec3 milkBase = vec3(0.9, 0.92, 0.95);
    color = mix(milkBase, color, 0.7);
    
    // Subsurface scattering effect
    float subsurface = pow(1.0 - viewAngle, 2.0);
    color += vec3(0.1, 0.15, 0.2) * subsurface;
    
    gl_FragColor = vec4(color, 1.0);
}
