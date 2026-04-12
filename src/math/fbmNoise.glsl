// Fractional Brownian Motion (fBm) Noise
// Multi-octave noise for organic variation
// Author: Structural Color Engine

#ifndef FBM_NOISE_GLSL
#define FBM_NOISE_GLSL

// Hash function
vec2 hash22(vec2 p) {
    p = vec2(
        dot(p, vec2(127.1, 311.7)),
        dot(p, vec2(269.5, 183.3))
    );
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

vec3 hash33(vec3 p) {
    p = vec3(
        dot(p, vec3(127.1, 311.7, 74.7)),
        dot(p, vec3(269.5, 183.3, 246.1)),
        dot(p, vec3(113.5, 271.9, 124.6))
    );
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

// Simplex-like 2D noise
float noise(vec2 p) {
    const float K1 = 0.366025404; // (sqrt(3)-1)/2
    const float K2 = 0.211324865; // (3-sqrt(3))/6
    
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    
    vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    
    vec3 h = max(0.5 - vec3(
        dot(a, a),
        dot(b, b),
        dot(c, c)
    ), 0.0);
    
    vec3 n = h * h * h * h * vec3(
        dot(a, hash22(i + 0.0)),
        dot(b, hash22(i + o)),
        dot(c, hash22(i + 1.0))
    );
    
    return dot(n, vec3(70.0));
}

// 3D noise
float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float n = i.x + i.y * 57.0 + i.z * 113.0;
    
    float res = mix(
        mix(
            mix(hash33(vec3(n)), hash33(vec3(n + 1.0)), f.x),
            mix(hash33(vec3(n + 57.0)), hash33(vec3(n + 58.0)), f.x),
            f.y
        ),
        mix(
            mix(hash33(vec3(n + 113.0)), hash33(vec3(n + 114.0)), f.x),
            mix(hash33(vec3(n + 170.0)), hash33(vec3(n + 171.0)), f.x),
            f.y
        ),
        f.z
    );
    
    return res;
}

// Fractional Brownian Motion (2D)
float fbm(vec2 p, int octaves) {
    float f = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    
    for (int i = 0; i < 8; i++) {
        if (i >= octaves) break;
        f += amp * noise(p * freq);
        freq *= 2.0;
        amp *= 0.5;
    }
    
    return f;
}

// Default fbm with 4 octaves
float fbm(vec2 p) {
    return fbm(p, 4);
}

// Fractional Brownian Motion (3D)
float fbm(vec3 p, int octaves) {
    float f = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    
    for (int i = 0; i < 8; i++) {
        if (i >= octaves) break;
        f += amp * noise(p * freq);
        freq *= 2.0;
        amp *= 0.5;
    }
    
    return f;
}

// Default 3D fbm
float fbm(vec3 p) {
    return fbm(p, 4);
}

// Turbulence (absolute value of fbm)
float turbulence(vec2 p, int octaves) {
    float f = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    
    for (int i = 0; i < 8; i++) {
        if (i >= octaves) break;
        f += amp * abs(noise(p * freq));
        freq *= 2.0;
        amp *= 0.5;
    }
    
    return f;
}

// Ridged multifractal
float ridgedMF(vec2 p, int octaves) {
    float f = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    float prev = 1.0;
    
    for (int i = 0; i < 8; i++) {
        if (i >= octaves) break;
        float n = noise(p * freq);
        n = 1.0 - abs(n);
        n *= n * prev;
        prev = n;
        f += amp * n;
        freq *= 2.0;
        amp *= 0.5;
    }
    
    return f;
}

#endif // FBM_NOISE_GLSL
