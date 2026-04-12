# 🌈 Structural Color & Spectral Interference Engine

> *"Color is not a property of light, but a property of structure."*

A comprehensive WebGL/Three.js laboratory for exploring structural color, thin-film optics, iridescence, and view-dependent procedural rendering.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![WebGL](https://img.shields.io/badge/WebGL-2.0-green.svg)
![Three.js](https://img.shields.io/badge/Three.js-r160-black.svg)

## 🦋 What is Structural Color?

Structural color is produced by nanostructure-mediated light interference rather than pigments. Examples in nature include:
- **Morpho butterfly wings** - Microscopic ridges create blue iridescence
- **Soap bubbles** - Thin-film interference creates rainbow patterns
- **Opals** - Photonic crystal arrays diffract light
- **Jewel beetles** - Multi-layer Bragg stacks produce metallic colors
- **Peacock feathers** - Melanin rods create structural coloration

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/structural-color-engine.git
cd structural-color-engine

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📁 Repository Contents

| File | Description |
|------|-------------|
| `shaders/` | GLSL shader collection (25+ interference models) |
| `data/` | CSV datasets (wavelengths, refractive indices, biological data) |
| `docs/` | Markdown documentation and theory |
| `math/` | Mathematical derivations and formulas |
| `examples/` | Live demo implementations |
| `tools/` | Python utilities for analysis |

## 🎨 Shader Collection

### Thin-Film Interference
- `thin_film_acid.frag` - Soap bubble / oil slick effect
- `fabry_perot.frag` - Multi-layer interference
- `newtons_rings.frag` - Contact interference patterns

### Biological Mimicry
- `morpho_butterfly.frag` - Diffraction grating simulation
- `scarab_beetle.frag` - Bragg reflector model
- `opal_photonic.frag` - 3D photonic crystal

### Advanced Optics
- `birefringence.frag` - Photoelastic stress fields
- `chromatic_dispersion.frag` - Wavelength-dependent refraction
- `rayleigh_scattering.frag` - Opalescence effects

### Mathematical Abstractions
- `quasicrystal.frag` - Aperiodic 5-fold symmetry
- `strange_attractor.frag` - Clifford/Peter de Jong chaos
- `topological_edge.frag` - Quantum Hall effect visualization

## 🔬 Physics Models Implemented

1. **Thin-Film Interference** - `2nd cos(θ)` optical path difference
2. **Bragg Reflection** - `λ = 2nd cos(θ)`
3. **Diffraction Grating** - `d(sin θᵢ + sin θₘ) = mλ`
4. **Rayleigh Scattering** - `I ∝ 1/λ⁴`
5. **Michel-Lévy Chart** - Birefringence color sequences

## 📊 Data Sources

- Wavelength-to-RGB conversions (380-780nm)
- Refractive indices for common materials
- Biological specimen measurements
- Colorimetric standard observer data

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
