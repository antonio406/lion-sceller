import * as THREE from "three";

/**
 * Genera una textura procedural de plástico brillante
 */
export const generatePlasticTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('No se pudo obtener el contexto 2D del canvas');
  }

  // Gradiente sutil
  const gradient = ctx.createLinearGradient(0, 0, 1024, 1024);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(1, '#f5f5f5');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 1024);

  // Añadir micro-imperfecciones
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const size = Math.random() * 2;
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
    ctx.fillRect(x, y, size, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
};

/**
 * Genera un mapa de rugosidad para simular irregularidades
 */
export const generateRoughnessMap = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('No se pudo obtener el contexto 2D del canvas');
  }

  // Base gris media
  ctx.fillStyle = '#888888';
  ctx.fillRect(0, 0, 512, 512);

  // Añadir variación de rugosidad
  for (let i = 0; i < 1000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const size = Math.random() * 5 + 2;
    const brightness = Math.floor(Math.random() * 100 + 100);
    ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
};

/**
 * Genera un mapa normal para añadir profundidad visual
 */
export const generateNormalMap = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('No se pudo obtener el contexto 2D del canvas');
  }

  // Color base del mapa normal (azul en el centro)
  ctx.fillStyle = '#8080ff';
  ctx.fillRect(0, 0, 512, 512);

  // Añadir variaciones sutiles
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const size = Math.random() * 4 + 1;
    const r = Math.floor(Math.random() * 40 + 108);
    const g = Math.floor(Math.random() * 40 + 108);
    const b = Math.floor(Math.random() * 40 + 215);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.5)`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
};

/**
 * Genera textura de kraft paper muy realista con fibras y textura de papel
 */
export const generateKraftTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('No se pudo obtener el contexto 2D del canvas');
  }

  // Color base kraft más natural
  const baseR = 184;
  const baseG = 153;
  const baseB = 104;
  
  // Aplicar gradiente sutil para variación natural
  const gradient = ctx.createLinearGradient(0, 0, 2048, 2048);
  gradient.addColorStop(0, `rgb(${baseR + 5}, ${baseG + 5}, ${baseB + 5})`);
  gradient.addColorStop(0.5, `rgb(${baseR}, ${baseG}, ${baseB})`);
  gradient.addColorStop(1, `rgb(${baseR - 5}, ${baseG - 5}, ${baseB - 5})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 2048, 2048);

  // Textura de papel muy fina (grano fino)
  for (let i = 0; i < 20000; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 2048;
    const brightness = Math.random() * 30 - 15;
    const alpha = Math.random() * 0.4 + 0.1;
    ctx.fillStyle = `rgba(${baseR + brightness}, ${baseG + brightness}, ${baseB + brightness}, ${alpha})`;
    ctx.fillRect(x, y, 1, 1);
  }

  // Fibras de papel (horizontales y verticales)
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.03)';
  ctx.lineWidth = 0.5;
  
  // Fibras horizontales
  for (let i = 0; i < 400; i++) {
    const y = Math.random() * 2048;
    const x1 = Math.random() * 200;
    const x2 = Math.random() * 200 + 1848;
    const alpha = Math.random() * 0.05;
    ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
  }
  
  // Fibras verticales (menos visibles)
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * 2048;
    const y1 = Math.random() * 200;
    const y2 = Math.random() * 200 + 1848;
    const alpha = Math.random() * 0.03;
    ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }

  // Manchas naturales del papel kraft
  for (let i = 0; i < 150; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 2048;
    const size = Math.random() * 30 + 10;
    const darkness = Math.random() * 40;
    const alpha = Math.random() * 0.15 + 0.05;
    
    const spotGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    spotGradient.addColorStop(0, `rgba(${baseR - darkness}, ${baseG - darkness}, ${baseB - darkness}, ${alpha})`);
    spotGradient.addColorStop(1, `rgba(${baseR - darkness}, ${baseG - darkness}, ${baseB - darkness}, 0)`);
    
    ctx.fillStyle = spotGradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Áreas más claras (zonas desgastadas)
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 2048;
    const size = Math.random() * 40 + 15;
    const brightness = Math.random() * 20;
    const alpha = Math.random() * 0.1 + 0.03;
    
    const lightGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    lightGradient.addColorStop(0, `rgba(${baseR + brightness}, ${baseG + brightness}, ${baseB + brightness}, ${alpha})`);
    lightGradient.addColorStop(1, `rgba(${baseR + brightness}, ${baseG + brightness}, ${baseB + brightness}, 0)`);
    
    ctx.fillStyle = lightGradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Rugosidad adicional (textura más grande)
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 2048;
    const size = Math.random() * 4 + 1;
    const brightness = Math.random() * 20 - 10;
    const alpha = Math.random() * 0.2;
    ctx.fillStyle = `rgba(${baseR + brightness}, ${baseG + brightness}, ${baseB + brightness}, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 16; // Mayor calidad de filtrado
  return texture;
};

/**
 * Genera textura de papel cartón ecológico/biodegradable ultra realista
 * Con fibras de madera visibles, textura rugosa y aspecto reciclado
 */
export const generateEcoKraftTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('No se pudo obtener el contexto 2D del canvas');
  }

  // Color base de papel cartón reciclado (más oscuro y con variación)
  const baseR = 157; // #9d7f4e
  const baseG = 127;
  const baseB = 78;
  
  // Fondo con textura muy irregular (papel reciclado)
  for (let y = 0; y < 2048; y += 4) {
    for (let x = 0; x < 2048; x += 4) {
      const variation = Math.random() * 30 - 15;
      const r = baseR + variation;
      const g = baseG + variation;
      const b = baseB + variation;
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x, y, 4, 4);
    }
  }

  // FIBRAS DE MADERA GRANDES Y VISIBLES (característica principal)
  ctx.lineWidth = 2;
  for (let i = 0; i < 300; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 2048;
    const length = Math.random() * 80 + 40;
    const angle = Math.random() * Math.PI;
    const darkness = Math.random() * 60 + 20;
    const alpha = Math.random() * 0.3 + 0.2;
    
    ctx.strokeStyle = `rgba(${baseR - darkness}, ${baseG - darkness}, ${baseB - darkness}, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    ctx.stroke();
  }

  // Fibras finas adicionales
  ctx.lineWidth = 1;
  for (let i = 0; i < 600; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 2048;
    const length = Math.random() * 40 + 20;
    const angle = Math.random() * Math.PI;
    const darkness = Math.random() * 40 + 10;
    const alpha = Math.random() * 0.25 + 0.1;
    
    ctx.strokeStyle = `rgba(${baseR - darkness}, ${baseG - darkness}, ${baseB - darkness}, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    ctx.stroke();
  }

  // Partículas de madera (pequeños puntos oscuros)
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 2048;
    const size = Math.random() * 3 + 0.5;
    const darkness = Math.random() * 80 + 30;
    const alpha = Math.random() * 0.4 + 0.3;
    
    ctx.fillStyle = `rgba(${baseR - darkness}, ${baseG - darkness}, ${baseB - darkness}, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Manchas grandes de cartón reciclado (impurezas)
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 2048;
    const size = Math.random() * 60 + 30;
    const darkness = Math.random() * 50 + 20;
    const alpha = Math.random() * 0.2 + 0.1;
    
    const spotGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    spotGradient.addColorStop(0, `rgba(${baseR - darkness}, ${baseG - darkness}, ${baseB - darkness}, ${alpha})`);
    spotGradient.addColorStop(0.5, `rgba(${baseR - darkness/2}, ${baseG - darkness/2}, ${baseB - darkness/2}, ${alpha/2})`);
    spotGradient.addColorStop(1, `rgba(${baseR}, ${baseG}, ${baseB}, 0)`);
    
    ctx.fillStyle = spotGradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Zonas más claras (fibras claras de madera)
  for (let i = 0; i < 150; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 2048;
    const size = Math.random() * 50 + 20;
    const brightness = Math.random() * 30 + 10;
    const alpha = Math.random() * 0.15 + 0.05;
    
    const lightGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    lightGradient.addColorStop(0, `rgba(${baseR + brightness}, ${baseG + brightness}, ${baseB + brightness}, ${alpha})`);
    lightGradient.addColorStop(1, `rgba(${baseR + brightness}, ${baseG + brightness}, ${baseB + brightness}, 0)`);
    
    ctx.fillStyle = lightGradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Textura de papel muy rugosa (grano grueso)
  for (let i = 0; i < 15000; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 2048;
    const brightness = Math.random() * 40 - 20;
    const alpha = Math.random() * 0.3;
    ctx.fillStyle = `rgba(${baseR + brightness}, ${baseG + brightness}, ${baseB + brightness}, ${alpha})`;
    ctx.fillRect(x, y, Math.random() * 2 + 1, Math.random() * 2 + 1);
  }

  // Capas de cartón (líneas sutiles que simulan capas prensadas)
  ctx.lineWidth = 1;
  for (let i = 0; i < 50; i++) {
    const y = Math.random() * 2048;
    const darkness = Math.random() * 30;
    const alpha = Math.random() * 0.08 + 0.02;
    
    ctx.strokeStyle = `rgba(${baseR - darkness}, ${baseG - darkness}, ${baseB - darkness}, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    // Línea ondulada
    for (let x = 0; x < 2048; x += 20) {
      const offset = Math.sin(x * 0.01) * 3;
      ctx.lineTo(x, y + offset);
    }
    ctx.stroke();
  }

  // Arrugas y pliegues (característico del papel reciclado)
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 2048;
    const width = Math.random() * 100 + 50;
    const height = Math.random() * 3 + 1;
    const angle = Math.random() * Math.PI;
    const darkness = Math.random() * 40;
    const alpha = Math.random() * 0.15 + 0.05;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = `rgba(${baseR - darkness}, ${baseG - darkness}, ${baseB - darkness}, ${alpha})`;
    ctx.fillRect(-width/2, -height/2, width, height);
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 16;
  return texture;
};

/**
 * Genera textura base de fleje (polipropileno con patrón entrecruzado)
 */
export const generateStrappingBaseTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('No se pudo obtener el contexto 2D del canvas');
  }

  // Fondo blanco base
  ctx.fillStyle = '#f8f8f8';
  ctx.fillRect(0, 0, 1024, 1024);

  // Patrón entrecruzado (crosshatch) característico del polipropileno
  const gridSize = 25; // Tamaño de los cuadros
  const lineWidth = 2;
  
  ctx.strokeStyle = 'rgba(200, 200, 200, 0.6)';
  ctx.lineWidth = lineWidth;

  // Líneas diagonales hacia la derecha (//)
  for (let i = -1024; i < 2048; i += gridSize) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 1024, 1024);
    ctx.stroke();
  }

  // Líneas diagonales hacia la izquierda (\\)
  for (let i = -1024; i < 2048; i += gridSize) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i - 1024, 1024);
    ctx.stroke();
  }

  // Líneas más oscuras para dar profundidad
  ctx.strokeStyle = 'rgba(180, 180, 180, 0.3)';
  ctx.lineWidth = 1;
  
  for (let i = -1024; i < 2048; i += gridSize * 2) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 1024, 1024);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i - 1024, 1024);
    ctx.stroke();
  }

  // Textura sutil de plástico
  for (let i = 0; i < 1000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const size = Math.random() * 1.5;
    const opacity = Math.random() * 0.08;
    
    ctx.fillStyle = `rgba(220, 220, 220, ${opacity})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 16;
  return texture;
};

/**
 * Genera textura con texto repetido para fleje impreso sobre patrón entrecruzado
 */
export const generatePrintedTextTexture = (text: string): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('No se pudo obtener el contexto 2D del canvas');
  }

  // Fondo blanco base
  ctx.fillStyle = '#f8f8f8';
  ctx.fillRect(0, 0, 2048, 512);

  // Patrón entrecruzado en el fondo
  const gridSize = 20;
  ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
  ctx.lineWidth = 1.5;

  // Líneas diagonales
  for (let i = -512; i < 2560; i += gridSize) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 512, 512);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i - 512, 512);
    ctx.stroke();
  }

  // Configurar texto
  ctx.font = 'bold 56px Arial';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  // Medir el ancho del texto
  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;
  const spacing = 100; // Espaciado entre repeticiones
  const totalWidth = textWidth + spacing;

  // Repetir el texto a lo largo del canvas
  const repetitions = Math.ceil(2048 / totalWidth) + 2;
  
  for (let i = 0; i < repetitions; i++) {
    const x = i * totalWidth;
    ctx.fillText(text, x, 256); // Centrado verticalmente
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 16;
  return texture;
};
/**
 * Genera textura de cinta de filamento (refuerzo)
 * Con rayas/líneas de filamento de vidrio o nylon incrustado
 */
export const generateFilamentTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('No se pudo obtener el contexto 2D del canvas');
  }

  // Fondo transparente/blanco muy claro
  ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
  ctx.fillRect(0, 0, 1024, 1024);

  // Líneas de filamento de refuerzo HORIZONTALES (a lo ancho de la cinta)
  const filamentCount = 30; // Cantidad de líneas de filamento
  const filamentSpacing = 1024 / filamentCount;
  
  for (let i = 0; i < filamentCount; i++) {
    const y = i * filamentSpacing;
    const height = 3 + Math.random() * 2; // Grosor más notorio
    const opacity = 0.85; // Mucho más opaco para que se vea blanco
    
    // Gradiente para dar efecto 3D al filamento (de arriba a abajo)
    const gradient = ctx.createLinearGradient(0, y, 0, y + height);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.7})`);
    gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity})`);
    gradient.addColorStop(1, `rgba(255, 255, 255, ${opacity * 0.7})`);
    
    ctx.fillStyle = gradient;
    
    // Dibujar línea horizontal con muy ligera ondulación
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x < 1024; x += 10) {
      const offset = Math.sin(x * 0.03) * 0.3;
      ctx.lineTo(x, y + offset);
    }
    ctx.lineTo(1024, y);
    ctx.lineTo(1024, y + height);
    for (let x = 1024; x >= 0; x -= 10) {
      const offset = Math.sin(x * 0.03) * 0.3;
      ctx.lineTo(x, y + height + offset);
    }
    ctx.closePath();
    ctx.fill();
  }

  // Líneas verticales muy sutiles (entretejido)
  for (let i = 0; i < 6; i++) {
    const x = Math.random() * 1024;
    const width = 1 + Math.random() * 0.5;
    const opacity = 0.04 + Math.random() * 0.04;
    
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.fillRect(x, 0, width, 1024);
  }

  // Textura muy sutil de adhesivo
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const size = Math.random() * 1.5;
    const opacity = Math.random() * 0.03;
    
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 16;
  return texture;
};
