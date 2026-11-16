import { useState, useEffect, useRef, Fragment } from "react";

const STORAGE_KEY = "app_iguazu_v1";
const ORDEN_PESTANAS = ["destinos", "mapas", "colab", "guia"];

// ---------- TASAS DE CAMBIO (EDITAR ACÁ) ----------
// Cuántas unidades de cada moneda equivalen a 1 dólar (USD). Actualizalas cuando cambie el valor.
const TASAS_CAMBIO = { USD_ARS: 1570, USD_BRL: 5.39, USD_PYG: 6150 };

const MONEDAS = {
  ARS: { simbolo: "$", nombre: "Pesos argentinos" },
  BRL: { simbolo: "R$", nombre: "Reales" },
  USD: { simbolo: "US$", nombre: "Dólares" },
  PYG: { simbolo: "₲", nombre: "Guaraníes" },
};

// ---------- TEXTOS POR IDIOMA (ES / PT / EN) ----------
const TEXTOS = {
  es: {
    subtitulo: "Armá tu itinerario por Argentina, Brasil y Paraguay.",
    tabs: { destinos: "Destinos", mapas: "Mapas", colab: "Colaboradores", guia: "Contactos" },
    datosViajero: "Datos del viajero",
    nombre: "Tu nombre",
    dias: "Días de estadía",
    personas: "Cantidad de personas",
    movilidad: "¿Cuenta con movilidad propia?",
    movNo: "No, necesito traslado / chofer",
    movSi: "Sí, tengo vehículo propio",
    hotel: "Hotel o alojamiento",
    divisa: "Moneda para ver precios de entradas",
    ayudaDivisa: "Valores de boletería solo de referencia.",
    planesTitulo: "¿No sabés por dónde empezar? Cargá un plan sugerido:",
    tipsTitulo: "💡 Tips de Frontera, Pagos y Días de Lluvia",
    tipsFronteraT: "🛂 Cruce de Fronteras (ARG · BRA · PAR)",
    tipsFronteraD: "Llevá siempre DNI físico vigente o Pasaporte original (no sirven fotos ni fotocopias). Menores necesitan autorización si viajan sin ambos padres. En Puente Tancredo Neves conviene cruzar antes de las 08:00 hs o después de las 15:00 hs.",
    tipsPagosT: "💳 Pagos, Pix y Efectivo",
    tipsPagosD: "En Brasil aceptan Pix y tarjetas en casi todos lados. En Argentina y Paraguay conviene llevar efectivo (pesos, reales o dólares billete azul en buen estado) para ferias y boleterías.",
    tipsLluviaT: "☔ Opciones ideales si llueve",
    tipsLluviaD: "Si llueve, podés aprovechar La Aripuca, Minas de Wanda, Represa de Itaipú, AquaFoz, Dreamland o compras en Ciudad del Este.",
    carritoTitulo: "Mi Carrito de Actividades",
    limpiarViaje: "🗑️ Limpiar viaje",
    carritoVacio: "Todavía no agregaste excursiones. Abrí un país, elegí el día y sumá actividades.",
    horasTotales: "Horas totales de paseo",
    reservarBtn: "Confirmar y Reservar por WhatsApp",
  },
  pt: {
    subtitulo: "Monte seu roteiro pela Argentina, Brasil e Paraguai.",
    tabs: { destinos: "Destinos", mapas: "Mapas", colab: "Parceiros", guia: "Contatos" },
    datosViajero: "Dados do viajante",
    nombre: "Seu nome",
    dias: "Dias de estadia",
    personas: "Quantidade de pessoas",
    movilidad: "Possui transporte próprio?",
    movNo: "Não, preciso de transfer / motorista",
    movSi: "Sim, tenho veículo próprio",
    hotel: "Hotel ou hospedagem",
    divisa: "Moeda para ver preços de ingressos",
    ayudaDivisa: "Valores de bilheteria apenas de referência.",
    planesTitulo: "Não sabe por onde começar? Carregue um roteiro sugerido:",
    tipsTitulo: "💡 Dicas de Fronteira, Pagamentos e Dias de Chuva",
    tipsFronteraT: "🛂 Travessia de Fronteira (ARG · BRA · PAR)",
    tipsFronteraD: "Leve sempre RG original recente ou Passaporte válido (fotos não são aceitas). Menores precisam de autorização se viajarem sem ambos os pais. Na Ponte Tancredo Neves, evite os horários de pico cruzando antes das 08h ou após as 15h.",
    tipsPagosT: "💳 Pagamentos, Pix e Dinheiro",
    tipsPagosD: "No Brasil, Pix e cartões são aceitos em quase todo lugar. Na Argentina e no Paraguai, vale levar dinheiro em espécie para feiras e bilheterias.",
    tipsLluviaT: "☔ Boas opções em dias de chuva",
    tipsLluviaD: "Se chover, aproveite La Aripuca, Minas de Wanda, Usina de Itaipu, AquaFoz, Dreamland ou compras em Ciudad del Este.",
    carritoTitulo: "Meu Roteiro de Atividades",
    limpiarViaje: "🗑️ Limpar roteiro",
    carritoVacio: "Você ainda não adicionou passeios. Abra um país, escolha o dia e adicione atividades.",
    horasTotales: "Horas totais de passeio",
    reservarBtn: "Confirmar e Reservar pelo WhatsApp",
  },
  en: {
    subtitulo: "Build your itinerary across Argentina, Brazil and Paraguay.",
    tabs: { destinos: "Destinations", mapas: "Maps", colab: "Partners", guia: "Contacts" },
    datosViajero: "Traveler details",
    nombre: "Your name",
    dias: "Stay duration",
    personas: "Number of travelers",
    movilidad: "Do you have your own vehicle?",
    movNo: "No, I need transfer / driver",
    movSi: "Yes, I have my own car",
    hotel: "Hotel or lodging",
    divisa: "Currency for ticket reference",
    ayudaDivisa: "Box-office prices are for reference only.",
    planesTitulo: "Not sure where to start? Load a suggested plan:",
    tipsTitulo: "💡 Border, Payment & Rainy Day Tips",
    tipsFronteraT: "🛂 Border Crossing (ARG · BRA · PAR)",
    tipsFronteraD: "Always carry your original valid Passport (photos or copies are not accepted). Cross Tancredo Neves Bridge before 08:00 AM or after 03:00 PM to avoid long queues.",
    tipsPagosT: "💳 Payments & Cash",
    tipsPagosD: "Cards and Pix are widely accepted in Brazil. Carry crisp USD bills or local cash for smaller shops and ticket offices in Argentina and Paraguay.",
    tipsLluviaT: "☔ Great Rainy Day Options",
    tipsLluviaD: "If it rains, enjoy La Aripuca, Wanda Mines, Itaipu Dam, AquaFoz, Dreamland, or shopping in Ciudad del Este.",
    carritoTitulo: "My Activity Cart",
    limpiarViaje: "🗑️ Clear trip",
    carritoVacio: "No tours added yet. Open a country, pick a day and add activities.",
    horasTotales: "Total tour hours",
    reservarBtn: "Confirm & Book via WhatsApp",
  },
};

// ---------- DATOS DEL GUÍA ----------
const GUIA = {
  nombre: "Alan - Turismo & Traslados Iguazú",
  titulo: "Guía y Coordinación de Excursiones en las Tres Fronteras",
  whatsapp: "5493757577335",
  telefonoVisible: "+54 9 3757 57-7335",
  email: "alan.igr.turismo@gmail.com",
  horarios: "Atención todos los días de 07:00 a 22:00 hs",
};

// ---------- COLABORADORES DIVIDIDOS EN 4 SECCIONES ----------
const CATEGORIAS_COLAB = [
  { id: "hoteles", icono: "🏨", titulo: "Hoteles y Hospedajes", preguntaBtn: "🏨 Hospedaje" },
  { id: "guias", icono: "🧭", titulo: "Guías de Confianza", preguntaBtn: "🧭 Guía" },
  { id: "choferes", icono: "🚐", titulo: "Choferes y Traslados", preguntaBtn: "🚐 Chofer" },
  { id: "restaurantes", icono: "🍽️", titulo: "Restaurantes", preguntaBtn: "🍽️ Qué cenar" },
];

const COLABORADORES = [
  {
    id: "el-ceibo",
    tipo: "hoteles",
    destacado: true,
    nombre: "Complejo El Ceibo",
    categoria: "Hotelería y Hospedaje",
    promo: "",
    logo: "/colaboradores/el-ceibo-logo.png",
    logoRespaldo: "/colaboradores/el-ceibo-logo.jpg",
    fotos: [
      "/colaboradores/el-ceibo-1.jpg",
      "/colaboradores/el-ceibo-2.jpg",
      "/colaboradores/el-ceibo-3.jpg",
      "/colaboradores/el-ceibo-4.jpg",
    ],
    descripcion:
      "Un refugio de descanso rodeado de verde, a pocos minutos de las Cataratas. Habitaciones cómodas, pileta para refrescarte después de cada excursión y la tranquilidad de la selva misionera para recargar energías.",
    ubicacion: "Puerto Iguazú, Misiones - Dirección a confirmar",
    mapa: "Complejo El Ceibo, Puerto Iguazú, Misiones, Argentina",
    telefonoVisible: "+54 9 3757 00-0000",
    whatsapp: "5493757000000",
    instagram: "@complejoelceibo",
    servicios: ["Piscina", "Wi-Fi", "Estacionamiento", "Entorno natural"],
  },
  // Sumar acá nuevos guías (tipo: "guias"), choferes (tipo: "choferes") y restaurantes (tipo: "restaurantes")
];

const POLITICA_SENA = "El 50% de seña previa corresponde exclusivamente a los servicios de traslados y guías para confirmar tu reserva (el 50% restante se abona en persona al encontrarse en destino).";
const POLITICA_ENTRADAS = "Importante: Los tickets/entradas a cada parque o atractivo NO están incluidos en el traslado y se abonan directamente en la boletería de cada lugar (o en su web oficial).";
const HORAS_POR_DIA = 8;
const HORAS_CON_COMBOS = 10;
const MAX_COMBOS = 3;

// ---------- DATOS POR PAÍS ----------
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
const ATRACTIVOS = [
  { id: 1, mapaImg: "/mapas/mapa-cataratas-arg.jpg", entrada: { moneda: "ARS", general: 60000, etqGeneral: "General", local: 25000, etqLocal: "Argentinos" }, nombre: "Cataratas Argentinas", lugar: "Puerto Iguazú", pais: "Argentina", horas: 7, foto: "/fotos/cataratas-arg.jpg", tags: ["♿ Apto cochecito / silla", "🥾 Caminata moderada", "💦 Rocío / te mojás"], resumen: "Vivís el lado más cercano y envolvente de las Cataratas: el Circuito Superior te lleva por pasarelas sobre el borde de los saltos y el Circuito Inferior te acerca al pie de las caídas, entre selva, arcoíris y rocío. El tren ecológico te deja frente a la Garganta del Diablo, donde el río se desploma con un rugido que se siente en el pecho. Un día completo para recorrer a tu ritmo, con coatíes, mariposas y tucanes en el camino.", desc: "Pasarelas sobre el río y la Garganta del Diablo, de cerca.", horario: "08:00 a 18:00 hs", llevar: ["Calzado cerrado y cómodo", "Piloto de lluvia", "Repelente", "Agua y protector solar", "Ropa de recambio"] },
  { id: 2, mapaImg: "/mapas/mapa-cataratas-br.jpg", entrada: { moneda: "BRL", general: 134, etqGeneral: "Extranjeros", local: 121, etqLocal: "Mercosur" }, nombre: "Cataratas Brasileñas", lugar: "Foz do Iguaçu", pais: "Brasil", horas: 4, foto: "/fotos/cataratas-br.jpg", tags: ["♿ Apto cochecito / silla", "🥾 Caminata suave", "💦 Rocío / te mojás"], resumen: "Es la vista panorámica frontal que todos sueñan: el sendero recorre la ladera brasileña y te muestra el conjunto completo de saltos con el lado argentino de fondo. Al final, una pasarela avanza sobre el salto Floriano hasta dejarte casi dentro de la caída de agua. Perfecto para fotos inolvidables y para entender la magnitud de las Cataratas.", desc: "La vista panorámica completa de todos los saltos.", horario: "09:00 a 17:00 hs", llevar: ["Piloto de lluvia", "Calzado cómodo", "Protector solar y gorra", "Agua"] },
  { id: 3, mapaImg: "/mapas/mapa-parque-aves.jpg", entrada: { moneda: "BRL", general: 110 }, nombre: "Parque das Aves", lugar: "Foz do Iguaçu", pais: "Brasil", horas: 3, foto: "/fotos/parque-aves.jpg", tags: ["♿ Apto cochecito / silla", "🥾 Caminata suave", "☀️ Al aire libre"], resumen: "Una inmersión en viveros gigantes donde caminás entre tucanes, guacamayos, loros y flamencos que vuelan libres a tu alrededor, en plena selva. Los senderos pasan por aviarios abiertos y te permiten ver de cerca especies de colores increíbles, además de mariposas. Ideal para ir en familia y sacar fotos únicas.", desc: "Tucanes, guacamayos y aviarios abiertos dentro de la selva.", horario: "08:30 a 17:00 hs", llevar: ["Repelente", "Calzado cerrado", "Protector solar", "Agua"] },
  { id: 4, mapaImg: "/mapas/mapa-itaipu.jpg", entrada: { moneda: "BRL", general: 63, etqGeneral: "Panorámica" }, nombre: "Represa de Itaipú", lugar: "Foz do Iguaçu", pais: "Brasil", horas: 3, foto: "/fotos/itaipu.jpg", tags: ["♿ Apto cochecito / silla", "☔ Apto día de lluvia"], resumen: "Conocés por dentro una de las mayores hidroeléctricas del planeta. El recorrido guiado te lleva frente al imponente muro de la represa y sus vertederos, mientras te cuentan cómo se genera la energía que comparten Brasil y Paraguay. Un paseo que impresiona por su escala y por la ingeniería detrás de cada detalle.", desc: "Visita guiada a una de las mayores hidroeléctricas del mundo.", horario: "08:00 a 16:00 hs", llevar: ["Documento original (se controla el ingreso)", "Calzado cerrado", "Ropa cómoda"] },
  { id: 5, mapaImg: "/mapas/mapa-wanda.jpg", entrada: { moneda: "USD", general: 4 }, nombre: "Minas de Wanda", lugar: "Misiones", pais: "Argentina", horas: 3, foto: "/fotos/wanda.jpg", tags: ["🥾 Caminata suave", "☔ Apto día de lluvia"], resumen: "Descendés a antiguas minas a cielo abierto donde las paredes de piedra esconden amatistas, ágatas y cuarzos que brillan a la luz. Con un guía recorrés los túneles y aprendés cómo se extraen y trabajan las gemas. Al final podés ver el taller y llevarte un recuerdo auténtico de la tierra colorada de Misiones.", desc: "Antiguas minas de piedras semipreciosas: amatista, ágata y cuarzo.", horario: "08:00 a 17:30 hs", llevar: ["Calzado cómodo", "Abrigo liviano para la mina", "Efectivo para compras"] },
  { id: 6, mapaImg: "/mapas/mapa-ciudad-este.jpg", entrada: { gratis: true }, nombre: "Compras en Ciudad del Este", lugar: "Paraguay", pais: "Paraguay", horas: 4, foto: "/fotos/ciudad-este.jpg", tags: ["🛍️ Compras / interior", "☔ Apto día de lluvia"], resumen: "Cruzás el Puente de la Amistad y te sumergís en uno de los centros comerciales más vibrantes de la región. Recorrés galerías con electrónica, perfumes, indumentaria y mucho más, con un ritmo intenso y lleno de ofertas. Con guía y chofer el día es más fácil, más seguro y mucho más rendidor.", desc: "Tiendas de electrónica, perfumes y mucho más a precios libres de impuestos.", horario: "07:00 a 17:00 hs", llevar: ["Efectivo (dólares o guaraníes)", "Mochila pequeña", "Calzado cómodo", "Agua"] },
  { id: 7, mapaImg: "/mapas/mapa-hito.jpg", entrada: { gratis: true }, nombre: "Hito Tres Fronteras", lugar: "Puerto Iguazú", pais: "Argentina", horas: 1.5, foto: "/fotos/hito.jpg", tags: ["♿ Apto cochecito / silla", "☀️ Al aire libre"], resumen: "Un mirador privilegiado sobre la confluencia de los ríos Iguazú y Paraná, donde en una sola postal ves tres países: Argentina, Brasil y Paraguay. Cada orilla tiene su obelisco con los colores de su bandera, y el paseo costero es ideal para caminar sin apuro. Un clásico para el atardecer y para llevarte una foto muy especial.", desc: "Mirador donde se juntan los ríos Iguazú y Paraná y se ven los tres países.", horario: "08:00 a 20:00 hs", llevar: ["Cámara o celular", "Repelente", "Protector solar"] },
  { id: 8, mapaImg: "/mapas/mapa-guiraoga.jpg", entrada: { moneda: "ARS", general: 35000 }, nombre: "GüiráOga", lugar: "Puerto Iguazú", pais: "Argentina", horas: 2, foto: "/fotos/guiraoga.jpg", tags: ["♿ Apto cochecito / silla", "🥾 Caminata suave", "☀️ Al aire libre"], resumen: "Un centro de rescate donde recorrés senderos de selva y conocés de cerca aves, monos, reptiles y otros animales rescatados que se están recuperando. Los guías te cuentan sus historias y cómo se trabaja para devolverlos a su hábitat. Una experiencia tranquila, educativa y muy emotiva.", desc: "Centro de rescate de fauna silvestre en plena selva misionera.", horario: "09:00 a 17:00 hs", llevar: ["Repelente", "Calzado cerrado", "Agua"] },
  { id: 9, mapaImg: "/mapas/mapa-aripuca.jpg", entrada: { moneda: "ARS", general: 8000 }, nombre: "La Aripuca", lugar: "Puerto Iguazú", pais: "Argentina", horas: 1.5, foto: "/fotos/aripuca.jpg", tags: ["♿ Apto cochecito / silla", "☔ Apto día de lluvia"], resumen: "Una gran construcción hecha con troncos enormes de árboles nativos, inspirada en las trampas que usaban los guaraníes para cazar. Adentro descubrís la historia de la selva misionera, maderas de la región y un espacio de artesanías. Un paseo corto, sorprendente y perfecto para completar tu día en Puerto Iguazú.", desc: "Gran construcción de troncos de árboles nativos, inspirada en una trampa guaraní.", horario: "09:00 a 18:00 hs", llevar: ["Calzado cómodo", "Protector solar", "Efectivo para artesanías"] },
  { id: 10, mapaImg: "/mapas/mapa-san-ignacio.jpg", entrada: { moneda: "ARS", general: 19000, etqGeneral: "Extranjeros", local: 8000, etqLocal: "Argentinos" }, nombre: "Ruinas de San Ignacio", lugar: "Misiones", pais: "Argentina", horas: 5, foto: "/fotos/san-ignacio.jpg", tags: ["🥾 Caminata moderada", "☀️ Al aire libre"], resumen: "Caminás entre las imponentes ruinas de arenisca roja de una de las misiones jesuítico-guaraníes mejor conservadas, Patrimonio de la Humanidad. Recorrés la plaza, la iglesia y los claustros mientras el guía te cuenta cómo vivían jesuitas y guaraníes. Un viaje en el tiempo en medio de la selva.", desc: "Misión jesuítico-guaraní de piedra roja, declarada Patrimonio de la Humanidad.", horario: "07:30 a 18:00 hs", llevar: ["Sombrero o gorra", "Protector solar", "Calzado cómodo", "Agua"] },
  { id: 11, mapaImg: "/mapas/mapa-templo-budista.jpg", entrada: { gratis: true }, nombre: "Templo Budista Chen Tien", lugar: "Foz do Iguaçu", pais: "Brasil", horas: 1.5, foto: "/fotos/templo-budista.jpg", tags: ["♿ Apto cochecito / silla", "☀️ Al aire libre"], resumen: "Un rincón de calma con arquitectura de inspiración china, jardines cuidados y esculturas que invitan a la contemplación. Es el lugar perfecto para hacer una pausa, caminar en silencio y tomar fotos distintas a todo lo que verás en el viaje. Corto, sereno y muy fotogénico.", desc: "Templo tranquilo con jardines y esculturas, ideal para una pausa.", horario: "09:00 a 17:00 hs", llevar: ["Ropa discreta y respetuosa", "Calzado fácil de quitar", "Agua"] },
  { id: 12, mapaImg: "/mapas/mapa-saltos-monday.jpg", entrada: { moneda: "USD", general: 12, etqGeneral: "Extranjeros", local: 9, etqLocal: "Mercosur" }, nombre: "Saltos del Monday", lugar: "Presidente Franco", pais: "Paraguay", horas: 2.5, foto: "/fotos/saltos-monday.jpg", tags: ["🥾 Caminata moderada", "💦 Rocío / te mojás"], resumen: "Una caída de agua rodeada de selva sobre el río Monday, con pasarelas y miradores para verla desde varios ángulos. El sonido del agua y el verde intenso lo hacen un lugar ideal para desconectar y refrescarse. Una joya natural que casi nadie conoce, a pocos kilómetros de Ciudad del Este.", desc: "Cascada sobre el río Monday, a pocos kilómetros de Ciudad del Este.", horario: "08:00 a 17:00 hs", llevar: ["Calzado antideslizante", "Traje de baño y toalla", "Repelente", "Agua"] },
];

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

const PLANES = [
  { id: "escapada", icono: "🌊", nombre: "Escapada 2 días", detalle: "Cataratas de ambos lados",
    dias: [
      { principales: [1], combos: [] },
      { principales: [2], combos: [3] },
    ] },
  { id: "clasico", icono: "🧭", nombre: "Clásico 3 días", detalle: "Argentina, Brasil y Paraguay",
    dias: [
      { principales: [1, 7], combos: [] },
      { principales: [2], combos: [3] },
      { principales: [6, 12], combos: [] },
    ] },
  { id: "aventura", icono: "🚤", nombre: "Aventura 4 días", detalle: "Con Gran Aventura y Macuco",
    dias: [
      { principales: [1], combos: ["gran-aventura"] },
      { principales: [2], combos: ["macuco-safari", 3] },
      { principales: [5, 8], combos: [] },
      { principales: [4, 11], combos: [] },
    ] },
];

const AVENTURA = [
  { id: "av-bici", nombre: "Paseos en bicicleta", foto: "/fotos/aventura-bici.jpg", desc: "Recorridos privados en bicicleta por senderos y caminos naturales de la región, adaptados a tu ritmo." },
  { id: "av-kayak", nombre: "Kayak", foto: "/fotos/aventura-kayak.jpg", desc: "Travesía privada en kayak por ríos y arroyos rodeados de selva misionera, con equipamiento incluido." },
  { id: "av-aves", nombre: "Bird Watching", foto: "/fotos/aventura-aves.jpg", desc: "Salida privada de observación de aves autóctonas en selva, ideal para aficionados y fotógrafos de naturaleza." },
  { id: "av-sunset", nombre: "Sunset en la Selva", foto: "/fotos/aventura-sunset.jpg", desc: "Experiencia privada al atardecer en un entorno natural único de la selva misionera." },
];

const MAPAS = [
  { id: "m1", nombre: "Parque Nacional Iguazú", pais: "Argentina", img: "/mapas/mapa-cataratas-arg.jpg", consulta: "Parque Nacional Iguazú, Misiones, Argentina" },
  { id: "m2", nombre: "Parque Nacional do Iguaçu", pais: "Brasil", img: "/mapas/mapa-cataratas-br.jpg", consulta: "Parque Nacional do Iguaçu, Foz do Iguaçu, Brasil" },
  { id: "m3", nombre: "Parque das Aves", pais: "Brasil", img: "/mapas/mapa-parque-aves.jpg", consulta: "Parque das Aves, Foz do Iguaçu, Brasil" },
  { id: "m4", nombre: "Represa de Itaipú", pais: "Brasil", img: "/mapas/mapa-itaipu.jpg", consulta: "Itaipu Binacional, Foz do Iguaçu, Brasil" },
  { id: "m5", nombre: "Minas de Wanda", pais: "Argentina", img: "/mapas/mapa-wanda.jpg", consulta: "Minas de Wanda, Misiones, Argentina" },
  { id: "m6", nombre: "Ciudad del Este (Área comercial)", pais: "Paraguay", img: "/mapas/mapa-ciudad-este.jpg", consulta: "Microcentro, Ciudad del Este, Paraguay" },
  { id: "m7", nombre: "Hito Tres Fronteras", pais: "Argentina", img: "/mapas/mapa-hito.jpg", consulta: "Hito Tres Fronteras, Puerto Iguazú, Argentina" },
  { id: "m8", nombre: "GüiráOga", pais: "Argentina", img: "/mapas/mapa-guiraoga.jpg", consulta: "Guira Oga, Puerto Iguazú, Argentina" },
  { id: "m9", nombre: "La Aripuca", pais: "Argentina", img: "/mapas/mapa-aripuca.jpg", consulta: "La Aripuca, Puerto Iguazú, Argentina" },
  { id: "m10", nombre: "Ruinas de San Ignacio", pais: "Argentina", img: "/mapas/mapa-san-ignacio.jpg", consulta: "Ruinas de San Ignacio Miní, Misiones, Argentina" },
  { id: "m11", nombre: "Templo Budista Chen Tien", pais: "Brasil", img: "/mapas/mapa-templo-budista.jpg", consulta: "Templo Budista Chen Tien, Foz do Iguaçu, Brasil" },
  { id: "m12", nombre: "Saltos del Monday", pais: "Paraguay", img: "/mapas/mapa-saltos-monday.jpg", consulta: "Saltos del Monday, Presidente Franco, Paraguay" },
  { id: "m13", nombre: "Centro de Puerto Iguazú", pais: "Argentina", img: "/mapas/mapa-centro-iguazu.jpg", consulta: "Puerto Iguazú, Misiones, Argentina" },
];

// ---------- 3 PLUMAS DEL BAILARÍN AZUL (2 AZULES + 1 ROJA MÁS PEQUEÑA) ----------
const PLUMAS_3 = [
  { id: "azul-1", top: "24%", size: 56, delay: "0ms", dur: "1.55s", gradId: "plumaAzulA", c1: "#7dd3fc", c2: "#0284c7", anim: "1" },
  { id: "roja-copete", top: "45%", size: 36, delay: "130ms", dur: "1.45s", gradId: "plumaRoja", c1: "#fca5a5", c2: "#dc2626", anim: "2" },
  { id: "azul-2", top: "64%", size: 48, delay: "70ms", dur: "1.65s", gradId: "plumaAzulB", c1: "#60a5fa", c2: "#1d4ed8", anim: "3" },
];

function PlumasTransicion({ rafaga }) {
  if (!rafaga) return null;
  const esIzq = rafaga.dir === "izq";
  return (
    <div key={rafaga.id} className={`plumas-capa dir-${rafaga.dir}`} style={{ "--dir": esIzq ? -1 : 1 }} aria-hidden="true">
      {PLUMAS_3.map((p) => (
        <svg
          key={p.id}
          className={`pluma-svg pluma-v-${p.anim}`}
          viewBox="0 0 64 64"
          style={{
            top: p.top,
            left: esIzq ? "100%" : "-64px",
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.dur,
          }}
        >
          <defs>
            <linearGradient id={`${p.gradId}-${rafaga.id}`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={p.c2} />
              <stop offset="55%" stopColor={p.c1} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          {/* Silueta realista de pluma con barbas separadas */}
          <path
            d="M54 8 C41 8, 29 14, 21 24 L26 26 L18 29 C14 35, 11 41, 11 47 L16 45 L12 51 C17 51, 24 49, 31 44 L29 39 L35 41 C45 33, 52 21, 54 8 Z"
            fill={`url(#${p.gradId}-${rafaga.id})`}
          />
          {/* Raquis central curvo y detalle de nervaduras */}
          <path
            d="M7 57 C19 44, 34 29, 53 9"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M27 36 L20 31 M34 29 L27 24 M41 22 L35 17 M33 35 L39 32 M25 43 L31 40"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="1.1"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      ))}
    </div>
  );
}

// ---------- FUNCIONES DE MONEDA Y SONIDO ----------
function aUSD(monto, moneda) {
  if (moneda === "USD") return monto;
  if (moneda === "ARS") return monto / TASAS_CAMBIO.USD_ARS;
  if (moneda === "BRL") return monto / TASAS_CAMBIO.USD_BRL;
  if (moneda === "PYG") return monto / TASAS_CAMBIO.USD_PYG;
  return monto;
}

function convertir(monto, desde, hacia) {
  if (desde === hacia) return monto;
  const usd = aUSD(monto, desde);
  if (hacia === "USD") return usd;
  if (hacia === "ARS") return usd * TASAS_CAMBIO.USD_ARS;
  if (hacia === "BRL") return usd * TASAS_CAMBIO.USD_BRL;
  if (hacia === "PYG") return usd * TASAS_CAMBIO.USD_PYG;
  return usd;
}

function formatear(monto, divisa) {
  const sim = MONEDAS[divisa]?.simbolo || divisa;
  const n = divisa === "USD" && monto < 20 && monto % 1 !== 0 ? Number(monto.toFixed(1)) : Math.round(monto);
  return `${sim} ${n.toLocaleString("es-AR")}`;
}

function costoEntrada(entrada, divisa, esLocal) {
  if (!entrada || entrada.gratis) return 0;
  const base = esLocal && entrada.local != null ? entrada.local : entrada.general;
  return convertir(base, entrada.moneda, divisa);
}

function textoEntrada(entrada, divisa) {
  if (!entrada || entrada.gratis) return "Entrada libre / gratuita";
  const gen = formatear(convertir(entrada.general, entrada.moneda, divisa), divisa);
  if (entrada.local != null) {
    const loc = formatear(convertir(entrada.local, entrada.moneda, divisa), divisa);
    return `${entrada.etqGeneral || "General"}: ${gen} · ${entrada.etqLocal || "Mercosur"}: ${loc}`;
  }
  if (entrada.etqGeneral) return `${entrada.etqGeneral}: ${gen}`;
  return gen;
}

function textoOficial(entrada) {
  if (!entrada || entrada.gratis) return "";
  const gen = formatear(entrada.general, entrada.moneda);
  if (entrada.local != null) return `Tarifa oficial: ${gen} / ${formatear(entrada.local, entrada.moneda)}`;
  return `Tarifa oficial: ${gen}`;
}

function reproducirCampanita() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const ahora = ctx.currentTime;
    [523.25, 659.25].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ahora + i * 0.09);
      gain.gain.setValueAtTime(0.08, ahora + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, ahora + i * 0.09 + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ahora + i * 0.09);
      osc.stop(ahora + i * 0.09 + 0.24);
    });
  } catch {
    // ignorar si el navegador bloquea audio
  }
}

function cargarGuardado() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignorar errores de almacenamiento
  }
  return {};
}

// ---------- COMPONENTES AUXILIARES ----------
function CapitanTangara({ modo, setModo, volando, mensaje, inline = false, botonesRapidos = null }) {
  const [cuadro, setCuadro] = useState(0);
  useEffect(() => {
    if (!volando) return;
    const iv = setInterval(() => setCuadro((c) => (c === 0 ? 1 : 0)), 130);
    return () => clearInterval(iv);
  }, [volando]);

  if (modo === "libre") {
    if (!inline) {
      return (
        <button type="button" className="tangara-mini" onClick={() => setModo("guiado")}
          aria-label="Llamar al Capitán Tangará" title="Llamar al Capitán Tangará">
          <img src="/fotos/asistente-posado.png" alt="Capitán Tangará" />
          <span>Tangará</span>
        </button>
      );
    }
    return null;
  }

  const imgActual = !volando
    ? "/fotos/asistente-posado.png"
    : cuadro === 0
      ? "/fotos/asistente-vuelo-1.png"
      : "/fotos/asistente-vuelo-2.png";

  return (
    <aside className={`tangara-posado ${volando ? "volando" : ""} ${inline ? "en-bloque" : "esquina"}`} aria-live="polite">
      <div className="tangara-globo">
        <div className="tangara-cab">
          <strong>🦜 Capitán Tangará</strong>
          <button type="button" className="tangara-cerrar" onClick={() => setModo("libre")} aria-label="Minimizar asistente" title="Explorar por mi cuenta">✕</button>
        </div>
        <p>{mensaje}</p>
        {botonesRapidos && (
          <div className="tangara-acciones tangara-rapidos">
            {botonesRapidos.map((b) => (
              <button key={b.id} type="button" className={`t-btn ${b.activo ? "si" : "no"}`} onClick={b.onClick}>
                {b.label}
              </button>
            ))}
          </div>
        )}
        {modo === "bienvenida" && !botonesRapidos && (
          <div className="tangara-acciones">
            <button type="button" className="t-btn si" onClick={() => setModo("guiado")}>Sí, guíame</button>
            <button type="button" className="t-btn no" onClick={() => setModo("libre")}>Explorar solo</button>
          </div>
        )}
      </div>
      <img className="tangara-ave" src={imgActual} alt="Capitán Tangará" />
    </aside>
  );
}

function Foto({ src, alt, className }) {
  const [falla, setFalla] = useState(false);
  if (falla) return <div className={`${className} foto-fallback`} role="img" aria-label={alt} />;
  return <img className={className} src={src} alt={alt} loading="lazy" onError={() => setFalla(true)} />;
}

function ImagenRespaldo({ src, respaldo, alt, className, fallback = null }) {
  const [etapa, setEtapa] = useState(0);
  if (etapa === 2 || (!src && !respaldo)) return fallback;
  const actual = etapa === 0 ? src : respaldo;
  if (!actual) return fallback;
  return (
    <img
      src={actual}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => {
        if (etapa === 0 && respaldo && respaldo !== src) setEtapa(1);
        else setEtapa(2);
      }}
    />
  );
}

function BarraResumen({ foto, nombre, meta, tags, conectado, abierto, onClick }) {
  return (
    <button type="button" className="barra-act" aria-expanded={abierto} onClick={onClick}>
      <Foto className="barra-miniatura" src={foto} alt={nombre} />
      <span className="barra-texto">
        <span className="barra-titulo">
          <span className="barra-nombre">{nombre}</span>
          {conectado && <span className="badge-conectado">Conectada ✓</span>}
        </span>
        <span className="barra-meta">{meta}</span>
        {tags && tags.length > 0 && (
          <span className="tags-fila">
            {tags.map((tg) => (
              <span key={tg} className="tag-chip">{tg}</span>
            ))}
          </span>
        )}
      </span>
      <span className="barra-flecha" aria-hidden="true">
        <b>{abierto ? "▲" : "▼"}</b>
        <span>{abierto ? "Cerrar" : "Ver"}</span>
      </span>
    </button>
  );
}

function Deslizable({ etiqueta = "article", className = "", onConectar, deshabilitado, children }) {
  const [dx, setDx] = useState(0);
  const [arrastrando, setArrastrando] = useState(false);
  const inicioX = useRef(0);
  const Tag = etiqueta;

  const onPointerDown = (e) => {
    if (deshabilitado || e.target.closest("button, select, input, a")) return;
    inicioX.current = e.clientX;
    setArrastrando(true);
  };
  const onPointerMove = (e) => {
    if (!arrastrando) return;
    const diff = Math.max(0, Math.min(130, e.clientX - inicioX.current));
    setDx(diff);
  };
  const terminar = () => {
    if (!arrastrando) return;
    if (dx >= 85 && !deshabilitado) onConectar();
    setArrastrando(false);
    setDx(0);
  };

  return (
    <Tag
      className={`${className} deslizable ${!deshabilitado ? "puede" : ""} ${arrastrando ? "arrastrando" : ""}`}
      style={{ transform: dx ? `translateX(${dx * 0.25}px)` : undefined }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={terminar}
      onPointerCancel={terminar}
    >
      {children}
      {!deshabilitado && (
        <div className="swipe" aria-hidden="true">
          <div className="swipe-fill" style={{ width: `${Math.min(100, (dx / 85) * 100)}%` }} />
          <span>{dx >= 85 ? "¡Soltá para conectar!" : "Deslizá → para conectar"}</span>
        </div>
      )}
    </Tag>
  );
}

function Carrusel({ fotos = [], nombre }) {
  const [idx, setIdx] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    if (fotos.length <= 1 || pausado || abierto) return;
    const iv = setInterval(() => setIdx((i) => (i + 1) % fotos.length), 5000);
    return () => clearInterval(iv);
  }, [fotos.length, pausado, abierto]);

  if (!fotos.length) return <div className="carrusel car-vacio">Sin fotos</div>;
  const prev = (e) => { e?.stopPropagation(); setIdx((i) => (i - 1 + fotos.length) % fotos.length); };
  const next = (e) => { e?.stopPropagation(); setIdx((i) => (i + 1) % fotos.length); };

  return (
    <div className="car-wrap">
      <div
        className={`carrusel clic ${pausado ? "pausado" : ""}`}
        onMouseEnter={() => setPausado(true)}
        onMouseLeave={() => setPausado(false)}
        onClick={() => setAbierto(true)}
      >
        {fotos.map((f, i) => (
          <img key={f} src={f} alt={`${nombre} ${i + 1}`} className={`slide ${i === idx ? "activa" : ""}`} />
        ))}
        {fotos.length > 1 && (
          <>
            <button type="button" className="car-btn prev" onClick={prev} aria-label="Foto anterior">‹</button>
            <button type="button" className="car-btn next" onClick={next} aria-label="Foto siguiente">›</button>
          </>
        )}
        <div className="car-badge" onClick={(e) => e.stopPropagation()}>
          <span>{idx + 1} / {fotos.length}</span>
          <button type="button" className="car-ampliar" onClick={() => setAbierto(true)}>Ampliar</button>
        </div>
      </div>
      {fotos.length > 1 && (
        <div className="thumbs">
          {fotos.map((f, i) => (
            <button key={f} type="button" className={`thumb ${i === idx ? "activa" : ""}`} onClick={() => setIdx(i)} aria-label={`Ver foto ${i + 1}`}>
              <img src={f} alt={`${nombre} miniatura ${i + 1}`} />
            </button>
          ))}
        </div>
      )}
      {abierto && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setAbierto(false)}>
          <span className="lb-cont">{idx + 1} / {fotos.length}</span>
          <button type="button" className="lb-cerrar" onClick={() => setAbierto(false)} aria-label="Cerrar">✕</button>
          {fotos.length > 1 && <button type="button" className="lb-btn prev" onClick={prev} aria-label="Anterior">‹</button>}
          <img className="lb-img" src={fotos[idx]} alt={`${nombre} ${idx + 1}`} onClick={(e) => e.stopPropagation()} />
          {fotos.length > 1 && <button type="button" className="lb-btn next" onClick={next} aria-label="Siguiente">›</button>}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const guardado = useRef(cargarGuardado()).current;

  // ---------- ESTADO ----------
  const [pestana, setPestana] = useState("destinos");
  const [dirVista, setDirVista] = useState("abajo");
  const [rafagaPlumas, setRafagaPlumas] = useState(null);
  const swipeTabRef = useRef({ x: 0, y: 0, ignorar: false });
  const [colabCat, setColabCat] = useState("hoteles");
  const [mapaAmpliado, setMapaAmpliado] = useState(null);
  const [zoomMapa, setZoomMapa] = useState(1);
  const [modoTangara, setModoTangara] = useState("bienvenida");
  const [volandoTangara, setVolandoTangara] = useState(false);
  const timerTangara = useRef(null);
  const volarTangara = () => {
    setVolandoTangara(true);
    clearTimeout(timerTangara.current);
    timerTangara.current = setTimeout(() => setVolandoTangara(false), 650);
  };

  useEffect(() => {
    if (!rafagaPlumas) return;
    const tmr = setTimeout(() => setRafagaPlumas(null), 1850);
    return () => clearTimeout(tmr);
  }, [rafagaPlumas]);

  const cambiarPestana = (nueva, dirForzada = null) => {
    if (nueva === pestana) return;
    const idxActual = ORDEN_PESTANAS.indexOf(pestana);
    const idxNueva = ORDEN_PESTANAS.indexOf(nueva);
    const dir = dirForzada || (idxNueva > idxActual ? "izq" : "der");
    setDirVista(dir);
    setRafagaPlumas({ id: Date.now(), dir });
    setPestana(nueva);
    if (modoTangara === "guiado") volarTangara();
  };

  const onTouchStartTab = (e) => {
    if (mapaAmpliado || e.touches.length !== 1) return;
    const ignorar = Boolean(e.target.closest(".deslizable.puede, .carrusel, .mapa-scroll, input, select, textarea"));
    swipeTabRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, ignorar };
  };

  const onTouchEndTab = (e) => {
    const { x, y, ignorar } = swipeTabRef.current;
    if (ignorar || !e.changedTouches.length || mapaAmpliado) return;
    const dx = e.changedTouches[0].clientX - x;
    const dy = e.changedTouches[0].clientY - y;
    if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.6) return;
    const idx = ORDEN_PESTANAS.indexOf(pestana);
    if (dx < 0 && idx < ORDEN_PESTANAS.length - 1) {
      cambiarPestana(ORDEN_PESTANAS[idx + 1], "izq");
    } else if (dx > 0 && idx > 0) {
      cambiarPestana(ORDEN_PESTANAS[idx - 1], "der");
    }
  };

  const [dias, setDias] = useState(guardado.dias || 3);
  const [personas, setPersonas] = useState(guardado.personas || 2);
  const [movilidad, setMovilidad] = useState(guardado.movilidad || "no");
  const [hotel, setHotel] = useState(guardado.hotel || "");
  const [nombreTurista, setNombreTurista] = useState(guardado.nombreTurista || "");
  const [carrito, setCarrito] = useState(Array.isArray(guardado.carrito) ? guardado.carrito : []);
  const [divisa, setDivisa] = useState(guardado.divisa || "ARS");
  const [idioma, setIdioma] = useState(guardado.idioma || "es");
  const [modoClaro, setModoClaro] = useState(Boolean(guardado.modoClaro));

  const [expandidas, setExpandidas] = useState({});
  const [combosExpandidos, setCombosExpandidos] = useState({});
  const [tipsAbierto, setTipsAbierto] = useState(false);
  const [faltaNombre, setFaltaNombre] = useState(false);
  const [planCargado, setPlanCargado] = useState("");
  const [carritoVisible, setCarritoVisible] = useState(false);
  const refNombre = useRef(null);
  const refCarrito = useRef(null);
  const [paisAbierto, setPaisAbierto] = useState(null);
  const [infoAbierta, setInfoAbierta] = useState(null);
  const [diaSel, setDiaSel] = useState({});
  const [aviso, setAviso] = useState(null);
  const [avisoCombo, setAvisoCombo] = useState(null);
  const [avisoGlobal, setAvisoGlobal] = useState("");
  const [sonido, setSonido] = useState(true);
  const sonar = () => { if (sonido) reproducirCampanita(); };

  const t = TEXTOS[idioma] || TEXTOS.es;

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ dias, personas, movilidad, hotel, nombreTurista, carrito, divisa, idioma, modoClaro })
      );
    } catch {
      // ignorar
    }
  }, [dias, personas, movilidad, hotel, nombreTurista, carrito, divisa, idioma, modoClaro]);

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

  const limpiarViaje = () => {
    setCarrito([]);
    setDias(3);
    setPersonas(2);
    setMovilidad("no");
    setHotel("");
    setNombreTurista("");
    setPlanCargado("");
    setAviso(null);
    setAvisoCombo(null);
    setAvisoGlobal("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignorar
    }
  };

  const diaDe = (id) => Math.min(diaSel[id] ?? 1, dias);

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
    if (!COMBOS.some((c) => c.padre === a.id)) {
      setExpandidas((prev) => ({ ...prev, [a.id]: false }));
    }
  };

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
    setCombosExpandidos((prev) => ({ ...prev, [c.id]: false }));
  };

  const quitar = (id) => {
    setPlanCargado("");
    setCarrito(carrito.filter((a) => a.id !== id && a.opcionalDe !== id));
  };

  // ---------- CÁLCULOS ----------
  const horasTotales = carrito.reduce((s, a) => s + a.horas, 0);
  const presupuesto = carrito.reduce((tAcc, a) => tAcc + costoEntrada(a.entrada, divisa, false), 0) * personas;
  const presupuestoLocal = carrito.reduce((tAcc, a) => tAcc + costoEntrada(a.entrada, divisa, true), 0) * personas;
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

  const confirmarReserva = (e) => {
    if (nombre) return;
    e.preventDefault();
    setFaltaNombre(true);
    refNombre.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => refNombre.current?.focus({ preventScroll: true }), 500);
  };

  const irAlCarrito = () => {
    const ir = () => refCarrito.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (pestana !== "destinos") { cambiarPestana("destinos", "der"); window.setTimeout(ir, 120); } else ir();
  };

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
    { id: "destinos", etiqueta: t.tabs.destinos, icono: "🏞️" },
    { id: "mapas", etiqueta: t.tabs.mapas, icono: "🗺️" },
    { id: "colab", etiqueta: t.tabs.colab, icono: "🏨" },
    { id: "guia", etiqueta: t.tabs.guia, icono: "💬" },
  ];

  const colabsDeCategoria = COLABORADORES.filter((c) => c.tipo === colabCat);
  const promosActivas = colabsDeCategoria.filter((c) => c.promo && c.promo.trim());

  const tienePais = (p) => carrito.some((x) => x.pais === p);
  const consejoTangara = (() => {
    if (pestana === "mapas") {
      return "Importante: estos mapas son meramente ilustrativos para darte una orientación general; ningún mapa representa con total exactitud el recorrido real. Usá el botón de Google Maps para navegar con precisión.";
    }
    if (pestana === "colab") {
      const listaNombres = colabsDeCategoria.map((c) => c.nombre).join(", ");
      const promoTexto = promosActivas.length
        ? ` Promos activas ahora: ${promosActivas.map((p) => `${p.nombre} (${p.promo})`).join(" · ")}.`
        : "";
      if (colabCat === "hoteles") {
        return `¿Estás buscando hospedaje para ${personas} ${personas === 1 ? "persona" : "personas"} (${dias} ${dias === 1 ? "día" : "días"})? Hoy te recomiendo consultar disponibilidad en: ${listaNombres || "nuestros aliados"}.${promoTexto}`;
      }
      if (colabCat === "restaurantes") {
        return colabsDeCategoria.length
          ? `¿Viendo qué cenar o almorzar en la ciudad? Te recomiendo: ${listaNombres}.${promoTexto}`
          : "¿Viendo qué cenar en la ciudad? Muy pronto vamos a sumar restaurantes aliados con promos. Mientras tanto, preguntale a Alan por WhatsApp sus lugares favoritos.";
      }
      if (colabCat === "guias") {
        return colabsDeCategoria.length
          ? `¿Buscás un guía habilitado de confianza? Podés contactar a: ${listaNombres}.${promoTexto}`
          : "¿Necesitás un guía de confianza para tu recorrido? Pronto sumamos el listado completo; por ahora coordinamos directo con Alan por WhatsApp.";
      }
      if (colabCat === "choferes") {
        return colabsDeCategoria.length
          ? `¿Buscás chofer o traslado privado? Tenés disponible a: ${listaNombres}.${promoTexto}`
          : "¿Necesitás chofer o traslado privado entre Argentina, Brasil y Paraguay? Pronto sumamos más choferes acá; consultanos por WhatsApp para reservar.";
      }
    }
    if (modoTangara === "bienvenida") {
      return "¡Hola! Soy el Capitán Tangará. Completá tu nombre, días y hotel arriba. ¿Querés que te guíe según tus días o preferís explorar solo?";
    }
    if (pestana === "guia") return "¿Dudas antes de reservar? Escribinos directo por WhatsApp o mail.";
    if (paisAbierto === "Argentina") {
      if (tienePais("Argentina")) {
        return `¡Circuito argentino listo! Llevá DNI físico vigente, calzado cerrado, piloto de lluvia, repelente y agua.${dias >= 2 && dias <= 3 && !tienePais("Brasil") ? " Con " + dias + " días te recomiendo sumar Brasil mañana." : ""}`;
      }
      return dias <= 2
        ? "Con " + dias + " días, priorizá Cataratas Argentinas (7 hs) y sumá Gran Aventura si querés lancha. Luego te recomiendo cruzar a Brasil."
        : "En " + dias + " días podés hacer Cataratas Argentinas un día y dejar Minas de Wanda, GüiráOga o San Ignacio para otro día.";
    }
    if (paisAbierto === "Brasil") {
      if (tienePais("Brasil")) {
        return "¡Gran circuito en Foz! Llevá DNI o pasaporte original (sin fotocopias) para aduana, protector solar, gorra y piloto.";
      }
      return "Cataratas Brasileñas lleva medio día: combinala el mismo día con Parque das Aves, Macuco Safari, Helisul o AquaFoz.";
    }
    if (paisAbierto === "Paraguay") {
      if (tienePais("Paraguay")) {
        return "Para el Puente de la Amistad llevá documento original vigente, efectivo (USD o Gs) y calzado antideslizante para Saltos del Monday.";
      }
      return "En Paraguay podés combinar Compras en Ciudad del Este por la mañana y Saltos del Monday por la tarde.";
    }
    if (paisAbierto === "aventura") {
      return "Tours privados a medida (bici, kayak, aves o sunset). Tocá «Quiero saber más» y coordinamos según el clima.";
    }
    if (carrito.length > 0) {
      return `¡Vas bárbaro! Ya armaste ${carrito.length} actividad(es). Recordá que la seña del 50% es solo por traslados y guías; entradas en boletería.`;
    }
    return dias <= 3
      ? `Para ${dias} días te sugiero empezar abriendo Argentina o cargar un plan sugerido en 1 clic.`
      : `Con ${dias} días podés recorrer los 3 países tranquilos. Abrí un bloque abajo para empezar.`;
  })();

  const botonesColabTangara = pestana === "colab"
    ? CATEGORIAS_COLAB.map((cat) => ({
        id: cat.id,
        label: cat.preguntaBtn,
        activo: colabCat === cat.id,
        onClick: () => { setColabCat(cat.id); volarTangara(); },
      }))
    : null;

  const dondeSePosa =
    pestana === "mapas" ? "mapas-top" :
    pestana === "colab" ? "colab-top" :
    modoTangara === "bienvenida" ? "inicio" :
    pestana !== "destinos" ? "pestana" :
    paisAbierto ? `pais-${paisAbierto}` :
    carrito.length > 0 ? "carrito" : "inicio";

  return (
    <div
      className={`app ${carrito.length > 0 ? "con-barra" : ""} ${modoClaro ? "claro" : ""}`}
      onTouchStart={onTouchStartTab}
      onTouchEnd={onTouchEndTab}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; display: block; }
        .app { --tinta: #f4f4f5; --rio: #34d399; --niebla: #1c1c21; --papel: #141417; --suave: #a1a1aa;
          color-scheme: dark; text-align: left; min-height: 100vh; background: #09090b; color: var(--tinta);
          font-family: "Segoe UI", system-ui, sans-serif; padding: 24px 16px 48px; transition: background .25s, color .25s; touch-action: pan-y; }
        .contenedor { max-width: 1100px; margin: 0 auto; }
        .app h1, .app h2, .app h3 { color: var(--tinta); }
        @keyframes entrarVista { from { opacity: 0; transform: translateY(12px) scale(.99); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes entrarDesdeDer { from { opacity: 0; transform: translateX(28px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes entrarDesdeIzq { from { opacity: 0; transform: translateX(-28px); } to { opacity: 1; transform: translateX(0); } }
        .vista-animada { animation: entrarVista .3s cubic-bezier(.22, 1, .36, 1) both; }
        .vista-animada.dir-izq { animation: entrarDesdeDer .28s cubic-bezier(.22, 1, .36, 1) both; }
        .vista-animada.dir-der { animation: entrarDesdeIzq .28s cubic-bezier(.22, 1, .36, 1) both; }

        /* ===== 3 PLUMAS PLANEANDO COMO HOJA AL VIENTO ===== */
        .plumas-capa { position: fixed; inset: 0; pointer-events: none; z-index: 900; overflow: hidden; }
        .pluma-svg { position: absolute; filter: drop-shadow(0 6px 10px rgba(0,0,0,.45)); opacity: 0; animation-fill-mode: forwards; animation-timing-function: cubic-bezier(.25, .46, .45, .94); }
        .pluma-v-1 { animation-name: plumaHoja1; }
        .pluma-v-2 { animation-name: plumaHoja2; }
        .pluma-v-3 { animation-name: plumaHoja3; }
        @keyframes plumaHoja1 {
          0%   { opacity: 0; transform: translate(0, 0) rotate(calc(var(--dir) * -28deg)) scale(.85); }
          12%  { opacity: .96; }
          36%  { opacity: .95; transform: translate(calc(var(--dir) * 26vw), -26px) rotate(calc(var(--dir) * 18deg)) scale(1.04); }
          64%  { opacity: .9;  transform: translate(calc(var(--dir) * 52vw), 22px) rotate(calc(var(--dir) * -22deg)) scale(1); }
          85%  { opacity: .75; transform: translate(calc(var(--dir) * 66vw), 42px) rotate(calc(var(--dir) * 8deg)) scale(.95); }
          100% { opacity: 0;   transform: translate(calc(var(--dir) * 70vw), 52px) rotate(calc(var(--dir) * -4deg)) scale(.92); }
        }
        @keyframes plumaHoja2 {
          0%   { opacity: 0; transform: translate(0, 0) rotate(calc(var(--dir) * 20deg)) scale(.8); }
          14%  { opacity: .96; }
          40%  { opacity: .95; transform: translate(calc(var(--dir) * 22vw), 22px) rotate(calc(var(--dir) * -26deg)) scale(1); }
          68%  { opacity: .88; transform: translate(calc(var(--dir) * 44vw), -14px) rotate(calc(var(--dir) * 24deg)) scale(.96); }
          87%  { opacity: .72; transform: translate(calc(var(--dir) * 55vw), 18px) rotate(calc(var(--dir) * -10deg)) scale(.92); }
          100% { opacity: 0;   transform: translate(calc(var(--dir) * 58vw), 26px) rotate(calc(var(--dir) * 4deg)) scale(.9); }
        }
        @keyframes plumaHoja3 {
          0%   { opacity: 0; transform: translate(0, 0) rotate(calc(var(--dir) * -16deg)) scale(.85); }
          15%  { opacity: .94; }
          38%  { opacity: .92; transform: translate(calc(var(--dir) * 28vw), 14px) rotate(calc(var(--dir) * 25deg)) scale(1.02); }
          66%  { opacity: .85; transform: translate(calc(var(--dir) * 54vw), -20px) rotate(calc(var(--dir) * -18deg)) scale(.97); }
          86%  { opacity: .7;  transform: translate(calc(var(--dir) * 69vw), 16px) rotate(calc(var(--dir) * 10deg)) scale(.93); }
          100% { opacity: 0;   transform: translate(calc(var(--dir) * 73vw), 24px) rotate(calc(var(--dir) * -3deg)) scale(.9); }
        }
        @media (prefers-reduced-motion: reduce) {
          .vista-animada, .vista-animada.dir-izq, .vista-animada.dir-der { animation: none; }
          .plumas-capa { display: none; }
        }

        .app .portada { border-radius: 16px; padding: clamp(40px, 9vw, 96px) clamp(20px, 5vw, 48px); margin-bottom: 20px;
          background-color: #1b3a4b; background-image: linear-gradient(rgba(5,20,32,.55), rgba(5,20,32,.55)), url('/fotos/portada.jpg');
          background-size: cover; background-position: center; position: relative; border: 1px solid #27272a; }
        .app .portada .titulo { color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,.4); margin: 0 0 8px; font-family: Georgia, serif; font-size: clamp(2rem, 5vw, 3.2rem); line-height: 1.1; }
        .app .portada .subtitulo { color: #fff; margin: 0; font-size: 1.05rem; text-shadow: 0 1px 6px rgba(0,0,0,.4); }
        .controles-top { position: absolute; top: 12px; right: 12px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
        .ctrl-top { height: 36px; min-width: 36px; padding: 0 10px; border-radius: 999px; border: 1px solid rgba(255,255,255,.28); background: rgba(9,9,11,.6);
          -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); color: #fff; font-size: .82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
        .ctrl-top.activo { background: #10b981; color: #04261a; border-color: #10b981; }
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
        .pais-cuerpo { padding: 4px 18px 18px; display: flex; flex-direction: column; gap: 10px; }
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
        .combos { grid-column: 1 / -1; background: #f6fbfa; border: 2px solid var(--c); border-radius: 14px; padding: 16px; margin: 10px; }
        .combos h3 { margin: 0 0 4px; font-size: 1.15rem; }
        .combos-sub { margin: 0 0 14px; font-size: .9rem; color: var(--suave); }
        .combo { background: var(--papel); border-radius: 12px; overflow: hidden; box-shadow: 0 1px 6px rgba(11,37,64,.12); }
        .combo-foto { width: 100%; height: 150px; object-fit: cover; display: block; }
        .combo-cuerpo { padding: 12px; display: flex; flex-direction: column; gap: 6px; }
        .combo h4 { margin: 0; font-size: 1rem; color: var(--tinta); }
        .combo-datos { margin: 0; font-size: .84rem; line-height: 1.4; }
        .etq { display: inline-block; font-size: .72rem; font-weight: 700; background: #fff4c7; color: #3d2f00; border-radius: 999px; padding: 1px 8px; margin-bottom: 2px; }
        .dia { border-radius: 12px; border: 2px solid #d4e0dc; padding: 10px 12px; margin-bottom: 10px; }
        .dia.activo { border-color: var(--c); }
        .dia-cab { display: flex; justify-content: space-between; gap: 8px; font-weight: 700; margin-bottom: 6px; }
        .dia-libre { color: var(--suave); font-weight: 400; }
        .btn-quitar { border: none; background: transparent; color: #a82a21; font-weight: 700; cursor: pointer; padding: 6px 8px; }
        .totales { display: flex; justify-content: space-between; font-weight: 700; margin: 12px 0; }
        .condiciones { background: #fff4c7; border: 2px solid #e0a800; border-radius: 12px; padding: 14px; margin-bottom: 14px; color: #3d2f00; line-height: 1.45; }
        .condiciones strong { display: block; margin-bottom: 4px; }
        .btn-whatsapp { display: block; width: 100%; text-align: center; text-decoration: none; border: none; background: #1a8f45; color: #fff !important; padding: 14px; border-radius: 12px; font-size: 1.02rem; font-weight: 700; cursor: pointer; }
        .btn-whatsapp:disabled { background: #b9c7c4; color: #2f403d !important; cursor: default; }
        .nota { font-size: .88rem; color: var(--suave); margin: 10px 0 0; }
        .pais-tag { font-size: .8rem; padding: 2px 10px; border-radius: 999px; color: #fff; }
        .Argentina { background: #2b86c5; } .Brasil { background: #1f8a4c; } .Paraguay { background: #c93a30; }
        .grilla-mapas { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr)); gap: 20px; margin-top: 14px; }
        .mapa-tarjeta { background: var(--papel); border-radius: 16px; overflow: hidden; box-shadow: 0 2px 10px rgba(11,37,64,.12); }
        .mapa-info { padding: 16px; display: flex; flex-direction: column; gap: 10px; }
        .mapa-info h3 { margin: 0; font-size: 1.1rem; }
        .btn-link { display: inline-block; text-align: center; text-decoration: none; background: var(--rio); color: #fff; padding: 10px 14px; border-radius: 10px; font-weight: 700; }
        .guia-card { max-width: 640px; border-radius: 28px; overflow: hidden; padding: clamp(16px, 4vw, 34px);
          background: url('/fotos/tarjeta-guia.jpg') center / cover no-repeat, linear-gradient(135deg, #2f6f55 0%, #1f6f8b 60%, #7bbf9a 100%);
          box-shadow: 0 30px 60px -18px rgba(11,37,64,.55), 0 8px 20px rgba(11,37,64,.25); }
        .guia-capa { background: rgba(9,9,11,.72); -webkit-backdrop-filter: blur(2px); backdrop-filter: blur(2px);
          border: 1px solid rgba(255,255,255,.12); border-radius: 22px; padding: clamp(20px, 4vw, 34px); }
        .guia-sello { display: inline-block; font-size: .78rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #04261a; background: #10b981; border-radius: 999px; padding: 4px 12px; }
        .guia-capa h2 { margin: 12px 0 4px; font-family: Georgia, serif; font-size: clamp(1.5rem, 4vw, 2rem); line-height: 1.15; }
        .guia-titulo { margin: 0 0 18px; color: var(--suave); font-weight: 600; }
        .guia-datos { list-style: none; margin: 0 0 20px; padding: 0; display: grid; gap: 10px; font-size: 1.05rem; font-weight: 600; }
        .guia-datos li { overflow-wrap: anywhere; }
        .guia-datos a { color: var(--tinta); text-decoration: none; border-bottom: 2px solid #10b981; }
        .guia-botones { display: flex; flex-wrap: wrap; gap: 10px; }
        .guia-botones .btn-whatsapp, .guia-botones .btn-mail { width: auto; flex: 1 1 170px; }
        .btn-mail { display: block; text-align: center; text-decoration: none; background: #27272a; color: #f4f4f5 !important; border: 1px solid #3f3f46; padding: 14px; border-radius: 12px; font-size: 1.02rem; font-weight: 700; }
        .colab-tabs { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin: 14px 0 20px; }
        .colab-tab { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 14px; border-radius: 14px; border: 1px solid #27272a; background: var(--papel); color: var(--tinta); font-family: inherit; font-weight: 700; font-size: .9rem; cursor: pointer; transition: border-color .2s, transform .15s; }
        .colab-tab:hover { border-color: #10b981; transform: translateY(-1px); }
        .colab-tab.activa { background: linear-gradient(135deg, #34d399, #10b981); color: #04261a; border-color: #10b981; }
        .colab-vacio { background: var(--papel); border: 1px dashed #3f3f46; border-radius: 20px; padding: 28px 20px; text-align: center; margin-bottom: 18px; }
        .colab-vacio h3 { margin: 0 0 8px; font-family: Georgia, serif; }
        .colab-vacio p { margin: 0 auto 16px; max-width: 520px; color: var(--suave); line-height: 1.45; }
        .colab-vacio .btn-whatsapp { max-width: 320px; margin: 0 auto; }
        .colab-promo { display: inline-block; margin-top: 6px; padding: 4px 10px; border-radius: 999px; background: rgba(251,191,36,.18); border: 1px solid #f59e0b; color: #fde68a; font-size: .8rem; font-weight: 700; }
        .colab-card { background: var(--papel); border-radius: 24px; overflow: hidden; margin-bottom: 24px; border-top: 8px solid #1f8a4c; }
        .colab-cab { display: flex; flex-wrap: wrap; align-items: center; gap: 20px; padding: 24px 24px 8px; }
        .medallon { width: 120px; height: 120px; flex: none; border-radius: 50%; background: #fff; border: 4px solid #1f8a4c; box-shadow: 0 8px 20px rgba(11,37,64,.25); display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .medallon img { width: 100%; height: 100%; object-fit: contain; padding: 8px; }
        .medallon-ini { font-family: Georgia, serif; font-size: 2.2rem; font-weight: 700; color: #1f8a4c; }
        .colab-cab h2 { margin: 6px 0; font-family: Georgia, serif; font-size: clamp(1.5rem, 4vw, 2rem); }
        .badge { display: inline-block; font-size: .75rem; font-weight: 700; background: #3a2e07; color: #fde68a; border: 1px solid #b45309; border-radius: 999px; padding: 2px 10px; }
        .cat { display: inline-block; font-size: .85rem; font-weight: 700; color: #6ee7b7; background: rgba(16,185,129,.18); border: 1px solid #065f46; border-radius: 999px; padding: 3px 12px; }
        .colab-cuerpo { display: grid; grid-template-columns: 1fr; gap: 22px; padding: 16px 24px 26px; align-items: start; }
        @media (min-width: 820px) { .colab-cuerpo { grid-template-columns: 1.2fr 1fr; } }
        .car-wrap { min-width: 0; }
        .carrusel { position: relative; border-radius: 16px; overflow: hidden; background: #0d2a35; aspect-ratio: 4 / 3; }
        .carrusel.clic { cursor: zoom-in; }
        .carrusel .slide { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; opacity: 0; transform: scale(1.06); transition: opacity .9s ease; }
        .carrusel .slide.activa { opacity: 1; animation: kenburns 5s linear forwards; }
        .carrusel.pausado .slide.activa { animation-play-state: paused; }
        @keyframes kenburns { from { transform: scale(1); } to { transform: scale(1.06); } }
        @media (prefers-reduced-motion: reduce) { .carrusel .slide.activa { animation: none; transform: scale(1); } }
        .car-vacio { display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; }
        .car-btn { position: absolute; top: 50%; transform: translateY(-50%); z-index: 2; width: 44px; height: 44px; border-radius: 50%; border: none; background: rgba(255,255,255,.9); color: #09090b; font-size: 1.8rem; line-height: 1; cursor: pointer; }
        .car-btn.prev { left: 10px; } .car-btn.next { right: 10px; }
        .car-badge { position: absolute; left: 12px; bottom: 12px; z-index: 2; display: flex; align-items: center; gap: 10px; padding: 5px 6px 5px 14px; border-radius: 999px; color: #fff; font-weight: 700; font-size: .85rem;
          background: rgba(10,25,35,.45); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); border: 1px solid rgba(255,255,255,.25); cursor: default; }
        .car-ampliar { border: none; background: rgba(255,255,255,.92); color: #09090b; font-weight: 700; font-size: .8rem; border-radius: 999px; padding: 6px 12px; cursor: pointer; }
        .thumbs { display: flex; gap: 6px; margin-top: 10px; padding: 6px 2px 10px; overflow: visible; }
        .thumb { flex: 1 1 0; width: auto; min-width: 0; max-width: 96px; aspect-ratio: 4 / 3; padding: 0; border-radius: 10px; overflow: hidden; border: 3px solid transparent; background: #0d2a35; cursor: pointer; opacity: .7; transition: opacity .2s, transform .2s, box-shadow .2s; }
        .thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .thumb:hover { opacity: 1; }
        .thumb.activa { opacity: 1; border-color: #10b981; box-shadow: 0 0 0 2px #09090b, 0 6px 16px rgba(16,185,129,.6); transform: translateY(-2px); }
        .lightbox { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; background: rgba(5,15,25,.88);
          -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); touch-action: pan-y; animation: lbEntrada .2s ease; }
        @keyframes lbEntrada { from { opacity: 0; } to { opacity: 1; } }
        .lb-img { max-width: 92vw; max-height: 84vh; object-fit: contain; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,.6); user-select: none; }
        .lb-btn { position: absolute; top: 50%; transform: translateY(-50%); width: 60px; height: 60px; border-radius: 50%; border: none; background: rgba(255,255,255,.9); color: #09090b; font-size: 2.4rem; line-height: 1; cursor: pointer; }
        .lb-btn.prev { left: 16px; } .lb-btn.next { right: 16px; }
        .lb-cerrar { position: absolute; top: 16px; right: 16px; width: 52px; height: 52px; border-radius: 50%; border: none; background: rgba(255,255,255,.9); color: #09090b; font-size: 1.5rem; cursor: pointer; }
        .lb-cont { position: absolute; top: 24px; left: 50%; transform: translateX(-50%); color: #fff; font-weight: 700; background: rgba(0,0,0,.5); padding: 4px 14px; border-radius: 999px; }
        @media (max-width: 600px) { .lb-btn { width: 48px; height: 48px; font-size: 2rem; } .lb-btn.prev { left: 8px; } .lb-btn.next { right: 8px; } }
        .colab-info p { margin: 0 0 14px; line-height: 1.5; }
        .colab-datos { list-style: none; margin: 0 0 14px; padding: 0; display: grid; gap: 8px; font-size: .95rem; }
        .colab-datos a { color: #34d399; font-weight: 600; }
        .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
        .chip { background: rgba(16,185,129,.15); color: #6ee7b7; font-size: .85rem; font-weight: 600; border-radius: 999px; padding: 4px 12px; }
        .colab-botones { display: flex; flex-wrap: wrap; gap: 10px; }
        .colab-botones .btn-whatsapp, .colab-botones .btn-link { width: auto; flex: 1 1 150px; }
        .firma { display: flex; justify-content: flex-end; align-items: center; gap: 10px; margin-top: 40px; }
        .firma-logo { height: 40px; width: auto; display: block; }
        .firma span { font-family: 'Caveat', 'Segoe Script', 'Bradley Hand', cursive; font-size: 1.6rem; color: var(--tinta); opacity: .85; }
        .app option { background: #1c1c21; color: #f4f4f5; }
        .historias { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; max-width: 460px; margin: 4px auto 28px; }
        .historia { display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 0; padding: 0; border: none; background: transparent; color: #a1a1aa; font-family: inherit; cursor: pointer; }
        .historia.activa { color: var(--tinta); }
        .aro { position: relative; width: min(72px, 17vw); height: min(72px, 17vw); padding: 3px; border-radius: 50%; background: #3f3f46; transition: transform .2s; }
        .historia:hover .aro { transform: scale(1.06); }
        .historia.activa .aro { background: linear-gradient(45deg, #f9ce34, #ee2a7b 55%, #6228d7); box-shadow: 0 0 18px rgba(238,42,123,.45); }
        .aro-interior { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 3px solid #09090b; background: radial-gradient(circle at 30% 25%, #2e2e35, #141417); font-size: clamp(1.4rem, 6vw, 1.9rem); }
        .aro-cont { position: absolute; top: -3px; right: -3px; min-width: 22px; height: 22px; padding: 0 6px; display: flex; align-items: center; justify-content: center; border-radius: 999px; border: 2px solid #09090b; background: #10b981; color: #04261a; font-size: .75rem; font-weight: 800; }
        .historia-titulo { font-size: clamp(.62rem, 2.9vw, .8rem); font-weight: 700; white-space: nowrap; }
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
        .condiciones { background: #2a2208; border-color: #b45309; color: #fde68a; }
        .dia { border-color: #27272a; }
        .btn-quitar { color: #f87171; }
        .etq { background: #3a2e07; color: #fde68a; }
        .deslizable { position: relative; touch-action: pan-y; transition: transform .25s ease; }
        .deslizable.puede { cursor: grab; }
        .deslizable.arrastrando { transition: none; cursor: grabbing; user-select: none; -webkit-user-select: none; }
        .swipe { position: relative; height: 34px; margin: 0 14px 14px; border-radius: 999px; background: #27272a; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .swipe-fill { position: absolute; inset: 0 auto 0 0; background: linear-gradient(90deg, #059669, #34d399); }
        .swipe span { position: relative; font-size: .8rem; font-weight: 700; color: #f4f4f5; text-shadow: 0 1px 2px rgba(0,0,0,.6); }
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
        .presupuesto b { color: var(--tinta); }
        .condiciones p { margin: 0 0 8px; }
        .condiciones p:last-child { margin: 0; }
        .condiciones .importante { font-weight: 700; }
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
        .campo.falta input { border-color: #f59e0b; box-shadow: 0 0 0 4px rgba(245,158,11,.35); animation: latido 1.2s ease-in-out 2; }
        @keyframes latido { 50% { box-shadow: 0 0 0 8px rgba(245,158,11,.15); } }
        @media (prefers-reduced-motion: reduce) { .campo.falta input { animation: none; } }
        .aviso-nombre { margin: 8px 0 0; padding: 8px 10px; border-radius: 10px; background: #3a2e07; color: #fde68a; border: 1px solid #854d0e; font-size: .85rem; line-height: 1.35; }
        .barra-movil { display: none; position: fixed; left: 10px; right: 10px; bottom: calc(10px + env(safe-area-inset-bottom, 0px)); z-index: 500; align-items: center; justify-content: space-between; gap: 10px;
          padding: 10px 10px 10px 16px; border-radius: 18px; border: 1px solid #10b981; background: rgba(9,9,11,.82); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
          box-shadow: 0 10px 30px rgba(0,0,0,.6), 0 0 0 1px rgba(16,185,129,.2); font-weight: 700; font-size: .92rem; }
        .barra-movil button { flex: none; border: none; border-radius: 999px; padding: 10px 16px; background: linear-gradient(135deg, #34d399, #10b981); color: #04261a; font-family: inherit; font-weight: 800; font-size: .9rem; cursor: pointer; }
        .carrito { scroll-margin-top: 12px; }
        @media (max-width: 899px) { .barra-movil { display: flex; } .app.con-barra { padding-bottom: 104px; } }
        .app { overflow-x: clip; }
        .colab-card, .caja, .pais-bloque { max-width: 100%; }
        .act { background: #1c1c21; border: 1px solid #27272a; border-radius: 14px; overflow: hidden; }
        .act.abierta { border-color: #3f3f46; }
        .act.conectada { border-color: #065f46; }
        .barra-act { width: 100%; display: flex; align-items: center; gap: 10px; padding: 8px 10px; border: none; background: transparent; color: var(--tinta); font-family: inherit; text-align: left; cursor: pointer; }
        .barra-act:hover { background: rgba(255,255,255,.03); }
        .act.abierta > .barra-act { background: rgba(16,185,129,.08); }
        .barra-miniatura { width: 48px; height: 48px; flex: none; border-radius: 10px; object-fit: cover; display: block; background: #27272a; }
        .barra-texto { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
        .barra-titulo { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; }
        .barra-nombre { font-weight: 800; font-size: .95rem; line-height: 1.2; }
        .badge-conectado { font-size: .7rem; font-weight: 800; padding: 1px 8px; border-radius: 999px; background: #10b981; color: #04261a; white-space: nowrap; }
        .barra-meta { font-size: .78rem; line-height: 1.3; color: var(--suave); }
        .tags-fila { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 2px; }
        .tag-chip { font-size: .68rem; padding: 2px 7px; border-radius: 999px; background: rgba(255,255,255,.06); border: 1px solid #3f3f46; color: #d4d4d8; white-space: nowrap; }
        .barra-flecha { flex: none; min-width: 54px; display: flex; flex-direction: column; align-items: center; font-size: .7rem; font-weight: 700; color: #6ee7b7; }
        .barra-flecha b { font-size: 1rem; line-height: 1; }
        .act .tarjeta, .act .combo { border: none; border-top: 1px solid #27272a; border-radius: 0; }
        .combos-lista { display: flex; flex-direction: column; gap: 8px; }
        @media (min-width: 700px) { .tarjeta-foto { height: 220px; } }
        .tangara-posado { display: flex; align-items: flex-end; justify-content: flex-end; gap: 8px; margin: 0 0 -6px; padding: 0 8px; position: relative; z-index: 5; }
        .tangara-posado.esquina { position: fixed; bottom: 14px; right: 14px; z-index: 600; margin: 0; max-width: min(310px, calc(100vw - 24px)); pointer-events: none; }
        .tangara-posado.esquina .tangara-globo, .tangara-posado.esquina .tangara-ave { pointer-events: auto; }
        .tangara-posado.volando .tangara-ave { animation: vueloSalto .6s ease-out; }
        @keyframes vueloSalto { 0% { transform: translate(-26px, -28px) scale(1.08) rotate(-8deg); } 60% { transform: translate(4px, -10px) rotate(3deg); } 100% { transform: translate(0, 0) scale(1) rotate(0); } }
        .tangara-ave { width: 58px; height: auto; flex: none; filter: drop-shadow(0 6px 12px rgba(0,0,0,.55)); animation: flotarAve 3s ease-in-out infinite; }
        @keyframes flotarAve { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .tangara-globo { max-width: 440px; background: rgba(20,20,23,.94); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
          border: 1px solid #34d399; border-radius: 14px; padding: 8px 11px; color: #f4f4f5; box-shadow: 0 8px 22px rgba(0,0,0,.45); font-size: .78rem; line-height: 1.35; }
        .tangara-cab { display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 2px; color: #34d399; font-size: .74rem; }
        .tangara-cerrar { border: none; background: transparent; color: #a1a1aa; cursor: pointer; font-size: .85rem; padding: 0 4px; }
        .tangara-globo p { margin: 0; }
        .tangara-acciones { display: flex; gap: 6px; margin-top: 7px; flex-wrap: wrap; }
        .tangara-rapidos .t-btn { flex: 1 1 auto; white-space: nowrap; }
        .t-btn { flex: 1; border: none; border-radius: 999px; padding: 5px 8px; font-family: inherit; font-weight: 700; font-size: .73rem; cursor: pointer; }
        .t-btn.si { background: linear-gradient(135deg, #34d399, #10b981); color: #04261a; }
        .t-btn.no { background: #27272a; color: #e4e4e7; border: 1px solid #3f3f46; }
        .tangara-mini { position: fixed; bottom: 76px; right: 12px; z-index: 600; display: flex; align-items: center; gap: 5px; padding: 4px 10px 4px 5px;
          border-radius: 999px; border: 1px solid #34d399; background: rgba(20,20,23,.9); color: #f4f4f5; font-family: inherit; font-weight: 700; font-size: .73rem;
          cursor: pointer; box-shadow: 0 6px 16px rgba(0,0,0,.5); }
        .tangara-mini img { width: 26px; height: 26px; object-fit: contain; }
        @media (max-width: 480px) { .tangara-ave { width: 50px; } .tangara-globo { font-size: .74rem; padding: 7px 10px; } }
        .btn-mapa { border: 2px solid #fbbf24; background: rgba(251,191,36,.1); color: #fbbf24; padding: 8px 10px; border-radius: 10px; font-weight: 700; cursor: pointer; font-family: inherit; font-size: .88rem; }
        .btn-mapa:hover { background: rgba(251,191,36,.2); }
        .mapa-img-wrap { position: relative; cursor: zoom-in; background: #1c1c21; overflow: hidden; }
        .mapa-img { width: 100%; height: 240px; object-fit: cover; display: block; transition: transform .25s ease; }
        .mapa-img-wrap:hover .mapa-img { transform: scale(1.03); }
        .mapa-zoom-badge { position: absolute; right: 10px; bottom: 10px; background: rgba(9,9,11,.78); color: #f4f4f5; font-size: .76rem; font-weight: 700; padding: 4px 10px; border-radius: 999px; border: 1px solid rgba(255,255,255,.2); }
        .mapa-botones { display: flex; gap: 8px; flex-wrap: wrap; }
        .mapa-botones .btn-mapa, .mapa-botones .btn-link { flex: 1 1 120px; text-align: center; }
        .mapa-modal { flex-direction: column; padding: 14px; gap: 10px; }
        .mapa-toolbar { width: 100%; max-width: 960px; display: flex; align-items: center; justify-content: space-between; gap: 10px; background: #141417; border: 1px solid #27272a; padding: 10px 14px; border-radius: 14px; color: #f4f4f5; }
        .mapa-zoom-btns { display: flex; align-items: center; gap: 6px; }
        .mapa-zoom-btns button { border: 1px solid #3f3f46; background: #27272a; color: #f4f4f5; width: 34px; height: 34px; border-radius: 10px; font-size: 1.1rem; font-weight: 800; cursor: pointer; }
        .mapa-zoom-btns button.cerrar { background: #7f1d1d; border-color: #991b1b; }
        .mapa-zoom-btns span { min-width: 44px; text-align: center; font-size: .85rem; font-weight: 700; }
        .mapa-scroll { width: 100%; max-width: 960px; max-height: calc(100vh - 96px); overflow: auto; border-radius: 14px; display: flex; justify-content: center; align-items: flex-start; }
        .mapa-scroll img { height: auto; border-radius: 12px; display: block; }
        .tips-card { background: var(--papel); border: 1px solid #27272a; border-radius: 16px; overflow: hidden; box-shadow: 0 0 0 1px #27272a, 0 8px 24px rgba(0,0,0,.45); }
        .tips-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 14px 16px; border: none; background: transparent; color: var(--tinta); font-family: inherit; font-weight: 700; font-size: .95rem; cursor: pointer; text-align: left; }
        .tips-body { padding: 0 16px 16px; display: grid; gap: 10px; font-size: .88rem; line-height: 1.45; }
        .tips-item { background: var(--niebla); border-radius: 10px; padding: 10px 12px; border: 1px solid #27272a; }
        .tips-item strong { display: block; margin-bottom: 3px; color: #34d399; }
        .tips-item p { margin: 0; color: var(--suave); }
        .carrito-cab { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 14px; }
        .carrito-cab h2 { margin: 0; }
        .btn-limpiar { border: 1px solid #7f1d1d; background: rgba(127,29,29,.22); color: #fca5a5; border-radius: 999px; padding: 6px 12px; font-size: .78rem; font-weight: 700; cursor: pointer; }
        .app.claro { --tinta: #18181b; --rio: #059669; --niebla: #f4f4f5; --papel: #ffffff; --suave: #52525b; color-scheme: light; background: #e4e4e7; color: #18181b; }
        .app.claro .portada { border-color: #d4d4d8; }
        .app.claro .caja, .app.claro .pais-bloque, .app.claro .mapa-tarjeta, .app.claro .colab-card, .app.claro .tips-card, .app.claro .colab-tab, .app.claro .colab-vacio { box-shadow: 0 0 0 1px #d4d4d8, 0 8px 24px rgba(0,0,0,.08); border-color: #d4d4d8; }
        .app.claro .campo select, .app.claro .campo input, .app.claro .asignar select { background: #ffffff; border-color: #cbd5e1; color: #18181b; }
        .app.claro option { background: #ffffff; color: #18181b; }
        .app.claro .planes { background: #ffffff; border-color: #cbd5e1; }
        .app.claro .plan { background: #f8fafc; border-color: #cbd5e1; color: #18181b; }
        .app.claro .plan-detalle { color: #52525b; }
        .app.claro .act { background: #f8fafc; border-color: #d4d4d8; }
        .app.claro .act.conectada { border-color: #10b981; }
        .app.claro .tarjeta, .app.claro .combo, .app.claro .info, .app.claro .combos, .app.claro .tips-item { background: #ffffff; border-color: #d4d4d8; }
        .app.claro .tag-chip { background: #e4e4e7; border-color: #cbd5e1; color: #27272a; }
        .app.claro .barra-flecha, .app.claro .btn-info, .app.claro .entrada { color: #059669; }
        .app.claro .tangara-globo { background: rgba(255,255,255,.96); color: #18181b; border-color: #059669; }
        .app.claro .tangara-cab { color: #059669; }
        .app.claro .aro-interior { border-color: #e4e4e7; background: #ffffff; }
        .app.claro .historia { color: #52525b; }
        .app.claro .barra-movil { background: rgba(255,255,255,.94); color: #18181b; }
        .app.claro .guia-capa { background: rgba(255,255,255,.85); color: #18181b; }
        .app.claro .btn-limpiar { background: #fee2e2; color: #991b1b; border-color: #fca5a5; }
        .app.claro .btn-mapa { color: #b45309; border-color: #d97706; background: rgba(245,158,11,.12); }
        .app.claro .nodo::before { box-shadow: 0 0 0 4px #ffffff; }
        .app.claro .dia { border-color: #cbd5e1; }
        .app.claro .colab-promo { color: #92400e; background: rgba(245,158,11,.15); }
      `}</style>

      <PlumasTransicion rafaga={rafagaPlumas} />

      <div className="contenedor">
        <header className="portada">
          <div className="controles-top">
            {["es", "pt", "en"].map((lang) => (
              <button
                key={lang}
                type="button"
                className={`ctrl-top ${idioma === lang ? "activo" : ""}`}
                onClick={() => setIdioma(lang)}
                title="Cambiar idioma"
              >
                {lang.toUpperCase()}
              </button>
            ))}
            <button
              type="button"
              className="ctrl-top"
              aria-label={modoClaro ? "Activar modo oscuro" : "Activar modo claro"}
              title={modoClaro ? "Modo oscuro" : "Modo claro"}
              onClick={() => setModoClaro((m) => !m)}
            >
              {modoClaro ? "🌙" : "☀️"}
            </button>
            <button
              type="button"
              className="ctrl-top"
              aria-pressed={sonido}
              aria-label={sonido ? "Silenciar sonido" : "Activar sonido"}
              title={sonido ? "Silenciar sonido" : "Activar sonido"}
              onClick={() => { const v = !sonido; setSonido(v); if (v) reproducirCampanita(); }}
            >
              {sonido ? "🔊" : "🔇"}
            </button>
          </div>
          <h1 className="titulo">Tres Fronteras</h1>
          <p className="subtitulo">{t.subtitulo}</p>
        </header>

        <nav className="historias" role="tablist" aria-label="Secciones">
          {PESTANAS.map((p) => (
            <button key={p.id} role="tab" aria-selected={pestana === p.id} className={`historia ${pestana === p.id ? "activa" : ""}`} onClick={() => cambiarPestana(p.id)}>
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
          <div key="destinos" className={`vista-animada dir-${dirVista}`}>
            {dondeSePosa === "inicio" && <CapitanTangara modo={modoTangara} setModo={setModoTangara} volando={volandoTangara} mensaje={consejoTangara} inline />}
            <section className="caja" style={{ marginBottom: 24 }}>
              <h2>{t.datosViajero}</h2>
              <div className="form" style={{ marginBottom: 0 }}>
                <div className={`campo ${faltaNombre ? "falta" : ""}`}>
                  <label htmlFor="nombre">{t.nombre}</label>
                  <input id="nombre" ref={refNombre} type="text" placeholder="Ej: Sofía Gómez" autoComplete="name" value={nombreTurista}
                    onChange={(e) => { setNombreTurista(e.target.value); if (e.target.value.trim()) setFaltaNombre(false); }} />
                  {faltaNombre && <p className="aviso-nombre" role="alert">¡Ya casi! Escribí al menos tu nombre para que sepamos a quién responderle por WhatsApp. 😊</p>}
                </div>
                <div className="campo">
                  <label htmlFor="dias">{t.dias}</label>
                  <select id="dias" value={dias} onChange={(e) => cambiarDias(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5, 6, 7].map((n) => <option key={n} value={n}>{n} {n === 1 ? "día" : "días"}</option>)}
                  </select>
                </div>
                <div className="campo">
                  <label htmlFor="personas">{t.personas}</label>
                  <input id="personas" type="number" min="1" max="50" value={personas}
                    onChange={(e) => setPersonas(Math.min(50, Math.max(1, Math.floor(Number(e.target.value)) || 1)))} />
                </div>
                <div className="campo">
                  <label htmlFor="movilidad">{t.movilidad}</label>
                  <select id="movilidad" value={movilidad} onChange={(e) => setMovilidad(e.target.value)}>
                    <option value="no">{t.movNo}</option>
                    <option value="si">{t.movSi}</option>
                  </select>
                </div>
                <div className="campo">
                  <label htmlFor="hotel">{t.hotel}</label>
                  <input id="hotel" type="text" placeholder="Nombre del hotel" value={hotel} onChange={(e) => setHotel(e.target.value)} />
                </div>
                <div className="campo">
                  <label htmlFor="divisa">{t.divisa}</label>
                  <select id="divisa" value={divisa} onChange={(e) => setDivisa(e.target.value)}>
                    {Object.entries(MONEDAS).map(([codigo, m]) => <option key={codigo} value={codigo}>{codigo} ({m.simbolo} {m.nombre})</option>)}
                  </select>
                  <small className="ayuda">{t.ayudaDivisa}</small>
                </div>
              </div>
            </section>

            <div className="layout">
              <section className="paises">
                <div className="planes">
                  <p className="planes-titulo">{t.planesTitulo}</p>
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

                <div className="tips-card">
                  <button type="button" className="tips-btn" aria-expanded={tipsAbierto} onClick={() => setTipsAbierto((v) => !v)}>
                    <span>{t.tipsTitulo}</span>
                    <span>{tipsAbierto ? "▲" : "▼"}</span>
                  </button>
                  {tipsAbierto && (
                    <div className="tips-body">
                      <div className="tips-item">
                        <strong>{t.tipsFronteraT}</strong>
                        <p>{t.tipsFronteraD}</p>
                      </div>
                      <div className="tips-item">
                        <strong>{t.tipsPagosT}</strong>
                        <p>{t.tipsPagosD}</p>
                      </div>
                      <div className="tips-item">
                        <strong>{t.tipsLluviaT}</strong>
                        <p>{t.tipsLluviaD}</p>
                      </div>
                    </div>
                  )}
                </div>

                {Object.entries(PAISES).map(([pais, datos]) => {
                  const lista = ATRACTIVOS.filter((a) => a.pais === pais);
                  const abierto = paisAbierto === pais;
                  return (
                    <Fragment key={pais}>
                      {dondeSePosa === `pais-${pais}` && <CapitanTangara modo={modoTangara} setModo={setModoTangara} volando={volandoTangara} mensaje={consejoTangara} inline />}
                      <div className="pais-bloque" style={{ "--c": datos.color }}>
                        <button className="pais-cab" aria-expanded={abierto} onClick={() => { setPaisAbierto(abierto ? null : pais); setExpandidas({}); setCombosExpandidos({}); if (modoTangara === "guiado") volarTangara(); }}>
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
                                  <BarraResumen foto={a.foto} nombre={a.nombre} meta={`⏱ ${a.horas} hs · 🎟️ ${textoEntrada(a.entrada, divisa)}`}
                                    tags={a.tags} conectado={agregado} abierto={abierta} onClick={() => setExpandidas({ ...expandidas, [a.id]: !abierta })} />

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
                                          {a.mapaImg && (
                                            <button type="button" className="btn-mapa" onClick={() => { setZoomMapa(1); setMapaAmpliado({ src: a.mapaImg, nombre: a.nombre }); }}>
                                              🗺️ Ver mapa del recorrido
                                            </button>
                                          )}

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
                    </Fragment>
                  );
                })}

                {dondeSePosa === "pais-aventura" && <CapitanTangara modo={modoTangara} setModo={setModoTangara} volando={volandoTangara} mensaje={consejoTangara} inline />}
                <div className="pais-bloque" style={{ "--c": "#d97706" }}>
                  <button className="pais-cab" aria-expanded={paisAbierto === "aventura"} onClick={() => { setPaisAbierto(paisAbierto === "aventura" ? null : "aventura"); setExpandidas({}); setCombosExpandidos({}); if (modoTangara === "guiado") volarTangara(); }}>
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

              <div>
                {dondeSePosa === "carrito" && <CapitanTangara modo={modoTangara} setModo={setModoTangara} volando={volandoTangara} mensaje={consejoTangara} inline />}
                <aside className="caja carrito" ref={refCarrito}>
                  <div className="carrito-cab">
                    <h2>{t.carritoTitulo}</h2>
                    {carrito.length > 0 && (
                      <button type="button" className="btn-limpiar" onClick={limpiarViaje}>
                        {t.limpiarViaje}
                      </button>
                    )}
                  </div>
                  {avisoGlobal && <p className="alerta global" role="status">{avisoGlobal}</p>}
                  {carrito.length === 0 && <p className="vacio">{t.carritoVacio}</p>}

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

                  <div className="totales"><span>{t.horasTotales}</span><span>{horasTotales} hs</span></div>

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
                    <a className="btn-whatsapp" href={linkWhatsApp} target="_blank" rel="noopener noreferrer" onClick={confirmarReserva}>{t.reservarBtn}</a>
                  ) : (
                    <button className="btn-whatsapp" disabled>{t.reservarBtn}</button>
                  )}
                  <p className="nota">
                    {carrito.length === 0 ? "Agregá al menos una actividad para reservar."
                      : !hotel.trim() ? "Tip: completá el nombre de tu hotel para que el mensaje salga completo."
                      : "Se abrirá WhatsApp con tu itinerario ya escrito."}
                  </p>
                </aside>
              </div>
            </div>
          </div>
        )}

        {/* ---------- PESTAÑA 2: Mapas ilustrados ---------- */}
        {pestana === "mapas" && (
          <section key="mapas" className={`vista-animada dir-${dirVista}`}>
            <CapitanTangara
              modo={modoTangara === "libre" ? "guiado" : modoTangara}
              setModo={setModoTangara}
              volando={volandoTangara}
              mensaje={consejoTangara}
              inline
            />
            <div className="grilla-mapas">
              {MAPAS.map((m) => (
                <article key={m.id} className="mapa-tarjeta">
                  <div className="mapa-img-wrap" onClick={() => { setZoomMapa(1); setMapaAmpliado({ src: m.img, nombre: m.nombre }); }}>
                    <Foto className="mapa-img" src={m.img} alt={`Mapa ilustrado de ${m.nombre}`} />
                    <span className="mapa-zoom-badge">🔍 Tocar para ampliar</span>
                  </div>
                  <div className="mapa-info">
                    <h3>{m.nombre}</h3>
                    <span className={`pais-tag ${m.pais}`} style={{ alignSelf: "flex-start" }}>{m.pais}</span>
                    <div className="mapa-botones">
                      <button type="button" className="btn-mapa" onClick={() => { setZoomMapa(1); setMapaAmpliado({ src: m.img, nombre: m.nombre }); }}>
                        🔍 Ampliar mapa
                      </button>
                      <a className="btn-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.consulta)}`} target="_blank" rel="noopener noreferrer">
                        Google Maps
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ---------- PESTAÑA 3: Colaboradores en 4 secciones ---------- */}
        {pestana === "colab" && (
          <section key="colab" className={`vista-animada dir-${dirVista}`}>
            <CapitanTangara
              modo={modoTangara === "libre" ? "guiado" : modoTangara}
              setModo={setModoTangara}
              volando={volandoTangara}
              mensaje={consejoTangara}
              botonesRapidos={botonesColabTangara}
              inline
            />

            <div className="colab-tabs" role="tablist" aria-label="Categorías de colaboradores">
              {CATEGORIAS_COLAB.map((cat) => {
                const cant = COLABORADORES.filter((c) => c.tipo === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={colabCat === cat.id}
                    className={`colab-tab ${colabCat === cat.id ? "activa" : ""}`}
                    onClick={() => { setColabCat(cat.id); volarTangara(); }}
                  >
                    <span>{cat.icono}</span>
                    <span>{cat.titulo} {cant > 0 ? `(${cant})` : ""}</span>
                  </button>
                );
              })}
            </div>

            <div key={colabCat} className="vista-animada">
              {colabsDeCategoria.length === 0 ? (
                <div className="colab-vacio">
                  <h3>{CATEGORIAS_COLAB.find((c) => c.id === colabCat)?.icono} {CATEGORIAS_COLAB.find((c) => c.id === colabCat)?.titulo}</h3>
                  <p>
                    Muy pronto vamos a ir sumando aliados verificados en esta sección. Mientras tanto, escribinos por WhatsApp y te recomendamos opciones de confianza según tu estadía.
                  </p>
                  <a
                    className="btn-whatsapp"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://wa.me/${GUIA.whatsapp}?text=${encodeURIComponent(`Hola Alan! Estoy viendo la sección de ${CATEGORIAS_COLAB.find((c) => c.id === colabCat)?.titulo} en App Iguazú y quería pedirte recomendaciones para ${personas} ${personas === 1 ? "persona" : "personas"} (${dias} ${dias === 1 ? "día" : "días"}).`)}`}
                  >
                    Consultar recomendaciones por WhatsApp
                  </a>
                </div>
              ) : (
                colabsDeCategoria.map((c) => (
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
                        {c.promo && <div className="colab-promo">🎁 {c.promo}</div>}
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
                ))
              )}
            </div>
            <p className="nota">¿Tenés un hotel, restaurante, sos guía habilitado o chofer y querés sumarte? Escribinos por WhatsApp desde la pestaña de contacto.</p>
          </section>
        )}

        {/* ---------- PESTAÑA 4: Contacto del Guía ---------- */}
        {pestana === "guia" && (
          <section key="guia" className={`guia-card vista-animada dir-${dirVista}`}>
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

      {carrito.length > 0 && !(pestana === "destinos" && carritoVisible) && (
        <div className="barra-movil" role="region" aria-label="Resumen de tu viaje">
          <span>🧭 {carrito.length} {carrito.length === 1 ? "actividad" : "actividades"} en tu viaje</span>
          <button onClick={irAlCarrito}>Ver mi viaje ↓</button>
        </div>
      )}

      {mapaAmpliado && (
        <div className="lightbox mapa-modal" role="dialog" aria-modal="true" aria-label={`Mapa de ${mapaAmpliado.nombre}`}
          onClick={() => setMapaAmpliado(null)}>
          <div className="mapa-toolbar" onClick={(e) => e.stopPropagation()}>
            <strong>🗺️ {mapaAmpliado.nombre}</strong>
            <div className="mapa-zoom-btns">
              <button type="button" onClick={() => setZoomMapa((z) => Math.max(1, +(z - 0.4).toFixed(1)))} aria-label="Alejar">−</button>
              <span>{Math.round(zoomMapa * 100)}%</span>
              <button type="button" onClick={() => setZoomMapa((z) => Math.min(3, +(z + 0.4).toFixed(1)))} aria-label="Acercar">+</button>
              <button type="button" className="cerrar" onClick={() => setMapaAmpliado(null)} aria-label="Cerrar mapa">✕</button>
            </div>
          </div>
          <div className="mapa-scroll" onClick={(e) => e.stopPropagation()}>
            <img src={mapaAmpliado.src} alt={`Mapa de ${mapaAmpliado.nombre}`}
              style={{ width: `${zoomMapa * 100}%`, maxWidth: zoomMapa === 1 ? "94vw" : "none" }} />
          </div>
        </div>
      )}
      {(dondeSePosa === "pestana" || (modoTangara === "libre" && pestana !== "mapas" && pestana !== "colab")) && (
        <CapitanTangara modo={modoTangara} setModo={setModoTangara} volando={volandoTangara} mensaje={consejoTangara} inline={false} />
      )}
    </div>
  );
}