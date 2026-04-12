# Mathematical Derivations

## 1. Thin-Film Interference Derivation

### Setup

Consider a thin film of thickness `d` and refractive index `n` surrounded by air (n≈1).

### Path Difference

Light reflects from both surfaces:
- Ray 1: Reflects from top surface
- Ray 2: Enters film, reflects from bottom, exits

The optical path difference (OPD) is:

```
OPD = 2nd cos(θ')
```

Where:
- `θ'` is the angle of refraction inside the film
- From Snell's law: sin(θ) = n sin(θ')

### Phase Changes

- Top surface (air→film): π phase shift (reflection from higher n)
- Bottom surface (film→air): 0 phase shift

Net phase shift: π

### Interference Conditions

**Constructive (bright):**
```
2nd cos(θ') = (m + 1/2)λ    (m = 0, 1, 2, ...)
```

**Destructive (dark):**
```
2nd cos(θ') = mλ
```

### Normal Incidence Simplification

At θ = 0:
```
2nd = (m + 1/2)λ    (constructive)
2nd = mλ            (destructive)
```

## 2. Bragg's Law Derivation

### Crystal Diffraction

Consider parallel planes of atoms with spacing `d`.

### Path Difference

For incident angle θ and reflected angle θ:

```
Path difference = AB + BC = 2d sin(θ)
```

### Bragg Condition

Constructive interference when:
```
2d sin(θ) = mλ    (Bragg's Law)
```

### For Photonic Crystals

In a multilayer stack with alternating refractive indices:

```
λ_max = 2(n₁d₁ + n₂d₂)
```

The central wavelength depends on the optical thickness of each layer.

## 3. Transfer Matrix Method

### Single Interface

The electric and magnetic fields at interface:

```
E = E⁺ + E⁻
H = (E⁺ - E⁻)n cos(θ)
```

### Propagation Matrix

For propagation through layer j:

```
⎡E⎤     ⎡e^(-iδⱼ)     0     ⎤ ⎡E⎤
⎣H⎦ = ⎣    0      e^(iδⱼ) ⎦ ⎣H⎦
```

Where phase thickness:
```
δⱼ = (2π/λ) nⱼ dⱼ cos(θⱼ)
```

### Interface Matrix

At interface between layers j and j+1:

```
⎡E⎤   1  ⎡1 + ηⱼ/ηⱼ₊₁   1 - ηⱼ/ηⱼ₊₁⎤ ⎡E⎤
⎣H⎦ = ── ⎣1 - ηⱼ/ηⱼ₊₁   1 + ηⱼ/ηⱼ₊₁⎦ ⎣H⎦
      2
```

Where admittance η = n cos(θ) for s-polarization.

### Total Transfer Matrix

For N layers:

```
M = M₁ · M₂ · ... · Mₙ
```

### Reflection Coefficient

```
r = (m₁₁ + m₁₂ηₛ)η₀ - (m₂₁ + m₂₂ηₛ)
    ─────────────────────────────────
    (m₁₁ + m₁₂ηₛ)η₀ + (m₂₁ + m₂₂ηₛ)
```

Reflectance: R = |r|²

## 4. Diffraction Grating Equation

### Grating Geometry

Parallel slits/grooves spaced by distance `d`.

### Path Difference

For incident angle θᵢ and diffraction angle θₘ:

```
Path difference = d(sin θₘ - sin θᵢ)
```

### Grating Equation

Constructive interference:
```
d(sin θₘ - sin θᵢ) = mλ    (m = 0, ±1, ±2, ...)
```

For reflection grating:
```
d(sin θᵢ + sin θₘ) = mλ
```

### Angular Dispersion

Differentiate grating equation:

```
d cos(θₘ) dθₘ = m dλ

dθₘ     m
─── = ─────────
dλ    d cos(θₘ)
```

Higher orders (larger m) give greater dispersion.

## 5. Rayleigh Scattering Derivation

### Scattering from Small Particles

For particles much smaller than wavelength (r << λ):

### Induced Dipole

Electric field induces dipole moment:
```
p = αE₀
```

Where polarizability:
```
α = 4πε₀r³((n²-1)/(n²+2))
```

### Radiated Power

From oscillating dipole:
```
P ∝ ω⁴|p|²
```

### Wavelength Dependence

Since ω = 2πc/λ:
```
I ∝ 1/λ⁴
```

This is the famous λ⁻⁴ dependence.

### Scattering Cross Section

```
σ = (8π/3)k⁴r⁶((n²-1)/(n²+2))²
```

Where k = 2π/λ.

## 6. Effective Medium Theory

### Maxwell-Garnett Formula

For spherical inclusions in a host:

```
(εₑff - εₕ)/(εₑff + 2εₕ) = f(εᵢ - εₕ)/(εᵢ + 2εₕ)
```

Where:
- εₑff = effective permittivity
- εₕ = host permittivity
- εᵢ = inclusion permittivity
- f = fill fraction

### Bruggeman Formula

For symmetric mixtures:

```
f(εᵢ - εₑff)/(εᵢ + 2εₑff) + (1-f)(εₕ - εₑff)/(εₕ + 2εₑff) = 0
```

### Refractive Index

```
nₑff = √εₑff
```

## 7. Colorimetry Calculations

### CIE XYZ Tristimulus Values

```
X = k ∫ P(λ) x̄(λ) dλ
Y = k ∫ P(λ) ȳ(λ) dλ
Z = k ∫ P(λ) z̄(λ) dλ
```

Where:
- P(λ) = spectral power distribution
- x̄, ȳ, z̄ = color matching functions
- k = normalization constant

### Chromaticity Coordinates

```
x = X/(X + Y + Z)
y = Y/(X + Y + Z)
z = Z/(X + Y + Z) = 1 - x - y
```

### CIE L*a*b* Color Space

```
L* = 116f(Y/Yₙ) - 16
a* = 500[f(X/Xₙ) - f(Y/Yₙ)]
b* = 200[f(Y/Yₙ) - f(Z/Zₙ)]
```

Where:
```
f(t) = t^(1/3)      if t > (6/29)³
f(t) = (1/3)(29/6)²t + 16/116    otherwise
```

### Color Difference

```
ΔE*ab = √(ΔL*² + Δa*² + Δb*²)
```

## 8. Fourier Optics

### Fraunhofer Diffraction

Far-field diffraction pattern:

```
U(x,y) = C ∫∫ U(ξ,η) exp[-i(2π/λz)(xξ + yη)] dξ dη
```

This is the Fourier transform of the aperture function.

### Convolution Theorem

```
ℱ{f * g} = ℱ{f} · ℱ{g}
ℱ{f · g} = ℱ{f} * ℱ{g}
```

### Angular Spectrum

```
A(kₓ, kᵧ) = ∫∫ U(x,y) exp[-i(kₓx + kᵧy)] dx dy
```

## References

1. Born, M. & Wolf, E. (1999). *Principles of Optics* (7th ed.). Cambridge.
2. Hecht, E. (2017). *Optics* (5th ed.). Pearson.
3. Macleod, H.A. (2017). *Thin-Film Optical Filters* (5th ed.). CRC Press.
4. Wyszecki, G. & Stiles, W.S. (2000). *Color Science* (2nd ed.). Wiley.
