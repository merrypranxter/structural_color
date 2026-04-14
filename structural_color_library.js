/**
 * STRUCTURAL COLOR SHADER LIBRARY
 * Physics-based iridescence and interference shaders
 */

const StructuralColorLibrary = {
  
  // Shared utility functions
  utilities: `
    float hash21(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    mat2 rot(float a) {
      float s = sin(a), c = cos(a);
      return mat2(c, -s, s, c);
    }

    // Convert wavelength (380-780nm) to RGB
    vec3 wavelengthToRGB(float wavelength) {
      float r = 0.0, g = 0.0, b = 0.0;
      
      if (wavelength >= 380.0 && wavelength < 440.0) {
        r = -(wavelength - 440.0) / (440.0 - 380.0);
        b = 1.0;
      } else if (wavelength >= 440.0 && wavelength < 490.0) {
        g = (wavelength - 440.0) / (490.0 - 440.0);
        b = 1.0;
      } else if (wavelength >= 490.0 && wavelength < 510.0) {
        g = 1.0;
        b = -(wavelength - 510.0) / (510.0 - 490.0);
      } else if (wavelength >= 510.0 && wavelength < 580.0) {
        r = (wavelength - 510.0) / (580.0 - 510.0);
        g = 1.0;
      } else if (wavelength >= 580.0 && wavelength < 645.0) {
        r = 1.0;
        g = -(wavelength - 645.0) / (645.0 - 580.0);
      } else if (wavelength >= 645.0 && wavelength <= 780.0) {
        r = 1.0;
      }
      
      // Intensity correction for edge wavelengths
      float factor = 1.0;
      if (wavelength >= 380.0 && wavelength < 420.0) {
        factor = 0.3 + 0.7 * (wavelength - 380.0) / (420.0 - 380.0);
      } else if (wavelength >= 700.0 && wavelength <= 780.0) {
        factor = 0.3 + 0.7 * (780.0 - wavelength) / (780.0 - 700.0);
      }
      
      return vec3(r, g, b) * factor;
    }

    // Cosine palette for procedural colors
    vec3 cosinePalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
      return a + b * cos(6.28318 * (c * t + d));
    }

    // FBM noise for organic variation
    float fbm(vec2 p) {
      float f = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 5; i++) {
        f += amplitude * (sin(p.x) * sin(p.y));
        p = rot(0.7) * p * 2.0;
        amplitude *= 0.5;
      }
      return f;
    }
  `,

  // Thin-film interference (soap bubbles, oil slicks)
  thin_film_interference: `
    vec3 thin_film_interference(vec2 uv, float time, float thickness, float viewAngle, float intensity) {
      // Center coordinates
      vec2 p = (uv - 0.5) * 2.0;
      
      // Distance from center for radial variation
      float r = length(p);
      
      // Angle-dependent thickness
      float filmThickness = thickness * (1.0 + 0.3 * fbm(p * 3.0 + time * 0.1));
      
      // View angle creates interference
      float cosTheta = mix(1.0, cos(viewAngle), r);
      
      // Optical path difference: 2 * n * d * cos(theta)
      // n = 1.33 (approximate for soap film)
      float pathDiff = 2.0 * 1.33 * filmThickness * cosTheta;
      
      // Calculate interference for different wavelengths
      vec3 color = vec3(0.0);
      float numSamples = 20.0;
      
      for (float i = 0.0; i < numSamples; i++) {
        float lambda = mix(400.0, 700.0, i / numSamples); // wavelength in nm
        
        // Interference condition: constructive when pathDiff = m*lambda
        float phase = (pathDiff * 100.0) / lambda; // convert to consistent units
        float interference = 0.5 + 0.5 * cos(6.28318 * phase);
        
        // Add to color spectrum
        color += wavelengthToRGB(lambda) * interference;
      }
      
      color /= numSamples;
      
      // Dark rim effect (thin film edge)
      float rim = pow(1.0 - cosTheta, 3.0);
      color = mix(color, vec3(0.05, 0.0, 0.1), rim * 0.7);
      
      // Intensity and gamma
      color *= intensity;
      color = pow(color, vec3(0.8));
      
      // Vignette
      color *= 1.0 - 0.3 * r;
      
      return color;
    }
  `,

  // Morpho butterfly - diffraction grating
  morpho_butterfly: `
    vec3 morpho_butterfly(vec2 uv, float time, float thickness, float viewAngle, float intensity) {
      vec2 p = (uv - 0.5) * 2.0;
      
      // Scale ridge pattern (Christmas tree scales)
      vec2 scaleUV = p * 15.0;
      scaleUV = rot(time * 0.1) * scaleUV;
      
      // Ridge spacing ~200nm, creates grating
      float ridgeSpacing = 0.2 * thickness;
      
      // Diffraction grating equation: d(sin θi + sin θm) = mλ
      float d = ridgeSpacing;
      float theta_i = viewAngle;
      
      vec3 color = vec3(0.0);
      
      // Create ridge pattern with noise
      float ridgePattern = abs(sin(scaleUV.x / ridgeSpacing * 3.14159));
      ridgePattern *= (0.8 + 0.2 * fbm(scaleUV * 2.0));
      ridgePattern = pow(ridgePattern, 3.0);
      
      // Morpho blue: primarily reflects 350-500nm
      float bluePeak = 440.0; // peak wavelength
      float bandwidth = 80.0;
      
      for (float i = 0.0; i < 20.0; i++) {
        float lambda = mix(350.0, 550.0, i / 20.0);
        
        // Diffraction efficiency (Gaussian around blue)
        float efficiency = exp(-pow((lambda - bluePeak) / bandwidth, 2.0));
        
        // Angle dependence
        float angleFactor = 1.0 - 0.5 * abs(sin(theta_i));
        
        color += wavelengthToRGB(lambda) * efficiency * angleFactor * ridgePattern;
      }
      
      color /= 10.0;
      
      // Melanin backing (absorbs non-blue)
      vec3 melanin = vec3(0.02, 0.01, 0.0);
      color = mix(melanin, color, ridgePattern);
      
      // Scale structure variation
      float scaleNoise = fbm(scaleUV * 0.5);
      color *= 0.8 + 0.4 * scaleNoise;
      
      color *= intensity;
      color = pow(color, vec3(0.9));
      
      return color;
    }
  `,

  // Scarab beetle - Bragg reflector
  scarab_beetle: `
    vec3 scarab_beetle(vec2 uv, float time, float thickness, float viewAngle, float intensity) {
      vec2 p = (uv - 0.5) * 2.0;
      
      // Multilayer structure (chitin/air alternating)
      float numLayers = 30.0 * thickness;
      float layerThickness = 0.12; // ~120nm per layer
      
      // Bragg condition: λ = 2nd cos(θ)
      float n_eff = 1.5; // effective refractive index
      float cosTheta = cos(viewAngle);
      
      // Central wavelength for reflection
      float lambda_bragg = 2.0 * n_eff * layerThickness * 100.0 * cosTheta;
      
      // Create cuticle texture
      vec2 cuticleUV = p * 20.0 + time * 0.05;
      float cuticlePattern = fbm(cuticleUV);
      
      // Local thickness variation
      float localThickness = layerThickness * (1.0 + 0.2 * cuticlePattern);
      lambda_bragg = 2.0 * n_eff * localThickness * 100.0 * cosTheta;
      
      // Calculate multilayer reflection
      vec3 color = vec3(0.0);
      float bandwidth = 40.0; // nm
      
      for (float i = 0.0; i < 25.0; i++) {
        float lambda = mix(400.0, 700.0, i / 25.0);
        
        // Multilayer interference (narrowband reflector)
        float detuning = (lambda - lambda_bragg) / bandwidth;
        float reflectance = exp(-detuning * detuning) / sqrt(numLayers);
        reflectance *= numLayers * 0.8; // Enhancement from multiple layers
        
        color += wavelengthToRGB(lambda) * reflectance;
      }
      
      color /= 15.0;
      
      // Metallic appearance
      float metallic = 0.3 + 0.7 * pow(1.0 - abs(cosTheta), 2.0);
      color *= metallic;
      
      // Cuticle structure adds variation
      color *= 0.7 + 0.3 * cuticlePattern;
      
      color *= intensity;
      color = pow(color, vec3(0.85));
      
      return color;
    }
  `,

  // Opal - 3D photonic crystal
  opal_photonic: `
    vec3 opal_photonic(vec2 uv, float time, float thickness, float viewAngle, float intensity) {
      vec2 p = (uv - 0.5) * 2.0;
      
      // Simulate close-packed silica spheres
      float sphereDiameter = 0.25 * thickness; // 250nm typical
      
      // Create pseudo-3D lattice with rotation
      vec2 latticeUV = p * 10.0;
      latticeUV = rot(time * 0.05) * latticeUV;
      
      // FCC lattice approximation with noise
      vec2 cell = floor(latticeUV);
      vec2 fpos = fract(latticeUV) - 0.5;
      
      // Multiple overlapping lattices for opal disorder
      float latticePattern = 0.0;
      for (int i = 0; i < 3; i++) {
        vec2 offset = vec2(hash21(cell + float(i)), hash21(cell + float(i) + 100.0)) - 0.5;
        offset *= 0.3;
        float d = length(fpos - offset);
        latticePattern += smoothstep(0.3, 0.2, d);
      }
      
      // Bragg diffraction from lattice
      // λ = (2/√3) * d * √(sin²θ - sin²φ)
      float a = sphereDiameter; // lattice constant
      float sinTheta = sin(viewAngle);
      float phi = atan(p.y, p.x) + time * 0.1;
      float sinPhi = sin(phi);
      
      float lambda_bragg = (2.0 / 1.732) * a * 100.0 * sqrt(abs(sinTheta * sinTheta - sinPhi * sinPhi));
      lambda_bragg = clamp(lambda_bragg, 400.0, 700.0);
      
      // Spectral reflection
      vec3 color = vec3(0.0);
      float bandwidth = 60.0;
      
      for (float i = 0.0; i < 20.0; i++) {
        float lambda = mix(400.0, 700.0, i / 20.0);
        
        float detuning = (lambda - lambda_bragg) / bandwidth;
        float reflection = exp(-detuning * detuning);
        
        color += wavelengthToRGB(lambda) * reflection * latticePattern;
      }
      
      color /= 10.0;
      
      // Opalescence - milky base color
      vec3 base = vec3(0.9, 0.95, 1.0) * 0.3;
      color = mix(base, color, 0.8);
      
      // Play of color - angular dependence
      float playOfColor = 0.7 + 0.3 * sin(viewAngle * 3.0 + time);
      color *= playOfColor;
      
      color *= intensity;
      color = pow(color, vec3(0.9));
      
      return color;
    }
  `,

  // Newton's Rings - contact interference
  newtons_rings: `
    vec3 newtons_rings(vec2 uv, float time, float intensity, float thickness, float viewAngle) {
      vec2 p = (uv - 0.5) * 2.0;
      float r = length(p);
      
      // Air gap thickness: t = r²/(2R) where R is radius of curvature
      float R = 5.0 / thickness; // lens radius of curvature
      float t = (r * r) / (2.0 * R) * 100.0; // in nm
      
      // Add small time variation
      t += 5.0 * sin(time * 0.2);
      
      // Interference in air gap (n=1.0)
      vec3 color = vec3(0.0);
      
      for (float i = 0.0; i < 20.0; i++) {
        float lambda = mix(400.0, 700.0, i / 20.0);
        
        // 2t = (m + 1/2)λ for bright rings
        // 2t = mλ for dark rings
        float phase = (2.0 * t) / lambda;
        float interference = 0.5 + 0.5 * cos(6.28318 * phase);
        
        color += wavelengthToRGB(lambda) * interference;
      }
      
      color /= 20.0;
      
      // Central dark spot (contact point)
      float centralSpot = exp(-r * r * 100.0);
      color = mix(color, vec3(0.0), centralSpot);
      
      // Ring sharpness
      color = pow(color, vec3(1.2));
      
      color *= intensity;
      
      return color;
    }
  `,

  // Rayleigh scattering - atmospheric colors
  rayleigh_scattering: `
    vec3 rayleigh_scattering(vec2 uv, float time, float thickness, float viewAngle, float intensity) {
      vec2 p = (uv - 0.5) * 2.0;
      
      // Path length through "atmosphere"
      float pathLength = 1.0 + thickness * abs(sin(viewAngle));
      
      // Sun position (animated)
      vec2 sunPos = vec2(cos(time * 0.1), sin(time * 0.1)) * 0.7;
      float sunDist = length(p - sunPos);
      
      // Scattering intensity ∝ 1/λ⁴
      vec3 color = vec3(0.0);
      
      for (float i = 0.0; i < 20.0; i++) {
        float lambda = mix(400.0, 700.0, i / 20.0);
        
        // Rayleigh scattering coefficient
        float lambda_um = lambda / 1000.0; // convert to micrometers
        float scattering = 1.0 / pow(lambda_um, 4.0);
        
        // Short path = blue (scattered), long path = red (transmitted)
        float scattered = scattering * (1.0 - exp(-pathLength * 0.5));
        float transmitted = exp(-scattering * pathLength * 0.1);
        
        // Sky vs sun
        float factor = mix(scattered, transmitted, exp(-sunDist * 5.0));
        
        color += wavelengthToRGB(lambda) * factor;
      }
      
      color /= 10.0;
      
      // Sun glow
      float sun = exp(-sunDist * 8.0) * 2.0;
      color += vec3(1.0, 0.9, 0.7) * sun;
      
      // Atmospheric gradient
      float altitude = p.y * 0.5 + 0.5;
      color *= 0.5 + 0.5 * altitude;
      
      color *= intensity;
      color = pow(color, vec3(0.85));
      
      return color;
    }
  `,

  // Chromatic dispersion - prism rainbow
  chromatic_dispersion: `
    vec3 chromatic_dispersion(vec2 uv, float time, float thickness, float viewAngle, float intensity) {
      vec2 p = (uv - 0.5) * 2.0;
      
      // Prism geometry
      float prismAngle = 1.0 + 0.5 * sin(time * 0.2);
      
      vec3 color = vec3(0.0);
      
      // Dispersion: n(λ) varies with wavelength
      // Cauchy equation: n(λ) = A + B/λ²
      
      for (float i = 0.0; i < 30.0; i++) {
        float lambda = mix(400.0, 700.0, i / 30.0);
        float lambda_um = lambda / 1000.0;
        
        // Refractive index (glass-like)
        float n = 1.5 + 0.01 / (lambda_um * lambda_um);
        
        // Deviation angle depends on n
        float deviation = (n - 1.0) * prismAngle * thickness;
        
        // Offset each wavelength differently
        vec2 offset = vec2(deviation * (i / 30.0 - 0.5) * 2.0, 0.0);
        offset = rot(viewAngle) * offset;
        
        // Sample with offset
        float d = length(p - offset);
        float contribution = exp(-d * d * 5.0);
        
        color += wavelengthToRGB(lambda) * contribution;
      }
      
      color /= 15.0;
      
      // Rainbow band
      float x = p.x;
      float rainbowBand = exp(-abs(x) * 2.0) * exp(-p.y * p.y * 3.0);
      color *= rainbowBand;
      
      color *= intensity;
      color = pow(color, vec3(0.9));
      
      return color;
    }
  `,

  // Birefringence - stress-induced colors
  birefringence: `
    vec3 birefringence(vec2 uv, float time, float thickness, float viewAngle, float intensity) {
      vec2 p = (uv - 0.5) * 2.0;
      
      // Stress field (simulated)
      float stress = length(p);
      stress += 0.3 * fbm(p * 5.0 + time * 0.1);
      
      // Retardation δ = 2πd(ne - no)/λ
      // Stress-induced birefringence
      float retardation = stress * thickness * 100.0;
      
      vec3 color = vec3(0.0);
      
      // Michel-Lévy interference colors
      for (float i = 0.0; i < 20.0; i++) {
        float lambda = mix(400.0, 700.0, i / 20.0);
        
        // Phase shift from retardation
        float delta = (6.28318 * retardation) / lambda;
        
        // Crossed polarizers: I ∝ sin²(δ/2)
        float intensity_wave = pow(sin(delta / 2.0), 2.0);
        
        color += wavelengthToRGB(lambda) * intensity_wave;
      }
      
      color /= 20.0;
      
      // Isochromatic fringes
      float fringe = abs(sin(retardation * 0.05));
      color *= 0.6 + 0.4 * fringe;
      
      // Add black cross (isoclinic lines)
      float angle = atan(p.y, p.x);
      float isoclinic = abs(sin(angle * 2.0 + time * 0.1));
      isoclinic = smoothstep(0.9, 1.0, isoclinic);
      color *= isoclinic;
      
      color *= intensity;
      color = pow(color, vec3(0.9));
      
      return color;
    }
  `,

  // Quasicrystal - Penrose tiling
  quasicrystal: `
    vec3 quasicrystal(vec2 uv, float time, float thickness, float viewAngle, float intensity) {
      vec2 p = (uv - 0.5) * 10.0;
      p = rot(time * 0.05) * p;
      
      // 5-fold symmetry (golden ratio)
      float phi = 1.61803398875;
      
      // Penrose tiling approximation
      float pattern = 0.0;
      
      for (int i = 0; i < 5; i++) {
        float angle = float(i) * 6.28318 / 5.0;
        vec2 dir = vec2(cos(angle), sin(angle));
        
        float wave = abs(sin(dot(p, dir) * thickness));
        pattern += wave;
        
        // Add golden ratio harmonics
        wave = abs(sin(dot(p, dir) * thickness * phi));
        pattern += wave * 0.5;
      }
      
      pattern /= 7.5;
      pattern = pow(pattern, 2.0);
      
      // Map to spectral colors
      float hue = fract(pattern * 3.0 + time * 0.1);
      
      vec3 color = cosinePalette(hue,
        vec3(0.5),
        vec3(0.5),
        vec3(1.0),
        vec3(0.0, 0.33, 0.67)
      );
      
      // Diffraction peaks
      float peaks = smoothstep(0.7, 1.0, pattern);
      color = mix(color, vec3(1.0), peaks * 0.5);
      
      color *= intensity;
      color = pow(color, vec3(0.9));
      
      return color;
    }
  `,

  // Strange attractor - chaotic dynamics
  strange_attractor: `
    vec3 strange_attractor(vec2 uv, float time, float thickness, float viewAngle, float intensity) {
      vec2 p = (uv - 0.5) * 4.0;
      
      // Clifford attractor parameters
      float a = 1.5 + 0.5 * sin(time * 0.1) * thickness;
      float b = -1.8 + 0.3 * cos(time * 0.15);
      float c = 1.6 + 0.4 * sin(time * 0.08);
      float d = 0.9 + 0.2 * cos(time * 0.12);
      
      // Iterate attractor
      vec2 z = p;
      float density = 0.0;
      
      for (int i = 0; i < 50; i++) {
        // Clifford equations
        float x_new = sin(a * z.y) + c * cos(a * z.x);
        float y_new = sin(b * z.x) + d * cos(b * z.y);
        z = vec2(x_new, y_new);
        
        // Accumulate density
        float dist = length(z - p);
        density += exp(-dist * dist * 10.0);
      }
      
      density /= 50.0;
      
      // Map density to color
      float hue = fract(density * 5.0 + time * 0.1 + viewAngle);
      
      vec3 color = cosinePalette(hue,
        vec3(0.5),
        vec3(0.5),
        vec3(1.0, 1.0, 0.5),
        vec3(0.8, 0.9, 0.3)
      );
      
      // Enhance fractal structure
      color *= pow(density, 0.5) * 2.0;
      
      color *= intensity;
      color = pow(color, vec3(0.85));
      
      return color;
    }
  `
};
