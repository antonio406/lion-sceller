import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TAPE_DIMENSIONS, TEXTURE_CONFIG, DEFAULT_BG_COLOR_HEX } from '../constants';
import { processTextureWithColors } from '../utils/textureUtils';

export const useThreeScene = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  tapeType: string = 'adhesive'
) => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const tapeMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const tapeTextureRef = useRef<THREE.Texture | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Crear escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(DEFAULT_BG_COLOR_HEX);
    sceneRef.current = scene;

    // Configuración de cámara mejorada
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 4);

    // Renderer con mejoras de calidad
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = false; // Sombras deshabilitadas
    container.appendChild(renderer.domElement);

    // Controles de órbita mejorados
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.5;
    controls.maxDistance = 8;
    controls.enablePan = false;

    // Sistema de iluminación mejorado (5 luces)
    // 1. Luz ambiental suave
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // 2. Luz direccional principal (sin sombras)
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(5, 5, 5);
    dirLight.castShadow = false;
    scene.add(dirLight);

    // 3. Luz de relleno (fill light)
    const fillLight = new THREE.DirectionalLight(0xadd8e6, 1.0);
    fillLight.position.set(-5, 0, -5);
    fillLight.castShadow = false;
    scene.add(fillLight);

    // 4. Luz de contorno (rim light)
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
    rimLight.position.set(0, -5, -5);
    rimLight.castShadow = false;
    scene.add(rimLight);

    // 5. Luz puntual adicional (spotlight sin sombras)
    const spotLight = new THREE.SpotLight(0xffffff, 1.5);
    spotLight.position.set(0, 8, 3);
    spotLight.angle = Math.PI / 6;
    spotLight.castShadow = false;
    spotLight.penumbra = 0.3;
    scene.add(spotLight);

    const { outerRadius, innerRadius, thickness } = TAPE_DIMENSIONS;

    // Dimensiones específicas para fleje impreso
    const tapeRadius = tapeType === 'printed' ? 1.2 : outerRadius;
    const tapeCoreRadius = tapeType === 'printed' ? 0.90 : innerRadius;
    const tapeThickness = tapeType === 'printed' ? 0.1 : thickness;

    // Material de la cinta mejorado con propiedades físicas realistas
    // Material inicial: transparente (blanco sin transmisión)
    const tapeMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#ffffff'), // Color blanco inicial para transparente
      roughness: 0.12,
      metalness: 0.0,
      transmission: 0.0, // Sin transmisión para evitar efectos raros
      thickness: 1.5,
      ior: 1.45, // Índice de refracción del plástico
      clearcoat: 0.95, // Capa brillante
      clearcoatRoughness: 0.03,
      transparent: true,
      opacity: 0.4, // 40% de opacidad
      side: THREE.DoubleSide,
    });

    tapeMaterialRef.current = tapeMaterial;

    // Crear texturas procedurales para mapas de detalle
    // const roughnessMap = generateRoughnessMap();
    // const normalMap = generateNormalMap();
    // tapeMaterial.roughnessMap = roughnessMap;
    // tapeMaterial.normalMap = normalMap;
    // tapeMaterial.normalScale = new THREE.Vector2(0.3, 0.3);
    
    const loader = new THREE.TextureLoader();

    // Crear geometría de la cinta con mayor detalle
    const tapeGeometry = new THREE.CylinderGeometry(
      tapeRadius,
      tapeRadius,
      tapeThickness,
      256, // Mayor detalle en la circunferencia
      8,   // Más segmentos verticales para mejor curvatura
      true
    );
    const tapeMesh = new THREE.Mesh(tapeGeometry, tapeMaterial);
    tapeMesh.rotation.x = Math.PI / 2;

    // Material del núcleo (cartón) mejorado con textura de cartón realista
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b5e34,
      roughness: 0.85,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });

    // Crear textura procedural de cartón
    const createCardboardTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Color base del cartón
      ctx.fillStyle = '#8b5e34';
      ctx.fillRect(0, 0, 512, 512);

      // Añadir textura de fibras
      for (let i = 0; i < 5000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        ctx.fillStyle = `rgba(139, 94, 52, ${Math.random() * 0.3})`;
        ctx.fillRect(x, y, 1, 1);
      }

      return new THREE.CanvasTexture(canvas);
    };

    const cardboardTexture = createCardboardTexture();
    if (cardboardTexture) {
      coreMaterial.map = cardboardTexture;
      coreMaterial.needsUpdate = true;
    }

    // Material para la parte interior del núcleo
    const coreInnerMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.0,
      clearcoat: 0.2,
      clearcoatRoughness: 0.4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.99,
    });

    // Cargar y procesar textura para el núcleo
    loader.load(
      TEXTURE_CONFIG.defaultPath,
      (coreTexture) => {
        const image = coreTexture.image as HTMLImageElement;
        processTextureWithColors(image.src, (coloredTexture) => {
          coloredTexture.wrapS = THREE.RepeatWrapping;
          coloredTexture.wrapT = THREE.RepeatWrapping;
          coloredTexture.repeat.set(TEXTURE_CONFIG.coreRepeatX, TEXTURE_CONFIG.coreRepeatY);
          coreInnerMaterial.map = coloredTexture;
          coreInnerMaterial.needsUpdate = true;
        });
      },
      undefined,
      (err) => console.error('Error cargando textura del núcleo:', err)
    );

    // Crear geometrías del núcleo
    const coreOuterGeometry = new THREE.CylinderGeometry(
      tapeCoreRadius + 0.12,
      tapeCoreRadius + 0.12,
      tapeThickness * 1.0,
      128,
      4,
      true
    );

    const coreInnerGeometry = new THREE.CylinderGeometry(
      tapeCoreRadius,
      tapeCoreRadius,
      tapeThickness * 1.0,
      128,
      1,
      true
    );

    // Crear meshes del núcleo sin sombras
    const coreOuterMesh = new THREE.Mesh(coreOuterGeometry, coreMaterial);
    const coreInnerMesh = new THREE.Mesh(coreInnerGeometry, coreInnerMaterial);

    // Crear anillos laterales del núcleo con mayor detalle
    const ringInnerGeo = new THREE.RingGeometry(tapeCoreRadius, tapeCoreRadius + 0.12, 256);
    const coreRingTop = new THREE.Mesh(ringInnerGeo, coreMaterial);
    const coreRingBottom = new THREE.Mesh(ringInnerGeo, coreMaterial);

    coreOuterMesh.rotation.x = Math.PI / 2;
    coreInnerMesh.rotation.x = Math.PI / 2;
    coreRingTop.position.z = tapeThickness * 0.520;
    coreRingBottom.position.z = -tapeThickness * 0.520;
    coreRingBottom.rotation.x = Math.PI;

    // Grupo del núcleo
    const coreGroup = new THREE.Group();
    coreGroup.add(coreOuterMesh, coreInnerMesh, coreRingTop, coreRingBottom);

    // Crear anillos superior e inferior de la cinta sin sombras
    const ringGeo = new THREE.RingGeometry(tapeCoreRadius, tapeRadius, 256);
    const tapeTop = new THREE.Mesh(ringGeo, tapeMaterial);
    tapeTop.position.z = tapeThickness / 2;
    
    const tapeBottom = new THREE.Mesh(ringGeo, tapeMaterial);
    tapeBottom.position.z = -tapeThickness / 2;
    tapeBottom.rotation.x = Math.PI;

    // Añadir todo a la escena
    scene.add(tapeMesh, coreGroup, tapeTop, tapeBottom);

    // Animación
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Manejo de redimensionamiento
    const handleResize = () => {
      if (!container) return;
      
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      controls.dispose();
      tapeGeometry.dispose();
      coreOuterGeometry.dispose();
      coreInnerGeometry.dispose();
      ringInnerGeo.dispose();
      ringGeo.dispose();
      tapeMaterial.dispose();
      coreMaterial.dispose();
      coreInnerMaterial.dispose();
      if (tapeTextureRef.current) {
        tapeTextureRef.current.dispose();
        tapeTextureRef.current = null;
      }
    };
  }, [containerRef, tapeType]);

  return {
    sceneRef,
    tapeMaterialRef,
    tapeTextureRef
  };
};
