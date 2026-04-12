// Chromatic Dispersion Shader
// Simulates wavelength-dependent refraction (prism effect)
// Author: Structural Color Engine
// Based on: Snell's law with wavelength-dependent refractive index

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_ior;
uniform float u_dispersion;

varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_viewPosition;

const float PI = 3.14159265359;

// Cauchy's equation for wavelength-dependent refractive index
// n(λ) = A + B/λ² + C/λ⁴
float cauchyIOR(float wavelength, float baseIOR, float dispersion) {
    // wavelength in micrometers
    float lambda = wavelength / 1000.0;
    return baseIOR + dispersion / (lambda * lambda);
}

// Refract function that returns vec3 for RGB
vec3 refractRGB(vec3 I, vec3 N, float iorR, float iorG, float iorB) {
    vec3 result;
    
    // Red channel
    float etaR = 1.0 / iorR;
    float cosiR = dot(I, N);
    float costR = 1.0 - etaR * etaR * (1.0 - cosiR * cosiR);
    result.r = costR > 0.0 ? etaR * cosiR - sqrt(costR) : 0.0;
    
    // Green channel
    float etaG = 1.0 / iorG;
    float cosiG = dot(I, N);
    float costG = 1.0 - etaG * etaG * (1.0 - cosiG * cosiG);
    result.g = costG > 0.0 ? etaG * cosiG - sqrt(costG) : 0.0;
    
    // Blue channel
    float etaB = 1.0 / iorB;
    float cosiB = dot(I, N);
    float costB = 1.0 - etaB * etaB * (1.0 - cosiB * cosiB);
    result.b = costB > 0.0 ? etaB * cosiB - sqrt(costB) : 0.0;
    
    return result;
}

// Background pattern (simulates environment)
vec3 backgroundPattern(vec2 uv) {
    // Grid pattern
    float grid = step(0.95, fract(uv.x * 10.0)) + step(0.95, fract(uv.y * 10.0));
    
    // Gradient
    vec3 gradient = vec3(uv.x, uv.y, 0.5);
    
    // Checkerboard
    float checker = mod(floor(uv.x * 5.0) + floor(uv.y * 5.0), 2.0);
    
    return mix(gradient, vec3(checker), 0.3) + vec3(grid * 0.2);
}

void main() {
    vec3 N = normalize(v_normal);
    vec3 V = normalize(v_viewPosition);
    vec3 I = -V; // Incident direction
    
    // Calculate IOR for each wavelength
    // Red: ~700nm, Green: ~530nm, Blue: ~440nm
    float iorR = cauchyIOR(700.0, u_ior, u_dispersion);
    float iorG = cauchyIOR(530.0, u_ior, u_dispersion);
    float iorB = cauchyIOR(440.0, u_ior, u_dispersion);
    
    // Calculate refraction for each channel
    float etaR = 1.0 / iorR;
    float etaG = 1.0 / iorG;
    float etaB = 1.0 / iorB;
    
    float cosi = dot(I, N);
    float kR = 1.0 - etaR * etaR * (1.0 - cosi * cosi);
    float kG = 1.0 - etaG * etaG * (1.0 - cosi * cosi);
    float kB = 1.0 - etaB * etaB * (1.0 - cosi * cosi);
    
    vec3 refractR = kR > 0.0 ? etaR * I - (etaR * cosi + sqrt(kR)) * N : vec3(0.0);
    vec3 refractG = kG > 0.0 ? etaG * I - (etaG * cosi + sqrt(kG)) * N : vec3(0.0);
    vec3 refractB = kB > 0.0 ? etaB * I - (etaB * cosi + sqrt(kB)) * N : vec3(0.0);
    
    // Sample background with offset coordinates
    vec2 uvR = v_uv + refractR.xy * 0.5;
    vec2 uvG = v_uv + refractG.xy * 0.5;
    vec2 uvB = v_uv + refractB.xy * 0.5;
    
    vec3 bgR = backgroundPattern(uvR);
    vec3 bgG = backgroundPattern(uvG);
    vec3 bgB = backgroundPattern(uvB);
    
    vec3 color = vec3(bgR.r, bgG.g, bgB.b);
    
    // Add chromatic aberration visualization
    float aberration = length(vec2(refractR.x - refractG.x, refractB.x - refractG.x));
    color += vec3(aberration * 0.5, 0.0, aberration * 0.3);
    
    // Animate the dispersion
    float timeOffset = sin(u_time * 0.5) * 0.1;
    color = mix(color, color.grb, timeOffset);
    
    // Fresnel reflection
    float fresnel = pow(1.0 - max(0.0, dot(N, V)), 3.0);
    color += vec3(fresnel * 0.3);
    
    // Boost colors
    color = pow(color, vec3(0.85));
    
    gl_FragColor = vec4(color, 1.0);
}
