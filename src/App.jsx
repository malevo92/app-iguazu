import { useState } from "react";

// ---------- 1. DATOS: catálogo de 12 destinos ----------
const ATRACTIVOS = [
  { id: 1, nombre: "Cataratas Argentinas", lugar: "Puerto Iguazú", pais: "Argentina", horas: 7, emoji: "💦", desc: "Pasarelas sobre el río y la Garganta del Diablo, de cerca." },
  { id: 2, nombre: "Cataratas Brasileñas", lugar: "Foz do Iguaçu", pais: "Brasil", horas: 4, emoji: "🌈", desc: "La vista panorámica completa de todos los saltos." },
  { id: 3, nombre: "Parque das Aves", lugar: "Foz do Iguaçu", pais: "Brasil", horas: 3, emoji: "🦜", desc: "Tucanes, guacamayos y aviarios abiertos dentro de la selva." },
  { id: 4, nombre: "Represa de Itaipú", lugar: "Foz do Iguaçu", pais: "Brasil", horas: 3, emoji: "⚡", desc: "Visita guiada a una de las mayores hidroeléctricas del mundo." },
  { id: 5, nombre: "Minas de Wanda", lugar: "Misiones", pais: "Argentina", horas: 3, emoji: "💎", desc: "Antiguas minas de piedras semipreciosas: amatista, ágata y cuarzo." },
  { id: 6, nombre: "Compras en Ciudad del Este", lugar: "Paraguay", pais: "Paraguay", horas: 4, emoji: "🛍️", desc: "Tiendas de electrónica, perfumes y mucho más a precios libres de impuestos." },
  { id: 7, nombre: "Hito Tres Fronteras", lugar: "Puerto Iguazú", pais: "Argentina", horas: 1.5, emoji: "📍", desc: "Mirador donde se juntan los ríos Iguazú y Paraná y se ven los tres países." },
  { id: 8, nombre: "GüiráOga", lugar: "Puerto Iguazú", pais: "Argentina", horas: 2, emoji: "🦉", desc: "Centro de rescate de fauna silvestre en plena selva misionera." },
  { id: 9, nombre: "La Aripuca", lugar: "Puerto Iguazú", pais: "Argentina", horas: 1.5, emoji: "🌳", desc: "Gran construcción de troncos de árboles nativos, inspirada en una trampa guaraní." },
  { id: 10, nombre: "Ruinas de San Ignacio", lugar: "Misiones", pais: "Argentina", horas: 5, emoji: "🏛️", desc: "Misión jesuítico-guaraní de piedra roja, declarada Patrimonio de la Humanidad." },
  { id: 11, nombre: "Templo Budista Chen Tien", lugar: "Foz do Iguaçu", pais: "Brasil", horas: 1.5, emoji: "🛕", desc: "Templo tranquilo con jardines y esculturas, ideal para una pausa." },
  { id: 12, nombre: "Saltos del Monday", lugar: "Presidente Franco", pais: "Paraguay", horas: 2.5, emoji: "🌊", desc: "Cascada sobre el río Monday, a pocos kilómetros de Ciudad del Este." },
];

const FILTROS = ["Todos", "Argentina", "Brasil", "Paraguay"];
const HORAS_POR_DIA = 8;

// ---------- Mapas (se buscan por nombre, sin API Key) ----------
const MAPAS = [
  { id: "m1", nombre: "Parque Nacional Iguazú", pais: "Argentina", consulta: "Parque Nacional Iguazú, Misiones, Argentina" },
  { id: "m2", nombre: "Parque Nacional do Iguaçu", pais: "Brasil", consulta: "Parque Nacional do Iguaçu, Foz do Iguaçu, Brasil" },
  { id: "m3", nombre: "Minas de Wanda", pais: "Argentina", consulta: "Minas de Wanda, Misiones, Argentina" },
  { id: "m4", nombre: "Microcentro de Ciudad del Este", pais: "Paraguay", consulta: "Microcentro, Ciudad del Este, Paraguay" },
];

// ---------- Datos del guía ----------
const GUIA = {
  nombre: "Tapia Emanuel", // CAMBIAR POR DATOS REALES
  titulo: "Guía de turismo habilitado · Tres Fronteras", // CAMBIAR POR DATOS REALES
  whatsapp: "5493757433077", // CAMBIAR POR DATOS REALES (solo números, con código de país: 54 9 + área + número)
  telefonoVisible: "+54 9 3757 433077", // CAMBIAR POR DATOS REALES
  email: "guia@ejemplo.com", // CAMBIAR POR DATOS REALES
  horarios: [
    { dia: "Lunes a viernes", horas: "8:00 a 19:00" }, // CAMBIAR POR DATOS REALES
    { dia: "Sábados", horas: "9:00 a 14:00" }, // CAMBIAR POR DATOS REALES
    { dia: "Domingos", horas: "Solo urgencias por WhatsApp" }, // CAMBIAR POR DATOS REALES
  ],
};

export default function App() {
  // ---------- 2. ESTADO ----------
  const [pestana, setPestana] = useState("destinos"); // "destinos" | "mapas" | "guia"
  const [dias, setDias] = useState(3);
  const [filtro, setFiltro] = useState("Todos");
  const [carrito, setCarrito] = useState([]);

  // ---------- 3. FUNCIONES ----------
  const agregar = (atractivo) => {
    if (carrito.some((a) => a.id === atractivo.id)) return;
    setCarrito([...carrito, atractivo]);
  };
  const quitar = (id) => setCarrito(carrito.filter((a) => a.id !== id));

  // ---------- 4. CÁLCULOS ----------
  const visibles = filtro === "Todos" ? ATRACTIVOS : ATRACTIVOS.filter((a) => a.pais === filtro);
  const horasTotales = carrito.reduce((suma, a) => suma + a.horas, 0);
  const horasDisponibles = dias * HORAS_POR_DIA;
  const diferencia = horasDisponibles - horasTotales;
  const diasNecesarios = Math.ceil(horasTotales / HORAS_POR_DIA);
  const porcentaje = Math.min(100, (horasTotales / horasDisponibles) * 100);

  let estado = { tipo: "vacio", texto: "Agregá excursiones para ver si el tiempo te alcanza." };
  if (horasTotales > 0 && diferencia < 0) {
    estado = { tipo: "mal", texto: `No alcanza: te faltan ${-diferencia} hs. Necesitás al menos ${diasNecesarios} días o quitar alguna excursión.` };
  } else if (horasTotales > 0 && diferencia <= 4) {
    estado = { tipo: "justo", texto: `Alcanza justo: te quedan ${diferencia} hs libres. Ideal para ir sin apuro.` };
  } else if (horasTotales > 0) {
    estado = { tipo: "bien", texto: `Alcanza bien: te sobran ${diferencia} hs. Podés sumar más paseos o descansar.` };
  }

  // Mensaje automático de WhatsApp con las actividades del carrito
  const lineas = carrito.map((a) => `- ${a.nombre} (${a.lugar}, ${a.horas} hs)`).join("\n");
  const mensajeWhatsApp = carrito.length
    ? `Hola ${GUIA.nombre}, quiero reservar estas excursiones:\n${lineas}\n\nTotal: ${horasTotales} hs. Me quedo ${dias} ${dias === 1 ? "día" : "días"}. ¿Tenés disponibilidad?`
    : `Hola ${GUIA.nombre}, quiero consultar por excursiones en las Tres Fronteras.`;
  const linkWhatsApp = `https://wa.me/${GUIA.whatsapp}?text=${encodeURIComponent(mensajeWhatsApp)}`;

  const PESTANAS = [
    { id: "destinos", etiqueta: `Destinos y Carrito${carrito.length ? ` (${carrito.length})` : ""}` },
    { id: "mapas", etiqueta: "Mapas" },
    { id: "guia", etiqueta: "Contacto del Guía" },
  ];

  return (
    <div className="app">
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; display: block; }
        .app {
          --tinta: #0b2540; --rio: #1f6f8b; --niebla: #eaf1ef; --papel: #ffffff;
          --argentina: #2b86c5; --brasil: #1f8a4c; --paraguay: #c93a30;
          color-scheme: light; text-align: left;
          min-height: 100vh; background: var(--niebla); color: var(--tinta);
          font-family: "Segoe UI", system-ui, sans-serif; padding: 24px 16px 48px;
        }
        .contenedor { max-width: 1100px; margin: 0 auto; }
        /* Títulos con color fijo y alto contraste */
        .app h1, .app h2, .app h3 { color: var(--tinta); }
        .titulo { font-family: Georgia, "Times New Roman", serif; font-size: clamp(2rem, 5vw, 3.2rem); margin: 0 0 4px; line-height: 1.1; }
        .subtitulo { margin: 0 0 20px; font-size: 1.05rem; color: #2c4a5e; }
        .pestanas { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; border-bottom: 2px solid #c5d6d1; padding-bottom: 12px; }
        .pestana { border: 2px solid var(--tinta); background: var(--papel); color: var(--tinta); padding: 10px 18px; border-radius: 10px; font-size: .95rem; font-weight: 700; cursor: pointer; }
        .pestana.activa { background: var(--tinta); color: #fff; }
        .app button:focus-visible, .app select:focus-visible, .app a:focus-visible { outline: 3px solid #f2b705; outline-offset: 2px; }
        .barra { display: flex; flex-wrap: wrap; gap: 16px 32px; align-items: center; margin-bottom: 24px; }
        .barra label { font-weight: 600; margin-right: 8px; }
        .barra select { font-size: 1rem; padding: 8px 12px; border-radius: 8px; border: 2px solid var(--rio); background: var(--papel); color: var(--tinta); }
        .filtros { display: flex; flex-wrap: wrap; gap: 8px; }
        .filtro { border: 2px solid var(--rio); background: transparent; color: var(--rio); padding: 8px 16px; border-radius: 999px; font-size: .95rem; font-weight: 600; cursor: pointer; }
        .filtro.activo { background: var(--rio); color: #fff; }
        .layout { display: grid; grid-template-columns: 1fr; gap: 24px; align-items: start; }
        @media (min-width: 900px) { .layout { grid-template-columns: 2fr 1fr; } .carrito { position: sticky; top: 16px; } }
        .grilla { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
        .tarjeta { background: var(--papel); border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 2px 10px rgba(11,37,64,.12); }
        .tarjeta-top { height: 88px; display: flex; align-items: center; justify-content: center; font-size: 3rem; }
        .tarjeta-cuerpo { padding: 16px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .tarjeta h3 { margin: 0; font-size: 1.15rem; }
        .lugar { margin: 0; font-size: .9rem; color: #2c4a5e; }
        .desc { margin: 0; font-size: .92rem; line-height: 1.45; flex: 1; }
        .meta { display: flex; justify-content: space-between; align-items: center; font-weight: 600; }
        .pais { font-size: .8rem; padding: 2px 10px; border-radius: 999px; color: #fff; }
        .Argentina { background: var(--argentina); } .Brasil { background: var(--brasil); } .Paraguay { background: var(--paraguay); }
        .btn-agregar { border: none; background: var(--tinta); color: #fff; padding: 10px; border-radius: 10px; font-size: .95rem; font-weight: 600; cursor: pointer; }
        .btn-agregar:disabled { background: #b9c7c4; color: #2f403d; cursor: default; }
        .carrito { background: var(--papel); border-radius: 16px; padding: 20px; box-shadow: 0 2px 10px rgba(11,37,64,.12); }
        .carrito h2 { margin: 0 0 12px; font-family: Georgia, serif; font-size: 1.4rem; }
        .vacio { color: #2c4a5e; margin: 0 0 12px; }
        .lista { list-style: none; padding: 0; margin: 0 0 16px; display: flex; flex-direction: column; gap: 8px; }
        .item { display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 10px 12px; background: var(--niebla); border-radius: 10px; }
        .item small { display: block; color: #2c4a5e; }
        .btn-quitar { border: none; background: transparent; color: #a82a21; font-weight: 700; cursor: pointer; padding: 6px 8px; }
        .totales { display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 8px; }
        .barra-progreso { height: 12px; background: var(--niebla); border-radius: 999px; overflow: hidden; margin-bottom: 12px; }
        .barra-progreso div { height: 100%; transition: width .3s; }
        .aviso { padding: 12px; border-radius: 10px; font-size: .95rem; line-height: 1.4; margin: 0; }
        .aviso.vacio { background: var(--niebla); }
        .aviso.bien { background: #d8f0e2; } .aviso.justo { background: #fdf0c4; } .aviso.mal { background: #f9d9d5; }
        .relleno-bien { background: var(--brasil); } .relleno-justo { background: #e0a800; } .relleno-mal { background: var(--paraguay); } .relleno-vacio { background: var(--rio); }
        /* Mapas */
        .grilla-mapas { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
        .mapa-tarjeta { background: var(--papel); border-radius: 16px; overflow: hidden; box-shadow: 0 2px 10px rgba(11,37,64,.12); }
        .mapa-tarjeta iframe { width: 100%; height: 260px; border: 0; display: block; }
        .mapa-info { padding: 16px; display: flex; flex-direction: column; gap: 10px; }
        .mapa-info h3 { margin: 0; font-size: 1.1rem; }
        .btn-link { display: inline-block; text-align: center; text-decoration: none; background: var(--rio); color: #fff; padding: 10px 14px; border-radius: 10px; font-weight: 700; }
        /* Guía */
        .guia { max-width: 520px; background: var(--papel); border-radius: 16px; padding: 28px; box-shadow: 0 2px 10px rgba(11,37,64,.12); }
        .guia h2 { margin: 0; font-family: Georgia, serif; font-size: 1.7rem; }
        .guia-titulo { margin: 4px 0 20px; color: #2c4a5e; }
        .guia dl { margin: 0 0 20px; display: grid; gap: 12px; }
        .guia dt { font-weight: 700; }
        .guia dd { margin: 2px 0 0; }
        .guia a { color: var(--rio); font-weight: 600; }
        .horarios { list-style: none; padding: 0; margin: 4px 0 0; display: grid; gap: 4px; }
        .btn-whatsapp { display: block; text-align: center; text-decoration: none; background: #1a8f45; color: #fff !important; padding: 14px; border-radius: 12px; font-size: 1.05rem; font-weight: 700; }
        .nota { font-size: .9rem; color: #2c4a5e; margin: 10px 0 0; }
      `}</style>

      <div className="contenedor">
        <h1 className="titulo">Tres Fronteras</h1>
        <p className="subtitulo">Armá tu itinerario por Argentina, Brasil y Paraguay.</p>

        {/* Menú de pestañas */}
        <nav className="pestanas" role="tablist">
          {PESTANAS.map((p) => (
            <button key={p.id} role="tab" aria-selected={pestana === p.id} className={`pestana ${pestana === p.id ? "activa" : ""}`} onClick={() => setPestana(p.id)}>
              {p.etiqueta}
            </button>
          ))}
        </nav>

        {/* ---------- PESTAÑA 1: Destinos y Carrito ---------- */}
        {pestana === "destinos" && (
          <>
            <div className="barra">
              <div>
                <label htmlFor="dias">Días de estadía:</label>
                <select id="dias" value={dias} onChange={(e) => setDias(Number(e.target.value))}>
                  {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? "día" : "días"}</option>
                  ))}
                </select>
              </div>
              <div className="filtros">
                {FILTROS.map((f) => (
                  <button key={f} className={`filtro ${filtro === f ? "activo" : ""}`} onClick={() => setFiltro(f)}>{f}</button>
                ))}
              </div>
            </div>

            <div className="layout">
              <section className="grilla">
                {visibles.map((a) => {
                  const agregado = carrito.some((x) => x.id === a.id);
                  return (
                    <article key={a.id} className="tarjeta">
                      <div className={`tarjeta-top ${a.pais}`} aria-hidden="true">{a.emoji}</div>
                      <div className="tarjeta-cuerpo">
                        <h3>{a.nombre}</h3>
                        <p className="lugar">{a.lugar}</p>
                        <p className="desc">{a.desc}</p>
                        <div className="meta">
                          <span>⏱ {a.horas} hs</span>
                          <span className={`pais ${a.pais}`}>{a.pais}</span>
                        </div>
                        <button className="btn-agregar" onClick={() => agregar(a)} disabled={agregado}>
                          {agregado ? "Ya está en tu viaje" : "Agregar a mi viaje"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </section>

              <aside className="carrito">
                <h2>Mi Carrito de Actividades</h2>
                {carrito.length === 0 && <p className="vacio">Todavía no agregaste excursiones.</p>}
                <ul className="lista">
                  {carrito.map((a) => (
                    <li key={a.id} className="item">
                      <div>
                        <strong>{a.nombre}</strong>
                        <small>{a.horas} hs · {a.lugar}</small>
                      </div>
                      <button className="btn-quitar" onClick={() => quitar(a.id)} aria-label={`Quitar ${a.nombre}`}>Quitar</button>
                    </li>
                  ))}
                </ul>
                <div className="totales">
                  <span>Horas totales</span>
                  <span>{horasTotales} de {horasDisponibles} hs</span>
                </div>
                <div className="barra-progreso">
                  <div className={`relleno-${estado.tipo}`} style={{ width: `${porcentaje}%` }} />
                </div>
                <p className={`aviso ${estado.tipo}`}>{estado.texto}</p>
              </aside>
            </div>
          </>
        )}

        {/* ---------- PESTAÑA 2: Mapas ---------- */}
        {pestana === "mapas" && (
          <section className="grilla-mapas">
            {MAPAS.map((m) => (
              <article key={m.id} className="mapa-tarjeta">
                <iframe
                  title={`Mapa de ${m.nombre}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(m.consulta)}&output=embed`}
                />
                <div className="mapa-info">
                  <h3>{m.nombre}</h3>
                  <span className={`pais ${m.pais}`} style={{ alignSelf: "flex-start" }}>{m.pais}</span>
                  <a className="btn-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.consulta)}`} target="_blank" rel="noopener noreferrer">
                    Abrir en Google Maps
                  </a>
                </div>
              </article>
            ))}
          </section>
        )}

        {/* ---------- PESTAÑA 3: Contacto del Guía ---------- */}
        {pestana === "guia" && (
          <section className="guia">
            <h2>{GUIA.nombre}</h2>
            <p className="guia-titulo">{GUIA.titulo}</p>
            <dl>
              <div>
                <dt>Teléfono / WhatsApp</dt>
                <dd>{GUIA.telefonoVisible}</dd>
              </div>
              <div>
                <dt>Correo electrónico</dt>
                <dd><a href={`mailto:${GUIA.email}`}>{GUIA.email}</a></dd>
              </div>
              <div>
                <dt>Horarios de atención</dt>
                <dd>
                  <ul className="horarios">
                    {GUIA.horarios.map((h) => (
                      <li key={h.dia}><strong>{h.dia}:</strong> {h.horas}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
            <a className="btn-whatsapp" href={linkWhatsApp} target="_blank" rel="noopener noreferrer">
              Escribir por WhatsApp
            </a>
            <p className="nota">
              {carrito.length
                ? `El mensaje incluirá tus ${carrito.length} excursiones (${horasTotales} hs en total).`
                : "Tu carrito está vacío: se enviará un mensaje de consulta general."}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}