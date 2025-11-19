import type { ChangeEvent } from 'react';
import { TAPE_TYPES } from '../constants';

interface TapeControlsProps {
  selectedTapeType: string;
  selectedMaterial: string;
  customText: string;
  onTapeTypeChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onMaterialChange: (material: string) => void;
  onCustomTextChange: (text: string) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBackgroundChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const TapeControls = ({
  selectedTapeType,
  selectedMaterial,
  customText,
  onTapeTypeChange,
  onMaterialChange,
  onCustomTextChange,
  onFileChange,
  onBackgroundChange,
}: TapeControlsProps) => {
  const currentTapeType = TAPE_TYPES[selectedTapeType];

  return (
    <div
      style={{
        position: "absolute",
        top: "98px",
        left: "20px",
        zIndex: 100,
        background: "rgba(30, 30, 30, 0.95)",
        color: "#E0E0E0",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.5)",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "300px",
      }}
    >
      <h3
        style={{
          margin: 0,
          paddingBottom: "10px",
          borderBottom: "1px solid #444",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        ⚙️ Configuración de Cinta
      </h3>

      {/* Selector de tipo de cinta */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label htmlFor="tapeType" style={{ fontWeight: "bold", fontSize: "14px" }}>
          📦 Tipo de Cinta:
        </label>
        <select
          id="tapeType"
          value={selectedTapeType}
          onChange={onTapeTypeChange}
          style={{
            backgroundColor: "#444",
            color: "white",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #666",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          {Object.entries(TAPE_TYPES).map(([key, type]) => (
            <option key={key} value={key}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      {/* Selector de material */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={{ fontWeight: "bold", fontSize: "14px" }}>🎨 Material:</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {currentTapeType.materials.map((material) => (
            <button
              key={material}
              onClick={() => onMaterialChange(material)}
              style={{
                padding: "8px 14px",
                borderRadius: "6px",
                border: selectedMaterial === material ? "2px solid #61DAFB" : "1px solid #666",
                backgroundColor: selectedMaterial === material ? "#2C5F7D" : "#444",
                color: "#E0E0E0",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: selectedMaterial === material ? "bold" : "normal",
                transition: "all 0.2s",
              }}
            >
              {material}
            </button>
          ))}
        </div>
      </div>

      {/* Input de texto personalizado para fleje impreso */}
      {currentTapeType.allowCustomText && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label htmlFor="customText" style={{ fontWeight: "bold", fontSize: "14px" }}>
            ✏️ Texto Personalizado:
          </label>
          <input
            type="text"
            id="customText"
            value={customText}
            onChange={(e) => onCustomTextChange(e.target.value)}
            style={{
              backgroundColor: "#444",
              color: "white",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #666",
              width: "100%",
            }}
            placeholder="Ingrese el texto..."
          />
        </div>
      )}

      {/* Input de textura */}
      {currentTapeType.allowTexture && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontWeight: "bold", fontSize: "14px" }}>
            🖼️ Textura:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            style={{
              backgroundColor: "#444",
              color: "white",
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #666",
            }}
          />
        </div>
      )}

      {/* Selector de color de fondo */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={{ fontWeight: "bold", fontSize: "14px" }}>
          🌅 Color del Fondo:
        </label>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => onBackgroundChange({ target: { value: '#000000ff' } } as ChangeEvent<HTMLInputElement>)}
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "#ffffff",
              color: "#000000",
              border: "2px solid #666",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            Blanco
          </button>
          <button
            onClick={() => onBackgroundChange({ target: { value: '#000000' } } as ChangeEvent<HTMLInputElement>)}
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "#000000",
              color: "#ffffff",
              border: "2px solid #666",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            Negro
          </button>
        </div>
      </div>
    </div>
  );
};
