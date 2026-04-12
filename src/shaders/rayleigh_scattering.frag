// Rayleigh Scattering / Opalescence Shader
// Simulates wavelength-dependent scattering (sky, opals, aerogel)
// Author: Structural Color Engine
// Based on: I ∝ 1/λ⁴

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_density;
uniform vec3 u_lightDir;

varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_viewPosition;
varying vec3 v_position;

const float PI = 3.14159265359;

// Physical wavelengths of RGB (in nanometers)
const vec3 WAVELENGTHS = vec3(700.0, 530.0, 440.0);

// Rayleigh phase function: (3/4)(1 + cos²θ)
float rayleighPhase(float cosTheta) {
    return 0.75 * (1.0 + cosTheta * cosTheta);
}

// Rayleigh scattering coefficient: σ ∝ 1/λ⁴
vec3 rayleighScattering(float density, vec3 lightDir, vec3 viewDir) {
    // Scattering coefficient (1/λ⁴)
    vec3 scatterCoeff = 1.0 / pow(WAVELENGTHS, vec3(4.0));
    
    // Scale to visible range
    scatterCoeff *= 1e10;
    
    // Phase function
    float cosTheta = dot(lightDir, viewDir);
    float phase = rayleighPhase(cosTheta);
    
    // Final scattering
    return scatterCoeff * phase * density;
}

// Density field for opalescent material
float densityField(vec3 p, float time) {
    float density = 0.0;
    
    // Base density
    density += 0.5;
    
    // Large scale variation
    density += sin(p.x * 2.0 + time * 0.1) * 0.2;
    density += sin(p.y * 2.0 + time * 0.15) * 0.2;
    density += sin(p.z * 2.0 + time * 0.2) * 0.2;
    
    // Fine detail
    density += sin(p.x * 10.0) * sin(p.y * 10.0) * sin(p.z * 10.0) * 0.1;
    
    // Ensure positive
    return max(0.0, density);
}

// Simplex-like noise
float hash(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
             dot(p, vec3(269.5, 183.3, 246.1)),
             dot(p, vec3(113.5, 271.9, 124.6)));
    return fract(sin(p.x) * 43758.5453);
}

void main() {
    vec3 N = normalize(v_normal);
    vec3 V = normalize(v_viewPosition);
    vec3 L = normalize(u_lightDir);
    
    // Calculate density at this point
    float density = densityField(v_position, u_time) * u_density;
    
    // Rayleigh scattering
    vec3 scattering = rayleighScattering(density, L, V);
    
    // Mie scattering (forward-scattering, for clouds/haze)
    float g = 0.7; // Asymmetry parameter
    float cosTheta = dot(L, V);
    float miePhase = (1.0 - g * g) / pow(1.0 + g * g - 2.0 * g * cosTheta, 1.5);
    vec3 mieScattering = vec3(miePhase) * density * 0.1;
    
    // Combine scattering types
    vec3 color = scattering + mieScattering;
    
    // Add direct light (sun/moon)
    float directLight = max(0.0, dot(N, L));
    color += vec3(directLight) * 0.3;
    
    // Add some noise for texture
    float noise = hash(v_position * 10.0 + u_time);
    color *= 0.95 + noise * 0.1;
    
    // Tone mapping (HDR to LDR)
    color = color / (1.0 + color);
    
    // Gamma correction
    color = pow(color, vec3(1.0 / 2.2));
    
    // Boost blue for sky effect
    color.b *= 1.2;
    
    gl_FragColor = vec4(color, 1.0);
}
