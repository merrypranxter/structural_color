// Newton's Rings Interference Shader
// Simulates interference between curved and flat surfaces
// Author: Structural Color Engine
// Based on: Contact interference physics

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_curvature;
uniform vec2 u_contact_point;

varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_viewPosition;

const float PI = 3.14159265359;

// Wavelength to RGB
vec3 wavelengthToRGB(float W) {
    vec3 c = vec3(0.0);
    float intensity = 1.0;
    
    if (W >= 380.0 && W < 440.0) {
        c = vec3(-(W - 440.0) / (440.0 - 380.0), 0.0, 1.0);
        intensity = 0.3 + 0.7 * (W - 380.0) / (420.0 - 380.0);
    } else if (W >= 440.0 && W < 490.0) {
        c = vec3(0.0, (W - 440.0) / (490.0 - 440.0), 1.0);
    } else if (W >= 490.0 && W < 510.0) {
        c = vec3(0.0, 1.0, -(W - 510.0) / (510.0 - 490.0));
    } else if (W >= 510.0 && W < 580.0) {
        c = vec3((W - 510.0) / (580.0 - 510.0), 1.0, 0.0);
    } else if (W >= 580.0 && W < 645.0) {
        c = vec3(1.0, -(W - 645.0) / (645.0 - 580.0), 0.0);
    } else if (W >= 645.0 && W <= 780.0) {
        c = vec3(1.0, 0.0, 0.0);
        intensity = 0.3 + 0.7 * (780.0 - W) / (780.0 - 700.0);
    }
    
    return c * intensity;
}

void main() {
    vec3 N = normalize(v_normal);
    vec3 V = normalize(v_viewPosition);
    
    // Vector from contact point
    vec2 delta = v_uv - u_contact_point;
    
    // Distance from contact point
    float r = length(delta);
    
    // Gap thickness increases with square of distance
    // This is the key physics of Newton's rings
    float gapThickness = r * r * u_curvature * 50.0;
    
    // Animate contact point slightly
    gapThickness += sin(u_time * 0.5 + r * 10.0) * 0.02;
    
    // Interference condition for reflected light
    // 2t = (m + 1/2)λ for bright rings (with phase reversal)
    // We'll calculate for multiple wavelengths
    
    vec3 color = vec3(0.0);
    
    // Sample multiple wavelengths for full color
    const int numWavelengths = 20;
    for (int i = 0; i < numWavelengths; i++) {
        float wavelength = 380.0 + float(i) * (780.0 - 380.0) / float(numWavelengths);
        
        // Interference condition
        float m = 2.0 * gapThickness / (wavelength / 1000.0) - 0.5;
        float interference = cos(m * PI);
        
        // Add to color
        color += wavelengthToRGB(wavelength) * (0.5 + 0.5 * interference);
    }
    
    color /= float(numWavelengths);
    
    // Dark center spot (physical contact, zero gap)
    float darkCenter = smoothstep(0.0, 0.05, r);
    color *= darkCenter;
    
    // Add central dark spot explicitly
    if (r < 0.02) {
        color *= r / 0.02;
    }
    
    // Rings get closer together as r increases (quadratic dependence)
    // This is visible in the increasing ring density
    
    // View angle effect
    float viewAngle = max(0.0, dot(N, V));
    color *= 0.5 + 0.5 * viewAngle;
    
    // Contrast enhancement
    color = pow(color, vec3(0.9));
    
    gl_FragColor = vec4(color, 1.0);
}
