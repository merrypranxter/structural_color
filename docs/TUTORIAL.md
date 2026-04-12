# Tutorial: Creating Your First Structural Color Shader

## Introduction

This tutorial will guide you through creating a custom thin-film interference shader from scratch.

## Part 1: Understanding the Physics

### Thin-Film Interference Basics

When light hits a thin film:
1. Some light reflects off the top surface
2. Some enters the film and reflects off the bottom
3. These two waves interfere

**Constructive interference** (bright colors) occurs when:
```
2nd cos(θ) = (m + 1/2)λ
```

Where:
- `n` = refractive index
- `d` = film thickness
- `θ` = angle in the film
- `m` = order (0, 1, 2, ...)
- `λ` = wavelength

## Part 2: Setting Up the Shader

### Step 1: Create the Vertex Shader

Create `my_shader.vert`:

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

### Step 2: Create the Fragment Shader

Create `my_shader.frag`:

```glsl
uniform float u_time;

varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_viewPosition;

void main() {
    // Normalize vectors
    vec3 N = normalize(v_normal);
    vec3 V = normalize(v_viewPosition);
    
    // Calculate view angle (0-1)
    float viewAngle = max(0.0, dot(N, V));
    
    // Output as grayscale for testing
    gl_FragColor = vec4(vec3(viewAngle), 1.0);
}
```

### Step 3: Test It

You should see a gradient from white (center) to black (edges).

## Part 3: Adding Color

### Using a Cosine Palette

```glsl
// Add this function
vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318 * (c * t + d));
}

void main() {
    vec3 N = normalize(v_normal);
    vec3 V = normalize(v_viewPosition);
    float viewAngle = max(0.0, dot(N, V));
    
    // Create rainbow effect
    vec3 color = palette(
        viewAngle * 3.0,  // Multiply for more bands
        vec3(0.5),        // Base
        vec3(0.5),        // Amplitude
        vec3(1.0),        // Frequency
        vec3(0.0, 0.33, 0.67)  // Phase (RGB)
    );
    
    gl_FragColor = vec4(color, 1.0);
}
```

## Part 4: Adding Film Thickness Variation

### Simple Sine Wave

```glsl
void main() {
    vec3 N = normalize(v_normal);
    vec3 V = normalize(v_viewPosition);
    float viewAngle = max(0.0, dot(N, V));
    
    // Vary thickness across surface
    float thickness = sin(v_uv.x * 10.0) * 0.5 + 0.5;
    
    // Combine with view angle
    float interference = viewAngle + thickness * 0.3;
    
    vec3 color = palette(
        interference * 3.0,
        vec3(0.5), vec3(0.5), vec3(1.0), vec3(0.0, 0.33, 0.67)
    );
    
    gl_FragColor = vec4(color, 1.0);
}
```

## Part 5: Adding Animation

```glsl
uniform float u_time;

void main() {
    vec3 N = normalize(v_normal);
    vec3 V = normalize(v_viewPosition);
    float viewAngle = max(0.0, dot(N, V));
    
    // Animated thickness variation
    float thickness = sin(v_uv.x * 10.0 + u_time) * 0.5 + 0.5;
    
    float interference = viewAngle + thickness * 0.3;
    
    vec3 color = palette(interference * 3.0, 
        vec3(0.5), vec3(0.5), vec3(1.0), vec3(0.0, 0.33, 0.67));
    
    gl_FragColor = vec4(color, 1.0);
}
```

## Part 6: Adding Noise for Realism

### Using FBM Noise

```glsl
// Include the fbmNoise library
#pragma glslify: fbm = require('../math/fbmNoise.glsl')

void main() {
    vec3 N = normalize(v_normal);
    vec3 V = normalize(v_viewPosition);
    float viewAngle = max(0.0, dot(N, V));
    
    // Organic thickness variation
    vec2 uv = v_uv * 3.0 + u_time * 0.1;
    float thickness = fbm(uv) * 0.5 + 0.5;
    
    float interference = (viewAngle + thickness * 0.4) * 5.0;
    
    vec3 color = palette(interference, 
        vec3(0.5), vec3(0.5), vec3(1.0), vec3(0.0, 0.33, 0.67));
    
    gl_FragColor = vec4(color, 1.0);
}
```

## Part 7: Adding the "Black Film" Effect

```glsl
void main() {
    vec3 N = normalize(v_normal);
    vec3 V = normalize(v_viewPosition);
    float viewAngle = max(0.0, dot(N, V));
    
    vec2 uv = v_uv * 3.0 + u_time * 0.1;
    float thickness = fbm(uv) * 0.5 + 0.5;
    
    float interference = (viewAngle + thickness * 0.4) * 5.0;
    
    vec3 color = palette(interference, 
        vec3(0.5), vec3(0.5), vec3(1.0), vec3(0.0, 0.33, 0.67));
    
    // Dark rim for thin film edges
    float rimLight = pow(1.0 - viewAngle, 3.0);
    color = mix(color, vec3(0.05, 0.0, 0.1), rimLight * 0.8);
    
    // HDR boost
    color = pow(color, vec3(0.8));
    
    gl_FragColor = vec4(color, 1.0);
}
```

## Part 8: Registering Your Shader

Add to `src/shaderLibrary.js`:

```javascript
import myShaderVertex from './shaders/my_shader.vert';
import myShaderFragment from './shaders/my_shader.frag';

export const SHADERS = {
  // ... existing shaders
  
  myShader: {
    name: 'My Custom Shader',
    description: 'My first thin-film interference shader',
    category: 'thin-film',
    vertex: myShaderVertex,
    fragment: myShaderFragment,
    uniforms: {
      u_time: { value: 0 },
      u_resolution: { value: [1, 1] }
    }
  }
};
```

## Part 9: Using Your Shader

In `main.js`:

```javascript
import { SHADERS } from './shaderLibrary.js';

// Create material with your shader
const material = new THREE.ShaderMaterial({
  vertexShader: SHADERS.myShader.vertex,
  fragmentShader: SHADERS.myShader.fragment,
  uniforms: {
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2(width, height) }
  }
});
```

## Exercises

### Exercise 1: Change the Color Palette

Try different palette parameters:

```glsl
// Gold tones
vec3(0.5), vec3(0.5), vec3(1.0, 0.8, 0.0), vec3(0.1, 0.2, 0.0)

// Ocean tones  
vec3(0.5), vec3(0.5), vec3(0.5, 0.8, 1.0), vec3(0.3, 0.5, 0.7)
```

### Exercise 2: Add Mouse Interaction

```glsl
uniform vec2 u_mouse;

void main() {
    // Use mouse to control thickness
    float mouseInfluence = length(v_uv - u_mouse);
    float thickness = fbm(uv) * 0.5 + 0.5 + mouseInfluence;
    // ...
}
```

### Exercise 3: Create a Soap Bubble

Combine multiple effects:
- FBM for film thickness
- Time animation
- View-dependent color
- Dark rim

## Tips and Tricks

### Debugging

1. **Visualize intermediate values:**
```glsl
gl_FragColor = vec4(vec3(thickness), 1.0);  // See thickness
```

2. **Check for NaN:**
```glsl
if (any(isnan(color))) color = vec3(1.0, 0.0, 0.0);  // Red = error
```

### Performance

1. Reduce FBM octaves on mobile
2. Use lower precision where possible
3. Precompute constants

### Aesthetics

1. Subtle animation is often better
2. Vary parameters slowly
3. Add noise at multiple scales

## Next Steps

- Try the Morpho butterfly diffraction shader
- Experiment with photonic crystal structures
- Create your own mathematical abstractions

## Resources

- [The Book of Shaders](https://thebookofshaders.com/)
- [Inigo Quilez's articles](https://iquilezles.org/articles/)
- [ShaderToy](https://www.shadertoy.com/)
