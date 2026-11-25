export default function PantallaInicio({
  primerNombre,
  clima,
  climaEstado,
  onNavegar,
  onAbrirChat,
  cantidadCarrito,
  modoClaro,
  setModoClaro,
  sonido,
  onToggleSonido,
  idioma,
  setIdioma,
}) {
  const hoyTexto = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const climaHoy = climaEstado === "listo" && clima?.[0] ? clima[0] : null;
  const iconoHoy = (code) => {
    if (code === 0) return "☀️";
    if (code === 1 || code === 2) return "⛅";
    if (code === 3) return "☁️";
    if (code >= 51 && code <= 82) return "🌧️";
    if (code >= 95) return "⛈️";
    return "🌤️";
  };

  return (
    <section className={`inicio-wrap ${modoClaro ? "claro" : ""}`}>
      <style>{`
        .inicio-wrap {
          max-width: 460px;
          margin: 0 auto;
          padding: 4px 2px 84px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .inicio-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .inicio-marca span {
          display: block;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #34d399;
        }
        .inicio-wrap.claro .inicio-marca span {
          color: #059669;
        }
        .inicio-marca h1 {
          margin: 0;
          font-family: Georgia, serif;
          font-size: 1.55rem;
          line-height: 1.1;
          color: var(--tinta);
        }
        .inicio-marca h1 b {
          color: #34d399;
        }
        .inicio-wrap.claro .inicio-marca h1 b {
          color: #059669;
        }
        .inicio-ctrls {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .inicio-ctrl-btn {
          height: 34px;
          min-width: 34px;
          padding: 0 9px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.06);
          color: var(--tinta);
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .inicio-wrap.claro .inicio-ctrl-btn {
          border-color: rgba(0, 0, 0, 0.12);
          background: rgba(255, 255, 255, 0.85);
        }
        .inicio-hero {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 2px 4px;
        }
        .inicio-ave-wrap {
          width: 148px;
          height: 148px;
          flex: none;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(52, 211, 153, 0.24) 0%, rgba(212, 106, 67, 0.12) 56%, transparent 72%);
          cursor: pointer;
        }
        .inicio-ave {
          width: 136px;
          height: auto;
          filter: drop-shadow(0 12px 20px rgba(0, 0, 0, 0.45));
          animation: flotarAve 3.2s ease-in-out infinite;
        }
        .inicio-globo {
          flex: 1;
          background: rgba(255, 255, 255, 0.94);
          color: #0f291e;
          font-size: 0.86rem;
          font-weight: 700;
          line-height: 1.35;
          text-align: left;
          padding: 12px 14px;
          border-radius: 18px 18px 18px 4px;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);
          border: 1.5px solid rgba(52, 211, 153, 0.55);
          cursor: pointer;
          transition: transform 0.18s;
        }
        .inicio-globo small {
          display: block;
          margin-top: 4px;
          font-size: 0.72rem;
          font-weight: 600;
          color: #059669;
        }
        .inicio-globo:hover { transform: scale(1.02); }
        .inicio-glass {
          background: rgba(24, 24, 28, 0.85);
          -webkit-backdrop-filter: blur(14px);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 22px;
          padding: 15px 18px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.38);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .inicio-wrap.claro .inicio-glass {
          background: rgba(255, 255, 255, 0.9);
          border-color: rgba(16, 185, 129, 0.25);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
        }
        .inicio-fecha {
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #34d399;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 8px;
        }
        .inicio-wrap.claro .inicio-fecha {
          color: #059669;
          border-bottom-color: rgba(0, 0, 0, 0.08);
        }
        .inicio-fila {
          display: flex;
          align-items: center;
          gap: 11px;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--tinta);
        }
        .inicio-ico {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(16, 185, 129, 0.15);
          font-size: 0.95rem;
          flex: none;
        }
        .inicio-cta {
          width: 100%;
          border: none;
          border-radius: 18px;
          padding: 16px 20px;
          background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
          color: #ffffff;
          font-family: inherit;
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: 0.03em;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          box-shadow: 0 10px 26px rgba(16, 185, 129, 0.35);
          transition: transform 0.16s, box-shadow 0.16s;
        }
        .inicio-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(16, 185, 129, 0.45);
        }
        .inicio-cta:active { transform: scale(0.98); }
        .inicio-cta-badge {
          background: rgba(0, 0, 0, 0.25);
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 0.78rem;
        }
        .inicio-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 11px;
        }
        .inicio-card-btn {
          background: rgba(24, 24, 28, 0.85);
          -webkit-backdrop-filter: blur(10px);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          padding: 14px;
          color: var(--tinta);
          font-family: inherit;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 7px;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
          transition: transform 0.16s, border-color 0.16s;
        }
        .inicio-wrap.claro .inicio-card-btn {
          background: rgba(255, 255, 255, 0.9);
          border-color: rgba(0, 0, 0, 0.08);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.07);
        }
        .inicio-card-btn:hover {
          transform: translateY(-2px);
          border-color: #34d399;
        }
        .inicio-card-ico {
          font-size: 1.4rem;
          line-height: 1;
        }
        .inicio-card-btn strong {
          font-size: 0.84rem;
          letter-spacing: 0.02em;
          line-height: 1.2;
          display: block;
        }
        .inicio-card-btn small {
          font-size: 0.73rem;
          color: var(--suave);
          display: block;
          margin-top: 2px;
        }
      `}</style>

      {/* Encabezado limpio */}
      <div className="inicio-top">
        <div className="inicio-marca">
          <span>¡Hola, {primerNombre || "explorador"}!</span>
          <h1>Iguazú <b>Explora</b></h1>
        </div>
        <div className="inicio-ctrls">
          <button
            type="button"
            className="inicio-ctrl-btn"
            onClick={() => setIdioma(idioma === "es" ? "pt" : idioma === "pt" ? "en" : "es")}
            title="Cambiar idioma"
          >
            {idioma.toUpperCase()}
          </button>
          <button
            type="button"
            className="inicio-ctrl-btn"
            onClick={() => setModoClaro((m) => !m)}
            title={modoClaro ? "Modo oscuro" : "Modo claro"}
          >
            {modoClaro ? "🌙" : "☀️"}
          </button>
          <button
            type="button"
            className="inicio-ctrl-btn"
            onClick={onToggleSonido}
            title={sonido ? "Silenciar" : "Activar sonido"}
          >
            {sonido ? "🔊" : "🔇"}
          </button>
        </div>
      </div>

      {/* Capitán Tangará + Globo de diálogo */}
      <div className="inicio-hero">
        <div
          className="inicio-ave-wrap"
          onClick={onAbrirChat}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter") onAbrirChat(); }}
          title="Hablar con el Capitán Tangará"
        >
          <img
            src="/fotos/asistente-posado.png"
            alt="Capitán Tangará"
            className="inicio-ave"
          />
        </div>
        <button type="button" className="inicio-globo" onClick={onAbrirChat}>
          {primerNombre
            ? `¡Hola ${primerNombre}! Aventuras te esperan hoy`
            : "¡Aventuras te esperan hoy!"}
          <small>💬 Tocá para preguntarme</small>
        </button>
      </div>

      {/* Tarjeta Informativa Glassmorphism */}
      <div className="inicio-glass">
        <div className="inicio-fecha">{hoyTexto}</div>
        <div className="inicio-fila">
          <span className="inicio-ico">{climaHoy ? iconoHoy(climaHoy.code) : "🌤️"}</span>
          <span>
            {climaHoy
              ? `Iguazú hoy: ${climaHoy.min}° / ${climaHoy.max}°`
              : "Consultando clima en Iguazú..."}
          </span>
        </div>
        <div className="inicio-fila">
          <span className="inicio-ico">✅</span>
          <span>Cataratas abiertas · Caudal normal</span>
        </div>
        <div className="inicio-fila">
          <span className="inicio-ico">🕒</span>
          <span>Horario del Parque: 08:00 a 18:00 hs</span>
        </div>
      </div>

      {/* Botón Principal */}
      <button
        type="button"
        className="inicio-cta"
        onClick={() => onNavegar("destinos")}
      >
        <span>🗺️ INGRESAR A LOS PASEOS →</span>
        {cantidadCarrito > 0 && (
          <span className="inicio-cta-badge">{cantidadCarrito} en tu viaje</span>
        )}
      </button>

      {/* Accesos Secundarios */}
      <div className="inicio-grid">
        <button type="button" className="inicio-card-btn" onClick={() => onNavegar("agenda")}>
          <span className="inicio-card-ico">🎭</span>
          <div>
            <strong>AGENDA CULTURAL</strong>
            <small>Eventos, ferias y música</small>
          </div>
        </button>

        <button type="button" className="inicio-card-btn" onClick={() => onNavegar("mapas")}>
          <span className="inicio-card-ico">🧭</span>
          <div>
            <strong>MAPAS ILUSTRADOS</strong>
            <small>Recorridos en acuarela</small>
          </div>
        </button>

        <button type="button" className="inicio-card-btn" onClick={() => onNavegar("colab")}>
          <span className="inicio-card-ico">🏨</span>
          <div>
            <strong>COLABORADORES</strong>
            <small>Hoteles, guías y más</small>
          </div>
        </button>

        <button type="button" className="inicio-card-btn" onClick={() => onNavegar("guia")}>
          <span className="inicio-card-ico">💬</span>
          <div>
            <strong>INFO Y CONTACTO</strong>
            <small>Consultas por WhatsApp</small>
          </div>
        </button>
      </div>
    </section>
  );
}