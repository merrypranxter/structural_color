/**
 * Shader Library
 * Central registry of all available shaders
 */

// Import all shaders
import vertexTemplate from './shaders/vertex_template.vert';
import thinFilmAcid from './shaders/thin_film_acid.frag';
import morphoButterfly from './shaders/morpho_butterfly.frag';
import scarabBeetle from './shaders/scarab_beetle.frag';
import opalPhotonic from './shaders/opal_photonic.frag';
import birefringence from './shaders/birefringence.frag';
import newtonsRings from './shaders/newtons_rings.frag';
import chromaticDispersion from './shaders/chromatic_dispersion.frag';
import rayleighScattering from './shaders/rayleigh_scattering.frag';
import quasicrystal from './shaders/quasicrystal.frag';
import strangeAttractor from './shaders/strange_attractor.frag';

/**
 * Shader registry
 */
export const SHADERS = {
  thinFilmAcid: {
    name: 'Thin-Film Acid',
    description: 'Iridescent soap bubble and oil slick effect',
    category: 'thin-film',
    vertex: vertexTemplate,
    fragment: thinFilmAcid,
    uniforms: {
      u_time: { value: 0 },
      u_resolution: { value: [1, 1] }
    }
  },
  
  morphoButterfly: {
    name: 'Morpho Butterfly',
    description: 'Diffraction grating simulation of Morpho butterfly wings',
    category: 'biological',
    vertex: vertexTemplate,
    fragment: morphoButterfly,
    uniforms: {
      u_time: { value: 0 },
      u_resolution: { value: [1, 1] }
    }
  },
  
  scarabBeetle: {
    name: 'Scarab Beetle',
    description: 'Multi-layer Bragg reflection from beetle shells',
    category: 'biological',
    vertex: vertexTemplate,
    fragment: scarabBeetle,
    uniforms: {
      u_time: { value: 0 },
      u_resolution: { value: [1, 1] }
    }
  },
  
  opalPhotonic: {
    name: 'Opal Photonic Crystal',
    description: '3D photonic crystal interference',
    category: 'photonic-crystal',
    vertex: vertexTemplate,
    fragment: opalPhotonic,
    uniforms: {
      u_time: { value: 0 },
      u_resolution: { value: [1, 1] },
      u_scale: { value: 1 }
    }
  },
  
  birefringence: {
    name: 'Birefringence',
    description: 'Photoelastic stress field visualization',
    category: 'optics',
    vertex: vertexTemplate,
    fragment: birefringence,
    uniforms: {
      u_time: { value: 0 },
      u_resolution: { value: [1, 1] },
      u_stress_scale: { value: 1 }
    }
  },
  
  newtonsRings: {
    name: "Newton's Rings",
    description: 'Contact interference between curved and flat surfaces',
    category: 'thin-film',
    vertex: vertexTemplate,
    fragment: newtonsRings,
    uniforms: {
      u_time: { value: 0 },
      u_resolution: { value: [1, 1] },
      u_curvature: { value: 1 },
      u_contact_point: { value: [0.5, 0.5] }
    }
  },
  
  chromaticDispersion: {
    name: 'Chromatic Dispersion',
    description: 'Wavelength-dependent refraction (prism effect)',
    category: 'optics',
    vertex: vertexTemplate,
    fragment: chromaticDispersion,
    uniforms: {
      u_time: { value: 0 },
      u_resolution: { value: [1, 1] },
      u_ior: { value: 1.5 },
      u_dispersion: { value: 0.05 }
    }
  },
  
  rayleighScattering: {
    name: 'Rayleigh Scattering',
    description: 'Opalescence and atmospheric scattering',
    category: 'scattering',
    vertex: vertexTemplate,
    fragment: rayleighScattering,
    uniforms: {
      u_time: { value: 0 },
      u_resolution: { value: [1, 1] },
      u_density: { value: 1 },
      u_lightDir: { value: [1, 1, 1] }
    }
  },
  
  quasicrystal: {
    name: 'Quasicrystal',
    description: 'Aperiodic 5-fold symmetric structures',
    category: 'mathematical',
    vertex: vertexTemplate,
    fragment: quasicrystal,
    uniforms: {
      u_time: { value: 0 },
      u_resolution: { value: [1, 1] },
      u_symmetry: { value: 5 },
      u_scale: { value: 1 }
    }
  },
  
  strangeAttractor: {
    name: 'Strange Attractor',
    description: 'Clifford/Peter de Jong chaotic attractors',
    category: 'mathematical',
    vertex: vertexTemplate,
    fragment: strangeAttractor,
    uniforms: {
      u_time: { value: 0 },
      u_resolution: { value: [1, 1] },
      u_paramA: { value: -1.4 },
      u_paramB: { value: 1.6 },
      u_paramC: { value: 1.0 },
      u_paramD: { value: 0.7 }
    }
  }
};

/**
 * Get shader by name
 * @param {string} name
 * @returns {Object|null}
 */
export function getShader(name) {
  return SHADERS[name] || null;
}

/**
 * Get all shaders in a category
 * @param {string} category
 * @returns {Object[]}
 */
export function getShadersByCategory(category) {
  return Object.entries(SHADERS)
    .filter(([_, shader]) => shader.category === category)
    .map(([name, shader]) => ({ name, ...shader }));
}

/**
 * Get all categories
 * @returns {string[]}
 */
export function getCategories() {
  const categories = new Set();
  Object.values(SHADERS).forEach(shader => {
    categories.add(shader.category);
  });
  return Array.from(categories);
}

/**
 * Get all shader names
 * @returns {string[]}
 */
export function getShaderNames() {
  return Object.keys(SHADERS);
}

export default SHADERS;
