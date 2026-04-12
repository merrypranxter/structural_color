# API Reference

## Shader Uniforms

### Common Uniforms

All shaders accept these common uniforms:

| Uniform | Type | Description |
|---------|------|-------------|
| `u_time` | float | Elapsed time in seconds |
| `u_resolution` | vec2 | Screen resolution (width, height) |
| `u_mouse` | vec2 | Normalized mouse position (0-1) |

### Shader-Specific Uniforms

#### Thin-Film Interference

| Uniform | Type | Default | Description |
|---------|------|---------|-------------|
| `u_scale` | float | 1.0 | Pattern scale multiplier |

#### Opal Photonic Crystal

| Uniform | Type | Default | Description |
|---------|------|---------|-------------|
| `u_scale` | float | 1.0 | Lattice scale |

#### Newton's Rings

| Uniform | Type | Default | Description |
|---------|------|---------|-------------|
| `u_curvature` | float | 1.0 | Lens curvature |
| `u_contact_point` | vec2 | (0.5, 0.5) | Contact point position |

#### Chromatic Dispersion

| Uniform | Type | Default | Description |
|---------|------|---------|-------------|
| `u_ior` | float | 1.5 | Base refractive index |
| `u_dispersion` | float | 0.05 | Dispersion strength |

#### Rayleigh Scattering

| Uniform | Type | Default | Description |
|---------|------|---------|-------------|
| `u_density` | float | 1.0 | Medium density |
| `u_lightDir` | vec3 | (1,1,1) | Light direction |

#### Strange Attractor

| Uniform | Type | Default | Description |
|---------|------|---------|-------------|
| `u_paramA` | float | -1.4 | Attractor parameter A |
| `u_paramB` | float | 1.6 | Attractor parameter B |
| `u_paramC` | float | 1.0 | Attractor parameter C |
| `u_paramD` | float | 0.7 | Attractor parameter D |

## Varying Variables

| Variable | Type | Description |
|----------|------|-------------|
| `v_uv` | vec2 | Texture coordinates (0-1) |
| `v_normal` | vec3 | Surface normal (view space) |
| `v_viewPosition` | vec3 | View direction vector |
| `v_position` | vec3 | Local position |
| `v_worldPosition` | vec3 | World space position |

## JavaScript API

### ShaderLibrary

```javascript
import { 
  getShader, 
  getShadersByCategory, 
  getCategories,
  getShaderNames 
} from './src/shaderLibrary.js';

// Get a specific shader
const shader = getShader('thinFilmAcid');

// Get all shaders in a category
const biologicalShaders = getShadersByCategory('biological');

// Get all categories
const categories = getCategories();
// ['thin-film', 'biological', 'photonic-crystal', 'optics', 'scattering', 'mathematical']

// Get all shader names
const names = getShaderNames();
```

### Geometry Functions

```javascript
import { 
  createComplexMesh,
  createSphereMesh,
  createIcosahedronMesh,
  createPlaneMesh,
  createGyroidInstancedMesh,
  gyroidSDF,
  schwarzPSDF,
  schwarzDSDF
} from './src/geometry/GyroidMesh.js';

// Create a torus knot mesh
const mesh = createComplexMesh(material);

// Create a sphere mesh
const sphere = createSphereMesh(material);

// Evaluate gyroid SDF at a point
const distance = gyroidSDF(new THREE.Vector3(x, y, z));
```

### Post-Processing

```javascript
import { setupPostProcessing } from './src/postProcessSetup.js';

const postProcess = setupPostProcessing(renderer, scene, camera);

// In animation loop
postProcess.update(time);

// Adjust effects
postProcess.setVHSIntensity(0.5);
postProcess.setBloomIntensity(0.8);
postProcess.setBloomThreshold(0.6);

// Render
postProcess.composer.render();
```

## GLSL Functions

### fbmNoise.glsl

```glsl
// 2D noise
float noise(vec2 p);

// 3D noise  
float noise(vec3 p);

// Fractional Brownian Motion (2D)
float fbm(vec2 p);
float fbm(vec2 p, int octaves);

// FBM (3D)
float fbm(vec3 p);
float fbm(vec3 p, int octaves);

// Turbulence
float turbulence(vec2 p, int octaves);

// Ridged multifractal
float ridgedMF(vec2 p, int octaves);
```

### palettes.glsl

```glsl
// General cosine palette
vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d);

// Predefined palettes
vec3 getAcidPalette(float t);
vec3 getOilSlickPalette(float t);
vec3 getSunsetPalette(float t);
vec3 getOceanPalette(float t);
vec3 getForestPalette(float t);
vec3 getNebulaPalette(float t);
vec3 getLavaPalette(float t);
vec3 getIcePalette(float t);
vec3 getGoldPalette(float t);
vec3 getSilverPalette(float t);
vec3 getRainbowPalette(float t);
vec3 getHeatmapPalette(float t);
vec3 getElectricPalette(float t);
vec3 getToxicPalette(float t);
vec3 getCandyPalette(float t);
vec3 getMatrixPalette(float t);
vec3 getVaporwavePalette(float t);

// Wavelength to RGB
vec3 wavelengthToRGB(float wavelength);
```

## Python Tools

### analyze_wavelength.py

```python
from tools.analyze_wavelength import (
    load_wavelength_data,
    plot_wavelength_spectrum,
    calculate_color_temperature,
    analyze_interference_colors
)

# Load data
data = load_wavelength_data('data/wavelength_rgb.csv')

# Plot spectrum
plot_wavelength_spectrum(data, 'output/spectrum.png')

# Analyze interference
results = analyze_interference_colors(thickness_nm=300, n=1.33)
```

### calculate_interference.py

```python
from tools.calculate_interference import (
    calculate_thin_film_interference,
    calculate_reflection_spectrum,
    find_interference_maxima,
    calculate_newtons_rings
)

# Calculate reflectance
R = calculate_thin_film_interference(
    wavelength=550, 
    thickness=300, 
    n_film=1.33
)

# Get full spectrum
spectrum = calculate_reflection_spectrum(
    thickness=300, 
    n_film=1.33
)

# Find maxima
wavelength_max = find_interference_maxima(
    thickness=300, 
    n_film=1.33, 
    order=0
)
```

### generate_palettes.py

```python
from tools.generate_palettes import (
    cosine_palette,
    generate_palette_samples,
    palette_to_hex,
    generate_glsl_palette
)

# Generate a color
color = cosine_palette(
    t=0.5,
    a=(0.5, 0.5, 0.5),
    b=(0.5, 0.5, 0.5),
    c=(1.0, 1.0, 1.0),
    d=(0.0, 0.33, 0.67)
)

# Convert to hex
hex_color = palette_to_hex(color)

# Generate GLSL code
glsl = generate_glsl_palette(
    name="Custom",
    a=(0.5, 0.5, 0.5),
    b=(0.5, 0.5, 0.5),
    c=(1.0, 1.0, 1.0),
    d=(0.0, 0.33, 0.67)
)
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1` | Switch to sphere geometry |
| `2` | Switch to torus geometry |
| `3` | Switch to torus knot geometry |
| `4` | Switch to icosahedron geometry |
| `5` | Switch to plane geometry |
| `W` | Toggle wireframe mode |
| `Space` | Toggle auto-rotation |

## Data Formats

### wavelength_rgb.csv

```csv
wavelength_nm,r,g,b,intensity,color_name
380,0.174,0.005,0.301,0.300,violet
...
```

### refractive_indices.csv

```csv
material,wavelength_nm,refractive_index,extinction_coefficient,temperature_c,source
water,589,1.333000,0.000000,20,iapws
...
```

### biological_specimens.csv

```csv
species,common_name,structure_type,dominant_color,peak_wavelength_nm,structure_size_nm,mechanism,reference
Morpho rhetenor,Morpho Butterfly,ridges,blue,450,200,diffraction_grating,Vukusic1999
...
```
