// Birefringence / Photoelastic Stress Field Shader
// Simulates polarized light through stressed materials
// Author: Structural Color Engine
// Based on: Michel-Lévy interference chart

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_stress_scale;

varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_viewPosition;

const float PI = 3.14159265359;

// Michel-Lévy color approximation
vec3 michelLevyColor(float retardation) {
    // Retardation is thickness * birefringence
    float r = retardation * 3.0;
    
    vec3 color;
    color.r = sin(r * PI) * 0.5 + 0.5;
    color.g = sin((r + 0.33) * PI) * 0.5 + 0.5;
    color.b = sin((r + 0.67) * PI) * 0.5 + 0.5;
    
    // Aggressive contrast for neon punch
    return smoothstep(0.1, 0.9, color);
}

// Generate stress field
float stressField(vec2 uv, float time) {
    // Multiple overlapping stress sources
    float stress = 0.0;
    
    // Central compression
    vec2 center = vec2(0.5);
    float dist = length(uv - center);
    stress += sin(dist * 20.0 - time) * 0.5;
    
    // Shear bands
    stress += sin((uv.x + uv.y) * 15.0 + time * 0.5) * 0.3;
    stress += sin((uv.x - uv.y) * 12.0 - time * 0.3) * 0.3;
    
    // Point stress concentrations
    for (int i = 0; i < 3; i++) {
        float fi = float(i);
        vec2 point = vec2(
            0.3 + 0.4 * sin(time * 0.3 + fi * 2.0),
            0.3 + 0.4 * cos(time * 0.4 + fi * 2.0)
        );
        float pointDist = length(uv - point);
        stress += exp(-pointDist * 5.0) * sin(pointDist * 30.0 - time);
    }
    
    return stress * u_stress_scale;
}

// Fractional Brownian Motion for organic variation
float fbm(vec2 p) {
    float f = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
        f += amp * sin(p.x * pow(2.0, float(i)) + p.y * pow(2.0, float(i)));
        amp *= 0.5;
    }
    return f;
}

void main() {
    vec3 N = normalize(v_normal);
    vec3 V = normalize(v_viewPosition);
    
    // Calculate stress field
    float stress = stressField(v_uv, u_time);
    
    // Add organic variation
    stress += fbm(v_uv * 5.0 + u_time * 0.1) * 0.3;
    
    // Convert stress to retardation (optical path difference)
    float retardation = abs(stress) * 2.0;
    
    // Get Michel-Lévy color
    vec3 color = michelLevyColor(retardation);
    
    // Add isochromatic lines (contours of equal retardation)
    float contour = fract(retardation * 2.0);
    float line = smoothstep(0.0, 0.05, contour) * smoothstep(0.1, 0.05, contour);
    color = mix(color, vec3(0.0), line * 0.3);
    
    // Add isoclinic lines (direction of principal stress)
    float angle = atan(stressField(v_uv + vec2(0.01, 0.0), u_time) - stress,
                       stressField(v_uv + vec2(0.0, 0.01), u_time) - stress);
    float isoclinic = smoothstep(0.95, 1.0, sin(angle * 4.0));
    color = mix(color, vec3(0.1), isoclinic * 0.2);
    
    // View angle affects intensity
    float viewAngle = max(0.0, dot(N, V));
    color *= 0.3 + 0.7 * viewAngle;
    
    // Boost saturation
    color = pow(color, vec3(0.8));
    
    gl_FragColor = vec4(color, 1.0);
}
