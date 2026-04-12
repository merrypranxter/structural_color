#!/usr/bin/env python3
"""
Interference Calculator
Calculates thin-film interference patterns
"""

import csv
import json
from pathlib import Path
import numpy as np


def calculate_thin_film_interference(wavelength, thickness, n_film, n_substrate=1.5, angle=0):
    """
    Calculate thin-film interference reflectance
    
    Args:
        wavelength: Light wavelength in nm
        thickness: Film thickness in nm
        n_film: Refractive index of film
        n_substrate: Refractive index of substrate
        angle: Incident angle in degrees
    
    Returns:
        Reflectance (0-1)
    """
    import math
    
    # Convert angle to radians
    theta = math.radians(angle)
    
    # Calculate angle in film using Snell's law
    sin_theta_film = math.sin(theta) / n_film
    if abs(sin_theta_film) > 1:
        return 0  # Total internal reflection
    
    theta_film = math.asin(sin_theta_film)
    
    # Optical path difference
    opd = 2 * n_film * thickness * math.cos(theta_film)
    
    # Phase difference
    delta = (2 * math.pi / wavelength) * opd
    
    # Fresnel reflection coefficients (normal incidence approximation)
    r01 = (1 - n_film) / (1 + n_film)  # Air-film
    r12 = (n_film - n_substrate) / (n_film + n_substrate)  # Film-substrate
    
    # Include phase shift at top surface
    if n_film > 1:
        r01 = -abs(r01)  # π phase shift
    
    # Interference
    R = r01**2 + r12**2 + 2 * r01 * r12 * math.cos(delta)
    
    return max(0, min(1, R))


def calculate_reflection_spectrum(thickness, n_film, wavelengths=None):
    """
    Calculate reflection spectrum for a film
    
    Args:
        thickness: Film thickness in nm
        n_film: Refractive index of film
        wavelengths: Array of wavelengths to calculate (default: 380-780nm)
    
    Returns:
        List of (wavelength, reflectance) tuples
    """
    if wavelengths is None:
        wavelengths = range(380, 781, 10)
    
    spectrum = []
    for wl in wavelengths:
        R = calculate_thin_film_interference(wl, thickness, n_film)
        spectrum.append((wl, R))
    
    return spectrum


def find_interference_maxima(thickness, n_film, order=0):
    """
    Find wavelengths of constructive interference
    
    Args:
        thickness: Film thickness in nm
        n_film: Refractive index of film
        order: Interference order (0, 1, 2, ...)
    
    Returns:
        Wavelength of maximum reflectance in nm
    """
    # Constructive interference condition
    # 2nd = (m + 1/2)λ for normal incidence with phase reversal
    wavelength = 2 * n_film * thickness / (order + 0.5)
    return wavelength


def calculate_newtons_rings(radius, curvature, wavelength):
    """
    Calculate interference in Newton's rings
    
    Args:
        radius: Distance from center in mm
        curvature: Lens curvature in mm
        wavelength: Light wavelength in nm
    
    Returns:
        Phase (0-2π) and intensity (0-1)
    """
    import math
    
    # Gap thickness at radius r
    # For spherical surface: t = r² / (2R)
    t_nm = (radius ** 2) / (2 * curvature) * 1e6  # Convert to nm
    
    # Phase difference
    delta = (4 * math.pi * t_nm) / wavelength
    
    # Intensity (with phase reversal)
    intensity = 0.5 * (1 + math.cos(delta + math.pi))
    
    return delta, intensity


def generate_interference_csv(output_path, thicknesses, n_film=1.33):
    """Generate CSV file with interference data"""
    
    wavelengths = list(range(380, 781, 10))
    
    with open(output_path, 'w', newline='') as f:
        writer = csv.writer(f)
        
        # Header
        header = ['thickness_nm'] + [f'{wl}nm' for wl in wavelengths]
        writer.writerow(header)
        
        # Data rows
        for thickness in thicknesses:
            row = [thickness]
            for wl in wavelengths:
                R = calculate_thin_film_interference(wl, thickness, n_film)
                row.append(f'{R:.4f}')
            writer.writerow(row)
    
    print(f"Generated interference data: {output_path}")


def main():
    """Main calculation function"""
    
    output_dir = Path(__file__).parent.parent / 'output'
    output_dir.mkdir(exist_ok=True)
    
    # Calculate for soap bubbles (n ≈ 1.33)
    print("Soap Bubble Interference Analysis")
    print("-" * 50)
    
    thicknesses = [100, 200, 300, 400, 500]
    
    for thickness in thicknesses:
        print(f"\nThickness: {thickness} nm")
        
        # Find maxima
        for order in range(3):
            wl_max = find_interference_maxima(thickness, 1.33, order)
            if 380 <= wl_max <= 780:
                print(f"  Order {order}: λ_max = {wl_max:.0f} nm")
    
    # Generate CSV
    generate_interference_csv(
        output_dir / 'interference_data.csv',
        list(range(50, 1001, 50)),
        n_film=1.33
    )
    
    # Newton's rings example
    print("\n\nNewton's Rings Example")
    print("-" * 50)
    
    curvature = 1000  # mm
    wavelength = 550  # nm (green)
    
    radii = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
    
    for r in radii:
        delta, intensity = calculate_newtons_rings(r, curvature, wavelength)
        ring_order = int(delta / (2 * 3.14159))
        print(f"Radius {r} mm: Order {ring_order}, Intensity {intensity:.3f}")
    
    print("\nCalculation complete!")


if __name__ == '__main__':
    main()
