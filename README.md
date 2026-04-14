# 🌈 Structural Color & Spectral Interference Engine

> *"Color is not a property of light, but a property of structure."*

A comprehensive WebGL/Three.js laboratory for exploring structural color, thin-film optics, iridescence, and view-dependent procedural rendering.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![WebGL](https://img.shields.io/badge/WebGL-2.0-green.svg)
![Three.js](https://img.shields.io/badge/Three.js-r160-black.svg)

## 🚀 Quick Start

### Standalone Gallery (No Build Required)
```bash
# Clone and view immediately
git clone https://github.com/merrypranxter/structural_color.git
cd structural_color

# Open in browser
python3 -m http.server 8000
# Visit http://localhost:8000/gallery.html
```

### Full Development Environment
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📦 What's Included

### Interactive Viewers
- **`gallery.html`** - Standalone WebGL gallery (10 shaders, live controls, physics info)
- **`index.html`** - Full Three.js viewer with post-processing
- Real-time parameter adjustment (thickness, angle, intensity)
- Detailed physics equations and natural examples

### Shader Collection (10 Physics-Based Effects)

#### Thin-Film Interference
- **Soap Bubble** - Oil slick iridescence (`2nd cos θ = mλ`)
- **Newton's Rings** - Contact interference patterns

#### Biological Mimicry  
- **Morpho Butterfly** - Diffraction grating (`d(sin θᵢ + sin θₘ) = mλ`)
- **Jewel Beetle** - Multilayer Bragg reflector (`λ = 2nd cos θ`)
- **Opal Photonic** - 3D photonic crystal

#### Optical Phenomena
- **Rayleigh Scattering** - Atmospheric blue (`I ∝ 1/λ⁴`)
- **Chromatic Dispersion** - Prismatic rainbow
- **Birefringence** - Photoelastic stress fields

#### Mathematical
- **Quasicrystal** - Penrose tiling (5-fold symmetry)
- **Strange Attractor** - Clifford chaos

### Code Libraries
- **`structural_color_library.js`** - Complete GLSL shader library
- **`tools/spectral_analysis.py`** - Python utilities for:
  - Wavelength ↔ RGB conversion
  - Thin-film interference calculation
  - Bragg reflector modeling
  - Spectral data generation

## 💻 Code Examples

### JavaScript/WebGL Usage

```javascript
// Load the shader library
const shader = StructuralColorLibrary.thin_film_interference;

// Create WebGL fragment shader
const fragmentSource = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_thickness;
  uniform float u_viewAngle;
  uniform float u_intensity;

  ${StructuralColorLibrary.utilities}
  ${shader}

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec3 col = thin_film_interference(uv, u_time, u_thickness, u_viewAngle, u_intensity);
    gl_FragColor = vec4(col, 1.0);
  }
`;

// Render with parameters
uniforms.u_thickness = 1.5;  // Film thickness multiplier
uniforms.u_viewAngle = 0.5;  // Viewing angle (radians)
uniforms.u_intensity = 1.2;  // Color intensity
```

### Python Spectral Analysis

```python
from spectral_analysis import ThinFilmInterference, SpectralColor

# Calculate thin-film interference color
film = ThinFilmInterference(n_film=1.33)  # Soap bubble
r, g, b = film.get_color(thickness=500, angle=0.0)  # 500nm thick
print(f"Color at 500nm: RGB({r:.2f}, {g:.2f}, {b:.2f})")

# Convert wavelength to RGB
wavelength = 550  # Green (nm)
color = SpectralColor.wavelength_to_rgb(wavelength)

# Generate interference color series
thicknesses = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
film.plot_thickness_series(thicknesses, 'soap_bubble_colors.png')
```

### GLSL Standalone Shader

```glsl
uniform float u_time;
uniform vec2 u_resolution;

// Include wavelength conversion
vec3 wavelengthToRGB(float wavelength) {
  // ... (see library for full implementation)
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = (uv - 0.5) * 2.0;
  
  // Thin-film interference parameters
  float thickness = 500.0;  // nanometers
  float n_film = 1.33;      // refractive index
  
  vec3 color = vec3(0.0);
  
  // Calculate interference for each wavelength
  for (float i = 0.0; i < 20.0; i++) {
    float lambda = mix(400.0, 700.0, i / 20.0);
    
    // Optical path difference
    float pathDiff = 2.0 * n_film * thickness;
    float phase = (pathDiff / lambda) * 6.28318;
    
    // Interference intensity
    float intensity = 0.5 + 0.5 * cos(phase);
    
    color += wavelengthToRGB(lambda) * intensity;
  }
  
  color /= 20.0;
  
  gl_FragColor = vec4(color, 1.0);
}
```

## 📐 Physics Principles Implemented

### 1. Thin-Film Interference
**Formula:** `2nd cos(θ) = mλ`

Constructive interference when optical path difference equals integer wavelengths. Film thickness 100-1000nm creates visible color range.

**Natural Examples:**
- Soap bubbles
- Oil slicks
- Oxidized metals
- Anti-reflective coatings

### 2. Bragg Reflection  
**Formula:** `λ = 2nd cos(θ)`

Multilayer interference in biological photonic crystals. 20-40 alternating layers create intense, pure colors.

**Natural Examples:**
- Scarab beetles (Chrysina gloriosa)
- Jewel beetles
- Fish scales (iridophores)
- Butterfly wings (some species)

### 3. Diffraction Grating
**Formula:** `d(sin θᵢ + sin θₘ) = mλ`

Periodic structures selectively reflect specific wavelengths. Spacing ~200nm for blue structural color.

**Natural Examples:**
- Morpho butterfly (~440nm peak)
- Peacock feathers
- Bird of paradise feathers

### 4. Rayleigh Scattering
**Formula:** `I ∝ 1/λ⁴`

Wavelength-dependent scattering. Blue (450nm) scatters 9.4× more than red (650nm).

**Natural Examples:**
- Blue sky
- Red sunsets
- Opalescent minerals
- Blue eyes (Tyndall scattering)

### 5. Chromatic Dispersion
**Formula:** `n(λ) = A + B/λ²` (Cauchy equation)

Refractive index varies with wavelength, causing angular separation of colors.

**Natural Examples:**
- Rainbows
- Diamond fire
- Prism effects
- Atmospheric halos

## 📊 Data Files

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📜 License

MIT License - See [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Inigo Quilez for shader mathematics
- The Book of Shaders community
- Nature's nanoscale engineers (butterflies, beetles, birds)

---

*"The universe is not only queerer than we suppose, but queerer than we can suppose."* — J.B.S. Haldane
