// Scarab Beetle Bragg Reflector Shader
// Simulates metallic color-shifting beetle shells
// Author: Structural Color Engine
// Based on: Multi-layer Bragg stack physics

uniform float u_time;
uniform vec2 u_resolution;

varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_viewPosition;

const float PI = 3.28318530718;
const int NUM_LAYERS = 10;

// Wavelength to RGB conversion
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

// Multi-layer Bragg stack calculation
vec3 braggStack(vec3 N, vec3 V, float baseThickness, float n1, float n2) {
    float cosTheta = max(0.0, dot(N, V));
    vec3 totalReflectance = vec3(0.0);
    
    // Accumulate reflections from multiple layers
    for (int i = 0; i < NUM_LAYERS; i++) {
        float layerIndex = float(i);
        
        // Alternate between high and low refractive index
        float n = mod(layerIndex, 2.0) < 1.0 ? n1 : n2;
        
        // Each layer slightly deeper
        float layerThickness = baseThickness + layerIndex * 0.02;
        
        // Optical path difference
        float pathDiff = 2.0 * n * layerThickness * cosTheta;
        
        // RGB phase offsets
        vec3 phase = vec3(0.0, 0.33, 0.67);
        
        // Interference for this layer
        vec3 layerColor = 0.5 + 0.5 * cos(PI * (pathDiff * 15.0 + phase));
        
        // Accumulate with decay for deeper layers
        float attenuation = exp(-layerIndex * 0.1);
        totalReflectance += layerColor * attenuation;
    }
    
    // Normalize
    return totalReflectance / float(NUM_LAYERS);
}

void main() {
    vec3 N = normalize(v_normal);
    vec3 V = normalize(v_viewPosition);
    
    // View angle determines reflected wavelength
    float viewAngle = max(0.0, dot(N, V));
    
    // Base thickness varies across the shell
    float baseThickness = 0.15 + sin(v_uv.x * 5.0) * 0.02;
    
    // Chitin (~1.56) and air (~1.0) layers
    float nChitin = 1.56;
    float nAir = 1.0;
    
    // Calculate Bragg reflection
    vec3 braggColor = braggStack(N, V, baseThickness, nChitin, nAir);
    
    // Wavelength-based color for gold-green shift
    float wavelength = 650.0 - viewAngle * 200.0;
    vec3 wavelengthColor = wavelengthToRGB(wavelength);
    
    // Combine approaches
    vec3 color = mix(braggColor, wavelengthColor, 0.5);
    
    // Metallic boost
    color = pow(color, vec3(1.5));
    
    // Add specular highlight
    float specular = pow(viewAngle, 20.0);
    color += vec3(specular * 0.5);
    
    // Darken edges for depth
    float rim = 1.0 - viewAngle;
    color *= 1.0 - rim * 0.3;
    
    gl_FragColor = vec4(color, 1.0);
}
