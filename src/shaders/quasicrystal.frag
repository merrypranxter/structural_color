// Aperiodic Quasicrystal Shader
// Simulates 5-fold symmetric quasicrystalline structures
// Author: Structural Color Engine
// Based on: Quasicrystal projection from higher dimensions

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_symmetry;
uniform float u_scale;

varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_viewPosition;

const float PI = 3.14159265359;
const float PHI = 1.618033988749895; // Golden ratio

// Quasicrystal pattern generation
// Projects from 5D to 2D using the golden ratio
float quasicrystal(vec2 uv, float time) {
    float value = 0.0;
    int N = 5; // 5-fold symmetry
    
    for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float angle = 2.0 * PI * fi / float(N);
        
        // 5D projection with phason shift
        float phase = cos(angle) * uv.x + sin(angle) * uv.y;
        phase += time * 0.1; // Animate
        
        // Golden ratio modulation
        value += cos(phase * u_scale * PHI + fi * PHI);
    }
    
    return value / float(N);
}

// Alternative: Generalized quasicrystal with variable symmetry
float generalizedQuasicrystal(vec2 uv, int symmetry, float scale, float time) {
    float value = 0.0;
    
    for (int i = 0; i < 12; i++) {
        if (i >= symmetry) break;
        
        float fi = float(i);
        float angle = 2.0 * PI * fi / float(symmetry);
        
        float phase = cos(angle) * uv.x + sin(angle) * uv.y;
        phase += time * 0.05 * fi;
        
        value += cos(phase * scale);
    }
    
    return value / float(symmetry);
}

// Cosine palette
vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(2.0 * PI * (c * t + d));
}

void main() {
    vec3 N = normalize(v_normal);
    vec3 V = normalize(v_viewPosition);
    
    // Center and scale UVs
    vec2 uv = (v_uv - 0.5) * 4.0;
    
    // Generate quasicrystal pattern
    float q5 = quasicrystal(uv, u_time);
    
    // Add 8-fold symmetry component
    float q8 = generalizedQuasicrystal(uv, 8, u_scale * 0.7, u_time * 0.7);
    
    // Combine
    float pattern = q5 * 0.6 + q8 * 0.4;
    
    // Create sharp edges (quasicrystal tiles)
    float tiles = smoothstep(0.2, 0.25, abs(pattern));
    
    // Phason flip effect (tiles "flipping")
    float phason = sin(u_time * 0.3 + pattern * 10.0);
    tiles = mix(tiles, 1.0 - tiles, smoothstep(-0.1, 0.1, phason) * 0.3);
    
    // Color mapping
    vec3 color = palette(
        pattern + u_time * 0.1,
        vec3(0.5),
        vec3(0.5),
        vec3(1.0, 0.9, 0.8),
        vec3(0.0, 0.33, 0.67)
    );
    
    // Add tile boundaries
    float boundary = abs(fract(pattern * 5.0) - 0.5);
    float edge = smoothstep(0.48, 0.5, boundary);
    color = mix(color, vec3(0.0), edge * 0.5);
    
    // View angle effect
    float viewAngle = max(0.0, dot(N, V));
    color *= 0.4 + 0.6 * viewAngle;
    
    // Metallic sheen
    float sheen = pow(viewAngle, 5.0);
    color += vec3(sheen * 0.3);
    
    // Boost
    color = pow(color, vec3(0.9));
    
    gl_FragColor = vec4(color, 1.0);
}
