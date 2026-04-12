// Thin-Film Acid Interference Shader
// Simulates iridescent soap bubbles and oil slicks
// Author: Structural Color Engine
// Based on: Thin-film interference physics

uniform float u_time;
uniform vec2 u_resolution;

varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_viewPosition;

// Include math utilities
#pragma glslify: fbm = require('../math/fbmNoise.glsl')
#pragma glslify: palette = require('../math/palettes.glsl')

void main() {
    // Normalize vectors
    vec3 N = normalize(v_normal);
    vec3 V = normalize(v_viewPosition);
    
    // Core interference: view-dependent dot product
    // 1.0 = facing camera, 0.0 = grazing angle
    float viewAngle = max(0.0, dot(N, V));
    
    // Animate UVs for flowing film effect
    vec2 flowingUv = v_uv * 3.0 + vec2(
        u_time * 0.1, 
        u_time * 0.05
    );
    
    // Generate organic thickness variation using FBM
    float filmThickness = fbm(flowingUv);
    
    // Calculate interference phase
    // The multiplier controls frequency of rainbow bands
    float interferencePhase = (viewAngle + filmThickness * 0.4) * 5.0 - (u_time * 0.3);
    
    // Map to acid color palette
    vec3 color = palette(interferencePhase, 
        vec3(0.5),           // Base
        vec3(0.5),           // Amplitude  
        vec3(1.0),           // Frequency
        vec3(0.263, 0.416, 0.557)  // Phase (acid tones)
    );
    
    // Add dark rim for "black film" effect (thin bubble edge)
    float rimLight = pow(1.0 - viewAngle, 3.0);
    color = mix(color, vec3(0.05, 0.0, 0.1), rimLight * 0.8);
    
    // HDR boost for luminous effect
    color = pow(color, vec3(0.8));
    
    gl_FragColor = vec4(color, 1.0);
}
