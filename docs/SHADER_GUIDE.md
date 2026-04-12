# Shader Implementation Guide

## Overview

This guide explains how to implement structural color effects in GLSL shaders.

## Basic Structure

### Vertex Shader Template

```glsl
varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_viewPosition;

void main() {
    v_uv = uv;
    v_normal = normalize(normalMatrix * normal);
    
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    v_viewPosition = normalize(cameraPosition - worldPosition.xyz);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

### Fragment Shader Template

```glsl
uniform float u_time;
uniform vec2 u_resolution;

varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_viewPosition;

void main() {
    vec3 N = normalize(v_normal);
    vec3 V = normalize(v_viewPosition);
    
    // Your interference calculation here
    vec3 color = calculateStructuralColor(N, V);
    
    gl_FragColor = vec4(color, 1.0);
}
```

## Core Functions

### 1. Cosine Color Palette

The foundation of procedural color generation:

```glsl
vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318 * (c * t + d));
}
```

Parameters:
- `a`: Base color (offset)
- `b`: Amplitude of variation
- `c`: Frequency of repetition
- `d`: Phase shift

### 2. View-Dependent Interference

```glsl
float viewAngle = max(0.0, dot(N, V));
float interference = viewAngle * frequency + phase;
```

### 3. Noise Functions

Simplex noise for organic variation:

```glsl
float hash(float n) { return fract(sin(n) * 43758.5453123); }

float noise(vec2 x) {
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    float n = p.x + p.y * 57.0;
    return mix(mix(hash(n), hash(n + 1.0), f.x),
               mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
}
```

### 4. Fractional Brownian Motion

```glsl
float fbm(vec2 p) {
    float f = 0.0;
    float amp = 0.5;
    for(int i = 0; i < 4; i++) {
        f += amp * noise(p);
        p *= 2.0;
        amp *= 0.5;
    }
    return f;
}
```

## Effect Categories

### Thin-Film Interference

```glsl
vec3 thinFilm(float cosTheta, float thickness, float n) {
    float pathDiff = 2.0 * n * thickness * sqrt(1.0 - pow(sin(acos(cosTheta))/n, 2.0));
    vec3 phase = vec3(0.0, 0.33, 0.67);
    return 0.5 + 0.5 * cos(6.28318 * (pathDiff + phase));
}
```

### Diffraction Grating

```glsl
vec3 diffraction(vec3 T, vec3 V, vec3 L, float spacing) {
    vec3 H = normalize(V + L);
    float grating = dot(T, H);
    float spectrum = sin(grating * spacing);
    return palette(spectrum, vec3(0.5), vec3(0.5), vec3(1.0), vec3(0.0, 0.33, 0.67));
}
```

### Bragg Reflector

```glsl
vec3 bragg(vec3 N, vec3 V, float wavelength, float spacing) {
    float cosTheta = max(0.0, dot(N, V));
    float reflectedWavelength = 2.0 * spacing * cosTheta;
    return wavelengthToRGB(reflectedWavelength * 1000.0);
}
```

## Optimization Tips

### 1. Minimize Branching

```glsl
// Bad: Branching in fragment shader
if (x > 0.5) {
    color = red;
} else {
    color = blue;
}

// Good: Use mix/step
float t = step(0.5, x);
color = mix(blue, red, t);
```

### 2. Precompute Constants

```glsl
// Precompute 2π
const float TWO_PI = 6.28318530718;

// Precompute palette parameters
const vec3 PALETTE_A = vec3(0.5);
const vec3 PALETTE_B = vec3(0.5);
```

### 3. Use Lower Precision Where Possible

```glsl
// High precision for positions
varying highp vec3 v_position;

// Medium precision for colors
varying mediump vec3 v_color;

// Low precision for UVs
varying lowp vec2 v_uv;
```

### 4. Avoid Expensive Operations

| Operation | Cost | Alternative |
|-----------|------|-------------|
| `pow(x, y)` | High | `x*x` for squares |
| `sin/cos` | Medium | Use sparingly |
| `sqrt` | Medium | `inversesqrt` if possible |
| `texture` | High | Minimize samples |

## Debugging Shaders

### Visualize Intermediate Values

```glsl
// Instead of final color, output intermediate
// gl_FragColor = vec4(color, 1.0);
gl_FragColor = vec4(vec3(viewAngle), 1.0); // Visualize view angle
```

### Check for NaN/Inf

```glsl
bool isValid(vec3 v) {
    return all(greaterThanEqual(v, vec3(0.0))) && 
           all(lessThanEqual(v, vec3(1.0)));
}
```

## Common Pitfalls

1. **Normalizing non-unit vectors**: Always normalize after interpolation
2. **Division by zero**: Add small epsilon to denominators
3. **Out-of-gamut colors**: Clamp final output to [0, 1]
4. **Precision issues**: Use appropriate precision qualifiers

## Further Reading

- [The Book of Shaders](https://thebookofshaders.com/)
- [Inigo Quilez's articles](https://iquilezles.org/articles/)
- [GLSL Reference](https://www.khronos.org/registry/OpenGL-Refpages/)
