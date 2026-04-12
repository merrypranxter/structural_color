# Contributing to Structural Color Engine

Thank you for your interest in contributing! This document provides guidelines for participating in this project.

## 🎯 Ways to Contribute

### 1. Add New Shader Effects
- Implement new optical phenomena
- Optimize existing shader code
- Add comments explaining the physics

### 2. Expand Documentation
- Write tutorials on specific effects
- Add mathematical derivations
- Create visual diagrams

### 3. Data Contributions
- Add new CSV datasets
- Verify refractive index values
- Contribute biological measurements

### 4. Bug Fixes
- Report shader compilation errors
- Fix mathematical inaccuracies
- Improve cross-browser compatibility

## 📝 Submission Guidelines

### For Shaders
```glsl
// File: shaders/your_effect.frag
// Author: Your Name
// Description: Brief explanation of the optical phenomenon
// Based on: [Paper/Book reference if applicable]

uniform float u_time;
varying vec2 v_uv;

// Your implementation here
```

### For Documentation
- Use clear, accessible language
- Include mathematical formulas in LaTeX
- Add diagrams where helpful
- Cite sources

### For Data Files
- Include column headers
- Add units in comments
- Cite data sources
- Use consistent formatting

## 🔬 Code Standards

### GLSL Style Guide
- Use meaningful variable names
- Comment complex mathematical operations
- Group related uniforms together
- Use `#include` for reusable functions

### Example:
```glsl
// Good: Clear variable names
float viewAngle = dot(normalize(normal), normalize(viewDirection));
float opticalPathDifference = 2.0 * refractiveIndex * filmThickness * cosTheta;

// Avoid: Cryptic abbreviations
float va = dot(n, vd);
float opd = 2.0 * n * t * ct;
```

## 🧪 Testing

Before submitting:
1. Test shaders on multiple browsers
2. Verify mathematical accuracy
3. Check performance on lower-end GPUs
4. Ensure mobile compatibility

## 📬 Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-effect`)
3. Commit your changes (`git commit -am 'Add amazing effect'`)
4. Push to the branch (`git push origin feature/amazing-effect`)
5. Open a Pull Request

## 🏷️ Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature request
- `documentation` - Docs improvement
- `shader` - Shader-related
- `physics` - Physics accuracy
- `good first issue` - Beginner-friendly

## 💬 Questions?

Open an issue with the `question` label or reach out to maintainers.

## 🙏 Recognition

Contributors will be acknowledged in the README and release notes.

---

By contributing, you agree that your contributions will be licensed under the MIT License.
