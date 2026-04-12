#!/usr/bin/env python3
"""
Palette Generation Tool
Generates procedural color palettes for shaders
"""

import csv
import json
from pathlib import Path
import numpy as np


def cosine_palette(t, a, b, c, d):
    """
    Generate color from cosine palette
    
    palette(t) = a + b * cos(2π * (c*t + d))
    
    Args:
        t: Input value (typically 0-1)
        a: Base color (offset)
        b: Amplitude
        c: Frequency
        d: Phase
    
    Returns:
        RGB tuple
    """
    import math
    two_pi = 2 * math.pi
    
    r = a[0] + b[0] * math.cos(two_pi * (c[0] * t + d[0]))
    g = a[1] + b[1] * math.cos(two_pi * (c[1] * t + d[1]))
    b_val = a[2] + b[2] * math.cos(two_pi * (c[2] * t + d[2]))
    
    return (r, g, b_val)


def generate_palette_samples(name, a, b, c, d, num_samples=256):
    """Generate samples for a palette"""
    samples = []
    for i in range(num_samples):
        t = i / (num_samples - 1)
        color = cosine_palette(t, a, b, c, d)
        samples.append({
            't': t,
            'r': color[0],
            'g': color[1],
            'b': color[2]
        })
    return samples


def palette_to_hex(color):
    """Convert RGB tuple to hex string"""
    r = int(max(0, min(1, color[0])) * 255)
    g = int(max(0, min(1, color[1])) * 255)
    b = int(max(0, min(1, color[2])) * 255)
    return f"#{r:02x}{g:02x}{b:02x}"


def generate_glsl_palette(name, a, b, c, d):
    """Generate GLSL code for a palette"""
    return f"""// {name} Palette
vec3 get{name}Palette(float t) {{
    vec3 a = vec3({a[0]:.3f}, {a[1]:.3f}, {a[2]:.3f});
    vec3 b = vec3({b[0]:.3f}, {b[1]:.3f}, {b[2]:.3f});
    vec3 c = vec3({c[0]:.3f}, {c[1]:.3f}, {c[2]:.3f});
    vec3 d = vec3({d[0]:.3f}, {d[1]:.3f}, {d[2]:.3f});
    return a + b * cos(6.28318 * (c * t + d));
}}
"""


def main():
    """Generate palette files"""
    
    # Define palettes
    palettes = {
        'acid': {
            'a': (0.5, 0.5, 0.5),
            'b': (0.5, 0.5, 0.5),
            'c': (1.0, 1.0, 1.0),
            'd': (0.263, 0.416, 0.557),
            'description': 'Lisa Frank 80s punk glam'
        },
        'oil_slick': {
            'a': (0.5, 0.5, 0.5),
            'b': (0.5, 0.5, 0.5),
            'c': (2.0, 1.0, 0.0),
            'd': (0.5, 0.20, 0.25),
            'description': 'Dark iridescent spill'
        },
        'sunset': {
            'a': (0.5, 0.5, 0.5),
            'b': (0.5, 0.5, 0.5),
            'c': (1.0, 0.7, 0.4),
            'd': (0.8, 0.1, 0.1),
            'description': 'Warm orange-red gradient'
        },
        'ocean': {
            'a': (0.5, 0.5, 0.5),
            'b': (0.5, 0.5, 0.5),
            'c': (0.5, 0.8, 1.0),
            'd': (0.3, 0.5, 0.7),
            'description': 'Deep blue-cyan depths'
        },
        'forest': {
            'a': (0.5, 0.5, 0.5),
            'b': (0.5, 0.5, 0.5),
            'c': (0.8, 1.0, 0.3),
            'd': (0.2, 0.6, 0.1),
            'description': 'Green nature tones'
        },
        'nebula': {
            'a': (0.5, 0.5, 0.5),
            'b': (0.5, 0.5, 0.5),
            'c': (1.0, 0.5, 1.0),
            'd': (0.6, 0.2, 0.8),
            'description': 'Purple-pink cosmic'
        },
        'gold': {
            'a': (0.5, 0.5, 0.5),
            'b': (0.5, 0.5, 0.5),
            'c': (1.0, 0.8, 0.0),
            'd': (0.1, 0.2, 0.0),
            'description': 'Metallic gold tones'
        },
        'rainbow': {
            'a': (0.5, 0.5, 0.5),
            'b': (0.5, 0.5, 0.5),
            'c': (1.0, 1.0, 1.0),
            'd': (0.0, 0.33, 0.67),
            'description': 'Full spectrum'
        }
    }
    
    # Create output directories
    output_dir = Path(__file__).parent.parent / 'output'
    output_dir.mkdir(exist_ok=True)
    
    # Generate GLSL file
    glsl_code = "// Auto-generated palette functions\n\n"
    
    for name, params in palettes.items():
        glsl_code += generate_glsl_palette(
            name.capitalize(),
            params['a'],
            params['b'],
            params['c'],
            params['d']
        )
        glsl_code += "\n"
    
    with open(output_dir / 'palettes.glsl', 'w') as f:
        f.write(glsl_code)
    
    print(f"Generated GLSL palettes: {output_dir / 'palettes.glsl'}")
    
    # Generate JSON file
    palette_data = {}
    for name, params in palettes.items():
        samples = generate_palette_samples(
            name,
            params['a'],
            params['b'],
            params['c'],
            params['d']
        )
        
        # Get key colors (start, middle, end)
        key_colors = [
            palette_to_hex(cosine_palette(0, params['a'], params['b'], params['c'], params['d'])),
            palette_to_hex(cosine_palette(0.5, params['a'], params['b'], params['c'], params['d'])),
            palette_to_hex(cosine_palette(1, params['a'], params['b'], params['c'], params['d']))
        ]
        
        palette_data[name] = {
            'description': params['description'],
            'parameters': {
                'a': params['a'],
                'b': params['b'],
                'c': params['c'],
                'd': params['d']
            },
            'key_colors': key_colors,
            'glsl_function': f'get{name.capitalize()}Palette'
        }
    
    with open(output_dir / 'palettes.json', 'w') as f:
        json.dump(palette_data, f, indent=2)
    
    print(f"Generated JSON palettes: {output_dir / 'palettes.json'}")
    
    # Print summary
    print("\nGenerated Palettes:")
    print("-" * 50)
    for name, data in palette_data.items():
        print(f"{name:15} | {data['description']}")
        print(f"                | Colors: {' '.join(data['key_colors'])}")


if __name__ == '__main__':
    main()
