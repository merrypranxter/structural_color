#!/usr/bin/env python3
"""
Wavelength Analysis Tool
Analyzes and visualizes wavelength data for structural color
"""

import csv
import sys
from pathlib import Path
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))


def load_wavelength_data(filepath):
    """Load wavelength RGB data from CSV"""
    data = []
    with open(filepath, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            data.append({
                'wavelength': float(row['wavelength_nm']),
                'r': float(row['r']),
                'g': float(row['g']),
                'b': float(row['b']),
                'intensity': float(row['intensity']),
                'color_name': row['color_name']
            })
    return data


def plot_wavelength_spectrum(data, output_path=None):
    """Plot wavelength spectrum with color bar"""
    wavelengths = [d['wavelength'] for d in data]
    r = [d['r'] for d in data]
    g = [d['g'] for d in data]
    b = [d['b'] for d in data]
    
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
    
    # Plot RGB components
    ax1.plot(wavelengths, r, 'r-', label='Red', linewidth=2)
    ax1.plot(wavelengths, g, 'g-', label='Green', linewidth=2)
    ax1.plot(wavelengths, b, 'b-', label='Blue', linewidth=2)
    ax1.set_xlabel('Wavelength (nm)')
    ax1.set_ylabel('Intensity')
    ax1.set_title('Wavelength to RGB Conversion')
    ax1.legend()
    ax1.grid(True, alpha=0.3)
    ax1.set_xlim(380, 780)
    
    # Create color bar
    ax2.set_xlim(380, 780)
    ax2.set_ylim(0, 1)
    
    for d in data:
        color = (d['r'], d['g'], d['b'])
        rect = Rectangle((d['wavelength'] - 2.5, 0), 5, 1, 
                         facecolor=color, edgecolor='none')
        ax2.add_patch(rect)
    
    ax2.set_xlabel('Wavelength (nm)')
    ax2.set_title('Visible Spectrum')
    ax2.set_yticks([])
    
    # Add labels for spectral regions
    regions = [
        (380, 450, 'Violet'),
        (450, 495, 'Blue'),
        (495, 570, 'Green'),
        (570, 590, 'Yellow'),
        (590, 620, 'Orange'),
        (620, 780, 'Red')
    ]
    
    for start, end, name in regions:
        ax2.text((start + end) / 2, -0.15, name, 
                ha='center', fontsize=10)
    
    plt.tight_layout()
    
    if output_path:
        plt.savefig(output_path, dpi=150, bbox_inches='tight')
        print(f"Saved plot to {output_path}")
    else:
        plt.show()
    
    plt.close()


def calculate_color_temperature(wavelength, intensity):
    """Estimate color temperature from peak wavelength"""
    # Wien's displacement law approximation
    # Peak wavelength for blackbody: λ_max = b/T where b ≈ 2.898×10^-3 m·K
    b = 2.898e6  # nm·K
    if wavelength > 0:
        temperature = b / wavelength
        return temperature
    return 0


def analyze_interference_colors(thickness_nm, n=1.33, orders=[0, 1, 2]):
    """Calculate interference colors for different orders"""
    results = []
    
    for m in orders:
        # Constructive interference: 2nd = (m + 1/2)λ
        wavelength = 2 * n * thickness_nm / (m + 0.5)
        
        # Clamp to visible range
        if 380 <= wavelength <= 780:
            results.append({
                'order': m,
                'wavelength': wavelength,
                'color': wavelength_to_color_name(wavelength)
            })
    
    return results


def wavelength_to_color_name(wavelength):
    """Convert wavelength to approximate color name"""
    if 380 <= wavelength < 450:
        return 'Violet'
    elif 450 <= wavelength < 495:
        return 'Blue'
    elif 495 <= wavelength < 570:
        return 'Green'
    elif 570 <= wavelength < 590:
        return 'Yellow'
    elif 590 <= wavelength < 620:
        return 'Orange'
    elif 620 <= wavelength <= 780:
        return 'Red'
    return 'Invisible'


def main():
    """Main analysis function"""
    data_dir = Path(__file__).parent.parent / 'data'
    
    # Load wavelength data
    wavelength_file = data_dir / 'wavelength_rgb.csv'
    if not wavelength_file.exists():
        print(f"Error: {wavelength_file} not found")
        return
    
    data = load_wavelength_data(wavelength_file)
    
    # Create output directory
    output_dir = Path(__file__).parent.parent / 'output'
    output_dir.mkdir(exist_ok=True)
    
    # Generate plots
    plot_wavelength_spectrum(data, output_dir / 'wavelength_spectrum.png')
    
    # Analyze interference for common thicknesses
    print("\nInterference Color Analysis:")
    print("-" * 50)
    
    thicknesses = [100, 200, 300, 400, 500]
    for thickness in thicknesses:
        print(f"\nFilm thickness: {thickness} nm")
        colors = analyze_interference_colors(thickness)
        for c in colors:
            print(f"  Order {c['order']}: {c['wavelength']:.0f} nm ({c['color']})")
    
    print("\nAnalysis complete!")


if __name__ == '__main__':
    main()
