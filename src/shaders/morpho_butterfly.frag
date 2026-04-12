// Morpho Butterfly Diffraction Shader
// Simulates the iridescent blue of Morpho butterfly wings
// Author: Structural Color Engine
// Based on: Vukusic & Sambles (2003)

uniform float u_time;
uniform vec2 u_resolution;

varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_viewPosition;

// Ridge spacing for Morpho rhetenor: ~200nm
const float RIDGE_SPACING = 200.0;
const float PI = 3.14159265359;

// Diffraction grating function
float diffractionGrating(float angle, float spacing, float wavelength) {
    // Grating equation: d(sin θᵢ + sin θₘ) = mλ
    float m = 1.0; // First order
    return sin(angle * spacing / wavelength * PI * 2.0);
}

// Procedural cosine palette
vec3 cosinePalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318 * (c * t + d));
}

void main() {
    vec3 N = normalize(v_normal);
    vec3 V = normalize(v_viewPosition);
    
    // Calculate view angle
    float viewAngle = acos(max(0.0, dot(N, V)));
    
    // Simulate ridge structure using sine waves
    float ridgeU = sin(v_uv.x * 100.0 + u_time * 0.5);
    float ridgeV = sin(v_uv.y * 20.0);
    
    // Combine for 2D ridge pattern
    float ridgePattern = ridgeU * ridgeV;
    
    // Diffraction effect varies with angle
    float diffractionStrength = pow(1.0 - abs(viewAngle) / (PI / 2.0), 2.0);
    
    // Wavelength-dependent diffraction
    float blueResponse = diffractionGrating(viewAngle, RIDGE_SPACING, 450.0);
    float greenResponse = diffractionGrating(viewAngle, RIDGE_SPACING, 520.0);
    float redResponse = diffractionGrating(viewAngle, RIDGE_SPACING, 650.0);
    
    // Combine responses
    vec3 diffractionColor = vec3(
        max(0.0, redResponse),
        max(0.0, greenResponse),
        max(0.0, blueResponse)
    );
    
    // Morpho blue palette
    vec3 baseColor = cosinePalette(
        ridgePattern + viewAngle * 2.0,
        vec3(0.2, 0.3, 0.6),   // Base (blue bias)
        vec3(0.3, 0.4, 0.5),   // Amplitude
        vec3(0.8, 0.9, 1.0),   // Frequency
        vec3(0.0, 0.33, 0.67)  // Phase
    );
    
    // Apply diffraction enhancement
    vec3 color = baseColor + diffractionColor * diffractionStrength * 0.5;
    
    // Add subtle noise for scale texture
    float noise = fract(sin(dot(v_uv, vec2(12.9898, 78.233))) * 43758.5453);
    color *= 0.95 + noise * 0.1;
    
    // Boost intensity for that Morpho "glow"
    color = pow(color, vec3(0.7));
    
    gl_FragColor = vec4(color, 1.0);
}
