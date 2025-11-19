export interface TapeType {
  id: string;
  name: string;
  materials: string[];
  allowTexture: boolean;
  allowCustomText: boolean;
  textureColorRestriction?: 'black-only' | 'none';
  thickness: number;
  defaultTransmission: number;
}

export interface TapeConfig {
  tapeType: string;
  material: string;
  customText?: string;
}

export interface MaterialConfig {
  colorHex: string;
  transmission: number;
  roughness?: number;
  ior?: number;
  thickness?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  opacity?: number;
  sheen?: number;
  sheenRoughness?: number;
  sheenColor?: string;
}
