// Strange Attractor Shader (Clifford/Peter de Jong)
// Simulates chaotic attractor density clouds
// Author: Structural Color Engine
// Based on: Clifford attractor equations

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_paramA;
uniform float u_paramB;
uniform float u_paramC;
uniform float u_paramD;

varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_viewPosition;

const float PI = 3.14159265359;
const int ITERATIONS = 100;

// Clifford attractor equations:
// x_{n+1} = sin(a * y_n) - cos(b * x_n)
// y_{n+1} = sin(c * x_n) - cos(d * y_n)

// Peter de Jong attractor:
// x_{n+1} = sin(a * y_n) - cos(b * x_n)
// y_{n+1} = sin(c * x_n) - cos(d * y_n)
// (Same form, different parameter ranges)

vec2 clifford(vec2 p, float a, float b, float c, float d) {
    return vec2(
        sin(a * p.y) + c * cos(a * p.x),
        sin(b * p.x) + d * cos(b * p.y)
    );
}

vec2 peterDeJong(vec2 p, float a, float b, float c, float d) {
    return vec2(
        sin(a * p.y) - cos(b * p.x),
        sin(c * p.x) - cos(d * p.y)
    );
}

// Hash for pseudo-random
float hash(float n) {
    return fract(sin(n) * 43758.5453);
}

// Color palette
vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);
    return a + b * cos(2.0 * PI * (c * t + d));
}

void main() {
    vec3 N = normalize(v_normal);
    vec3 V = normalize(v_viewPosition);
    
    // Map UV to attractor space
    vec2 p = (v_uv - 0.5) * 4.0;
    
    // Animate parameters
    float a = u_paramA + sin(u_time * 0.1) * 0.1;
    float b = u_paramB + cos(u_time * 0.15) * 0.1;
    float c = u_paramC + sin(u_time * 0.2) * 0.1;
    float d = u_paramD + cos(u_time * 0.25) * 0.1;
    
    // Accumulate attractor density
    float density = 0.0;
    vec2 pos = p;
    
    // Iterate attractor
    for (int i = 0; i < ITERATIONS; i++) {
        // Choose attractor type based on parameter sum
        if (a + b + c + d > 0.0) {
            pos = clifford(pos, a, b, c, d);
        } else {
            pos = peterDeJong(pos, a, b, c, d);
        }
        
        // Accumulate near current pixel
        float dist = length(pos - p);
        density += 1.0 / (1.0 + dist * 10.0);
    }
    
    // Normalize
    density /= float(ITERATIONS);
    
    // Create glow effect
    float glow = pow(density, 0.5);
    
    // Map to color
    vec3 color = palette(glow * 2.0 + u_time * 0.1);
    
    // Add inner bright core
    float core = smoothstep(0.5, 1.0, density);
    color += vec3(core * 0.5);
    
    // View angle affects transparency-like effect
    float viewAngle = max(0.0, dot(N, V));
    color *= 0.3 + 0.7 * viewAngle;
    
    // Add subtle noise
    float noise = hash(p.x * 100.0 + p.y * 50.0);
    color *= 0.95 + noise * 0.1;
    
    // HDR tone mapping
    color = color / (1.0 + color);
    
    // Boost
    color = pow(color, vec3(0.8));
    
    gl_FragColor = vec4(color, 1.0);
}
