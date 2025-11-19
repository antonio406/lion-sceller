import { useCallback, useRef } from 'react';
import * as THREE from 'three';
import { MATERIAL_CONFIGS } from '../constants';
import { createTintedTexture, overlayImageOnTexture, overlayImageOnFilament } from '../utils/textureUtils';
import { generateKraftTexture, generateEcoKraftTexture, generateFilamentTexture, generatePrintedTextTexture, generateStrappingBaseTexture } from '../utils/proceduralTextures';

export const useTapeControls = (
  tapeMaterialRef: React.MutableRefObject<THREE.MeshPhysicalMaterial | null>,
  sceneRef: React.MutableRefObject<THREE.Scene | null>,
  tapeTextureRef: React.MutableRefObject<THREE.Texture | null>,
  tapeType: string = 'adhesive'
) => {
  // Almacenar la textura original sin modificar
  const originalTextureRef = useRef<THREE.Texture | null>(null);
  // Almacenar las texturas procedurales generadas para no recrearlas cada vez
  const kraftTextureRef = useRef<THREE.Texture | null>(null);
  const ecoKraftTextureRef = useRef<THREE.Texture | null>(null);
  const filamentTextureRef = useRef<THREE.Texture | null>(null);
  const strappingTextureRef = useRef<THREE.Texture | null>(null);
  // Almacenar el material actual
  const currentMaterialRef = useRef<string>('canela');
  
  /**
   * Cambia el material de la cinta con propiedades físicas realistas
   */
  const changeMaterial = useCallback((material: string) => {
    if (!tapeMaterialRef.current) return;

    // Guardar el material actual
    currentMaterialRef.current = material;

    const config = MATERIAL_CONFIGS[material] || {
      colorHex: "#c49a6c",
      transmission: 0.3,
      roughness: 0.2,
      ior: 1.42,
      thickness: 1.0,
      clearcoat: 0.7,
      clearcoatRoughness: 0.1
    };

    // SIEMPRE aplicar el color del material
    tapeMaterialRef.current.color.set(config.colorHex);
    
    // Si es material kraft y NO hay imagen cargada, aplicar textura procedural
    if (material === 'kraft' && !originalTextureRef.current) {
      // Generar textura kraft solo una vez
      if (!kraftTextureRef.current) {
        kraftTextureRef.current = generateKraftTexture();
      }
      tapeMaterialRef.current.map = kraftTextureRef.current;
      tapeTextureRef.current = kraftTextureRef.current;
    }
    // Si es material kraft-eco y NO hay imagen cargada, aplicar textura procedural
    else if (material === 'kraft-eco' && !originalTextureRef.current) {
      // Generar textura kraft ecológico solo una vez
      if (!ecoKraftTextureRef.current) {
        ecoKraftTextureRef.current = generateEcoKraftTexture();
      }
      tapeMaterialRef.current.map = ecoKraftTextureRef.current;
      tapeTextureRef.current = ecoKraftTextureRef.current;
    }
    // Si es cinta de filamento (transparente con rayas de refuerzo)
    else if (tapeType === 'filament' && material === 'transparente' && !originalTextureRef.current) {
      // Generar textura de filamento solo una vez
      if (!filamentTextureRef.current) {
        filamentTextureRef.current = generateFilamentTexture();
      }
      tapeMaterialRef.current.map = filamentTextureRef.current;
      tapeTextureRef.current = filamentTextureRef.current;
    }
    // Si es fleje impreso sin texto, mostrar textura base entrecruzada
    else if (tapeType === 'printed' && !originalTextureRef.current) {
      // Generar textura de fleje solo una vez
      if (!strappingTextureRef.current) {
        strappingTextureRef.current = generateStrappingBaseTexture();
      }
      tapeMaterialRef.current.map = strappingTextureRef.current;
      tapeTextureRef.current = strappingTextureRef.current;
    }
    // Si es filamento CON imagen, superponer imagen CON COLORES ORIGINALES sobre la textura de filamento
    else if (tapeType === 'filament' && material === 'transparente' && originalTextureRef.current) {
      // Asegurar que existe la textura base de filamento
      const baseTexture = filamentTextureRef.current || (filamentTextureRef.current = generateFilamentTexture());
      
      // Combinar la textura base con la imagen (SIN convertir a negro)
      const combinedTexture = overlayImageOnFilament(baseTexture, originalTextureRef.current);
      
      // Limpiar textura anterior si existe
      if (tapeTextureRef.current && 
          tapeTextureRef.current !== originalTextureRef.current && 
          tapeTextureRef.current !== kraftTextureRef.current &&
          tapeTextureRef.current !== ecoKraftTextureRef.current &&
          tapeTextureRef.current !== filamentTextureRef.current &&
          tapeTextureRef.current !== strappingTextureRef.current) {
        tapeTextureRef.current.dispose();
      }
      
      tapeTextureRef.current = combinedTexture;
      tapeMaterialRef.current.map = combinedTexture;
    }
    // Si es kraft o kraft-eco CON imagen, superponer imagen en negro sobre la textura procedural
    else if ((material === 'kraft' || material === 'kraft-eco') && originalTextureRef.current) {
      // Asegurar que existe la textura base procedural
      const baseTexture = material === 'kraft' 
        ? (kraftTextureRef.current || (kraftTextureRef.current = generateKraftTexture()))
        : (ecoKraftTextureRef.current || (ecoKraftTextureRef.current = generateEcoKraftTexture()));
      
      // Combinar la textura base con la imagen en negro encima
      const combinedTexture = overlayImageOnTexture(baseTexture, originalTextureRef.current);
      
      // Limpiar textura anterior si existe
      if (tapeTextureRef.current && 
          tapeTextureRef.current !== originalTextureRef.current && 
          tapeTextureRef.current !== kraftTextureRef.current &&
          tapeTextureRef.current !== ecoKraftTextureRef.current) {
        tapeTextureRef.current.dispose();
      }
      
      tapeTextureRef.current = combinedTexture;
      tapeMaterialRef.current.map = combinedTexture;
    }
    // Si hay textura cargada en otros materiales, crear una textura tintada con el color del material de fondo
    else if (originalTextureRef.current) {
      // Crear textura con el color del material de fondo y la imagen encima
      const tintedTexture = createTintedTexture(
        originalTextureRef.current,
        config.colorHex
      );
      
      // Limpiar textura anterior si existe
      if (tapeTextureRef.current && 
          tapeTextureRef.current !== originalTextureRef.current && 
          tapeTextureRef.current !== kraftTextureRef.current &&
          tapeTextureRef.current !== ecoKraftTextureRef.current) {
        tapeTextureRef.current.dispose();
      }
      
      tapeTextureRef.current = tintedTexture;
      tapeMaterialRef.current.map = tintedTexture;
    }
    // Si NO hay textura y NO es kraft, quitar cualquier textura
    else {
      tapeMaterialRef.current.map = null;
    }
    
    tapeMaterialRef.current.transmission = config.transmission;
    
    if (config.roughness !== undefined) {
      tapeMaterialRef.current.roughness = config.roughness;
    }
    if (config.ior !== undefined) {
      tapeMaterialRef.current.ior = config.ior;
    }
    if (config.thickness !== undefined) {
      tapeMaterialRef.current.thickness = config.thickness;
    }
    if (config.clearcoat !== undefined) {
      tapeMaterialRef.current.clearcoat = config.clearcoat;
    }
    if (config.clearcoatRoughness !== undefined) {
      tapeMaterialRef.current.clearcoatRoughness = config.clearcoatRoughness;
    }
    if (config.opacity !== undefined) {
      tapeMaterialRef.current.opacity = config.opacity;
    }
    if (config.sheen !== undefined) {
      tapeMaterialRef.current.sheen = config.sheen;
    }
    if (config.sheenRoughness !== undefined) {
      tapeMaterialRef.current.sheenRoughness = config.sheenRoughness;
    }
    if (config.sheenColor !== undefined) {
      tapeMaterialRef.current.sheenColor = new THREE.Color(config.sheenColor);
    }
    
    // Configurar transparencia
    if (config.opacity !== undefined && config.opacity < 1.0) {
      tapeMaterialRef.current.transparent = true;
    } else {
      tapeMaterialRef.current.opacity = 1.0;
      tapeMaterialRef.current.transparent = false;
    }
    
    tapeMaterialRef.current.needsUpdate = true;
  }, [tapeMaterialRef, tapeTextureRef, tapeType]);

  /**
   * Cambia el color de fondo de la escena
   */
  const changeBackground = useCallback((colorHex: string) => {
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(colorHex);
    }
  }, [sceneRef]);

  /**
   * Aplica una textura a la cinta
   */
  const applyTexture = useCallback((
    texture: THREE.Texture,
    coreTexture?: THREE.Texture
  ) => {
    if (!tapeMaterialRef.current) return;

    // Guardar la textura original para poder aplicar tintados después
    originalTextureRef.current = texture;

    // Reaplicar el material actual para que procese la textura correctamente
    // (kraft/kraft-eco la combinará con la textura procedural)
    changeMaterial(currentMaterialRef.current);

    // Aplicar textura al núcleo si se proporciona
    if (coreTexture && sceneRef.current) {
      sceneRef.current.traverse((object: THREE.Object3D) => {
        if (object instanceof THREE.Mesh && 
            object.material instanceof THREE.MeshStandardMaterial && 
            object.material.color.getHex() === 0x9c7b4b) {
          object.material.map = coreTexture;
          object.material.needsUpdate = true;
        }
      });
    }
  }, [tapeMaterialRef, sceneRef, changeMaterial]);

  /**
   * Aplica texto personalizado (para fleje impreso)
   */
  const applyCustomText = useCallback((text: string) => {
    if (!tapeMaterialRef.current || !text.trim()) return;

    // Generar textura con el texto repetido
    const textTexture = generatePrintedTextTexture(text.trim());
    
    // Limpiar textura anterior si existe
    if (tapeTextureRef.current) {
      tapeTextureRef.current.dispose();
    }
    
    tapeTextureRef.current = textTexture;
    tapeMaterialRef.current.map = textTexture;
    tapeMaterialRef.current.needsUpdate = true;
  }, [tapeMaterialRef, tapeTextureRef]);

  return {
    changeMaterial,
    changeBackground,
    applyTexture,
    applyCustomText
  };
};
