# Changelog

All notable changes to the Structural Color Engine project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New topological edge state shader (Quantum Hall Effect)
- BZ reaction-diffusion implementation
- Pentagonal anholonomy visualization
- Viscous fingering simulation
- 4D Hodge filtration slices

## [1.2.0] - 2024-03-15

### Added
- Photonic crystal (opal matrix) shader
- Michel-Lévy interference chart
- Voronoi spectral caustics
- Pleochroic crystal axes
- Multi-layer Bragg stack simulation

### Changed
- Improved fbmNoise performance by 40%
- Updated Three.js to r160

### Fixed
- Fixed chromatic aberration in VHS post-process
- Corrected wavelength-to-RGB conversion for violet range

## [1.1.0] - 2024-02-01

### Added
- Holographic diffraction grating shader
- Birefringence / photoelastic stress field
- Wavelength-to-RGB Bragg reflector
- Phase-wrapped thin film (Fabry-Pérot)
- Chromatic dispersion implementation
- Rayleigh scattering (opalescence)
- Moiré spectral interference
- Cholesteric liquid crystals
- Newton's rings simulation

### Changed
- Restructured shader directory organization
- Enhanced color palette generation

## [1.0.0] - 2024-01-10

### Added
- Initial release with core thin-film interference
- Basic WebGL/Three.js setup
- VHS post-processing effects
- Gyroid mesh geometry
- Acid color palette system
- FBM noise implementation

### Features
- 5 core shader effects
- Post-processing pipeline
- Interactive camera controls
- Real-time parameter adjustment

## [0.5.0] - 2023-12-01

### Added
- Project initialization
- Basic repository structure
- Development environment setup
- Initial documentation

---

## Legend

- **Added** - New features
- **Changed** - Changes to existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Security improvements
