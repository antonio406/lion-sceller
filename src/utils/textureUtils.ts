import * as THREE from "three";

/**
 * Procesa una imagen para convertirla a blanco y negro
 */
export const processTextureToBlackAndWhite = (
  texture: THREE.Texture
): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('No se pudo obtener el contexto 2D del canvas');
  }

  const image = texture.image as HTMLImageElement;
  canvas.width = image.width;
  canvas.height = image.height;
  
  ctx.drawImage(image, 0, 0);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
    if (brightness > 128) {
      data[i] = data[i + 1] = data[i + 2] = 255; // Blanco
    } else {
      data[i] = data[i + 1] = data[i + 2] = 0; // Negro
    }
  }

  ctx.putImageData(imageData, 0, 0);
  
  const processedTexture = new THREE.CanvasTexture(canvas);
  return processedTexture;
};

/**
 * Procesa una imagen para cambiar los colores (específico para el núcleo)
 */
export const processTextureWithColors = (
  imageSrc: string,
  callback: (texture: THREE.CanvasTexture) => void
): void => {
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = 512;
  colorCanvas.height = 512;

  const img = new Image();
  img.src = imageSrc;
  
  img.onload = () => {
    const ctx = colorCanvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 512);
    ctx.drawImage(img, 0, 0, 512, 512);
    
    const imageData = ctx.getImageData(0, 0, 512, 512);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      
      if (r < 100 && g < 100 && b < 100 && a > 0) {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 255; // azul
      } else if (r > 100 && r < 200 && g > 100 && g < 200 && b > 100 && b < 200 && a > 0) {
        data[i] = 255; // rojo
        data[i + 1] = 0;
        data[i + 2] = 0;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    const coloredTexture = new THREE.CanvasTexture(colorCanvas);
    callback(coloredTexture);
  };
};

/**
 * Configura una textura con los parámetros de repetición
 */
export const configureTexture = (
  texture: THREE.Texture,
  repeatX: number,
  repeatY: number
): THREE.Texture => {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  return texture;
};

/**
 * Carga una imagen y devuelve una URL de objeto
 */
export const loadImageAsObjectURL = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Libera la memoria de una URL de objeto
 */
export const revokeObjectURL = (url: string): void => {
  URL.revokeObjectURL(url);
};

/**
 * Crea una textura donde la imagen se sobrepone al color del material.
 * El contenido de la imagen (partes no transparentes) se convierte a negro
 * y se superpone sobre el color del material de fondo.
 */
export const createTintedTexture = (
  sourceTexture: THREE.Texture,
  tintColor: string
): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  const image = sourceTexture.image as HTMLImageElement;
  
  canvas.width = image.width;
  canvas.height = image.height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('No se pudo obtener el contexto 2D del canvas');
  }

  // 1. Pintar todo el fondo con el color del material
  ctx.fillStyle = tintColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Dibujar la imagen en un canvas temporal para procesarla
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  
  if (!tempCtx) {
    throw new Error('No se pudo obtener el contexto 2D del canvas temporal');
  }

  tempCtx.drawImage(image, 0, 0);
  
  // 3. Obtener los datos de la imagen y convertir a negro solo las partes con contenido
  const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const alpha = data[i + 3];
    
    // Si el pixel tiene contenido (no es completamente transparente y no es muy claro)
    if (alpha > 10) {
      const brightness = (r + g + b) / 3;
      
      // Si el pixel es lo suficientemente oscuro (tiene contenido de imagen)
      if (brightness < 240) {
        // Convertir a negro, manteniendo la transparencia
        data[i] = 0;       // R
        data[i + 1] = 0;   // G
        data[i + 2] = 0;   // B
        // El alpha se mantiene para preservar bordes suaves
      } else {
        // Si es muy claro, hacerlo completamente transparente
        data[i + 3] = 0;
      }
    }
  }

  tempCtx.putImageData(imageData, 0, 0);

  // 4. Superponer la imagen procesada (negra) sobre el fondo de color
  ctx.drawImage(tempCanvas, 0, 0);

  const tintedTexture = new THREE.CanvasTexture(canvas);
  tintedTexture.wrapS = sourceTexture.wrapS;
  tintedTexture.wrapT = sourceTexture.wrapT;
  tintedTexture.repeat.copy(sourceTexture.repeat);
  
  return tintedTexture;
};

/**
 * Combina una textura base (como kraft-eco) con una imagen en negro encima.
 * La textura base se mantiene visible y la imagen se superpone en negro.
 * Usa la misma lógica que createTintedTexture pero con textura procedural de fondo.
 */
export const overlayImageOnTexture = (
  baseTexture: THREE.Texture,
  imageTexture: THREE.Texture
): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  const overlayImage = imageTexture.image as HTMLImageElement;
  const baseImage = baseTexture.image as HTMLCanvasElement | HTMLImageElement;
  
  // Usar el tamaño de la imagen original (igual que createTintedTexture)
  canvas.width = overlayImage.width;
  canvas.height = overlayImage.height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('No se pudo obtener el contexto 2D del canvas');
  }

  // 1. Dibujar la textura kraft-eco como fondo (escalada al tamaño de la imagen)
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

  // 2. Crear canvas temporal para procesar la imagen a negro
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  
  if (!tempCtx) {
    throw new Error('No se pudo obtener el contexto 2D del canvas temporal');
  }

  tempCtx.drawImage(overlayImage, 0, 0);
  
  // 3. Convertir la imagen a negro (solo contenido, respetando transparencias)
  const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const alpha = data[i + 3];
    
    // Si el pixel tiene contenido
    if (alpha > 10) {
      const brightness = (r + g + b) / 3;
      
      // Si el pixel tiene contenido visible (no es muy claro)
      if (brightness < 240) {
        // Convertir a negro, manteniendo la transparencia
        data[i] = 0;       // R
        data[i + 1] = 0;   // G
        data[i + 2] = 0;   // B
        // El alpha se mantiene
      } else {
        // Si es muy claro, hacerlo completamente transparente
        data[i + 3] = 0;
      }
    }
  }

  tempCtx.putImageData(imageData, 0, 0);

  // 4. Superponer la imagen procesada (negra) sobre el fondo kraft
  ctx.drawImage(tempCanvas, 0, 0);

  const resultTexture = new THREE.CanvasTexture(canvas);
  resultTexture.wrapS = imageTexture.wrapS;
  resultTexture.wrapT = imageTexture.wrapT;
  resultTexture.repeat.copy(imageTexture.repeat);
  
  return resultTexture;
};

/**
 * Combina una textura de filamento con una imagen SIN convertir a negro.
 * La imagen mantiene sus colores originales sobre la textura de filamento.
 */
export const overlayImageOnFilament = (
  baseTexture: THREE.Texture,
  imageTexture: THREE.Texture
): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  const overlayImage = imageTexture.image as HTMLImageElement;
  const baseImage = baseTexture.image as HTMLCanvasElement | HTMLImageElement;
  
  // Usar el tamaño de la imagen original
  canvas.width = overlayImage.width;
  canvas.height = overlayImage.height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('No se pudo obtener el contexto 2D del canvas');
  }

  // 1. Dibujar la textura de filamento como fondo
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

  // 2. Superponer la imagen CON SUS COLORES ORIGINALES
  ctx.drawImage(overlayImage, 0, 0);

  const resultTexture = new THREE.CanvasTexture(canvas);
  resultTexture.wrapS = imageTexture.wrapS;
  resultTexture.wrapT = imageTexture.wrapT;
  resultTexture.repeat.copy(imageTexture.repeat);
  
  return resultTexture;
};
