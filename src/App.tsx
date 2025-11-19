import { useRef, useState, useEffect, type ChangeEvent } from "react";
import * as THREE from "three";
import Navbar from "./components/Navbar";
import { TapeControls } from "./components/TapeControls";
import { useThreeScene } from "./hooks/useThreeScene";
import { useTapeControls } from "./hooks/useTapeControls";
import { TAPE_TYPES, TEXTURE_CONFIG } from "./constants";
import { 
  processTextureToBlackAndWhite, 
  configureTexture, 
  loadImageAsObjectURL, 
  revokeObjectURL 
} from "./utils/textureUtils";

const products = [
  {
    id: "adhesive-clear",
    name: "Cinta Adhesiva Transparente Premium",
    type: "adhesive",
    material: "transparente",
    description: "Cinta transparente de alta claridad ideal para empaques de presentación.",
    price: 200,
    tag: "Más vendida",
  },
  {
    id: "adhesive-brown",
    name: "Cinta Canela Reforzada",
    type: "adhesive",
    material: "canela",
    description: "Cinta canela resistente para cajas de envío de alta seguridad.",
    price: 300,
    tag: "Resistente",
  },
  {
    id: "eco-kraft",
    name: "Cinta Eco Kraft",
    type: "eco",
    material: "kraft-eco",
    description: "Cinta de papel kraft ecológica, 100% reciclable y amigable con el planeta.",
    price: 250,
    tag: "Eco-Friendly",
  },
  {
    id: "filament",
    name: "Fleje de Filamento",
    type: "filament",
    material: "transparente",
    description: "Fleje de filamento ultra resistente para cargas pesadas y paletizado.",
    price: 230,
    tag: "Alta tensión",
  },
];

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Estados para la configuración de la cinta
  const [selectedTapeType, setSelectedTapeType] = useState<string>('adhesive');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('transparente');
  const [customText, setCustomText] = useState<string>('');
  const [cartCount, setCartCount] = useState<number>(0);
  const [backgroundColor, setBackgroundColor] = useState<string>('#000000');

  // Hook para la escena de Three.js
  const { sceneRef, tapeMaterialRef, tapeTextureRef } = useThreeScene(containerRef, selectedTapeType);

  // Hook para controles de la cinta
  const { changeMaterial, changeBackground, applyTexture, applyCustomText } = useTapeControls(
    tapeMaterialRef,
    sceneRef,
    tapeTextureRef,
    selectedTapeType
  );

  // Aplicar material inicial cuando la escena esté lista
  useEffect(() => {
    if (tapeMaterialRef.current) {
      changeMaterial(selectedMaterial);
    }
  }, [selectedTapeType, selectedMaterial, changeMaterial, tapeMaterialRef]);

  // Reaplicar el color de fondo actual cuando cambie el tipo de cinta
  useEffect(() => {
    changeBackground(backgroundColor);
  }, [selectedTapeType, changeBackground, backgroundColor]);

  // Manejar cambios en el material de la cinta
  const handleMaterialChange = (material: string) => {
    setSelectedMaterial(material);
    changeMaterial(material);
  };

  // Manejar cambios en el tipo de cinta
  const handleTapeTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newType = event.target.value;
    setSelectedTapeType(newType);
    setSelectedMaterial(TAPE_TYPES[newType].materials[0]);
    setCustomText('');
    changeMaterial(TAPE_TYPES[newType].materials[0]);
  };

  // Manejar cambios en el texto personalizado
  const handleCustomTextChange = (text: string) => {
    setCustomText(text);
    if (text.trim()) {
      applyCustomText(text);
    }
  };

  // Manejar cambios en la textura
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !tapeMaterialRef.current) return;

    const imageUrl = loadImageAsObjectURL(file);
    const loader = new THREE.TextureLoader();
    const isBlackOnly = TAPE_TYPES[selectedTapeType].textureColorRestriction === 'black-only';

    loader.load(
      imageUrl,
      (newTexture) => {
        const configuredTexture = configureTexture(
          newTexture, 
          TEXTURE_CONFIG.repeatX, 
          TEXTURE_CONFIG.repeatY
        );

        if (tapeTextureRef.current) {
          tapeTextureRef.current.dispose();
        }
        
        if (isBlackOnly) {
          const processedTexture = processTextureToBlackAndWhite(configuredTexture);
          configureTexture(processedTexture, TEXTURE_CONFIG.repeatX, TEXTURE_CONFIG.repeatY);
          
          const coreTexture = processedTexture.clone();
          configureTexture(coreTexture, TEXTURE_CONFIG.coreRepeatX, TEXTURE_CONFIG.coreRepeatY);
          
          applyTexture(processedTexture, coreTexture);
        } else {
          const coreTexture = configuredTexture.clone();
          configureTexture(coreTexture, TEXTURE_CONFIG.coreRepeatX, TEXTURE_CONFIG.coreRepeatY);
          
          applyTexture(configuredTexture, coreTexture);
        }

        revokeObjectURL(imageUrl);
      },
      undefined,
      (err) => {
        console.error("Error al cargar la nueva textura:", err);
        revokeObjectURL(imageUrl);
      }
    );
  };

  // Manejar cambios en el fondo
  const handleBackgroundChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setBackgroundColor(newColor);
    changeBackground(newColor);
  };

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #ffffff 0, #111111 60%, #000000 100%)",
        color: "#f9fafb",
      }}
    >
      <Navbar cartCount={cartCount} />

      <main
        style={{
          paddingTop: "100px",
          paddingBottom: "48px",
          maxWidth: "1200px",
          margin: "0 auto",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        <section
          style={{
            display: "grid",
            gap: "32px",
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              position: "relative",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 24px 80px rgba(0,0,0,0.9)",
              border: "1px solid rgba(253, 0, 0, 0.4)",
              background:
                "radial-gradient(circle at top, rgba(248,250,252,0.08), transparent 60%), #000000",
              marginLeft: "400px",
            }}
          >
            <div
              ref={containerRef}
              style={{
                width: "100%",
                minHeight: "380px",
                height: "100%",
              }}
            />
          </div>

          <div>
            <TapeControls
              selectedTapeType={selectedTapeType}
              selectedMaterial={selectedMaterial}
              customText={customText}
              onTapeTypeChange={handleTapeTypeChange}
              onMaterialChange={handleMaterialChange}
              onCustomTextChange={handleCustomTextChange}
              onFileChange={handleFileChange}
              onBackgroundChange={handleBackgroundChange}
            />
          </div>
        </section>

        <section
          id="products-section"
          style={{
            marginTop: "48px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "16px",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  letterSpacing: "0.03em",
                }}
              >
                Productos destacados
              </h2>
              <p
                style={{
                  marginTop: "4px",
                  fontSize: "0.9rem",
                  color: "#e5e7eb",
                }}
              >
                Elige una cinta para visualizarla al instante en 3D.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  textAlign: "left",
                  borderRadius: "16px",
                  padding: "14px 14px 16px",
                  border: "1px solid rgba(248,113,113,0.5)",
                  background:
                    "linear-gradient(135deg, #111111, #000000)",
                  cursor: "pointer",
                  transition:
                    "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease",
                }}
                onClick={() => {
                  setSelectedTapeType(product.type);
                  setSelectedMaterial(product.material);
                  changeMaterial(product.material);
                  setCustomText("");
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 20px 40px rgba(0,0,0,0.9)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#ef4444";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "rgba(248,113,113,0.5)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.75rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#ef4444",
                      }}
                    >
                      {product.tag}
                    </span>
                    <h3
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                      }}
                    >
                      {product.name}
                    </h3>
                  </div>
                  <div
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      color: "#fecaca",
                    }}
                  >
                    ${""}
                    {product.price.toFixed(2)}
                  </div>
                </div>

                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#9ca3af",
                    marginBottom: "10px",
                  }}
                >
                  {product.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.75rem",
                    color: "#9ca3af",
                    marginTop: "10px",
                  }}
                >
                  <span>
                    Tipo: <strong>{product.type}</strong>
                  </span>
                  <span>
                    Material: <strong>{product.material}</strong>
                  </span>
                </div>

                <button
                  onClick={() => {
                    setCartCount((prev) => prev + 1);
                  }}
                  style={{
                    marginTop: "10px",
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "999px",
                    border: "none",
                    background:
                      "linear-gradient(90deg, #b91c1c 0%, #ef4444 50%, #000000 100%)",
                    color: "#f9fafb",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Agregar al carrito
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
