import React, { type CSSProperties } from "react";

const navButtonStyle: CSSProperties = {
  background: "transparent",
  border: "none",
  color: "#f9fafb",
  padding: "6px 10px",
  borderRadius: 999,
  fontSize: 13,
  cursor: "pointer",
  transition: "background 0.15s ease, color 0.15s ease",
};

interface NavbarProps {
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount }) => {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "64px",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background:
          "linear-gradient(90deg, #6e6e6eff 0%, #b91c1c 50%, #000000 100%)",
        color: "#f9fafb",
        zIndex: 200,
        boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
      }}
    >
      {/* Logo / Marca */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <img
          src="/lionsceller.png"
          alt="Lion Sceller logo"
          style={{
            width: 100,
            height: 40,
            borderRadius: "999px",
            objectFit: "cover",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: 700, fontSize: 18 }}>Lion Sceller</span>
          <span style={{ fontSize: 11, color: "#f9fafb" }}>
            Personaliza tu cinta en tiempo real
          </span>
        </div>
      </div>

      {/* Links de navegación */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          fontSize: 14,
        }}
      >
        <button
          style={navButtonStyle}
          onClick={() => {
            const section = document.getElementById("products-section");
            if (section) {
              section.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          Productos
        </button>
        <button
          style={navButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.12)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Ofertas
        </button>
        <button
          style={navButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.12)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Ayuda
        </button>
      </nav>

      {/* Buscador + Login + Carrito */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          minWidth: 0,
        }}
      >
        {/* Buscador */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "6px 10px",
            borderRadius: "999px",
            backgroundColor: "rgba(0,0,0,0.85)",
            border: "1px solid rgba(248,250,252,0.7)",
            minWidth: 0,
          }}
        >
          <span style={{ fontSize: 14, marginRight: 6, opacity: 0.7 }}>🔍</span>
          <input
            placeholder="Buscar cinta, fleje, fleje impreso…"
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              color: "#e5e7eb",
              fontSize: 13,
              minWidth: 80,
              width: 160,
            }}
          />
        </div>

        {/* Login */}
        <button
          style={{
            ...navButtonStyle,
            borderRadius: "999px",
            padding: "8px 14px",
            border: "1px solid rgba(248,250,252,0.85)",
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          Iniciar sesión
        </button>

        {/* Carrito */}
        <button
          style={{
            borderRadius: "999px",
            padding: "8px 14px",
            border: "none",
            background:
              "linear-gradient(135deg, #b91c1c 0%, #ef4444 50%, #000000 100%)",
            color: "#e5e7eb",
            fontWeight: 600,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 6,
            boxShadow: "0 8px 18px rgba(0,0,0,0.7)",
            cursor: "pointer",
          }}
        >
          🛒
          <span>Carrito</span>
          <span
            style={{
              marginLeft: 2,
              padding: "2px 6px",
              borderRadius: "999px",
              backgroundColor: "rgba(15,23,42,0.8)",
              fontSize: 11,
              minWidth: 20,
              textAlign: "center",
            }}
          >
            {cartCount}
          </span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
