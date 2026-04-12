# Theory of Structural Color

## 1. Introduction

Structural color arises from the interaction of light with nanostructures rather than pigments. This phenomenon produces some of nature's most vivid and iridescent colors.

## 2. Physical Mechanisms

### 2.1 Thin-Film Interference

When light reflects from both surfaces of a thin film, the two reflected waves interfere:

**Constructive Interference:**
```
2nd cos(θ) = mλ    (m = 0, 1, 2, ...)
```

**Destructive Interference:**
```
2nd cos(θ) = (m + 1/2)λ
```

Where:
- `n` = refractive index of the film
- `d` = film thickness
- `θ` = angle of refraction
- `λ` = wavelength of light
- `m` = interference order

### 2.2 Bragg Reflection

In periodic structures like photonic crystals:

```
λ = 2nₑff d sin(θ)
```

Where `nₑff` is the effective refractive index and `d` is the lattice spacing.

### 2.3 Diffraction Grating

For a grating with spacing `d`:

```
d(sin θᵢ + sin θₘ) = mλ
```

Where:
- `θᵢ` = incident angle
- `θₘ` = diffraction angle for order m

### 2.4 Rayleigh Scattering

Scattering intensity depends on wavelength:

```
I ∝ 1/λ⁴
```

This explains why the sky is blue and sunsets are red.

## 3. Mathematical Framework

### 3.1 Fresnel Equations

Reflection coefficients at an interface:

**s-polarized (perpendicular):**
```
rₛ = (n₁ cos θ₁ - n₂ cos θ₂) / (n₁ cos θ₁ + n₂ cos θ₂)
```

**p-polarized (parallel):**
```
rₚ = (n₂ cos θ₁ - n₁ cos θ₂) / (n₂ cos θ₁ + n₁ cos θ₂)
```

### 3.2 Transfer Matrix Method

For multi-layer structures, the transfer matrix relates fields:

```
⎡E₀⎤   ⎡A B⎤ ⎡Eₙ⎤
⎣H₀⎦ = ⎣C D⎦ ⎣Hₙ⎦
```

### 3.3 Effective Medium Theory

For subwavelength structures:

```
nₑff² = f·n₁² + (1-f)·n₂²
```

Where `f` is the fill fraction.

## 4. Biological Examples

### 4.1 Morpho Butterfly

- Structure: Ridges with lamellae
- Period: ~200 nm
- Mechanism: Diffraction + thin-film
- Peak reflectance: ~450 nm (blue)

### 4.2 Jewel Beetles

- Structure: Chitin-air multilayers
- Layer count: 10-50
- Mechanism: Bragg reflection
- Color: Metallic green/gold

### 4.3 Peacock Feathers

- Structure: 2D photonic crystal
- Lattice: Square array of rods
- Mechanism: Photonic band gap
- Colors: Blue, green, yellow, brown

## 5. Computational Methods

### 5.1 Finite-Difference Time-Domain (FDTD)

Solves Maxwell's equations directly:

```
∇ × E = -∂B/∂t
∇ × H = ∂D/∂t + J
```

### 5.2 Rigorous Coupled-Wave Analysis (RCWA)

For periodic structures, expands fields in Fourier series.

### 5.3 Finite Element Method (FEM)

Discretizes space into elements and solves variationally.

## 6. Colorimetry

### 6.1 CIE XYZ Color Space

Tristimulus values from spectral power distribution:

```
X = ∫ P(λ) x̄(λ) dλ
Y = ∫ P(λ) ȳ(λ) dλ
Z = ∫ P(λ) z̄(λ) dλ
```

### 6.2 Wavelength to RGB Conversion

Approximate conversion for visible spectrum (380-780 nm):

```glsl
vec3 wavelengthToRGB(float W) {
    vec3 c = vec3(0.0);
    if (W >= 380.0 && W < 440.0) 
        c = vec3(-(W-440.0)/(440.0-380.0), 0.0, 1.0);
    else if (W >= 440.0 && W < 490.0) 
        c = vec3(0.0, (W-440.0)/(490.0-440.0), 1.0);
    // ... etc
    return c;
}
```

## 7. References

1. Kinoshita, S. & Yoshioka, S. (2005). "Structural colors in nature." *Rep. Prog. Phys.* 68, 1.
2. Parker, A.R. (2000). "515 million years of structural colour." *J. Opt. A* 2, R15.
3. Vukusic, P. & Sambles, J.R. (2003). "Photonic structures in biology." *Nature* 424, 852.
4. Hecht, E. (2017). *Optics* (5th ed.). Pearson.
5. Joannopoulos, J.D. et al. (2008). *Photonic Crystals* (2nd ed.). Princeton.
