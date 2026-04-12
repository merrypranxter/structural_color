# Frequently Asked Questions

## General Questions

### What is structural color?

Structural color is produced by nanostructure-mediated light interference rather than pigments. Examples include soap bubbles, butterfly wings, and opals. The color changes with viewing angle and is often more vivid than pigment-based colors.

### How is this different from regular shaders?

Most shaders simulate material appearance using approximations. Structural color shaders implement the actual physics equations—calculating interference, diffraction, and scattering as they occur in nature.

### Do I need to know physics to use this?

No! The shaders work out of the box. Understanding the physics helps with customization but isn't required.

### What browsers are supported?

Any modern browser with WebGL 2.0 support:
- Chrome 80+
- Firefox 79+
- Safari 15+
- Edge 80+

## Technical Questions

### Why is my shader black?

Common causes:
1. Normal vectors not normalized
2. Division by zero
3. Values outside [0, 1] range
4. Missing uniforms

Debug by outputting intermediate values:
```glsl
gl_FragColor = vec4(vec3(viewAngle), 1.0);
```

### How do I make it run faster?

1. Reduce FBM octaves (try 3 instead of 4)
2. Lower geometry resolution
3. Use simpler noise functions
4. Disable post-processing

### Can I use this in my project?

Yes! The code is MIT licensed. Attribution is appreciated but not required.

### How do I add a new shader?

1. Create `.frag` and `.vert` files in `src/shaders/`
2. Import them in `src/shaderLibrary.js`
3. Add to the `SHADERS` object
4. Reference the new shader in your code

See [TUTORIAL.md](docs/TUTORIAL.md) for a step-by-step guide.

## Physics Questions

### What equation produces the rainbow effect?

The thin-film interference equation:
```
2nd cos(θ) = (m + 1/2)λ
```

Different wavelengths (colors) constructively interfere at different angles, creating the rainbow.

### Why do soap bubbles change color before popping?

As the bubble thins, the optimal interference wavelength shifts through the spectrum. When very thin, it appears black (destructive interference for all visible wavelengths).

### What's the difference between Bragg reflection and thin-film?

- **Thin-film**: Single layer, simple interference
- **Bragg**: Multiple layers (10-50), sharper peaks, metallic appearance

### Can this simulate real materials?

Yes! Use the refractive index data in `data/refractive_indices.csv` and the biological measurements in `data/biological_specimens.csv`.

## Customization Questions

### How do I change colors?

Modify the palette parameters in the shader:
```glsl
vec3 color = palette(t, 
    vec3(0.5),           // Base
    vec3(0.5),           // Amplitude
    vec3(1.0),           // Frequency
    vec3(0.0, 0.33, 0.67) // Phase (change this!)
);
```

### How do I add mouse interaction?

Add `u_mouse` uniform:
```glsl
uniform vec2 u_mouse;

void main() {
    float influence = length(v_uv - u_mouse);
    // Use influence in your calculation
}
```

### How do I use my own geometry?

Create a custom geometry function in `src/geometry/GyroidMesh.js`:
```javascript
export function createMyMesh(material) {
    const geometry = new THREE.MyGeometry(...);
    return new THREE.Mesh(geometry, material);
}
```

## Data Questions

### Where does the wavelength data come from?

The wavelength-to-RGB conversion is based on the CIE 1931 color matching functions, which represent average human color perception.

### Are the refractive indices accurate?

Yes, sourced from:
- NIST database
- Academic papers
- Manufacturer specifications

See `data/refractive_indices.csv` for sources.

### Can I contribute data?

Absolutely! Submit a PR with:
1. CSV file with proper headers
2. Source citation
3. Units clearly labeled

## Troubleshooting

### Shader compilation error

Check:
1. Semicolons at end of lines
2. Matching braces
3. Correct varying names
4. No undefined variables

### Performance issues

1. Check FPS with stats.js (press F12)
2. Try simpler shaders
3. Reduce geometry complexity
4. Close other browser tabs

### Colors look wrong

1. Check gamma correction
2. Verify palette parameters
3. Ensure values are clamped [0, 1]
4. Try different color spaces

## Contributing

### How can I help?

- Add new shaders
- Improve documentation
- Fix bugs
- Share examples
- Answer questions

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### What shaders are needed?

Check the [Roadmap](ROADMAP.md) for planned features. Popular requests:
- More biological examples
- Quantum optics effects
- Nonlinear phenomena
- Historical pigments

### How do I report a bug?

Open an issue with:
1. Browser and GPU info
2. Steps to reproduce
3. Expected vs actual behavior
4. Console error messages

## Learning Resources

### Where can I learn more about the physics?

- [Hecht's Optics](https://www.pearson.com/en-us/subject-catalog/p/optics/P200000005792) - The standard textbook
- [Kinoshita's Structural Colors](https://www.worldscientific.com/worldscibooks/10.1142/6902) - Biological focus
- [The Physics of Structural Colors](https://www.nature.com/articles/s41566-018-0261-1) - Review article

### Where can I learn GLSL?

- [The Book of Shaders](https://thebookofshaders.com/) - Excellent introduction
- [Inigo Quilez's articles](https://iquilezles.org/articles/) - Advanced techniques
- [ShaderToy](https://www.shadertoy.com/) - Examples and community

### Where can I learn Three.js?

- [Three.js documentation](https://threejs.org/docs/)
- [Three.js examples](https://threejs.org/examples/)
- [Discover Three.js](https://discoverthreejs.com/)

## Still Have Questions?

- Open a [GitHub issue](https://github.com/yourusername/structural-color-engine/issues)
- Join the discussion on [Discord](#) (coming soon)
- Email: [contact@example.com](mailto:contact@example.com)
