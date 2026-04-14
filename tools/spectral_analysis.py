"""
STRUCTURAL COLOR - Spectral Analysis Utilities
Generate wavelength data, interference patterns, and color conversions
"""

import numpy as np
import matplotlib.pyplot as plt
from typing import Tuple, List
import csv

class SpectralColor:
    """Convert between wavelengths and RGB colors"""
    
    @staticmethod
    def wavelength_to_rgb(wavelength: float, gamma: float = 0.8) -> Tuple[float, float, float]:
        """
        Convert wavelength (380-780nm) to RGB color
        Based on CIE color matching functions
        
        Args:
            wavelength: Wavelength in nanometers (380-780)
            gamma: Gamma correction factor
            
        Returns:
            (r, g, b) tuple with values 0-1
        """
        wavelength = float(wavelength)
        
        if wavelength < 380 or wavelength > 780:
            return (0.0, 0.0, 0.0)
        
        # Determine RGB components
        if 380 <= wavelength < 440:
            r = -(wavelength - 440) / (440 - 380)
            g = 0.0
            b = 1.0
        elif 440 <= wavelength < 490:
            r = 0.0
            g = (wavelength - 440) / (490 - 440)
            b = 1.0
        elif 490 <= wavelength < 510:
            r = 0.0
            g = 1.0
            b = -(wavelength - 510) / (510 - 490)
        elif 510 <= wavelength < 580:
            r = (wavelength - 510) / (580 - 510)
            g = 1.0
            b = 0.0
        elif 580 <= wavelength < 645:
            r = 1.0
            g = -(wavelength - 645) / (645 - 580)
            b = 0.0
        elif 645 <= wavelength <= 780:
            r = 1.0
            g = 0.0
            b = 0.0
        
        # Intensity falloff at edges
        if 380 <= wavelength < 420:
            factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380)
        elif 700 < wavelength <= 780:
            factor = 0.3 + 0.7 * (780 - wavelength) / (780 - 700)
        else:
            factor = 1.0
        
        # Apply gamma correction
        r = (r * factor) ** gamma if r > 0 else 0
        g = (g * factor) ** gamma if g > 0 else 0
        b = (b * factor) ** gamma if b > 0 else 0
        
        return (r, g, b)
    
    @staticmethod
    def generate_spectrum_gradient(n_samples: int = 100) -> np.ndarray:
        """Generate RGB gradient across visible spectrum"""
        wavelengths = np.linspace(380, 780, n_samples)
        colors = np.array([SpectralColor.wavelength_to_rgb(w) for w in wavelengths])
        return colors


class ThinFilmInterference:
    """Calculate thin-film interference colors"""
    
    def __init__(self, n_film: float = 1.33, n_substrate: float = 1.5):
        """
        Args:
            n_film: Refractive index of film (1.33 for soap)
            n_substrate: Refractive index of substrate
        """
        self.n_film = n_film
        self.n_substrate = n_substrate
    
    def calculate_interference(self, thickness: float, wavelength: float, 
                              angle: float = 0.0) -> float:
        """
        Calculate interference intensity for given parameters
        
        Args:
            thickness: Film thickness in nanometers
            wavelength: Light wavelength in nanometers
            angle: Incident angle in radians
            
        Returns:
            Interference intensity (0-1)
        """
        # Optical path difference
        cos_theta = np.cos(angle)
        path_diff = 2 * self.n_film * thickness * cos_theta
        
        # Phase shift
        phase = (2 * np.pi * path_diff) / wavelength
        
        # Reflectance (simplified)
        r1 = (1 - self.n_film) / (1 + self.n_film)
        r2 = (self.n_film - self.n_substrate) / (self.n_film + self.n_substrate)
        
        # Interference pattern
        intensity = (r1**2 + r2**2 + 2*r1*r2*np.cos(phase))
        intensity = np.clip(intensity, 0, 1)
        
        return intensity
    
    def get_color(self, thickness: float, angle: float = 0.0) -> Tuple[float, float, float]:
        """
        Get RGB color for given film thickness and angle
        
        Args:
            thickness: Film thickness in nanometers
            angle: Viewing angle in radians
            
        Returns:
            (r, g, b) tuple
        """
        color = np.zeros(3)
        wavelengths = np.linspace(380, 780, 50)
        
        for wavelength in wavelengths:
            intensity = self.calculate_interference(thickness, wavelength, angle)
            rgb = SpectralColor.wavelength_to_rgb(wavelength)
            color += np.array(rgb) * intensity
        
        # Normalize
        color = color / np.max(color) if np.max(color) > 0 else color
        
        return tuple(color)
    
    def plot_thickness_series(self, thicknesses: List[float], 
                             filename: str = 'thin_film_series.png'):
        """Plot colors for range of thicknesses"""
        fig, ax = plt.subplots(figsize=(12, 6))
        
        colors = [self.get_color(t) for t in thicknesses]
        
        for i, (thickness, color) in enumerate(zip(thicknesses, colors)):
            ax.add_patch(plt.Rectangle((i, 0), 1, 1, color=color))
            ax.text(i + 0.5, -0.2, f'{thickness:.0f}nm', 
                   ha='center', va='top', fontsize=8)
        
        ax.set_xlim(0, len(thicknesses))
        ax.set_ylim(-0.5, 1)
        ax.set_aspect('equal')
        ax.axis('off')
        ax.set_title('Thin-Film Interference Colors vs Thickness', 
                    fontsize=14, fontweight='bold', pad=20)
        
        plt.tight_layout()
        plt.savefig(filename, dpi=150, bbox_inches='tight')
        print(f"Saved {filename}")


class BraggReflector:
    """Calculate Bragg reflector spectral response"""
    
    def __init__(self, n_high: float = 1.5, n_low: float = 1.0, n_layers: int = 20):
        """
        Args:
            n_high: High refractive index material
            n_low: Low refractive index material
            n_layers: Number of layer pairs
        """
        self.n_high = n_high
        self.n_low = n_low
        self.n_layers = n_layers
    
    def bragg_wavelength(self, layer_thickness: float, angle: float = 0.0) -> float:
        """
        Calculate Bragg reflection peak wavelength
        
        Args:
            layer_thickness: Thickness of each layer (nm)
            angle: Incident angle (radians)
            
        Returns:
            Peak wavelength (nm)
        """
        n_eff = (self.n_high + self.n_low) / 2
        cos_theta = np.cos(angle)
        
        # Bragg condition: λ = 2nd cos(θ)
        wavelength = 2 * n_eff * layer_thickness * cos_theta
        
        return wavelength
    
    def reflectance_spectrum(self, layer_thickness: float, 
                            wavelengths: np.ndarray) -> np.ndarray:
        """
        Calculate reflectance spectrum for multilayer
        
        Args:
            layer_thickness: Thickness of each layer (nm)
            wavelengths: Array of wavelengths to evaluate (nm)
            
        Returns:
            Reflectance array (0-1)
        """
        lambda_bragg = self.bragg_wavelength(layer_thickness)
        bandwidth = 50.0  # nm (typical)
        
        # Gaussian-like reflectance peak
        detuning = (wavelengths - lambda_bragg) / bandwidth
        reflectance = np.exp(-detuning**2)
        
        # Enhancement from multiple layers
        reflectance *= np.tanh(self.n_layers / 10)
        
        return reflectance
    
    def plot_spectrum(self, layer_thickness: float, 
                     filename: str = 'bragg_spectrum.png'):
        """Plot reflectance spectrum"""
        wavelengths = np.linspace(350, 800, 200)
        reflectance = self.reflectance_spectrum(layer_thickness, wavelengths)
        
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))
        
        # Spectrum plot
        ax1.plot(wavelengths, reflectance, 'b-', linewidth=2)
        ax1.fill_between(wavelengths, reflectance, alpha=0.3)
        ax1.set_xlabel('Wavelength (nm)', fontsize=12)
        ax1.set_ylabel('Reflectance', fontsize=12)
        ax1.set_title(f'Bragg Reflector Spectrum ({self.n_layers} layer pairs)', 
                     fontsize=14, fontweight='bold')
        ax1.grid(True, alpha=0.3)
        ax1.set_xlim(350, 800)
        
        # Color bar
        colors = np.array([SpectralColor.wavelength_to_rgb(w) for w in wavelengths])
        for i in range(len(wavelengths)-1):
            ax2.add_patch(plt.Rectangle((wavelengths[i], 0), 
                                       wavelengths[i+1]-wavelengths[i], 
                                       reflectance[i], 
                                       color=colors[i]))
        
        ax2.set_xlabel('Wavelength (nm)', fontsize=12)
        ax2.set_ylabel('Reflected Color', fontsize=12)
        ax2.set_xlim(350, 800)
        ax2.set_ylim(0, 1)
        
        plt.tight_layout()
        plt.savefig(filename, dpi=150, bbox_inches='tight')
        print(f"Saved {filename}")


def generate_wavelength_rgb_csv(filename: str = 'wavelength_rgb.csv'):
    """Generate CSV mapping wavelengths to RGB values"""
    wavelengths = np.arange(380, 781, 5)
    
    with open(filename, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['wavelength_nm', 'r', 'g', 'b'])
        
        for w in wavelengths:
            r, g, b = SpectralColor.wavelength_to_rgb(w)
            writer.writerow([w, f'{r:.4f}', f'{g:.4f}', f'{b:.4f}'])
    
    print(f"Generated {filename} with {len(wavelengths)} entries")


def generate_interference_data(filename: str = 'interference_colors.csv'):
    """Generate interference colors for various film thicknesses"""
    film = ThinFilmInterference()
    thicknesses = np.arange(100, 1001, 50)
    
    with open(filename, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['thickness_nm', 'r', 'g', 'b', 'hex_color'])
        
        for t in thicknesses:
            r, g, b = film.get_color(t)
            hex_color = '#{:02x}{:02x}{:02x}'.format(
                int(r*255), int(g*255), int(b*255)
            )
            writer.writerow([t, f'{r:.4f}', f'{g:.4f}', f'{b:.4f}', hex_color])
    
    print(f"Generated {filename} with {len(thicknesses)} entries")


def example_usage():
    """Demonstrate usage of spectral utilities"""
    
    print("🌈 STRUCTURAL COLOR - Spectral Analysis\n")
    
    # 1. Generate wavelength-RGB mapping
    print("1. Generating wavelength→RGB mapping...")
    generate_wavelength_rgb_csv('data/wavelength_rgb.csv')
    
    # 2. Thin-film interference
    print("\n2. Calculating thin-film interference...")
    film = ThinFilmInterference()
    thicknesses = np.linspace(100, 1000, 20)
    film.plot_thickness_series(thicknesses, 'thin_film_colors.png')
    
    # 3. Bragg reflector
    print("\n3. Plotting Bragg reflector spectrum...")
    bragg = BraggReflector(n_high=1.5, n_low=1.0, n_layers=30)
    bragg.plot_spectrum(150.0, 'bragg_reflector.png')
    
    # 4. Generate interference data
    print("\n4. Generating interference color data...")
    generate_interference_data('interference_colors.csv')
    
    # 5. Spectrum visualization
    print("\n5. Creating spectrum visualization...")
    fig, ax = plt.subplots(figsize=(12, 2))
    colors = SpectralColor.generate_spectrum_gradient(200)
    wavelengths = np.linspace(380, 780, 200)
    
    for i in range(len(colors)-1):
        ax.add_patch(plt.Rectangle((wavelengths[i], 0), 
                                   wavelengths[i+1]-wavelengths[i], 
                                   1, color=colors[i]))
    
    ax.set_xlim(380, 780)
    ax.set_ylim(0, 1)
    ax.set_xlabel('Wavelength (nm)', fontsize=12, fontweight='bold')
    ax.set_title('Visible Spectrum (380-780nm)', fontsize=14, fontweight='bold', pad=15)
    ax.set_yticks([])
    
    # Add wavelength markers
    for w in [400, 450, 500, 550, 600, 650, 700, 750]:
        ax.axvline(w, color='black', linewidth=0.5, alpha=0.3, linestyle='--')
        ax.text(w, 1.1, f'{w}', ha='center', fontsize=8)
    
    plt.tight_layout()
    plt.savefig('visible_spectrum.png', dpi=150, bbox_inches='tight')
    print("Saved visible_spectrum.png")
    
    print("\n✅ All examples complete!")


if __name__ == "__main__":
    example_usage()
