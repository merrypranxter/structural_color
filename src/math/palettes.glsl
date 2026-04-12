// Procedural Color Palettes
// Cosine-based color palette generation
// Author: Structural Color Engine
// Based on: Inigo Quilez's palette function

#ifndef PALETTES_GLSL
#define PALETTES_GLSL

const float PI = 3.14159265359;
const float TWO_PI = 6.28318530718;

// General cosine palette
// t: input value (typically 0-1)
// a: base color (offset)
// b: amplitude of variation
// c: frequency of repetition
// d: phase shift
vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(TWO_PI * (c * t + d));
}

// Acid palette (Lisa Frank / 80s punk glam)
vec3 getAcidPalette(float t) {
    vec3 a = vec3(0.5);
    vec3 b = vec3(0.5);
    vec3 c = vec3(1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);
    return palette(t, a, b, c, d);
}

// Oil slick palette (dark iridescent)
vec3 getOilSlickPalette(float t) {
    vec3 a = vec3(0.5);
    vec3 b = vec3(0.5);
    vec3 c = vec3(2.0, 1.0, 0.0);
    vec3 d = vec3(0.5, 0.20, 0.25);
    return palette(t, a, b, c, d);
}

// Sunset palette (warm orange-red)
vec3 getSunsetPalette(float t) {
    vec3 a = vec3(0.5);
    vec3 b = vec3(0.5);
    vec3 c = vec3(1.0, 0.7, 0.4);
    vec3 d = vec3(0.8, 0.1, 0.1);
    return palette(t, a, b, c, d);
}

// Ocean palette (deep blue-cyan)
vec3 getOceanPalette(float t) {
    vec3 a = vec3(0.5);
    vec3 b = vec3(0.5);
    vec3 c = vec3(0.5, 0.8, 1.0);
    vec3 d = vec3(0.3, 0.5, 0.7);
    return palette(t, a, b, c, d);
}

// Forest palette (greens)
vec3 getForestPalette(float t) {
    vec3 a = vec3(0.5);
    vec3 b = vec3(0.5);
    vec3 c = vec3(0.8, 1.0, 0.3);
    vec3 d = vec3(0.2, 0.6, 0.1);
    return palette(t, a, b, c, d);
}

// Nebula palette (purple-pink cosmic)
vec3 getNebulaPalette(float t) {
    vec3 a = vec3(0.5);
    vec3 b = vec3(0.5);
    vec3 c = vec3(1.0, 0.5, 1.0);
    vec3 d = vec3(0.6, 0.2, 0.8);
    return palette(t, a, b, c, d);
}

// Lava palette (red-orange volcanic)
vec3 getLavaPalette(float t) {
    vec3 a = vec3(0.5);
    vec3 b = vec3(0.5);
    vec3 c = vec3(1.0, 0.3, 0.0);
    vec3 d = vec3(0.0, 0.2, 0.1);
    return palette(t, a, b, c, d);
}

// Ice palette (cold blue-white)
vec3 getIcePalette(float t) {
    vec3 a = vec3(0.5);
    vec3 b = vec3(0.5);
    vec3 c = vec3(0.3, 0.8, 1.0);
    vec3 d = vec3(0.5, 0.7, 0.9);
    return palette(t, a, b, c, d);
}

// Gold palette (metallic)
vec3 getGoldPalette(float t) {
    vec3 a = vec3(0.5);
    vec3 b = vec3(0.5);
    vec3 c = vec3(1.0, 0.8, 0.0);
    vec3 d = vec3(0.1, 0.2, 0.0);
    return palette(t, a, b, c, d);
}

// Silver palette (metallic grey)
vec3 getSilverPalette(float t) {
    vec3 a = vec3(0.5);
    vec3 b = vec3(0.5);
    vec3 c = vec3(0.8, 0.8, 1.0);
    vec3 d = vec3(0.0, 0.0, 0.1);
    return palette(t, a, b, c, d);
}

// Full rainbow palette
vec3 getRainbowPalette(float t) {
    vec3 a = vec3(0.5);
    vec3 b = vec3(0.5);
    vec3 c = vec3(1.0);
    vec3 d = vec3(0.0, 0.33, 0.67);
    return palette(t, a, b, c, d);
}

// Heat map palette (blue to red)
vec3 getHeatmapPalette(float t) {
    vec3 a = vec3(0.5);
    vec3 b = vec3(0.5);
    vec3 c = vec3(1.0, 0.0, 0.0);
    vec3 d = vec3(0.0, 0.5, 1.0);
    return palette(t, a, b, c, d);
}

// Electric palette (cyan-magenta)
vec3 getElectricPalette(float t) {
    vec3 a = vec3(0.5);
    vec3 b = vec3(0.5);
    vec3 c = vec3(0.0, 1.0, 1.0);
    vec3 d = vec3(0.5, 0.0, 0.5);
    return palette(t, a, b, c, d);
}

// Toxic palette (green-yellow warning)
vec3 getToxicPalette(float t) {
    vec3 a = vec3(0.5);
    vec3 b = vec3(0.5);
    vec3 c = vec3(0.8, 1.0, 0.0);
    vec3 d = vec3(0.2, 0.8, 0.1);
    return palette(t, a, b, c, d);
}

// Candy palette (pink-purple sweet)
vec3 getCandyPalette(float t) {
    vec3 a = vec3(0.5);
    vec3 b = vec3(0.5);
    vec3 c = vec3(1.0, 0.5, 0.8);
    vec3 d = vec3(0.3, 0.7, 0.9);
    return palette(t, a, b, c, d);
}

// Matrix palette (green digital)
vec3 getMatrixPalette(float t) {
    vec3 a = vec3(0.0);
    vec3 b = vec3(0.0, 1.0, 0.0);
    vec3 c = vec3(0.0);
    vec3 d = vec3(0.0, 0.5, 0.0);
    return palette(t, a, b, c, d);
}

// Vaporwave palette (pink-cyan retro)
vec3 getVaporwavePalette(float t) {
    vec3 a = vec3(0.5);
    vec3 b = vec3(0.5);
    vec3 c = vec3(1.0, 0.0, 1.0);
    vec3 d = vec3(0.5, 0.2, 0.8);
    return palette(t, a, b, c, d);
}

// Wavelength to RGB conversion (approximate)
vec3 wavelengthToRGB(float wavelength) {
    vec3 color = vec3(0.0);
    float intensity = 1.0;
    
    if (wavelength >= 380.0 && wavelength < 440.0) {
        color = vec3(-(wavelength - 440.0) / (440.0 - 380.0), 0.0, 1.0);
        intensity = 0.3 + 0.7 * (wavelength - 380.0) / (420.0 - 380.0);
    } else if (wavelength >= 440.0 && wavelength < 490.0) {
        color = vec3(0.0, (wavelength - 440.0) / (490.0 - 440.0), 1.0);
    } else if (wavelength >= 490.0 && wavelength < 510.0) {
        color = vec3(0.0, 1.0, -(wavelength - 510.0) / (510.0 - 490.0));
    } else if (wavelength >= 510.0 && wavelength < 580.0) {
        color = vec3((wavelength - 510.0) / (580.0 - 510.0), 1.0, 0.0);
    } else if (wavelength >= 580.0 && wavelength < 645.0) {
        color = vec3(1.0, -(wavelength - 645.0) / (645.0 - 580.0), 0.0);
    } else if (wavelength >= 645.0 && wavelength <= 780.0) {
        color = vec3(1.0, 0.0, 0.0);
        intensity = 0.3 + 0.7 * (780.0 - wavelength) / (780.0 - 700.0);
    }
    
    return color * intensity;
}

#endif // PALETTES_GLSL
