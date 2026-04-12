# Physics Cheat Sheet

## Quick Reference for Structural Color Physics

## Thin-Film Interference

### Formulas

| Condition | Formula |
|-----------|---------|
| Constructive | `2nd cos(θ) = (m + 1/2)λ` |
| Destructive | `2nd cos(θ) = mλ` |
| Normal incidence | `2nd = (m + 1/2)λ` |

### Common Thicknesses

| Film | Thickness | Colors |
|------|-----------|--------|
| Soap bubble | 100-500 nm | Rainbow |
| Oil slick | 50-500 nm | Iridescent |
| Oxide layer | 10-200 nm | Gold-blue |
| Morpho wing | 140-160 nm | Blue |

### Refractive Indices

| Material | n (at 589nm) |
|----------|-------------|
| Air | 1.0003 |
| Water | 1.333 |
| Oil | 1.4-1.5 |
| Chitin | 1.56 |
| Glass | 1.5-1.9 |
| Diamond | 2.417 |

## Bragg Reflection

### Formula
```
λ = 2nₑff d sin(θ)
```

### For Multi-Layer Stack
```
λ_max = 2(n₁d₁ + n₂d₂)
```

### Examples

| Structure | Layers | Color |
|-----------|--------|-------|
| Scarab beetle | 10-50 | Metallic |
| Morpho wing | 10-12 | Blue |
| Peacock feather | 5-10 | Iridescent |

## Diffraction Grating

### Grating Equation
```
d(sin θᵢ + sin θₘ) = mλ
```

### Angular Dispersion
```
dθₘ/dλ = m / (d cos θₘ)
```

### Examples

| Structure | Spacing | Effect |
|-----------|---------|--------|
| CD/DVD | 1500 nm | Rainbow |
| Morpho ridges | 200 nm | Blue |
| Peacock barbules | 150 nm | Green-blue |

## Rayleigh Scattering

### Formula
```
I ∝ 1/λ⁴
```

### Scattering Ratio
```
I_blue / I_red = (700/450)⁴ ≈ 5.5
```

### Examples

| Phenomenon | Cause |
|------------|-------|
| Blue sky | N₂, O₂ scattering |
| Red sunset | Long path through atmosphere |
| Opal color | SiO₂ spheres |
| Blue eyes | Tyndall scattering |

## Photonic Crystals

### Band Gap Condition
```
λ ≈ 2a√(n₁²f + n₂²(1-f))
```

Where:
- `a` = lattice constant
- `f` = fill fraction
- `n₁, n₂` = refractive indices

### Types

| Dimension | Structure | Example |
|-----------|-----------|---------|
| 1D | Multilayer | Beetle shell |
| 2D | Rod array | Peacock feather |
| 3D | Sphere array | Opal |

## Colorimetry

### CIE XYZ
```
X = ∫ P(λ) x̄(λ) dλ
Y = ∫ P(λ) ȳ(λ) dλ
Z = ∫ P(λ) z̄(λ) dλ
```

### Chromaticity
```
x = X/(X+Y+Z)
y = Y/(X+Y+Z)
```

### Wavelength to RGB (Approximate)

| Range (nm) | Formula |
|------------|---------|
| 380-440 | `(-(λ-440)/(440-380), 0, 1)` |
| 440-490 | `(0, (λ-440)/(490-440), 1)` |
| 490-510 | `(0, 1, -(λ-510)/(510-490))` |
| 510-580 | `((λ-510)/(580-510), 1, 0)` |
| 580-645 | `(1, -(λ-645)/(645-580), 0)` |
| 645-780 | `(1, 0, 0)` |

## Biological Structures

### Morpho Butterfly

| Parameter | Value |
|-----------|-------|
| Ridge spacing | ~200 nm |
| Lamellae count | 10-12 |
| Peak wavelength | 450 nm |
| Mechanism | Diffraction + thin-film |

### Scarab Beetle

| Parameter | Value |
|-----------|-------|
| Layer count | 10-50 |
| Layer thickness | 100-200 nm |
| Chitin n | 1.56 |
| Mechanism | Bragg reflection |

### Peacock Feather

| Parameter | Value |
|-----------|-------|
| Lattice type | 2D square |
| Rod spacing | ~150 nm |
| Rod diameter | ~100 nm |
| Mechanism | Photonic crystal |

## Useful Constants

### Physical Constants

| Constant | Value |
|----------|-------|
| Speed of light (c) | 2.998 × 10⁸ m/s |
| Planck's constant (h) | 6.626 × 10⁻³⁴ J·s |
| Boltzmann constant (k) | 1.381 × 10⁻²³ J/K |

### Optical

| Property | Value |
|----------|-------|
| Visible range | 380-780 nm |
| Peak photopic | 555 nm |
| Peak scotopic | 507 nm |

### Mathematical

| Constant | Value |
|----------|-------|
| π | 3.14159265359 |
| 2π | 6.28318530718 |
| Golden ratio (φ) | 1.61803398875 |

## Quick Conversions

### Wavelength
```
1 eV = 1240 nm
E(eV) = 1240/λ(nm)
```

### Frequency
```
f = c/λ
λ(nm) × f(THz) = 299,792
```

### Wavenumber
```
ṽ = 1/λ
ṽ(cm⁻¹) = 10⁷/λ(nm)
```

## Shader Snippets

### View Angle
```glsl
float viewAngle = max(0.0, dot(normalize(N), normalize(V)));
```

### Cosine Palette
```glsl
vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318 * (c * t + d));
}
```

### Wavelength to RGB
```glsl
vec3 wavelengthToRGB(float W) {
    vec3 c = vec3(0.0);
    if (W >= 380.0 && W < 440.0) 
        c = vec3(-(W-440.0)/(440.0-380.0), 0.0, 1.0);
    // ... etc
    return c;
}
```

## References

1. Hecht, E. (2017). *Optics* (5th ed.)
2. Born & Wolf (1999). *Principles of Optics*
3. Kinoshita (2008). *Structural Colors in the Realm of Nature*
4. Joannopoulos et al. (2008). *Photonic Crystals*
