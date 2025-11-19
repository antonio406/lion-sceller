import type { TapeType, MaterialConfig } from '../types';

// Colores base
export const DEFAULT_TAPE_COLOR_HEX = "#c49a6c"; // canela natural
export const DEFAULT_BG_COLOR_HEX = "#000000ff";

// Tipos de cinta y sus configuraciones
export const TAPE_TYPES: Record<string, TapeType> = {
  adhesive: {
    id: 'adhesive',
    name: 'Adhesiva',
    materials: ['transparente', 'blanca', 'canela'],
    allowTexture: true,
    allowCustomText: false,
    textureColorRestriction: 'none',
    thickness: 0.5,
    defaultTransmission: 0.45
  },
  gorilla: {
    id: 'gorilla',
    name: 'Gorila',
    materials: ['kraft'],
    allowTexture: true,
    allowCustomText: false,
    textureColorRestriction: 'none',
    thickness: 0.6,
    defaultTransmission: 0.1
  },
  eco: {
    id: 'eco',
    name: 'Ecológica Biodegradable',
    materials: ['kraft-eco'],
    allowTexture: true,
    allowCustomText: false,
    textureColorRestriction: 'black-only',
    thickness: 0.5,
    defaultTransmission: 0.1
  },
  filament: {
    id: 'filament',
    name: 'Filamento',
    materials: ['transparente'],
    allowTexture: true,
    allowCustomText: false,
    textureColorRestriction: 'black-only',
    thickness: 0.45,
    defaultTransmission: 0.8
  },
  printed: {
    id: 'printed',
    name: 'Fleje Impreso',
    materials: ['transparente-delgada'],
    allowTexture: false,
    allowCustomText: true,
    thickness: 0.3,
    defaultTransmission: 0.7
  }
};

// Configuraciones de materiales con propiedades realistas
export const MATERIAL_CONFIGS: Record<string, MaterialConfig> = {
  transparente: {
    colorHex: "#ffffff",
    transmission: 0.0,
    roughness: 0.08,
    ior: 1.45,
    thickness: 1.5,
    clearcoat: 0.95,
    clearcoatRoughness: 0.03,
    opacity: 0.4 // Hacer más transparente (40% opacidad)
  },
  blanca: {
    colorHex: "#f8f8f8",
    transmission: 0.05,
    roughness: 0.25,
    ior: 1.4,
    thickness: 0.8,
    clearcoat: 0.6,
    clearcoatRoughness: 0.15
  },
  canela: {
    colorHex: "#c49a6c",
    transmission: 0.25,
    roughness: 0.2,
    ior: 1.42,
    thickness: 1.0,
    clearcoat: 0.7,
    clearcoatRoughness: 0.1
  },
  kraft: {
    colorHex: "#b89968",
    transmission: 0.0,
    roughness: 0.85, // Más mate, textura de papel
    ior: 1.38,
    thickness: 0.5,
    clearcoat: 0.05, // Casi sin brillo (papel mate)
    clearcoatRoughness: 0.9
  },
  "kraft-eco": {
    colorHex: "#9d7f4e", // Color más oscuro, papel cartón reciclado
    transmission: 0.0,
    roughness: 0.95, // Extremadamente mate (papel cartón rugoso)
    ior: 1.35,
    thickness: 0.5,
    clearcoat: 0.0, // Sin brillo absoluto
    clearcoatRoughness: 1.0 // Totalmente difuso
  },
  "transparente-delgada": {
    colorHex: "#f5f5f5", // Blanco casi puro (polipropileno)
    transmission: 0.0, // Sin transparencia (fleje es opaco)
    roughness: 0.45, // Semi-mate (polipropileno tiene algo de brillo pero no mucho)
    ior: 1.49, // IOR del polipropileno
    thickness: 0.3, // Más delgado que otras cintas
    clearcoat: 0.35, // Algo de brillo pero no excesivo
    clearcoatRoughness: 0.25, // Semi-mate
    sheen: 0.2, // Ligero efecto satinado
    sheenRoughness: 0.6,
    sheenColor: "#ffffff"
  }
};

// Dimensiones de la cinta
export const TAPE_DIMENSIONS = {
  outerRadius: 1.2,
  innerRadius: 0.65,
  thickness: 0.6,
  // Ancho reducido para fleje impreso
  printedStrapWidth: 0.25
};

// Configuración de la textura
export const TEXTURE_CONFIG = {
  defaultPath: "/lion sceller.png",
  repeatX: 6,
  repeatY: 1,
  coreRepeatX: 12,
  coreRepeatY: 2
};
