export default function BarraInferior({ pestana, onNavegar, cantidadCarrito, modoClaro }) {
  const items = [
    { id: "inicio", icono: "🏠", label: "Inicio" },
    { id: "destinos", icono: "🏞️", label: "Paseos", badge: cantidadCarrito },
    { id: "mapas", icono: "🗺️", label: "Mapas" },
    { id: "agenda", icono: "🎭", label: "Agenda" },
    { id: "guia", icono: "💬", label: "Contacto" },
  ];

  return (
    <nav className={`nav-inf ${modoClaro ? "claro" : ""}`} aria-label="Navegación principal">
      <style>{`
        .nav-inf {
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          bottom: 0;
          width: 100%;
          max-width: 520px;
          z-index: 700;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          padding: 8px 6px calc(8px + env(safe-area-inset-bottom, 0px));
          background: rgba(16, 16, 20, 0.9);
          -webkit-backdrop-filter: blur(14px);
          backdrop-filter: blur(14px);
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 22px 22px 0 0;
          box-shadow: 0 -8px 28px rgba(0, 0, 0, 0.45);
        }
        .nav-inf.claro {
          background: rgba(255, 255, 255, 0.94);
          border-top-color: rgba(0, 0, 0, 0.08);
          box-shadow: 0 -6px 22px rgba(0, 0, 0, 0.08);
        }
        .nav-inf-btn {
          position: relative;
          border: none;
          background: transparent;
          color: #a1a1aa;
          font-family: inherit;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 4px 2px;
          cursor: pointer;
          transition: color 0.15s, transform 0.15s;
        }
        .nav-inf.claro .nav-inf-btn { color: #71717a; }
        .nav-inf-btn.activa {
          color: #34d399;
          transform: translateY(-1px);
        }
        .nav-inf.claro .nav-inf-btn.activa { color: #059669; }
        .nav-inf-ico { font-size: 1.2rem; line-height: 1; }
        .nav-inf-lbl { font-size: 0.68rem; font-weight: 700; }
        .nav-inf-badge {
          position: absolute;
          top: 0;
          right: 18%;
          min-width: 17px;
          height: 17px;
          padding: 0 4px;
          border-radius: 999px;
          background: #10b981;
          color: #04261a;
          font-size: 0.65rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          className={`nav-inf-btn ${pestana === it.id ? "activa" : ""}`}
          onClick={() => onNavegar(it.id)}
        >
          <span className="nav-inf-ico" aria-hidden="true">{it.icono}</span>
          <span className="nav-inf-lbl">{it.label}</span>
          {it.badge > 0 && <span className="nav-inf-badge">{it.badge}</span>}
        </button>
      ))}
    </nav>
  );
}