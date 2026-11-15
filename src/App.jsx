import { useState, useEffect, useRef, Fragment } from "react";

// ---------- TASAS DE CAMBIO (EDITAR ACÁ) ----------
// Cuántas unidades de cada moneda equivalen a 1 dólar (USD). Actualizalas cuando cambie el valor.
const TASAS_CAMBIO = { USD_ARS: 1570, USD_BRL: 5.39, USD_PYG: 6150 };

// ---------- DATOS DEL GUÍA (editá acá si algo cambia) ----------
const GUIA = {
  nombre: "Alan - Turismo & Traslados Iguazú",
  titulo: "Guía y Coordinación de Excursiones en las Tres Fronteras",
  whatsapp: "5493757577335", // solo números, con código de país (se usa en https://wa.me/5493757577335?text=...)
  telefonoVisible: "+54 9 3757 57-7335",
  email: "alan.igr.turismo@gmail.com",
  horarios: "Atención todos los días de 07:00 a 22:00 hs",
};

// ---------- COLABORADORES Y HOSPEDAJES ----------
// Para sumar un hotel, cabaña o restaurante: copiá un objeto completo y cambiá sus datos.
// Fotos en public/colaboradores/. Las fotos que no existan se ocultan solas.
const COLABORADORES = [
  // EDITAR DATOS DE COMPLEJO EL CEIBO AQUÍ
  {
    id: "el-ceibo",
    destacado: true,
    nombre: "Complejo El Ceibo",
    categoria: "Hotelería y Hospedaje", // otras ideas: "Cabañas", "Gastronomía"
    logo: "/colaboradores/el-ceibo-logo.png",
    logoRespaldo: "/colaboradores/el-ceibo-logo.jpg", // se usa si el .png no carga
    fotos: [
      "/colaboradores/el-ceibo-1.jpg",
      "/colaboradores/el-ceibo-2.jpg",
      "/colaboradores/el-ceibo-3.jpg",
      "/colaboradores/el-ceibo-4.jpg",
    ],
    descripcion:
      "Un refugio de descanso rodeado de verde, a pocos minutos de las Cataratas. Habitaciones cómodas, pileta para refrescarte después de cada excursión y la tranquilidad de la selva misionera para recargar energías.",
    ubicacion: "Puerto Iguazú, Misiones - Dirección a confirmar",
    mapa: "Complejo El Ceibo, Puerto Iguazú, Misiones, Argentina", // texto que se busca en Google Maps
    telefonoVisible: "+54 9 3757 00-0000",
    whatsapp: "5493757000000", // solo números, con código de país
    instagram: "@complejoelceibo",
    servicios: ["Piscina", "Wi-Fi", "Estacionamiento", "Entorno natural"],
  },
];

const POLITICA_SENA = "El 50% de seña previa corresponde exclusivamente a los servicios de traslados y guías para confirmar tu reserva (el 50% restante se abona en persona al encontrarse en destino).";
const POLITICA_ENTRADAS = "Importante: Los tickets/entradas a cada parque o atractivo NO están incluidos en el traslado y se abonan directamente en la boletería de cada lugar (o en su web oficial).";
const HORAS_POR_DIA = 8; // tope diario de paseos principales
const HORAS_CON_COMBOS = 10; // tope diario cuando el día incluye actividades combinadas
const MAX_COMBOS = 3; // máximo de actividades combinadas por día

// ---------- DATOS POR PAÍS (bandera, color y documentación) ----------
// VERIFICAR: confirmá los requisitos vigentes antes de publicar (visas según nacionalidad, etc.)
const PAISES = {
  Argentina: {
    bandera: "🇦🇷", color: "#2b86c5",
    documentos: [
      "DNI físico vigente (argentinos y residentes) o pasaporte vigente (extranjeros).",
      "Menores: documento propio y autorización de viaje si no van con ambos padres.",
    ],
  },
  Brasil: {
    bandera: "🇧🇷", color: "#1f8a4c",
    documentos: [
      "Pasaporte vigente o DNI físico en buen estado (ciudadanos del Mercosur). Otras nacionalidades: pasaporte y, según el país, visa.",
      "Menores: documento propio y autorización de viaje de ambos padres si no viajan con los dos.",
      "Se cruza la frontera con documento original: no se aceptan fotos ni fotocopias.",
    ],
  },
  Paraguay: {
    bandera: "🇵🇾", color: "#c93a30",
    documentos: [
      "Pasaporte vigente o DNI físico en buen estado (ciudadanos del Mercosur). Otras nacionalidades: pasaporte y, según el país, visa.",
      "Menores: documento propio y autorización de viaje de ambos padres si no viajan con los dos.",
      "Se cruza la frontera con documento original: no se aceptan fotos ni fotocopias.",
    ],
  },
};

// ---------- CATÁLOGO: 12 destinos ----------
// VERIFICAR: los horarios son orientativos y cambian según la temporada
const ATRACTIVOS = [
  { id: 1, entrada: { moneda: "ARS", general: 60000, etqGeneral: "General", local: 25000, etqLocal: "Argentinos" }, nombre: "Cataratas Argentinas", lugar: "Puerto Iguazú", pais: "Argentina", horas: 7, foto: "/fotos/cataratas-arg.jpg", resumen: "Vivís el lado más cercano y envolvente de las Cataratas: el Circuito Superior te lleva por pasarelas sobre el borde de los saltos y el Circuito Inferior te acerca al pie de las caídas, entre selva, arcoíris y rocío. El tren ecológico te deja frente a la Garganta del Diablo, donde el río se desploma con un rugido que se siente en el pecho. Un día completo para recorrer a tu ritmo, con coatíes, mariposas y tucanes en el camino.", desc: "Pasarelas sobre el río y la Garganta del Diablo, de cerca.", horario: "08:00 a 18:00 hs", llevar: ["Calzado cerrado y cómodo", "Piloto de lluvia", "Repelente", "Agua y protector solar", "Ropa de recambio"] },
  { id: 2, entrada: { moneda: "BRL", general: 134, etqGeneral: "Extranjeros", local: 121, etqLocal: "Mercosur" }, nombre: "Cataratas Brasileñas", lugar: "Foz do Iguaçu", pais: "Brasil", horas: 4, foto: "/fotos/cataratas-br.jpg", resumen: "Es la vista panorámica frontal que todos sueñan: el sendero recorre la ladera brasileña y te muestra el conjunto completo de saltos con el lado argentino de fondo. Al final, una pasarela avanza sobre el salto Floriano hasta dejarte casi dentro de la caída de agua. Perfecto para fotos inolvidables y para entender la magnitud de las Cataratas.", desc: "La vista panorámica completa de todos los saltos.", horario: "09:00 a 17:00 hs", llevar: ["Piloto de lluvia", "Calzado cómodo", "Protector solar y gorra", "Agua"] },
  { id: 3, entrada: { moneda: "BRL", general: 110 }, nombre: "Parque das Aves", lugar: "Foz do Iguaçu", pais: "Brasil", horas: 3, foto: "/fotos/parque-aves.jpg", resumen: "Una inmersión en viveros gigantes donde caminás entre tucanes, guacamayos, loros y flamencos que vuelan libres a tu alrededor, en plena selva. Los senderos pasan por aviarios abiertos y te permiten ver de cerca especies de colores increíbles, además de mariposas. Ideal para ir en familia y sacar fotos únicas.", desc: "Tucanes, guacamayos y aviarios abiertos dentro de la selva.", horario: "08:30 a 17:00 hs", llevar: ["Repelente", "Calzado cerrado", "Protector solar", "Agua"] },
  { id: 4, entrada: { moneda: "BRL", general: 63, etqGeneral: "Panorámica" }, nombre: "Represa de Itaipú", lugar: "Foz do Iguaçu", pais: "Brasil", horas: 3, foto: "/fotos/itaipu.jpg", resumen: "Conocés por dentro una de las mayores hidroeléctricas del planeta. El recorrido guiado te lleva frente al imponente muro de la represa y sus vertederos, mientras te cuentan cómo se genera la energía que comparten Brasil y Paraguay. Un paseo que impresiona por su escala y por la ingeniería detrás de cada detalle.", desc: "Visita guiada a una de las mayores hidroeléctricas del mundo.", horario: "08:00 a 16:00 hs", llevar: ["Documento original (se controla el ingreso)", "Calzado cerrado", "Ropa cómoda"] },
  { id: 5, entrada: { moneda: "USD", general: 4 }, nombre: "Minas de Wanda", lugar: "Misiones", pais: "Argentina", horas: 3, foto: "/fotos/wanda.jpg", resumen: "Descendés a antiguas minas a cielo abierto donde las paredes de piedra esconden amatistas, ágatas y cuarzos que brillan a la luz. Con un guía recorrés los túneles y aprendés cómo se extraen y trabajan las gemas. Al final podés ver el taller y llevarte un recuerdo auténtico de la tierra colorada de Misiones.", desc: "Antiguas minas de piedras semipreciosas: amatista, ágata y cuarzo.", horario: "08:00 a 17:30 hs", llevar: ["Calzado cómodo", "Abrigo liviano para la mina", "Efectivo para compras"] },
  { id: 6, entrada: { gratis: true }, nombre: "Compras en Ciudad del Este", lugar: "Paraguay", pais: "Paraguay", horas: 4, foto: "/fotos/ciudad-este.jpg", resumen: "Cruzás el Puente de la Amistad y te sumergís en uno de los centros comerciales más vibrantes de la región. Recorrés galerías con electrónica, perfumes, indumentaria y mucho más, con un ritmo intenso y lleno de ofertas. Con guía y chofer el día es más fácil, más seguro y mucho más rendidor.", desc: "Tiendas de electrónica, perfumes y mucho más a precios libres de impuestos.", horario: "07:00 a 17:00 hs", llevar: ["Efectivo (dólares o guaraníes)", "Mochila pequeña", "Calzado cómodo", "Agua"] },
  { id: 7, entrada: { gratis: true }, nombre: "Hito Tres Fronteras", lugar: "Puerto Iguazú", pais: "Argentina", horas: 1.5, foto: "/fotos/hito.jpg", resumen: "Un mirador privilegiado sobre la confluencia de los ríos Iguazú y Paraná, donde en una sola postal ves tres países: Argentina, Brasil y Paraguay. Cada orilla tiene su obelisco con los colores de su bandera, y el paseo costero es ideal para caminar sin apuro. Un clásico para el atardecer y para llevarte una foto muy especial.", desc: "Mirador donde se juntan los ríos Iguazú y Paraná y se ven los tres países.", horario: "08:00 a 20:00 hs", llevar: ["Cámara o celular", "Repelente", "Protector solar"] },
  { id: 8, entrada: { moneda: "ARS", general: 35000 }, nombre: "GüiráOga", lugar: "Puerto Iguazú", pais: "Argentina", horas: 2, foto: "/fotos/guiraoga.jpg", resumen: "Un centro de rescate donde recorrés senderos de selva y conocés de cerca aves, monos, reptiles y otros animales rescatados que se están recuperando. Los guías te cuentan sus historias y cómo se trabaja para devolverlos a su hábitat. Una experiencia tranquila, educativa y muy emotiva.", desc: "Centro de rescate de fauna silvestre en plena selva misionera.", horario: "09:00 a 17:00 hs", llevar: ["Repelente", "Calzado cerrado", "Agua"] },
  { id: 9, entrada: { moneda: "ARS", general: 8000 }, nombre: "La Aripuca", lugar: "Puerto Iguazú", pais: "Argentina", horas: 1.5, foto: "/fotos/aripuca.jpg", resumen: "Una gran construcción hecha con troncos enormes de árboles nativos, inspirada en las trampas que usaban los guaraníes para cazar. Adentro descubrís la historia de la selva misionera, maderas de la región y un espacio de artesanías. Un paseo corto, sorprendente y perfecto para completar tu día en Puerto Iguazú.", desc: "Gran construcción de troncos de árboles nativos, inspirada en una trampa guaraní.", horario: "09:00 a 18:00 hs", llevar: ["Calzado cómodo", "Protector solar", "Efectivo para artesanías"] },
  { id: 10, entrada: { moneda: "ARS", general: 19000, etqGeneral: "Extranjeros", local: 8000, etqLocal: "Argentinos" }, nombre: "Ruinas de San Ignacio", lugar: "Misiones", pais: "Argentina", horas: 5, foto: "/fotos/san-ignacio.jpg", resumen: "Caminás entre las imponentes ruinas de arenisca roja de una de las misiones jesuítico-guaraníes mejor conservadas, Patrimonio de la Humanidad. Recorrés la plaza, la iglesia y los claustros mientras el guía te cuenta cómo vivían jesuitas y guaraníes. Un viaje en el tiempo en medio de la selva.", desc: "Misión jesuítico-guaraní de piedra roja, declarada Patrimonio de la Humanidad.", horario: "07:30 a 18:00 hs", llevar: ["Sombrero o gorra", "Protector solar", "Calzado cómodo", "Agua"] },
  { id: 11, entrada: { gratis: true }, nombre: "Templo Budista Chen Tien", lugar: "Foz do Iguaçu", pais: "Brasil", horas: 1.5, foto: "/fotos/templo-budista.jpg", resumen: "Un rincón de calma con arquitectura de inspiración china, jardines cuidados y esculturas que invitan a la contemplación. Es el lugar perfecto para hacer una pausa, caminar en silencio y tomar fotos distintas a todo lo que verás en el viaje. Corto, sereno y muy fotogénico.", desc: "Templo tranquilo con jardines y esculturas, ideal para una pausa.", horario: "09:00 a 17:00 hs", llevar: ["Ropa discreta y respetuosa", "Calzado fácil de quitar", "Agua"] },
  { id: 12, entrada: { moneda: "USD", general: 12, etqGeneral: "Extranjeros", local: 9, etqLocal: "Mercosur" }, nombre: "Saltos del Monday", lugar: "Presidente Franco", pais: "Paraguay", horas: 2.5, foto: "/fotos/saltos-monday.jpg", resumen: "Una caída de agua rodeada de selva sobre el río Monday, con pasarelas y miradores para verla desde varios ángulos. El sonido del agua y el verde intenso lo hacen un lugar ideal para desconectar y refrescarse. Una joya natural que casi nadie conoce, a pocos kilómetros de Ciudad del Este.", desc: "Cascada sobre el río Monday, a pocos kilómetros de Ciudad del Este.", horario: "08:00 a 17:00 hs", llevar: ["Calzado antideslizante", "Traje de baño y toalla", "Repelente", "Agua"] },
];

// ---------- ACTIVIDADES COMBINABLES (se habilitan al agregar el parque principal) ----------
// padre: id del parque principal (1 = Cataratas Argentinas, 2 = Cataratas Brasileñas)
// VERIFICAR: horarios, duraciones y requisitos son orientativos
const PANELES = {
  1: { titulo: "¡Potenciá tu visita dentro del Parque!" },
  2: { titulo: "¡Combiná tu día en Foz do Iguaçu! (Recorridos cercanos ideales para el mismo día)" },
};
const COMBOS = [
  { id: "gran-aventura", padre: 1, entrada: { moneda: "ARS", general: 100000 }, nombre: "Gran Aventura (Paseo Náutico + Selva 4x4)", lugar: "Parque Nacional Iguazú", pais: "Argentina", horas: 1.5, duracion: "1 h 30 min aprox.", horario: "09:00 a 15:30 hs (según temporada)", foto: "/fotos/gran-aventura.jpg",
    desc: "Recorrés la selva en vehículo 4x4 con guía y después navegás en lancha por el río hasta quedar al pie de los saltos. Terminás empapado, feliz y con las mejores fotos de la visita.",
    requisitos: ["Ropa y calzado que se puedan mojar", "Traje de baño, toalla y ropa de recambio", "No recomendado para embarazadas ni personas con problemas de columna", "Edad mínima según el operador"] },
  { id: 3, padre: 2, entrada: { moneda: "BRL", general: 110 }, nombre: "Parque das Aves", lugar: "Foz do Iguaçu", pais: "Brasil", horas: 3, duracion: "2 a 3 hs", horario: "08:30 a 17:00 hs", foto: "/fotos/parque-aves.jpg",
    desc: "Viveros gigantes con tucanes, guacamayos y flamencos que vuelan libres a tu alrededor, a pasos de la entrada de las Cataratas.",
    requisitos: ["Repelente", "Calzado cerrado", "Protector solar"] },
  { id: "macuco-safari", padre: 2, entrada: { moneda: "BRL", general: 384 }, nombre: "Macuco Safari", lugar: "Foz do Iguaçu", pais: "Brasil", horas: 2, duracion: "2 hs aprox.", horario: "09:00 a 16:30 hs", foto: "/fotos/macuco-safari.jpg",
    desc: "Aventura náutica y selva del lado brasileño: vehículo eléctrico por el bosque, una caminata hasta un salto y navegación en lancha bajo las caídas de agua.",
    requisitos: ["Ropa que se pueda mojar", "Calzado cerrado", "No recomendado para embarazadas ni personas con problemas de espalda"] },
  { id: "helisul", padre: 2, entrada: { moneda: "BRL", general: 735 }, nombre: "Helisul", lugar: "Foz do Iguaçu", pais: "Brasil", horas: 0.5, duracion: "30 min aprox.", horario: "09:00 a 17:00 hs", foto: "/fotos/helisul.jpg",
    desc: "Sobrevuelo panorámico en helicóptero sobre las Cataratas: ves todos los saltos, el río y la selva desde el aire. Los minutos más impactantes del viaje.",
    requisitos: ["Documento y datos de cada pasajero", "Sujeto al clima y a la disponibilidad"] },
  { id: "aquafoz", padre: 2, entrada: { moneda: "BRL", general: 150 }, nombre: "AquaFoz", lugar: "Foz do Iguaçu", pais: "Brasil", horas: 2, duracion: "2 hs aprox.", horario: "10:00 a 18:00 hs", foto: "/fotos/aquafoz.jpg",
    desc: "Uno de los acuarios más grandes de Sudamérica, en la entrada del Parque Nacional. Túneles de vidrio con peces de agua dulce y salada, ideal para ir con chicos.",
    requisitos: ["Calzado cómodo", "Abrigo liviano por el aire acondicionado"] },
  { id: "dreamland", padre: 2, entrada: { moneda: "BRL", general: 159 }, nombre: "Dreamland (Museo de Cera)", lugar: "Foz do Iguaçu", pais: "Brasil", horas: 2, duracion: "2 hs aprox.", horario: "09:00 a 18:00 hs", foto: "/fotos/dreamland.jpg",
    desc: "Museo de cera y complejo temático sobre la Av. das Cataratas, con personajes famosos, escenarios para fotos y atracciones para toda la familia.",
    requisitos: ["Cámara o celular para fotos", "Ropa cómoda"] },
];

// ---------- PLANES SUGERIDOS (se cargan en 1 clic) ----------
// Cada día: principales = ids de ATRACTIVOS, combos = ids de COMBOS (se enlazan a su parque principal)
const PLANES = [
  { id: "escapada", icono: "🌊", nombre: "Escapada 2 días", detalle: "Cataratas de ambos lados",
    dias: [
      { principales: [1], combos: [] }, // Día 1 Argentina
      { principales: [2], combos: [3] }, // Día 2 Brasil: Cataratas Brasileñas + Parque das Aves
    ] },
  { id: "clasico", icono: "🧭", nombre: "Clásico 3 días", detalle: "Argentina, Brasil y Paraguay",
    dias: [
      { principales: [1, 7], combos: [] }, // Día 1 Argentina: Cataratas Argentinas + Hito Tres Fronteras
      { principales: [2], combos: [3] }, // Día 2 Brasil
      { principales: [6, 12], combos: [] }, // Día 3 Paraguay: Ciudad del Este + Saltos del Monday
    ] },
  { id: "aventura", icono: "🚤", nombre: "Aventura 4 días", detalle: "Con Gran Aventura y Macuco",
    dias: [
      { principales: [1], combos: ["gran-aventura"] }, // Día 1 Argentina
      { principales: [2], combos: ["macuco-safari", 3] }, // Día 2 Brasil
      { principales: [5, 8], combos: [] }, // Día 3 Argentina: Minas de Wanda + GüiráOga
      { principales: [4, 11], combos: [] }, // Día 4 Brasil: Itaipú + Templo Budista
    ] },
];

// ---------- TURISMO AVENTURA (tours privados a medida, sin precio fijo) ----------
// Cuando tengas las ilustraciones en acuarela, guardalas en public/fotos/ con estos nombres.
const AVENTURA = [
  {
    id: "av-bici",
    nombre: "Paseos en bicicleta",
    foto: "/fotos/aventura-bici.jpg",
    desc: "Recorridos privados en bicicleta por senderos y caminos naturales de la región, adaptados a tu ritmo.",
  },
  {
    id: "av-kayak",
    nombre: "Kayak",
    foto: "/fotos/aventura-kayak.jpg",
    desc: "Travesía privada en kayak por ríos y arroyos rodeados de selva misionera, con equipamiento incluido.",
  },
  {
    id: "av-aves",
    nombre: "Bird Watching",
    foto: "/fotos/aventura-aves.jpg",
    desc: "Salida privada de observación de aves autóctonas en selva, ideal para aficionados y fotógrafos de naturaleza.",
  },
  {
    id: "av-sunset",
    nombre: "Sunset en la Selva",
    foto: "/fotos/aventura-sunset.jpg",
    desc: "Experiencia privada al atardecer en un entorno natural único de la selva misionera.",
  },
];

// ---------- Mapas (se buscan por nombre, sin API Key) ----------
const MAPAS = [
  { id: "m1", nombre: "Parque Nacional Iguazú", pais: "Argentina", consulta: "Parque Nacional Iguazú, Misiones, Argentina" },
  { id: "m2", nombre: "Parque Nacional do Iguaçu", pais: "Brasil", consulta: "Parque Nacional do Iguaçu, Foz do Iguaçu, Brasil" },
  { id: "m3", nombre: "Minas de Wanda", pais: "Argentina", consulta: "Minas de Wanda, Misiones, Argentina" },
  { id: "m4", nombre: "Microcentro de Ciudad del Este", pais: "Paraguay", consulta: "Microcentro, Ciudad del Este, Paraguay" },
];

// Imagen que prueba una ruta alternativa si la primera falla (por ejemplo .png -> .jpg)
function ImagenRespaldo({ src, respaldo, alt, className, fallback = null }) {
  const [actual, setActual] = useState(src);
  const [falla, setFalla] = useState(false);
  if (falla) return fallback;
  return (
    <img className={className} src={actual} alt={alt}
      onError={() => { if (respaldo && actual !== respaldo) setActual(respaldo); else setFalla(true); }} />
  );
}

// Carrusel: auto-play con efecto Ken Burns, miniaturas, visor a pantalla completa y swipe móvil.
// Precarga cada foto y oculta automáticamente las que no existen.
const INTERVALO_CARRUSEL = 4000; // milisegundos entre fotos

function Carrusel({ fotos, nombre }) {
  const [estado, setEstado] = useState({}); // { ruta: true | false }
  const [i, setI] = useState(0);
  const [hover, setHover] = useState(false); // mouse encima
  const [tocando, setTocando] = useState(false); // dedo sobre el carrusel
  const [abierto, setAbierto] = useState(false); // visor en pantalla completa
  const toqueX = useRef(0);
  const temporizadorToque = useRef(null);

  useEffect(() => {
    let vivo = true;
    fotos.forEach((src) => {
      const img = new Image();
      img.onload = () => vivo && setEstado((e) => ({ ...e, [src]: true }));
      img.onerror = () => vivo && setEstado((e) => ({ ...e, [src]: false }));
      img.src = src;
    });
    return () => { vivo = false; };
  }, [fotos]);

  const visibles = fotos.filter((src) => estado[src] === true);
  const cargando = fotos.some((src) => estado[src] === undefined);
  const n = visibles.length;
  const idx = Math.min(i, Math.max(n - 1, 0));
  const pausado = hover || tocando;
  const ir = (k) => setI(((k % n) + n) % n);

  // Auto-play: avanza solo, se pausa con mouse/dedo o con el visor abierto
  useEffect(() => {
    if (n < 2 || pausado || abierto) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((idx + 1) % n), INTERVALO_CARRUSEL);
    return () => clearTimeout(t);
  }, [idx, n, pausado, abierto]);

  // Visor: Escape cierra, flechas del teclado navegan, y se bloquea el scroll de fondo
  useEffect(() => {
    if (!abierto) return;
    const alTeclear = (e) => {
      if (e.key === "Escape") setAbierto(false);
      else if (e.key === "ArrowRight") setI((idx + 1) % n);
      else if (e.key === "ArrowLeft") setI((idx - 1 + n) % n);
    };
    window.addEventListener("keydown", alTeclear);
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", alTeclear);
      document.body.style.overflow = previo;
    };
  }, [abierto, idx, n]);

  useEffect(() => () => clearTimeout(temporizadorToque.current), []);

  // Swipe táctil: deslizar a la izquierda = siguiente, a la derecha = anterior
  const alTocar = (e) => {
    toqueX.current = e.touches[0].clientX;
    clearTimeout(temporizadorToque.current);
    setTocando(true);
  };
  const alSoltar = (e) => {
    const dx = e.changedTouches[0].clientX - toqueX.current;
    if (Math.abs(dx) > 40 && n > 1) ir(idx + (dx < 0 ? 1 : -1));
    temporizadorToque.current = setTimeout(() => setTocando(false), 3000); // reanuda el auto-play
  };

  if (n === 0) {
    return (
      <div className="carrusel foto-fallback car-vacio">
        {cargando ? "Cargando fotos…" : "Próximamente más fotos"}
      </div>
    );
  }

  const parar = (fn) => (e) => { e.stopPropagation(); fn(); };

  return (
    <div className="car-wrap">
      <div
        className={`carrusel clic ${pausado ? "pausado" : ""}`}
        aria-roledescription="carrusel"
        onClick={() => setAbierto(true)}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setHover(false)}
        onTouchStart={alTocar}
        onTouchEnd={alSoltar}
      >
        {visibles.map((src, k) => (
          <img key={src} className={`slide ${k === idx ? "activa" : ""}`} src={src}
            alt={k === idx ? `${nombre}: foto ${idx + 1} de ${n}` : ""} aria-hidden={k !== idx} />
        ))}

        {n > 1 && (
          <>
            <button className="car-btn prev" aria-label="Foto anterior" onClick={parar(() => ir(idx - 1))}>‹</button>
            <button className="car-btn next" aria-label="Foto siguiente" onClick={parar(() => ir(idx + 1))}>›</button>
          </>
        )}

        <div className="car-badge" onClick={(e) => e.stopPropagation()}>
          <span>{idx + 1} / {n}</span>
          <button className="car-ampliar" onClick={() => setAbierto(true)}>🔍 Ampliar foto</button>
        </div>
      </div>

      {n > 1 && (
        <div className="thumbs">
          {visibles.map((src, k) => (
            <button key={src} className={`thumb ${k === idx ? "activa" : ""}`} aria-label={`Ver foto ${k + 1}`} aria-current={k === idx} onClick={() => ir(k)}>
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}

      {abierto && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Fotos de ${nombre}`}
          onClick={() => setAbierto(false)} onTouchStart={alTocar} onTouchEnd={alSoltar}>
          <button className="lb-cerrar" aria-label="Cerrar visor" autoFocus onClick={parar(() => setAbierto(false))}>✕</button>
          <span className="lb-cont">{idx + 1} / {n}</span>
          {n > 1 && <button className="lb-btn prev" aria-label="Foto anterior" onClick={parar(() => ir(idx - 1))}>‹</button>}
          <img className="lb-img" src={visibles[idx]} alt={`${nombre}: foto ${idx + 1} de ${n}`} onClick={(e) => e.stopPropagation()} />
          {n > 1 && <button className="lb-btn next" aria-label="Foto siguiente" onClick={parar(() => ir(idx + 1))}>›</button>}
        </div>
      )}
    </div>
  );
}

// ---------- DIVISAS Y VALORES DE ENTRADA ----------
const MONEDAS = {
  ARS: { simbolo: "$", nombre: "Pesos Argentinos", decimales: 0 },
  BRL: { simbolo: "R$", nombre: "Reales", decimales: 2 },
  USD: { simbolo: "US$", nombre: "Dólares", decimales: 2 },
  PYG: { simbolo: "Gs", nombre: "Guaraníes", decimales: 0 },
};
// Convierte pasando por dólares; al convertir redondea para que los valores sean legibles
const convertir = (monto, desde, hasta) => {
  if (desde === hasta) return monto;
  const usd = desde === "USD" ? monto : monto / TASAS_CAMBIO[`USD_${desde}`];
  const valor = hasta === "USD" ? usd : usd * TASAS_CAMBIO[`USD_${hasta}`];
  if (hasta === "ARS") return Math.round(valor / 100) * 100;
  if (hasta === "PYG") return Math.round(valor / 1000) * 1000;
  return Math.round(valor * 100) / 100;
};
const formatear = (monto, moneda) =>
  `${MONEDAS[moneda].simbolo} ${new Intl.NumberFormat("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: MONEDAS[moneda].decimales }).format(monto)}`;

// Texto de la entrada en la divisa elegida: "Gratis", un valor único, o valor general + argentino/Mercosur
const textoEntrada = (e, divisa) => {
  if (!e) return "Consultar en boletería";
  if (e.gratis) return "Gratis";
  const aprox = e.moneda !== divisa ? "≈ " : "";
  const f = (v) => aprox + formatear(convertir(v, e.moneda, divisa), divisa);
  const etq = e.etqGeneral ? `${e.etqGeneral} ` : "";
  return e.local != null ? `${etq}${f(e.general)} · ${e.etqLocal} ${f(e.local)}` : `${etq}${f(e.general)}`;
};
const textoOficial = (e) =>
  `Valor oficial: ${e.etqGeneral ? `${e.etqGeneral} ` : ""}${formatear(e.general, e.moneda)}${e.local != null ? ` · ${e.etqLocal} ${formatear(e.local, e.moneda)}` : ""}`;
const costoEntrada = (e, divisa, tarifaLocal) => {
  if (!e || e.gratis) return 0;
  return convertir(tarifaLocal && e.local != null ? e.local : e.general, e.moneda, divisa);
};

// Campanita suave de dos notas ascendentes (Web Audio API, sin archivos de audio)
let contextoAudio = null;
function reproducirCampanita() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!contextoAudio) contextoAudio = new AC();
    const ctx = contextoAudio;
    if (ctx.state === "suspended") ctx.resume();
    const maestro = ctx.createGain();
    maestro.gain.value = 0.5;
    maestro.connect(ctx.destination);
    const t0 = ctx.currentTime + 0.01;
    // Do6 -> Mi6: cada nota mezcla la fundamental con dos armónicos que se apagan rápido (timbre de marimba/campanita)
    [[1046.5, 0], [1318.5, 0.12]].forEach(([freq, retraso]) => {
      const t = t0 + retraso;
      [[1, 0.5, 0.55], [2, 0.18, 0.28], [3, 0.06, 0.14]].forEach(([mult, vol, dur]) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq * mult;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc.connect(g);
        g.connect(maestro);
        osc.start(t);
        osc.stop(t + dur + 0.05);
      });
    });
  } catch (e) {
    /* si el navegador no permite audio, simplemente no suena */
  }
}

// "Deslizá para conectar": arrastrar hacia la derecha (dedo o mouse) llena la barra verde y conecta al soltar
const UMBRAL_DESLIZAR = 150; // píxeles que hay que arrastrar
function Deslizable({ etiqueta = "article", className, onConectar, deshabilitado, children }) {
  const Etiqueta = etiqueta;
  const [dx, setDx] = useState(0);
  const [activo, setActivo] = useState(false);
  const inicio = useRef(null);

  const empezar = (x, e) => {
    if (deshabilitado || e.target.closest("select, button, input, a, label")) return; // no interferir con los controles
    inicio.current = x;
    setActivo(true);
  };
  const mover = (x) => { if (inicio.current !== null) setDx(Math.max(0, x - inicio.current)); };
  const cancelar = () => { inicio.current = null; setActivo(false); setDx(0); };
  const terminar = () => {
    if (inicio.current === null) return;
    const conecta = dx >= UMBRAL_DESLIZAR;
    cancelar();
    if (conecta) onConectar();
  };
  const progreso = Math.min(1, dx / UMBRAL_DESLIZAR);

  return (
    <Etiqueta
      className={`${className} deslizable ${deshabilitado ? "" : "puede"} ${activo ? "arrastrando" : ""}`}
      style={{ transform: `translateX(${Math.min(dx * 0.35, 52)}px)` }}
      onTouchStart={(e) => empezar(e.touches[0].clientX, e)}
      onTouchMove={(e) => mover(e.touches[0].clientX)}
      onTouchEnd={terminar}
      onTouchCancel={cancelar}
      onMouseDown={(e) => empezar(e.clientX, e)}
      onMouseMove={(e) => mover(e.clientX)}
      onMouseUp={terminar}
      onMouseLeave={cancelar}
      onDragStart={(e) => e.preventDefault()}
    >
      {children}
      {!deshabilitado && (
        <div className="swipe" aria-hidden="true">
          <div className="swipe-fill" style={{ width: `${progreso * 100}%` }} />
          <span>{progreso >= 1 ? "¡Soltá para conectar!" : "Deslizá para conectar →"}</span>
        </div>
      )}
    </Etiqueta>
  );
}

// Barrita compacta de una actividad: miniatura, nombre, duración, entrada, badge "Conectado" y flecha Ver/Minimizar
function BarraResumen({ foto, nombre, meta, conectado, abierto, onClick }) {
  return (
    <button type="button" className="barra-act" aria-expanded={abierto} onClick={onClick}>
      <Foto className="barra-miniatura" src={foto} alt="" />
      <span className="barra-texto">
        <span className="barra-titulo">
          <span className="barra-nombre">{nombre}</span>
          {conectado && <span className="badge-conectado">✓ Conectado</span>}
        </span>
        <span className="barra-meta">{meta}</span>
      </span>
      <span className="barra-flecha"><b aria-hidden="true">{abierto ? "▴" : "▾"}</b>{abierto ? "Minimizar" : "Ver"}</span>
    </button>
  );
}

// Foto con respaldo: si el archivo no existe en public/fotos/, muestra un degradado prolijo
function Foto({ src, alt, className }) {
  const [falla, setFalla] = useState(false);
  if (falla) return <div className={`${className} foto-fallback`} role="img" aria-label={alt} />;
  return <img className={className} src={src} alt={alt} loading="lazy" onError={() => setFalla(true)} />;
}

export default function App() {
  // ---------- ESTADO ----------
  const [pestana, setPestana] = useState("destinos");
  const [dias, setDias] = useState(3);
  const [personas, setPersonas] = useState(2);
  const [movilidad, setMovilidad] = useState("no"); // "no" = necesita traslado, "si" = vehículo propio
  const [hotel, setHotel] = useState("");
  const [nombreTurista, setNombreTurista] = useState("");
  const [expandidas, setExpandidas] = useState({}); // actividades desplegadas: { idActividad: true }
  const [combosExpandidos, setCombosExpandidos] = useState({}); // combinables desplegadas: { idCombo: true }
  const [faltaNombre, setFaltaNombre] = useState(false); // resalta el campo nombre si falta al reservar
  const [planCargado, setPlanCargado] = useState(""); // nombre del último plan sugerido cargado
  const [carritoVisible, setCarritoVisible] = useState(false); // para ocultar la barra flotante si el carrito ya se ve
  const refNombre = useRef(null);
  const refCarrito = useRef(null);
  const [paisAbierto, setPaisAbierto] = useState(null); // acordeón: un país abierto a la vez
  const [infoAbierta, setInfoAbierta] = useState(null); // id de la actividad con panel informativo abierto
  const [diaSel, setDiaSel] = useState({}); // día elegido en cada tarjeta: { idActividad: nroDia }
  const [aviso, setAviso] = useState(null); // { id, texto } aviso de la tarjeta que falló
  const [avisoCombo, setAvisoCombo] = useState(null); // { id, texto } aviso de una actividad combinada
  const [avisoGlobal, setAvisoGlobal] = useState("");
  const [carrito, setCarrito] = useState([]); // [{ ...atractivo, dia }]
  const [divisa, setDivisa] = useState("ARS"); // moneda para ver los precios de referencia
  const [sonido, setSonido] = useState(true); // campanita activada / silenciada
  const sonar = () => { if (sonido) reproducirCampanita(); };

  useEffect(() => {
    const el = refCarrito.current;
    if (!el || !("IntersectionObserver" in window)) { setCarritoVisible(false); return; }
    const obs = new IntersectionObserver(([e]) => setCarritoVisible(e.isIntersecting), { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [pestana]);

  // ---------- FUNCIONES ----------
  const cambiarDias = (n) => {
    const fuera = carrito.filter((x) => x.dia > n);
    setDias(n);
    if (fuera.length) {
      setCarrito(carrito.filter((x) => x.dia <= n));
      setAvisoGlobal(`Se quitaron ${fuera.length} actividad(es) que estaban en días fuera de tu nueva estadía.`);
    } else setAvisoGlobal("");
  };

  const diaDe = (id) => Math.min(diaSel[id] ?? 1, dias);

  // Carga un plan sugerido: ajusta los días y llena el carrito (después se puede editar libremente)
  const cargarPlan = (plan) => {
    if (carrito.length && !window.confirm("Cargar este plan reemplaza las actividades que ya tenés en tu viaje. ¿Querés continuar?")) return;
    const items = [];
    plan.dias.forEach((d, i) => {
      d.principales.forEach((id) => {
        items.push({ ...ATRACTIVOS.find((x) => x.id === id), dia: i + 1, opcionalDe: null });
        d.combos
          .map((cid) => COMBOS.find((c) => c.id === cid && c.padre === id))
          .filter(Boolean)
          .forEach((c) => items.push({ ...c, dia: i + 1, opcionalDe: id }));
      });
    });
    setDias(plan.dias.length);
    setCarrito(items);
    setAviso(null);
    setAvisoCombo(null);
    setAvisoGlobal("");
    setPlanCargado(plan.nombre);
    sonar();
  };

  const horasDe = (items) => items.reduce((sum, x) => sum + x.horas, 0);
  const limiteDia = (items) => (items.some((x) => x.opcionalDe) ? HORAS_CON_COMBOS : HORAS_POR_DIA);

  // ¿La actividad entra en ese día? Un solo país, 8 hs de paseos principales y tope de 10 hs si hay combinadas
  const puedeEntrar = (a, d) => {
    const items = carrito.filter((x) => x.dia === d);
    const principales = items.filter((x) => !x.opcionalDe);
    return (
      (!items.length || items[0].pais === a.pais) &&
      horasDe(principales) + a.horas <= HORAS_POR_DIA &&
      horasDe(items) + a.horas <= limiteDia(items)
    );
  };

  const agregar = (a) => {
    const dia = diaDe(a.id);
    const delDia = carrito.filter((x) => x.dia === dia);
    const posibles = Array.from({ length: dias }, (_, i) => i + 1).filter((d) => puedeEntrar(a, d));
    const sugerencia = posibles.length
      ? ` Días disponibles para esta actividad: ${posibles.join(", ")}.`
      : " Ya no hay un día disponible: probá aumentar los días de estadía.";

    if (delDia.length && delDia[0].pais !== a.pais) {
      setAviso({ id: a.id, texto: `El Día ${dia} ya tiene actividades de ${delDia[0].pais}. Por los tiempos de cruce fronterizo (migraciones y aduana) no se pueden combinar dos países en el mismo día: asignala a otro día libre.${sugerencia}` });
      return;
    }
    if (!puedeEntrar(a, dia)) {
      setAviso({ id: a.id, texto: `El Día ${dia} ya tiene ${horasDe(delDia)} hs y esta actividad suma ${a.horas} hs: se pasaría del tope diario (${HORAS_POR_DIA} hs, o ${HORAS_CON_COMBOS} hs si incluye actividades combinadas).${sugerencia}` });
      return;
    }
    setAviso(null);
    setAvisoCombo(null);
    setAvisoGlobal("");
    sonar();
    setPlanCargado("");
    setCarrito([...carrito, { ...a, dia, opcionalDe: null }]);
    // Auto-minimiza la actividad al conectarla (excepto Cataratas, que muestran sus combinables)
    if (!COMBOS.some((c) => c.padre === a.id)) {
      setExpandidas((prev) => ({ ...prev, [a.id]: false }));
    }
  };

  // Suma una actividad combinada al mismo día que su parque principal
  const agregarCombo = (c, padre) => {
    const delDia = carrito.filter((x) => x.dia === padre.dia);
    const cantidad = delDia.filter((x) => x.opcionalDe).length;
    let texto = "";
    if (cantidad >= MAX_COMBOS) {
      texto = `Ya combinaste ${MAX_COMBOS} actividades en el Día ${padre.dia}: es el máximo para un mismo día.`;
    } else if (horasDe(delDia) + c.horas > HORAS_CON_COMBOS) {
      texto = `Con esta actividad el Día ${padre.dia} llegaría a ${horasDe(delDia) + c.horas} hs y el tope con actividades combinadas es de ${HORAS_CON_COMBOS} hs. Probá con una opción más corta o quitá otra.`;
    }
    if (texto) {
      setAvisoCombo({ id: c.id, texto });
      return;
    }
    setAvisoCombo(null);
    setAviso(null);
    sonar();
    setPlanCargado("");
    setCarrito([...carrito, { ...c, dia: padre.dia, opcionalDe: padre.id }]);
    // Auto-minimiza la actividad combinada al conectarla
    setCombosExpandidos((prev) => ({ ...prev, [c.id]: false }));
  };

  // Al quitar un parque principal también se quitan sus actividades combinadas
  const quitar = (id) => {
    setPlanCargado("");
    setCarrito(carrito.filter((a) => a.id !== id && a.opcionalDe !== id));
  };

  // ---------- CÁLCULOS ----------
  const horasTotales = carrito.reduce((s, a) => s + a.horas, 0);
  const presupuesto = carrito.reduce((t, a) => t + costoEntrada(a.entrada, divisa, false), 0) * personas; // tarifa general
  const presupuestoLocal = carrito.reduce((t, a) => t + costoEntrada(a.entrada, divisa, true), 0) * personas; // tarifa argentinos/Mercosur
  const porDia = Array.from({ length: dias }, (_, i) => {
    const dia = i + 1;
    const items = carrito.filter((x) => x.dia === dia);
    return { dia, items, pais: items[0]?.pais, horas: horasDe(items), limite: limiteDia(items) };
  });

  // ---------- MENSAJE DE WHATSAPP ----------
  const detalle = porDia
    .filter((d) => d.items.length)
    .map((d) => {
      const lineas = d.items
        .filter((x) => !x.opcionalDe)
        .map((a) => `  • ${a.nombre} (${a.horas} hs)` + d.items.filter((o) => o.opcionalDe === a.id).map((o) => ` + Opcional: ${o.nombre} (${o.horas} hs)`).join(""));
      return `Día ${d.dia} (${d.pais}) - ${d.horas} hs:\n${lineas.join("\n")}`;
    })
    .join("\n\n");
  const nombre = nombreTurista.trim();
  const saludo = nombre
    ? `¡Hola! Soy ${nombre} y me encantaría coordinar mi viaje por las Tres Fronteras con ustedes. Les comparto mi itinerario:`
    : "¡Hola! Me encantaría coordinar mi viaje por las Tres Fronteras con ustedes. Les comparto mi itinerario:";
  const mensajeReserva =
    `${saludo}\n\n` +
    `*Datos del viaje*\n- Días de estadía: ${dias}\n- Cantidad de personas: ${personas}\n` +
    `- Movilidad: ${movilidad === "si" ? "Tengo vehículo propio" : "No tengo, necesito traslado / chofer"}\n` +
    `- Alojamiento: ${hotel.trim() || "A confirmar"}\n\n*Itinerario*\n${detalle}\n\n` +
    `Total: ${horasTotales} hs de paseo.\n\n*Condiciones de reserva*\n- ${POLITICA_SENA}\n- ${POLITICA_ENTRADAS}\n\n` +
    `Quedo a la espera de los datos para abonar el 50% de seña de traslados y guías y confirmar la reserva. ¡Gracias!`;
  const mensajeConsulta = `Hola ${GUIA.nombre}, quiero consultar por excursiones en las Tres Fronteras.`;
  const linkWhatsApp = `https://wa.me/${GUIA.whatsapp}?text=${encodeURIComponent(carrito.length ? mensajeReserva : mensajeConsulta)}`;

  // Al reservar sin nombre: lleva al campo, lo resalta y pide el nombre antes de abrir WhatsApp
  const confirmarReserva = (e) => {
    if (nombre) return; // con nombre, el enlace abre WhatsApp normalmente
    e.preventDefault();
    setFaltaNombre(true);
    refNombre.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => refNombre.current?.focus({ preventScroll: true }), 500);
  };

  // Barra flotante móvil: desplaza suavemente hasta el carrito (cambia a Destinos si hace falta)
  const irAlCarrito = () => {
    const ir = () => refCarrito.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (pestana !== "destinos") { setPestana("destinos"); window.setTimeout(ir, 120); } else ir();
  };

  // Nodo de la línea de tiempo: ● Actividad ──▶ ● Actividad combinada
  const nodo = (a, opcional, primero) => (
    <div key={a.id} className={`nodo ${opcional ? "opcional" : ""}`}>
      <div>
        {!primero && <span className="flecha" aria-hidden="true">──▶</span>}
        {opcional && <span className="etq">+ Opcional</span>}
        <strong>{a.nombre}</strong>
        <small>{a.horas} hs · {a.lugar}</small>
      </div>
      <button className="btn-quitar" onClick={() => quitar(a.id)} aria-label={`Quitar ${a.nombre}`}>Quitar</button>
    </div>
  );

  const PESTANAS = [
    { id: "destinos", etiqueta: "Destinos", icono: "🏞️" },
    { id: "mapas", etiqueta: "Mapas", icono: "🗺️" },
    { id: "colab", etiqueta: "Colaboradores", icono: "🏨" },
    { id: "guia", etiqueta: "Contactos", icono: "💬" },
  ];

  return (
    <div className={`app ${carrito.length > 0 ? "con-barra" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; display: block; }
        .app { --tinta: #f4f4f5; --rio: #34d399; --niebla: #1c1c21; --papel: #141417; --suave: #a1a1aa;
          color-scheme: dark; text-align: left; min-height: 100vh; background: #09090b; color: var(--tinta);
          font-family: "Segoe UI", system-ui, sans-serif; padding: 24px 16px 48px; }
        .contenedor { max-width: 1100px; margin: 0 auto; }
        .app h1, .app h2, .app h3 { color: var(--tinta); }
        .app .portada { border-radius: 16px; padding: clamp(40px, 9vw, 96px) clamp(20px, 5vw, 48px); margin-bottom: 20px;
          background-color: #1b3a4b; background-image: linear-gradient(rgba(5,20,32,.55), rgba(5,20,32,.55)), url('/fotos/portada.jpg');
          background-size: cover; background-position: center; }
        .app .portada .titulo { color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,.4); margin: 0 0 8px; font-family: Georgia, serif; font-size: clamp(2rem, 5vw, 3.2rem); line-height: 1.1; }
        .app .portada .subtitulo { color: #fff; margin: 0; font-size: 1.05rem; text-shadow: 0 1px 6px rgba(0,0,0,.4); }
        .app button:focus-visible, .app select:focus-visible, .app input:focus-visible, .app a:focus-visible { outline: 3px solid #f2b705; outline-offset: 2px; }
        .caja { background: var(--papel); border-radius: 16px; padding: 20px; box-shadow: 0 2px 10px rgba(11,37,64,.12); }
        .caja h2 { margin: 0 0 14px; font-family: Georgia, serif; font-size: 1.35rem; }
        .form { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-bottom: 24px; }
        .campo label { display: block; font-weight: 700; margin-bottom: 6px; font-size: .92rem; }
        .campo select, .campo input { width: 100%; font-size: 1rem; padding: 10px 12px; border-radius: 8px; border: 2px solid var(--rio); background: var(--papel); color: var(--tinta); }
        .layout { display: grid; grid-template-columns: 1fr; gap: 24px; align-items: start; }
        @media (min-width: 900px) { .layout { grid-template-columns: 3fr 2fr; } .carrito { position: sticky; top: 16px; } }
        .paises { display: flex; flex-direction: column; gap: 14px; }
        .pais-bloque { background: var(--papel); border-radius: 16px; overflow: hidden; box-shadow: 0 2px 10px rgba(11,37,64,.12); border-left: 8px solid var(--c); }
        .pais-cab { width: 100%; display: flex; align-items: center; gap: 14px; padding: 16px 18px; border: none; background: transparent; color: var(--tinta); cursor: pointer; text-align: left; font-family: inherit; }
        .pais-bandera { font-size: 2.2rem; line-height: 1; }
        .pais-nombre { font-family: Georgia, serif; font-size: 1.35rem; font-weight: 700; display: block; }
        .pais-cant { font-size: .9rem; color: var(--suave); }
        .pais-flecha { margin-left: auto; font-size: 1.2rem; transition: transform .2s; }
        .pais-flecha.abierta { transform: rotate(180deg); }
        .pais-cuerpo { padding: 4px 18px 18px; display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; align-items: start; }
        .tarjeta { background: var(--niebla); border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; }
        .tarjeta-foto { width: 100%; height: 160px; object-fit: cover; display: block; background: #c5d6d1; }
        .tarjeta-cuerpo { padding: 14px; display: flex; flex-direction: column; gap: 8px; }
        .tarjeta h3 { margin: 0; font-size: 1.08rem; }
        .lugar { margin: 0; font-size: .88rem; color: var(--suave); }
        .desc { margin: 0; font-size: .9rem; line-height: 1.4; }
        .btn-info { border: 2px solid var(--rio); background: transparent; color: var(--rio); padding: 8px; border-radius: 10px; font-weight: 700; cursor: pointer; }
        .info { background: var(--papel); border-radius: 10px; padding: 12px; font-size: .88rem; line-height: 1.45; display: grid; gap: 10px; }
        .info h4 { margin: 0 0 4px; font-size: .85rem; color: var(--tinta); text-transform: uppercase; letter-spacing: .03em; }
        .info ul { margin: 0; padding-left: 18px; }
        .asignar { display: flex; gap: 8px; align-items: center; }
        .asignar select { padding: 9px 8px; border-radius: 8px; border: 2px solid var(--rio); background: var(--papel); color: var(--tinta); font-size: .95rem; }
        .btn-agregar { flex: 1; border: none; background: var(--tinta); color: #fff; padding: 10px; border-radius: 10px; font-size: .92rem; font-weight: 700; cursor: pointer; }
        .btn-agregar:disabled { background: #b9c7c4; color: #2f403d; cursor: default; }
        .alerta { margin: 0; padding: 10px 12px; border-radius: 10px; background: #f9d9d5; color: #5a120c; font-size: .88rem; line-height: 1.4; }
        .alerta.global { margin-bottom: 14px; background: #fdf0c4; color: #4d3b00; }
        .vacio { color: var(--suave); margin: 0 0 12px; }
        .foto-fallback { background: linear-gradient(135deg, #1f6f8b 0%, #1f8a4c 60%, #7bbf9a 100%); }
        .resumen { background: #e3f3f7; border-left: 4px solid var(--rio); border-radius: 8px; padding: 10px 12px; }
        .combos { grid-column: 1 / -1; background: #f6fbfa; border: 2px solid var(--c); border-radius: 14px; padding: 16px; }
        .combos h3 { margin: 0 0 4px; font-size: 1.15rem; }
        .combos-sub { margin: 0 0 14px; font-size: .9rem; color: var(--suave); }
        .combos-grilla { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; align-items: start; }
        .combo { background: var(--papel); border-radius: 12px; overflow: hidden; box-shadow: 0 1px 6px rgba(11,37,64,.12); }
        .combo-foto { width: 100%; height: 120px; object-fit: cover; display: block; }
        .combo-cuerpo { padding: 12px; display: flex; flex-direction: column; gap: 6px; }
        .combo h4 { margin: 0; font-size: 1rem; color: var(--tinta); }
        .combo-datos { margin: 0; font-size: .84rem; line-height: 1.4; }
        .item.opcional { margin-left: 14px; padding-left: 10px; border-left: 3px solid #e0a800; }
        .etq { display: inline-block; font-size: .72rem; font-weight: 700; background: #fff4c7; color: #3d2f00; border-radius: 999px; padding: 1px 8px; margin-bottom: 2px; }
        .dia { border-radius: 12px; border: 2px solid #d4e0dc; padding: 10px 12px; margin-bottom: 10px; }
        .dia.activo { border-color: var(--c); }
        .dia-cab { display: flex; justify-content: space-between; gap: 8px; font-weight: 700; margin-bottom: 6px; }
        .dia-libre { color: var(--suave); font-weight: 400; }
        .item { display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 6px 0; border-top: 1px solid #e3ebe8; }
        .item small { display: block; color: var(--suave); }
        .btn-quitar { border: none; background: transparent; color: #a82a21; font-weight: 700; cursor: pointer; padding: 6px 8px; }
        .totales { display: flex; justify-content: space-between; font-weight: 700; margin: 12px 0; }
        .condiciones { background: #fff4c7; border: 2px solid #e0a800; border-radius: 12px; padding: 14px; margin-bottom: 14px; color: #3d2f00; line-height: 1.45; }
        .condiciones strong { display: block; margin-bottom: 4px; }
        .btn-whatsapp { display: block; width: 100%; text-align: center; text-decoration: none; border: none; background: #1a8f45; color: #fff !important; padding: 14px; border-radius: 12px; font-size: 1.02rem; font-weight: 700; cursor: pointer; }
        .btn-whatsapp:disabled { background: #b9c7c4; color: #2f403d !important; cursor: default; }
        .nota { font-size: .88rem; color: var(--suave); margin: 10px 0 0; }
        .pais-tag { font-size: .8rem; padding: 2px 10px; border-radius: 999px; color: #fff; }
        .Argentina { background: #2b86c5; } .Brasil { background: #1f8a4c; } .Paraguay { background: #c93a30; }
        .grilla-mapas { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
        .mapa-tarjeta { background: var(--papel); border-radius: 16px; overflow: hidden; box-shadow: 0 2px 10px rgba(11,37,64,.12); }
        .mapa-tarjeta iframe { width: 100%; height: 260px; border: 0; display: block; }
        .mapa-info { padding: 16px; display: flex; flex-direction: column; gap: 10px; }
        .mapa-info h3 { margin: 0; font-size: 1.1rem; }
        .btn-link { display: inline-block; text-align: center; text-decoration: none; background: var(--rio); color: #fff; padding: 10px 14px; border-radius: 10px; font-weight: 700; }
        /* Tarjeta personal del guía: la opacidad de la capa (0.80) se regula en .guia-capa */
        .guia-card { max-width: 640px; border-radius: 28px; overflow: hidden; padding: clamp(16px, 4vw, 34px);
          background: url('/fotos/tarjeta-guia.jpg') center / cover no-repeat, linear-gradient(135deg, #2f6f55 0%, #1f6f8b 60%, #7bbf9a 100%);
          box-shadow: 0 30px 60px -18px rgba(11,37,64,.55), 0 8px 20px rgba(11,37,64,.25); }
        .guia-capa { background: rgba(255,255,255,.80); -webkit-backdrop-filter: blur(2px); backdrop-filter: blur(2px);
          border: 1px solid rgba(255,255,255,.7); border-radius: 22px; padding: clamp(20px, 4vw, 34px); }
        .guia-sello { display: inline-block; font-size: .78rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #fff; background: #1f6f4f; border-radius: 999px; padding: 4px 12px; }
        .guia-capa h2 { margin: 12px 0 4px; font-family: Georgia, serif; font-size: clamp(1.5rem, 4vw, 2rem); line-height: 1.15; }
        .guia-titulo { margin: 0 0 18px; color: var(--suave); font-weight: 600; }
        .guia-datos { list-style: none; margin: 0 0 20px; padding: 0; display: grid; gap: 10px; font-size: 1.05rem; font-weight: 600; }
        .guia-datos a { color: var(--tinta); text-decoration: none; border-bottom: 2px solid rgba(31,111,79,.5); }
        .guia-botones { display: flex; flex-wrap: wrap; gap: 10px; }
        .guia-botones .btn-whatsapp, .guia-botones .btn-mail { width: auto; flex: 1 1 170px; }
        .btn-mail { display: block; text-align: center; text-decoration: none; background: var(--tinta); color: #fff !important; padding: 14px; border-radius: 12px; font-size: 1.02rem; font-weight: 700; }
        /* Colaboradores */
        .colab-card { background: var(--papel); border-radius: 24px; overflow: hidden; margin-bottom: 24px; border-top: 8px solid #1f8a4c; box-shadow: 0 18px 40px -14px rgba(11,37,64,.4); }
        .colab-cab { display: flex; flex-wrap: wrap; align-items: center; gap: 20px; padding: 24px 24px 8px; }
        .medallon { width: 120px; height: 120px; flex: none; border-radius: 50%; background: #fff; border: 4px solid #1f8a4c; box-shadow: 0 8px 20px rgba(11,37,64,.25); display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .medallon img { width: 100%; height: 100%; object-fit: contain; padding: 8px; }
        .medallon-ini { font-family: Georgia, serif; font-size: 2.2rem; font-weight: 700; color: #1f8a4c; }
        .colab-cab h2 { margin: 6px 0; font-family: Georgia, serif; font-size: clamp(1.5rem, 4vw, 2rem); }
        .badge { display: inline-block; font-size: .75rem; font-weight: 700; background: #fff4c7; color: #3d2f00; border: 1px solid #e0a800; border-radius: 999px; padding: 2px 10px; }
        .cat { display: inline-block; font-size: .85rem; font-weight: 700; color: #fff; background: #1f6f8b; border-radius: 999px; padding: 3px 12px; }
        .colab-cuerpo { display: grid; grid-template-columns: 1fr; gap: 22px; padding: 16px 24px 26px; align-items: start; }
        @media (min-width: 820px) { .colab-cuerpo { grid-template-columns: 1.2fr 1fr; } }
        .car-wrap { min-width: 0; }
        .carrusel { position: relative; border-radius: 16px; overflow: hidden; background: #0d2a35; aspect-ratio: 4 / 3; }
        .carrusel.clic { cursor: zoom-in; }
        .carrusel .slide { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; opacity: 0; transform: scale(1.06); transition: opacity .9s ease; }
        /* Ken Burns: zoom lento de 1 a 1.06 mientras la foto está activa */
        .carrusel .slide.activa { opacity: 1; animation: kenburns 5s linear forwards; }
        .carrusel.pausado .slide.activa { animation-play-state: paused; }
        @keyframes kenburns { from { transform: scale(1); } to { transform: scale(1.06); } }
        @media (prefers-reduced-motion: reduce) { .carrusel .slide.activa { animation: none; transform: scale(1); } }
        .car-vacio { display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; }
        .car-btn { position: absolute; top: 50%; transform: translateY(-50%); z-index: 2; width: 44px; height: 44px; border-radius: 50%; border: none; background: rgba(255,255,255,.9); color: var(--tinta); font-size: 1.8rem; line-height: 1; cursor: pointer; }
        .car-btn.prev { left: 10px; } .car-btn.next { right: 10px; }
        .car-badge { position: absolute; left: 12px; bottom: 12px; z-index: 2; display: flex; align-items: center; gap: 10px; padding: 5px 6px 5px 14px; border-radius: 999px; color: #fff; font-weight: 700; font-size: .85rem;
          background: rgba(10,25,35,.45); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); border: 1px solid rgba(255,255,255,.25); cursor: default; }
        .car-ampliar { border: none; background: rgba(255,255,255,.92); color: var(--tinta); font-weight: 700; font-size: .8rem; border-radius: 999px; padding: 6px 12px; cursor: pointer; }
        .thumbs { display: flex; gap: 8px; margin-top: 10px; padding: 6px 4px 10px; overflow-x: auto; }
        .thumb { flex: none; width: 78px; aspect-ratio: 4 / 3; padding: 0; border-radius: 10px; overflow: hidden; border: 3px solid transparent; background: #0d2a35; cursor: pointer; opacity: .7; transition: opacity .2s, transform .2s, box-shadow .2s; }
        .thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .thumb:hover { opacity: 1; }
        .thumb.activa { opacity: 1; border-color: #1f8a4c; box-shadow: 0 0 0 2px #fff, 0 6px 14px rgba(31,138,76,.55); transform: translateY(-2px); }
        /* Visor en pantalla completa */
        .lightbox { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; background: rgba(5,15,25,.88);
          -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); touch-action: pan-y; animation: lbEntrada .2s ease; }
        @keyframes lbEntrada { from { opacity: 0; } to { opacity: 1; } }
        .lb-img { max-width: 92vw; max-height: 84vh; object-fit: contain; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,.6); user-select: none; }
        .lb-btn { position: absolute; top: 50%; transform: translateY(-50%); width: 60px; height: 60px; border-radius: 50%; border: none; background: rgba(255,255,255,.9); color: var(--tinta); font-size: 2.4rem; line-height: 1; cursor: pointer; }
        .lb-btn.prev { left: 16px; } .lb-btn.next { right: 16px; }
        .lb-cerrar { position: absolute; top: 16px; right: 16px; width: 52px; height: 52px; border-radius: 50%; border: none; background: rgba(255,255,255,.9); color: var(--tinta); font-size: 1.5rem; cursor: pointer; }
        .lb-cont { position: absolute; top: 24px; left: 50%; transform: translateX(-50%); color: #fff; font-weight: 700; background: rgba(0,0,0,.5); padding: 4px 14px; border-radius: 999px; }
        @media (max-width: 600px) { .lb-btn { width: 48px; height: 48px; font-size: 2rem; } .lb-btn.prev { left: 8px; } .lb-btn.next { right: 8px; } }
        .colab-info p { margin: 0 0 14px; line-height: 1.5; }
        .colab-datos { list-style: none; margin: 0 0 14px; padding: 0; display: grid; gap: 8px; font-size: .95rem; }
        .colab-datos a { color: var(--rio); font-weight: 600; }
        .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
        .chip { background: #d8f0e2; color: #0f4a2a; font-size: .85rem; font-weight: 600; border-radius: 999px; padding: 4px 12px; }
        .colab-botones { display: flex; flex-wrap: wrap; gap: 10px; }
        .colab-botones .btn-whatsapp, .colab-botones .btn-link { width: auto; flex: 1 1 150px; }
        /* Firma de autor */
        .firma { display: flex; justify-content: flex-end; align-items: center; gap: 10px; margin-top: 40px; }
        .firma-logo { height: 40px; width: auto; display: block; }
        .firma span { font-family: 'Caveat', 'Segoe Script', 'Bradley Hand', cursive; font-size: 1.6rem; color: var(--tinta); opacity: .85; }
        /* ===== TEMA NEGRO ===== */
        .app .portada { position: relative; border: 1px solid #27272a; background-image: linear-gradient(rgba(9,9,11,.4), rgba(9,9,11,.85)), url('/fotos/portada.jpg'); }
        .app option { background: #1c1c21; color: #f4f4f5; }
        .sonido { position: absolute; top: 12px; right: 12px; width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255,255,255,.25); background: rgba(9,9,11,.55);
          -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); color: #fff; font-size: 1.05rem; cursor: pointer; }
        /* Menú circular estilo historias destacadas */
        .historias { display: flex; justify-content: center; gap: clamp(10px, 4vw, 36px); margin: 4px 0 28px; }
        .historia { display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 70px; padding: 0; border: none; background: transparent; color: #a1a1aa; font-family: inherit; cursor: pointer; }
        .historia.activa { color: #f4f4f5; }
        .aro { position: relative; width: 72px; height: 72px; padding: 3px; border-radius: 50%; background: #3f3f46; transition: transform .2s; }
        .historia:hover .aro { transform: scale(1.06); }
        .historia.activa .aro { background: linear-gradient(45deg, #f9ce34, #ee2a7b 55%, #6228d7); box-shadow: 0 0 18px rgba(238,42,123,.45); }
        .aro-interior { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 3px solid #09090b; background: radial-gradient(circle at 30% 25%, #2e2e35, #141417); font-size: 1.9rem; }
        .aro-cont { position: absolute; top: -3px; right: -3px; min-width: 22px; height: 22px; padding: 0 6px; display: flex; align-items: center; justify-content: center; border-radius: 999px; border: 2px solid #09090b; background: #10b981; color: #04261a; font-size: .75rem; font-weight: 800; }
        .historia-titulo { font-size: .8rem; font-weight: 700; white-space: nowrap; }
        @media (max-width: 420px) { .aro { width: 60px; height: 60px; } .aro-interior { font-size: 1.55rem; } .historia { min-width: 62px; } .historia-titulo { font-size: .7rem; } }
        /* Paneles y tarjetas */
        .caja, .pais-bloque, .mapa-tarjeta, .colab-card { box-shadow: 0 0 0 1px #27272a, 0 12px 32px rgba(0,0,0,.55); }
        .tarjeta, .combo { border: 1px solid #27272a; }
        .tarjeta-foto { background: #27272a; }
        .campo select, .campo input, .asignar select { background: #1c1c21; border: 2px solid #27272a; color: #f4f4f5; }
        .campo select:focus, .campo input:focus, .asignar select:focus { border-color: #10b981; }
        .campo input::placeholder { color: #71717a; }
        .btn-info { border-color: #3f3f46; color: #6ee7b7; }
        .info { background: #141417; border: 1px solid #27272a; }
        .resumen { background: rgba(16,185,129,.12); border-left-color: #10b981; }
        .combos { background: #141417; }
        .btn-agregar { background: linear-gradient(135deg, #34d399, #10b981); color: #04261a; }
        .btn-agregar:disabled { background: #27272a; color: #71717a; }
        .alerta { background: #3b1213; color: #fecaca; border: 1px solid #7f1d1d; }
        .alerta.global { background: #3a2e07; color: #fde68a; border-color: #854d0e; }
        .btn-link { background: linear-gradient(135deg, #fbbf24, #fb923c); color: #1c0b00; }
        .btn-whatsapp { background: linear-gradient(135deg, #25d366, #10b981); color: #04261a !important; }
        .btn-whatsapp:disabled { background: #27272a; color: #71717a !important; }
        .btn-mail { background: #27272a; color: #f4f4f5 !important; border: 1px solid #3f3f46; }
        .condiciones { background: #2a2208; border-color: #b45309; color: #fde68a; }
        .dia { border-color: #27272a; }
        .btn-quitar { color: #f87171; }
        .etq { background: #3a2e07; color: #fde68a; }
        .guia-capa { background: rgba(9,9,11,.72); border-color: rgba(255,255,255,.12); }
        .guia-sello { background: #10b981; color: #04261a; }
        .guia-datos a { border-bottom-color: #10b981; }
        .badge { background: #3a2e07; color: #fde68a; border-color: #b45309; }
        .cat { background: rgba(16,185,129,.18); color: #6ee7b7; border: 1px solid #065f46; }
        .chip { background: rgba(16,185,129,.15); color: #6ee7b7; }
        .colab-datos a { color: #34d399; }
        .thumb.activa { border-color: #10b981; box-shadow: 0 0 0 2px #09090b, 0 6px 16px rgba(16,185,129,.6); }
        .car-btn, .lb-btn, .lb-cerrar, .car-ampliar { color: #09090b; }
        /* Deslizá para conectar */
        .deslizable { position: relative; touch-action: pan-y; transition: transform .25s ease; }
        .deslizable.puede { cursor: grab; }
        .deslizable.arrastrando { transition: none; cursor: grabbing; user-select: none; -webkit-user-select: none; }
        .swipe { position: relative; height: 34px; margin: 0 14px 14px; border-radius: 999px; background: #27272a; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .swipe-fill { position: absolute; inset: 0 auto 0 0; background: linear-gradient(90deg, #059669, #34d399); }
        .swipe span { position: relative; font-size: .8rem; font-weight: 700; color: #f4f4f5; text-shadow: 0 1px 2px rgba(0,0,0,.6); }
        /* Ruta encadenada por día */
        .ruta { position: relative; margin: 6px 0 4px 10px; padding-left: 22px; border-left: 3px solid var(--c); }
        .nodo { position: relative; display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 8px 0; }
        .nodo::before { content: ""; position: absolute; left: -31px; top: 50%; width: 14px; height: 14px; margin-top: -7px; border-radius: 50%; background: var(--c); box-shadow: 0 0 0 4px #141417; }
        .nodo.opcional::before { background: #fbbf24; }
        .nodo small { display: block; color: var(--suave); }
        .flecha { display: block; font-size: .8rem; font-weight: 700; color: #fbbf24; letter-spacing: -1px; }
        .entrada { margin: 0; font-size: .85rem; font-weight: 700; color: #6ee7b7; }
        .oficial { display: block; margin-top: 3px; color: var(--suave); font-size: .8rem; }
        .campo .ayuda { display: block; margin-top: 4px; color: var(--suave); font-size: .78rem; }
        .presupuesto { display: grid; gap: 4px; margin: 0 0 14px; padding: 14px; border-radius: 12px; background: rgba(16,185,129,.1); border: 1px solid #065f46; }
        .presupuesto-monto { font-size: 1.5rem; font-weight: 800; color: #34d399; }
        .presupuesto small { color: var(--suave); line-height: 1.4; }
        .presupuesto b { color: #f4f4f5; }
        .condiciones p { margin: 0 0 8px; }
        .condiciones p:last-child { margin: 0; }
        .condiciones .importante { font-weight: 700; }
        /* ===== PLANES SUGERIDOS ===== */
        .planes { background: #141417; border: 1px dashed #3f3f46; border-radius: 16px; padding: 14px; }
        .planes-titulo { margin: 0 0 10px; font-weight: 700; font-size: .95rem; }
        .planes-botones { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(150px, 100%), 1fr)); gap: 10px; }
        .plan { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; padding: 12px; border: 1px solid #27272a; border-radius: 14px; background: linear-gradient(135deg, #1c1c21, #141417); color: #f4f4f5; font-family: inherit; text-align: left; cursor: pointer; transition: transform .15s, border-color .15s; }
        .plan:hover { border-color: #10b981; transform: translateY(-2px); }
        .plan:active { transform: scale(.98); }
        .plan-icono { font-size: 1.4rem; }
        .plan-nombre { font-weight: 800; font-size: 1rem; background: linear-gradient(90deg, #fbbf24, #fb923c); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .plan-detalle { font-size: .78rem; color: #a1a1aa; }
        .plan-ok { margin: 10px 0 0; font-size: .88rem; color: #6ee7b7; }
        .excede { color: #fbbf24; }
        /* Campo nombre resaltado */
        .campo.falta input { border-color: #f59e0b; box-shadow: 0 0 0 4px rgba(245,158,11,.35); animation: latido 1.2s ease-in-out 2; }
        @keyframes latido { 50% { box-shadow: 0 0 0 8px rgba(245,158,11,.15); } }
        @media (prefers-reduced-motion: reduce) { .campo.falta input { animation: none; } }
        .aviso-nombre { margin: 8px 0 0; padding: 8px 10px; border-radius: 10px; background: #3a2e07; color: #fde68a; border: 1px solid #854d0e; font-size: .85rem; line-height: 1.35; }
        /* Barra flotante móvil */
        .barra-movil { display: none; position: fixed; left: 10px; right: 10px; bottom: calc(10px + env(safe-area-inset-bottom, 0px)); z-index: 500; align-items: center; justify-content: space-between; gap: 10px;
          padding: 10px 10px 10px 16px; border-radius: 18px; border: 1px solid #10b981; background: rgba(9,9,11,.82); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
          box-shadow: 0 10px 30px rgba(0,0,0,.6), 0 0 0 1px rgba(16,185,129,.2); font-weight: 700; font-size: .92rem; }
        .barra-movil button { flex: none; border: none; border-radius: 999px; padding: 10px 16px; background: linear-gradient(135deg, #34d399, #10b981); color: #04261a; font-family: inherit; font-weight: 800; font-size: .9rem; cursor: pointer; }
        .carrito { scroll-margin-top: 12px; }
        @media (max-width: 899px) { .barra-movil { display: flex; } .app.con-barra { padding-bottom: 104px; } }
        /* ===== AJUSTES PARA CELULAR (360px a 430px) ===== */
        .app { overflow-x: clip; }
        .historias { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; max-width: 460px; margin: 4px auto 28px; }
        .historia { min-width: 0; }
        .aro { width: min(72px, 17vw); height: min(72px, 17vw); }
        .aro-interior { font-size: clamp(1.4rem, 6vw, 1.9rem); }
        .historia-titulo { font-size: clamp(.62rem, 2.9vw, .8rem); }
        .grilla-mapas { grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr)); }
        .combos-grilla { grid-template-columns: repeat(auto-fill, minmax(min(220px, 100%), 1fr)); }
        .pais-cuerpo { grid-template-columns: repeat(auto-fill, minmax(min(240px, 100%), 1fr)); overflow-x: clip; }
        .thumbs { overflow: visible; gap: 6px; padding: 6px 2px 10px; }
        .thumb { flex: 1 1 0; width: auto; min-width: 0; max-width: 96px; }
        .guia-datos li { overflow-wrap: anywhere; }
        .colab-card, .caja, .pais-bloque { max-width: 100%; }
        /* ===== ACTIVIDADES PLEGABLES (acordeón) ===== */
        .pais-cuerpo { display: flex; flex-direction: column; gap: 10px; }
        .act { background: #1c1c21; border: 1px solid #27272a; border-radius: 14px; overflow: hidden; }
        .act.abierta { border-color: #3f3f46; }
        .act.conectada { border-color: #065f46; }
        .barra-act { width: 100%; display: flex; align-items: center; gap: 10px; padding: 8px 10px; border: none; background: transparent; color: #f4f4f5; font-family: inherit; text-align: left; cursor: pointer; }
        .barra-act:hover { background: rgba(255,255,255,.03); }
        .act.abierta > .barra-act { background: rgba(16,185,129,.08); }
        .barra-miniatura { width: 48px; height: 48px; flex: none; border-radius: 10px; object-fit: cover; display: block; background: #27272a; }
        .barra-texto { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
        .barra-titulo { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; }
        .barra-nombre { font-weight: 800; font-size: .95rem; line-height: 1.2; }
        .badge-conectado { font-size: .7rem; font-weight: 800; padding: 1px 8px; border-radius: 999px; background: #10b981; color: #04261a; white-space: nowrap; }
        .barra-meta { font-size: .78rem; line-height: 1.3; color: #a1a1aa; }
        .barra-flecha { flex: none; min-width: 54px; display: flex; flex-direction: column; align-items: center; font-size: .7rem; font-weight: 700; color: #6ee7b7; }
        .barra-flecha b { font-size: 1rem; line-height: 1; }
        .act .tarjeta, .act .combo { border: none; border-top: 1px solid #27272a; border-radius: 0; }
        .combos { margin: 10px; }
        .combos-lista { display: flex; flex-direction: column; gap: 8px; }
        .combo-foto { height: 150px; }
        @media (min-width: 700px) { .tarjeta-foto { height: 220px; } }
      `}</style>

      <div className="contenedor">
        <header className="portada">
          <button className="sonido" aria-pressed={sonido} aria-label={sonido ? "Silenciar sonido" : "Activar sonido"} title={sonido ? "Silenciar sonido" : "Activar sonido"}
            onClick={() => { const v = !sonido; setSonido(v); if (v) reproducirCampanita(); }}>
            {sonido ? "🔊" : "🔇"}
          </button>
          <h1 className="titulo">Tres Fronteras</h1>
          <p className="subtitulo">Armá tu itinerario por Argentina, Brasil y Paraguay.</p>
        </header>

        <nav className="historias" role="tablist" aria-label="Secciones">
          {PESTANAS.map((p) => (
            <button key={p.id} role="tab" aria-selected={pestana === p.id} className={`historia ${pestana === p.id ? "activa" : ""}`} onClick={() => setPestana(p.id)}>
              <span className="aro">
                <span className="aro-interior" aria-hidden="true">{p.icono}</span>
                {p.id === "destinos" && carrito.length > 0 && <span className="aro-cont" aria-label={`${carrito.length} actividades`}>{carrito.length}</span>}
              </span>
              <span className="historia-titulo">{p.etiqueta}</span>
            </button>
          ))}
        </nav>

        {/* ---------- PESTAÑA 1: Destinos y Carrito ---------- */}
        {pestana === "destinos" && (
          <>
            {/* Formulario del viajero */}
            <section className="caja" style={{ marginBottom: 24 }}>
              <h2>Datos del viajero</h2>
              <div className="form" style={{ marginBottom: 0 }}>
                <div className={`campo ${faltaNombre ? "falta" : ""}`}>
                  <label htmlFor="nombre">Tu nombre</label>
                  <input id="nombre" ref={refNombre} type="text" placeholder="Ej: Sofía Gómez" autoComplete="name" value={nombreTurista}
                    onChange={(e) => { setNombreTurista(e.target.value); if (e.target.value.trim()) setFaltaNombre(false); }} />
                  {faltaNombre && <p className="aviso-nombre" role="alert">¡Ya casi! Escribí al menos tu nombre para que sepamos a quién responderle por WhatsApp. 😊</p>}
                </div>
                <div className="campo">
                  <label htmlFor="dias">Días de estadía</label>
                  <select id="dias" value={dias} onChange={(e) => cambiarDias(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5, 6, 7].map((n) => <option key={n} value={n}>{n} {n === 1 ? "día" : "días"}</option>)}
                  </select>
                </div>
                <div className="campo">
                  <label htmlFor="personas">Cantidad de personas</label>
                  <input id="personas" type="number" min="1" max="50" value={personas}
                    onChange={(e) => setPersonas(Math.min(50, Math.max(1, Math.floor(Number(e.target.value)) || 1)))} />
                </div>
                <div className="campo">
                  <label htmlFor="movilidad">¿Cuenta con movilidad propia?</label>
                  <select id="movilidad" value={movilidad} onChange={(e) => setMovilidad(e.target.value)}>
                    <option value="no">No, necesito traslado / chofer</option>
                    <option value="si">Sí, tengo vehículo propio</option>
                  </select>
                </div>
                <div className="campo">
                  <label htmlFor="hotel">Hotel o alojamiento</label>
                  <input id="hotel" type="text" placeholder="Nombre del hotel" value={hotel} onChange={(e) => setHotel(e.target.value)} />
                </div>
                <div className="campo">
                  <label htmlFor="divisa">Moneda para ver precios de entradas</label>
                  <select id="divisa" value={divisa} onChange={(e) => setDivisa(e.target.value)}>
                    {Object.entries(MONEDAS).map(([codigo, m]) => <option key={codigo} value={codigo}>{codigo} ({m.simbolo} {m.nombre})</option>)}
                  </select>
                  <small className="ayuda">Valores de boletería solo de referencia.</small>
                </div>
              </div>
            </section>

            <div className="layout">
              {/* Acordeón por países */}
              <section className="paises">
                {/* Planes sugeridos en 1 clic */}
                <div className="planes">
                  <p className="planes-titulo">¿No sabés por dónde empezar? Cargá un plan sugerido:</p>
                  <div className="planes-botones">
                    {PLANES.map((pl) => (
                      <button key={pl.id} className="plan" onClick={() => cargarPlan(pl)}>
                        <span className="plan-icono" aria-hidden="true">{pl.icono}</span>
                        <span className="plan-nombre">{pl.nombre}</span>
                        <span className="plan-detalle">{pl.detalle}</span>
                      </button>
                    ))}
                  </div>
                  {planCargado && <p className="plan-ok" role="status">✅ Plan «{planCargado}» cargado. Podés seguir agregando o quitando paseos.</p>}
                </div>

                {Object.entries(PAISES).map(([pais, datos]) => {
                  const lista = ATRACTIVOS.filter((a) => a.pais === pais);
                  const abierto = paisAbierto === pais;
                  return (
                    <div key={pais} className="pais-bloque" style={{ "--c": datos.color }}>
                      <button className="pais-cab" aria-expanded={abierto} onClick={() => { setPaisAbierto(abierto ? null : pais); setExpandidas({}); setCombosExpandidos({}); }}>
                        <span className="pais-bandera" aria-hidden="true">{datos.bandera}</span>
                        <span>
                          <span className="pais-nombre">{pais}</span>
                          <span className="pais-cant">{lista.length} atractivos</span>
                        </span>
                        <span className={`pais-flecha ${abierto ? "abierta" : ""}`} aria-hidden="true">▼</span>
                      </button>

                      {abierto && (
                        <div className="pais-cuerpo">
                          {lista.map((a) => {
                            const agregado = carrito.some((x) => x.id === a.id);
                            const verInfo = infoAbierta === a.id;
                            const abierta = !!expandidas[a.id];
                            const padre = carrito.find((x) => x.id === a.id);
                            const combos = COMBOS.filter((c) => c.padre === a.id);
                            return (
                              <div key={a.id} className={`act ${abierta ? "abierta" : ""} ${agregado ? "conectada" : ""}`}>
                                {/* Barrita superior: siempre visible, al tocarla se despliega o se minimiza */}
                                <BarraResumen foto={a.foto} nombre={a.nombre} meta={`⏱ ${a.horas} hs · 🎟️ ${textoEntrada(a.entrada, divisa)}`}
                                  conectado={agregado} abierto={abierta} onClick={() => setExpandidas({ ...expandidas, [a.id]: !abierta })} />

                                {abierta && (
                                  <>
                                    <Deslizable className="tarjeta" onConectar={() => agregar(a)} deshabilitado={agregado}>
                                      <Foto className="tarjeta-foto" src={a.foto} alt={`${a.nombre}, ${a.lugar}`} />
                                      <div className="tarjeta-cuerpo">
                                        <p className="lugar">{a.lugar} · ⏱ {a.horas} hs</p>
                                        <p className="desc">{a.desc}</p>
                                        <button className="btn-info" aria-expanded={verInfo} onClick={() => setInfoAbierta(verInfo ? null : a.id)}>
                                          {verInfo ? "Ocultar información" : "Ver información"}
                                        </button>

                                        {verInfo && (
                                          <div className="info">
                                            <div className="resumen"><h4>Sobre este paseo y qué vas a ver</h4>{a.resumen}</div>
                                            <div><h4>Horario</h4>Abre y cierra: {a.horario}</div>
                                            <div><h4>Duración estimada</h4>{a.horas} hs aproximadamente</div>
                                            <div>
                                              <h4>Entrada (boletería)</h4>
                                              {textoEntrada(a.entrada, divisa)}
                                              {!a.entrada.gratis && a.entrada.moneda !== divisa && <small className="oficial">{textoOficial(a.entrada)}</small>}
                                              <small className="oficial">Se abona en la boletería del lugar o en su web oficial: no está incluida en el traslado.</small>
                                            </div>
                                            <div><h4>Documentación obligatoria</h4><ul>{datos.documentos.map((d) => <li key={d}>{d}</li>)}</ul></div>
                                            <div><h4>Qué llevar</h4><ul>{a.llevar.map((l) => <li key={l}>{l}</li>)}</ul></div>
                                          </div>
                                        )}

                                        <div className="asignar">
                                          <select aria-label={`Día para ${a.nombre}`} value={diaDe(a.id)} disabled={agregado}
                                            onChange={(e) => setDiaSel({ ...diaSel, [a.id]: Number(e.target.value) })}>
                                            {Array.from({ length: dias }, (_, i) => <option key={i + 1} value={i + 1}>Día {i + 1}</option>)}
                                          </select>
                                          <button className="btn-agregar" onClick={() => agregar(a)} disabled={agregado}>
                                            {agregado ? "Conectada ✓" : "+ Conectar"}
                                          </button>
                                        </div>
                                        {aviso?.id === a.id && <p className="alerta" role="alert">{aviso.texto}</p>}
                                      </div>
                                    </Deslizable>

                                    {/* Combinables: ordenadas dentro de la tarjeta expandida del parque principal */}
                                    {padre && combos.length > 0 && (
                                      <section className="combos">
                                        <h3>{PANELES[a.id].titulo}</h3>
                                        <p className="combos-sub">
                                          Se suman al Día {padre.dia}. Podés combinar hasta {MAX_COMBOS} actividades y el tope del día sube a {HORAS_CON_COMBOS} hs.
                                        </p>
                                        <div className="combos-lista">
                                          {combos.map((c) => {
                                            const ya = carrito.find((x) => x.id === c.id);
                                            const abiertoC = !!combosExpandidos[c.id];
                                            return (
                                              <div key={c.id} className={`act ${abiertoC ? "abierta" : ""} ${ya ? "conectada" : ""}`}>
                                                <BarraResumen foto={c.foto} nombre={c.nombre} meta={`⏱ ${c.duracion} · 🎟️ ${textoEntrada(c.entrada, divisa)}`}
                                                  conectado={!!ya} abierto={abiertoC} onClick={() => setCombosExpandidos({ ...combosExpandidos, [c.id]: !abiertoC })} />
                                                {abiertoC && (
                                                  <Deslizable etiqueta="div" className="combo" onConectar={() => agregarCombo(c, padre)} deshabilitado={!!ya}>
                                                    <Foto className="combo-foto" src={c.foto} alt={c.nombre} />
                                                    <div className="combo-cuerpo">
                                                      <p className="desc">{c.desc}</p>
                                                      <p className="combo-datos">🕒 {c.horario} · ⏱ {c.duracion}</p>
                                                      <p className="combo-datos entrada">🎟️ Entrada: {textoEntrada(c.entrada, divisa)}</p>
                                                      <p className="combo-datos"><strong>Requisitos:</strong> {c.requisitos.join(" · ")}</p>
                                                      <button className="btn-agregar" disabled={!!ya} onClick={() => agregarCombo(c, padre)}>
                                                        {ya ? `Conectada (Día ${ya.dia})` : `+ Conectar al Día ${padre.dia}`}
                                                      </button>
                                                      {avisoCombo?.id === c.id && <p className="alerta" role="alert">{avisoCombo.texto}</p>}
                                                    </div>
                                                  </Deslizable>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </section>
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                {/* Bloque desplegable: Turismo Aventura (tours privados a medida) */}
                <div className="pais-bloque" style={{ "--c": "#d97706" }}>
                  <button className="pais-cab" aria-expanded={paisAbierto === "aventura"} onClick={() => { setPaisAbierto(paisAbierto === "aventura" ? null : "aventura"); setExpandidas({}); setCombosExpandidos({}); }}>
                    <span className="pais-bandera" aria-hidden="true">🌿</span>
                    <span>
                      <span className="pais-nombre">Turismo Aventura</span>
                      <span className="pais-cant">{AVENTURA.length} experiencias privadas a medida</span>
                    </span>
                    <span className={`pais-flecha ${paisAbierto === "aventura" ? "abierta" : ""}`} aria-hidden="true">▼</span>
                  </button>

                  {paisAbierto === "aventura" && (
                    <div className="pais-cuerpo">
                      {AVENTURA.map((av) => {
                        const abierta = !!expandidas[av.id];
                        const textoConsultaAv =
                          `${nombre ? `¡Hola! Soy ${nombre} y me` : "¡Hola! Me"} gustaría saber más y consultar disponibilidad para la actividad privada *${av.nombre}* (Turismo Aventura).` +
                          `\n\n*Datos del viaje*\n- Días de estadía: ${dias}\n- Personas: ${personas}` +
                          `\n- Movilidad: ${movilidad === "si" ? "Tengo vehículo propio" : "No tengo, necesito traslado / chofer"}` +
                          (hotel.trim() ? `\n- Alojamiento: ${hotel.trim()}` : "") +
                          (carrito.length > 0 ? `\n\n*Mi itinerario actual en el carrito*\n${detalle}\n(Total actual: ${horasTotales} hs)` : "");
                        const linkAv = `https://wa.me/${GUIA.whatsapp}?text=${encodeURIComponent(textoConsultaAv)}`;
                        return (
                          <div key={av.id} className={`act ${abierta ? "abierta" : ""}`}>
                            <BarraResumen foto={av.foto} nombre={av.nombre} meta="Tour privado a medida · Consultar disponibilidad"
                              conectado={false} abierto={abierta} onClick={() => setExpandidas({ ...expandidas, [av.id]: !abierta })} />
                            {abierta && (
                              <div className="tarjeta">
                                <Foto className="tarjeta-foto" src={av.foto} alt={av.nombre} />
                                <div className="tarjeta-cuerpo">
                                  <p className="desc">{av.desc}</p>
                                  <div className="info">
                                    <div>
                                      <h4>Modalidad y disponibilidad</h4>
                                      Tour privado sujeto a condiciones climáticas, disponibilidad de equipos (bicicletas / kayaks), guía y traslado en la fecha elegida.
                                    </div>
                                  </div>
                                  <a className="btn-whatsapp" href={linkAv} target="_blank" rel="noopener noreferrer">
                                    Quiero saber más
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>

              {/* Carrito por día */}
              <aside className="caja carrito" ref={refCarrito}>
                <h2>Mi Carrito de Actividades</h2>
                {avisoGlobal && <p className="alerta global" role="status">{avisoGlobal}</p>}
                {carrito.length === 0 && <p className="vacio">Todavía no agregaste excursiones. Abrí un país, elegí el día y sumá actividades.</p>}

                {porDia.map((d) => (
                  <div key={d.dia} className={`dia ${d.items.length ? "activo" : ""}`} style={{ "--c": d.pais ? PAISES[d.pais].color : "#d4e0dc" }}>
                    <div className="dia-cab">
                      <span>Día {d.dia}{d.pais ? ` - ${PAISES[d.pais].bandera} ${d.pais}` : ""}</span>
                      <span className={!d.items.length ? "dia-libre" : d.horas > d.limite ? "excede" : ""}>{!d.items.length ? "Libre" : `${d.horas > d.limite ? "⚠ " : ""}${d.horas} de ${d.limite} hs`}</span>
                    </div>
                    {d.items.length > 0 && (
                      <div className="ruta">
                        {d.items
                          .filter((x) => !x.opcionalDe)
                          .flatMap((a) => [a, ...d.items.filter((o) => o.opcionalDe === a.id)])
                          .map((a, k) => nodo(a, !!a.opcionalDe, k === 0))}
                      </div>
                    )}
                  </div>
                ))}

                <div className="totales"><span>Horas totales de paseo</span><span>{horasTotales} hs</span></div>

                {carrito.length > 0 && (
                  <div className="presupuesto">
                    <strong>Presupuesto estimado en boleterías (referencia)</strong>
                    <span className="presupuesto-monto">{formatear(presupuesto, divisa)}</span>
                    <small>Para {personas} {personas === 1 ? "persona" : "personas"}, con tarifa general o de extranjeros.</small>
                    {presupuestoLocal !== presupuesto && (
                      <small>Si todos son argentinos o del Mercosur: <b>{formatear(presupuestoLocal, divisa)}</b></small>
                    )}
                    <small>Es solo informativo: las entradas se pagan directamente en cada parque (boletería o web oficial) y no están incluidas en el traslado. Valores y tasas de cambio orientativos.</small>
                  </div>
                )}

                <div className="condiciones">
                  <strong>Condiciones de Reserva</strong>
                  <p>{POLITICA_SENA}</p>
                  <p className="importante">{POLITICA_ENTRADAS}</p>
                </div>

                {carrito.length ? (
                  <a className="btn-whatsapp" href={linkWhatsApp} target="_blank" rel="noopener noreferrer" onClick={confirmarReserva}>Confirmar y Reservar por WhatsApp</a>
                ) : (
                  <button className="btn-whatsapp" disabled>Confirmar y Reservar por WhatsApp</button>
                )}
                <p className="nota">
                  {carrito.length === 0 ? "Agregá al menos una actividad para reservar."
                    : !hotel.trim() ? "Tip: completá el nombre de tu hotel para que el mensaje salga completo."
                    : "Se abrirá WhatsApp con tu itinerario ya escrito."}
                </p>
              </aside>
            </div>
          </>
        )}

        {/* ---------- PESTAÑA 2: Mapas ---------- */}
        {pestana === "mapas" && (
          <section className="grilla-mapas">
            {MAPAS.map((m) => (
              <article key={m.id} className="mapa-tarjeta">
                <iframe title={`Mapa de ${m.nombre}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(m.consulta)}&output=embed`} />
                <div className="mapa-info">
                  <h3>{m.nombre}</h3>
                  <span className={`pais-tag ${m.pais}`} style={{ alignSelf: "flex-start" }}>{m.pais}</span>
                  <a className="btn-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.consulta)}`} target="_blank" rel="noopener noreferrer">
                    Abrir en Google Maps
                  </a>
                </div>
              </article>
            ))}
          </section>
        )}

        {/* ---------- PESTAÑA 3: Hospedajes y Colaboradores ---------- */}
        {pestana === "colab" && (
          <section>
            {COLABORADORES.map((c) => (
              <article key={c.id} className="colab-card">
                <div className="colab-cab">
                  <div className="medallon">
                    <ImagenRespaldo src={c.logo} respaldo={c.logoRespaldo} alt={`Logo de ${c.nombre}`}
                      fallback={<span className="medallon-ini">{c.nombre.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>} />
                  </div>
                  <div>
                    {c.destacado && <span className="badge">Aliado destacado</span>}
                    <h2>{c.nombre}</h2>
                    <span className="cat">{c.categoria}</span>
                  </div>
                </div>

                <div className="colab-cuerpo">
                  <Carrusel fotos={c.fotos} nombre={c.nombre} />
                  <div className="colab-info">
                    <p>{c.descripcion}</p>
                    <ul className="colab-datos">
                      <li>📍 {c.ubicacion}</li>
                      <li>📞 {c.telefonoVisible}</li>
                      <li>📷 <a href={`https://instagram.com/${c.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer">{c.instagram}</a></li>
                    </ul>
                    <div className="chips">{c.servicios.map((sv) => <span key={sv} className="chip">{sv}</span>)}</div>
                    <div className="colab-botones">
                      <a className="btn-whatsapp" target="_blank" rel="noopener noreferrer"
                        href={`https://wa.me/${c.whatsapp}?text=${encodeURIComponent(`Hola! Los contacto desde la web de ${GUIA.nombre}. Quiero consultar disponibilidad en ${c.nombre} para ${personas} ${personas === 1 ? "persona" : "personas"} y una estadía de ${dias} ${dias === 1 ? "día" : "días"}.`)}`}>
                        Consultar disponibilidad
                      </a>
                      <a className="btn-link" target="_blank" rel="noopener noreferrer"
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.mapa)}`}>
                        Ver ubicación
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
            <p className="nota">¿Tenés un hotel, cabaña o restaurante y querés sumarte? Escribinos por WhatsApp desde la pestaña de contacto.</p>
          </section>
        )}

        {/* ---------- PESTAÑA 4: Contacto del Guía (tarjeta personal) ---------- */}
        {pestana === "guia" && (
          <section className="guia-card">
            <div className="guia-capa">
              <span className="guia-sello">Tu guía en las Tres Fronteras</span>
              <h2>{GUIA.nombre}</h2>
              <p className="guia-titulo">{GUIA.titulo}</p>
              <ul className="guia-datos">
                <li>📞 <a href={`tel:+${GUIA.whatsapp}`}>{GUIA.telefonoVisible}</a></li>
                <li>✉️ <a href={`mailto:${GUIA.email}`}>{GUIA.email}</a></li>
                <li>🕒 {GUIA.horarios}</li>
              </ul>
              <div className="guia-botones">
                <a className="btn-whatsapp" href={linkWhatsApp} target="_blank" rel="noopener noreferrer">Escribir por WhatsApp</a>
                <a className="btn-mail" href={`mailto:${GUIA.email}?subject=${encodeURIComponent("Consulta de excursiones - Tres Fronteras")}&body=${encodeURIComponent(carrito.length ? mensajeReserva : mensajeConsulta)}`}>Enviar correo</a>
              </div>
              <p className="nota">
                {carrito.length ? `El mensaje incluirá tu itinerario de ${carrito.length} excursiones (${horasTotales} hs en total).` : "Tu carrito está vacío: se enviará un mensaje de consulta general."}
              </p>
            </div>
          </section>
        )}

        {/* ---------- Firma de autor ---------- */}
        <footer className="firma">
          <ImagenRespaldo className="firma-logo" src="/fotos/logo-otro-lagarto.png" respaldo="/fotos/logo-otro-lagarto.jpg" alt="Logo de Otro Lagarto" />
          <span>Designed by Otro Lagarto</span>
        </footer>
      </div>

      {/* Barra flotante móvil: solo en pantallas menores a 900px y con al menos 1 actividad */}
      {carrito.length > 0 && !(pestana === "destinos" && carritoVisible) && (
        <div className="barra-movil" role="region" aria-label="Resumen de tu viaje">
          <span>🧭 {carrito.length} {carrito.length === 1 ? "actividad" : "actividades"} en tu viaje</span>
          <button onClick={irAlCarrito}>Ver mi viaje ↓</button>
        </div>
      )}
    </div>
  );
}
