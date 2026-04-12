// Vertex Shader Template
// Standard vertex shader for structural color effects
// Author: Structural Color Engine

// Attributes (from geometry)
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

// Uniforms (from JavaScript)
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;
uniform float u_time;

// Varyings (passed to fragment shader)
varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_viewPosition;
varying vec3 v_position;
varying vec3 v_worldPosition;

void main() {
    // Pass UV coordinates
    v_uv = uv;
    
    // Transform normal to view space
    v_normal = normalize(normalMatrix * normal);
    
    // Calculate world position
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    v_worldPosition = worldPosition.xyz;
    
    // Calculate view direction
    v_viewPosition = normalize(cameraPosition - worldPosition.xyz);
    
    // Pass local position (useful for 3D effects)
    v_position = position;
    
    // Optional: Add vertex displacement for animation
    vec3 displacedPosition = position;
    
    // Example: Wave displacement
    // displacedPosition += normal * sin(position.x * 5.0 + u_time) * 0.1;
    
    // Final position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
}
