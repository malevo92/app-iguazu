import { useState, useEffect, useRef, Fragment } from "react";

const STORAGE_KEY = "app_iguazu_v1";
const ORDEN_PESTANAS = ["destinos", "mapas", "colab", "agenda", "guia"];

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
    tabs: { destinos: "Destinos", mapas: "Mapas", colab: "Colaboradores", agenda: "Agenda", guia: "Contactos" },
    climaTitulo: "Clima en Iguazú",
    climaHoy: "Hoy",
    climaManana: "Mañana",
    climaCargando: "Cargando pronóstico...",
    climaError: "Sin conexión al pronóstico",
    datosViajero: "Datos del viajero",
    nombre: "Tu nombre",
    origen: "De dónde vengo",
    origenPh: "Ej: Buenos Aires, Córdoba, Brasil...",
    dias: "Días de estadía",
    personas: "Cantidad de personas",
    conChicos: "👶 Con chicos / menores",
    conMayores: "👴 Con adultos mayores / silla de ruedas",
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
    accesibleTitulo: "Turismo Accesible",
    accesibleSub: "Opciones recomendadas para adultos mayores, sillas de ruedas o cochecitos",
    carritoTitulo: "Mi Carrito de Actividades",
    limpiarViaje: "🗑️ Limpiar viaje",
    carritoVacio: "Todavía no agregaste excursiones. Abrí un país, elegí el día y sumá actividades.",
    horasTotales: "Horas totales de paseo",
    reservarBtn: "Confirmar y Reservar por WhatsApp",
  },
  pt: {
    subtitulo: "Monte seu roteiro pela Argentina, Brasil e Paraguai.",
    tabs: { destinos: "Destinos", mapas: "Mapas", colab: "Parceiros", agenda: "Agenda", guia: "Contatos" },
    climaTitulo: "Clima em Iguaçu",
    climaHoy: "Hoje",
    climaManana: "Amanhã",
    climaCargando: "Carregando previsão...",
    climaError: "Sem conexão com a previsão",
    datosViajero: "Dados do viajante",
    nombre: "Seu nome",
    origen: "De onde venho",
    origenPh: "Ex: São Paulo, Curitiba, Argentina...",
    dias: "Dias de estadia",
    personas: "Quantidade de pessoas",
    conChicos: "👶 Com crianças / menores",
    conMayores: "👴 Com idosos / cadeira de rodas",
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
    accesibleTitulo: "Turismo Acessível",
    accesibleSub: "Opções recomendadas para idosos, cadeira de rodas ou carrinho de bebê",
    carritoTitulo: "Meu Roteiro de Atividades",
    limpiarViaje: "🗑️ Limpar roteiro",
    carritoVacio: "Você ainda não adicionou passeios. Abra um país, escolha o dia e adicione atividades.",
    horasTotales: "Horas totais de passeio",
    reservarBtn: "Confirmar e Reservar pelo WhatsApp",
  },
  en: {
    subtitulo: "Build your itinerary across Argentina, Brazil and Paraguay.",
    tabs: { destinos: "Destinations", mapas: "Maps", colab: "Partners", agenda: "Events", guia: "Contacts" },
    climaTitulo: "Iguazú Weather",
    climaHoy: "Today",
    climaManana: "Tomorrow",
    climaCargando: "Loading forecast...",
    climaError: "Forecast unavailable",
    datosViajero: "Traveler details",
    nombre: "Your name",
    origen: "Where I'm from",
    origenPh: "E.g.: Buenos Aires, USA, Brazil...",
    dias: "Stay duration",
    personas: "Number of travelers",
    conChicos: "👶 Traveling with kids",
    conMayores: "👴 Seniors / wheelchair accessible",
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
    accesibleTitulo: "Accessible Tourism",
    accesibleSub: "Recommended options for seniors, wheelchairs or strollers",
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

// ---------- COLABORADORES DIVIDIDOS EN 5 SECCIONES (ESTILO BENTO GRID) ----------
const CATEGORIAS_COLAB = [
  { id: "hoteles", icono: "🏨", titulo: "Hoteles y Hospedajes", preguntaBtn: "🏨 Hospedaje", foto: "/colaboradores/el-ceibo-1.jpg", grande: true },
  { id: "restaurantes", icono: "🍽️", titulo: "Restaurantes", preguntaBtn: "🍽️ Qué cenar", foto: "/fotos/portada.jpg" },
  { id: "guias", icono: "🧭", titulo: "Guías de Confianza", preguntaBtn: "🧭 Guía", foto: "/fotos/cataratas-arg.jpg" },
  { id: "choferes", icono: "🚐", titulo: "Choferes y Traslados", preguntaBtn: "🚐 Chofer", foto: "/fotos/cataratas-br.jpg" },
  { id: "actividades", icono: "🌿", titulo: "Actividades", preguntaBtn: "🌿 Actividades", foto: "/fotos/aventura-kayak.jpg" },
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
  // Sumar acá nuevos guías (tipo: "guias"), choferes (tipo: "choferes"), restaurantes (tipo: "restaurantes") y actividades (tipo: "actividades")
];

// ---------- AGENDA CULTURAL (EVENTOS, FERIAS, MÚSICA, MARATONES) ----------
const CATEGORIAS_AGENDA = [
  { id: "todos", label: "✨ Todos" },
  { id: "ferias", label: "🎪 Ferias" },
  { id: "musica", label: "🎶 Música en vivo" },
  { id: "muestras", label: "🎨 Muestras" },
  { id: "deportes", label: "🏃 Maratones" },
  { id: "eventos", label: "🎭 Eventos" },
];

const AGENDA_CULTURAL = [
  /* Ejemplo para sumar eventos que envíen los colaboradores o la municipalidad:
  {
    id: "ev-1",
    categoria: "ferias",
    titulo: "Feria de Emprendedores y Artesanos",
    fecha: "Sábado 18:00 a 22:00 hs",
    lugar: "Plaza San Martín, Puerto Iguazú",
    mapa: "Plaza San Martín, Puerto Iguazú, Misiones, Argentina",
    entrada: "Entrada libre y gratuita",
    foto: "/fotos/portada.jpg",
    organiza: "Municipalidad de Puerto Iguazú",
    descripcion: "Puestos de artesanías regionales, gastronomía local y música en vivo para toda la familia.",
  },
  */
];

const POLITICA_SENA = "El 50% de seña previa corresponde exclusivamente a los servicios de traslados y guías para confirmar tu reserva (el 50% restante se abona en persona al encontrarse en destino).";
const POLITICA_ENTRADAS = "Importante: Los tickets/entradas a cada parque o atractivo NO están incluidos en el traslado y se abonan directamente en la boletería de cada lugar (o en su web oficial).";
const HORAS_POR_DIA = 8;
const HORAS_CON_COMBOS = 10;
const MAX_COMBOS = 3;

// ---------- DATOS POR PAÍS ----------
const PAISES = {
  Argentina: {
    bandera: "🇦🇷", tipoIcono: "ar", color: "#2b86c5",
    documentos: [
      "DNI físico vigente (argentinos y residentes) o pasaporte vigente (extranjeros).",
      "Menores: documento propio y autorización de viaje si no van con ambos padres.",
    ],
  },
  Brasil: {
    bandera: "🇧🇷", tipoIcono: "br", color: "#1f8a4c",
    documentos: [
      "Pasaporte vigente o DNI físico en buen estado (ciudadanos del Mercosur). Otras nacionalidades: pasaporte y, según el país, visa.",
      "Menores: documento propio y autorización de viaje de ambos padres si no viajan con los dos.",
      "Se cruza la frontera con documento original: no se aceptan fotos ni fotocopias.",
    ],
  },
  Paraguay: {
    bandera: "🇵🇾", tipoIcono: "py", color: "#c93a30",
    documentos: [
      "Pasaporte vigente o DNI físico en buen estado (ciudadanos del Mercosur). Otras nacionalidades: pasaporte y, según el país, visa.",
      "Menores: documento propio y autorización de viaje de ambos padres si no viajan con los dos.",
      "Se cruza la frontera con documento original: no se aceptan fotos ni fotocopias.",
    ],
  },
};

// ---------- CATÁLOGO: 12 destinos ----------
const ATRACTIVOS = [
  { id: 1, accesible: "Tren ecológico adaptado, pasarelas amplias con rampas hacia Garganta del Diablo y Circuito Superior (silla de ruedas sin escaleras). El Circuito Inferior tiene algunos tramos con escalones.", mapaImg: "/mapas/mapa-cataratas-arg.jpg", entrada: { moneda: "ARS", general: 60000, etqGeneral: "General", local: 25000, etqLocal: "Argentinos" }, nombre: "Cataratas Argentinas", lugar: "Puerto Iguazú", pais: "Argentina", horas: 7, foto: "/fotos/cataratas-arg.jpg", tags: ["♿ Apto cochecito / silla", "🥾 Caminata moderada", "💦 Rocío / te mojás"], resumen: "Vivís el lado más cercano y envolvente de las Cataratas: el Circuito Superior te lleva por pasarelas sobre el borde de los saltos y el Circuito Inferior te acerca al pie de las caídas, entre selva, arcoíris y rocío. El tren ecológico te deja frente a la Garganta del Diablo, donde el río se desploma con un rugido que se siente en el pecho. Un día completo para recorrer a tu ritmo, con coatíes, mariposas y tucanes en el camino.", desc: "Pasarelas sobre el río y la Garganta del Diablo, de cerca.", horario: "08:00 a 18:00 hs", llevar: ["Calzado cerrado y cómodo", "Piloto de lluvia", "Repelente", "Agua y protector solar", "Ropa de recambio"] },
  { id: 2, accesible: "Buses internos con plataforma elevadora y ascensor panorámico en el mirador final sobre el Salto Floriano. Sendero asfaltado con miradores accesibles.", mapaImg: "/mapas/mapa-cataratas-br.jpg", entrada: { moneda: "BRL", general: 134, etqGeneral: "Extranjeros", local: 121, etqLocal: "Mercosur" }, nombre: "Cataratas Brasileñas", lugar: "Foz do Iguaçu", pais: "Brasil", horas: 4, foto: "/fotos/cataratas-br.jpg", tags: ["♿ Apto cochecito / silla", "🥾 Caminata suave", "💦 Rocío / te mojás"], resumen: "Es la vista panorámica frontal que todos sueñan: el sendero recorre la ladera brasileña y te muestra el conjunto completo de saltos con el lado argentino de fondo. Al final, una pasarela avanza sobre el salto Floriano hasta dejarte casi dentro de la caída de agua. Perfecto para fotos inolvidables y para entender la magnitud de las Cataratas.", desc: "La vista panorámica completa de todos los saltos.", horario: "09:00 a 17:00 hs", llevar: ["Piloto de lluvia", "Calzado cómodo", "Protector solar y gorra", "Agua"] },
  { id: 3, accesible: "Sendero pavimentado, plano y sombreado en todo el recorrido, ideal para adultos mayores, sillas de ruedas y cochecitos.", mapaImg: "/mapas/mapa-parque-aves.jpg", entrada: { moneda: "BRL", general: 110 }, nombre: "Parque das Aves", lugar: "Foz do Iguaçu", pais: "Brasil", horas: 3, foto: "/fotos/parque-aves.jpg", tags: ["♿ Apto cochecito / silla", "🥾 Caminata suave", "☀️ Al aire libre"], resumen: "Una inmersión en viveros gigantes donde caminás entre tucanes, guacamayos, loros y flamencos que vuelan libres a tu alrededor, en plena selva. Los senderos pasan por aviarios abiertos y te permiten ver de cerca especies de colores increíbles, además de mariposas. Ideal para ir en familia y sacar fotos únicas.", desc: "Tucanes, guacamayos y aviarios abiertos dentro de la selva.", horario: "08:30 a 17:00 hs", llevar: ["Repelente", "Calzado cerrado", "Protector solar", "Agua"] },
  { id: 4, accesible: "Recorrido principal en bus panorámico con paradas adaptadas y casi sin caminata exigente; excelente opción para descansar y disfrutar la vista.", mapaImg: "/mapas/mapa-itaipu.jpg", entrada: { moneda: "BRL", general: 63, etqGeneral: "Panorámica" }, nombre: "Represa de Itaipú", lugar: "Foz do Iguaçu", pais: "Brasil", horas: 3, foto: "/fotos/itaipu.jpg", tags: ["♿ Apto cochecito / silla", "☔ Apto día de lluvia"], resumen: "Conocés por dentro una de las mayores hidroeléctricas del planeta. El recorrido guiado te lleva frente al imponente muro de la represa y sus vertederos, mientras te cuentan cómo se genera la energía que comparten Brasil y Paraguay. Un paseo que impresiona por su escala y por la ingeniería detrás de cada detalle.", desc: "Visita guiada a una de las mayores hidroeléctricas del mundo.", horario: "08:00 a 16:00 hs", llevar: ["Documento original (se controla el ingreso)", "Calzado cerrado", "Ropa cómoda"] },
  { id: 5, mapaImg: "/mapas/mapa-wanda.jpg", entrada: { moneda: "USD", general: 4 }, nombre: "Minas de Wanda", lugar: "Misiones", pais: "Argentina", horas: 3, foto: "/fotos/wanda.jpg", tags: ["🥾 Caminata suave", "☔ Apto día de lluvia"], resumen: "Descendés a antiguas minas a cielo abierto donde las paredes de piedra esconden amatistas, ágatas y cuarzos que brillan a la luz. Con un guía recorrés los túneles y aprendés cómo se extraen y trabajan las gemas. Al final podés ver el taller y llevarte un recuerdo auténtico de la tierra colorada de Misiones.", desc: "Antiguas minas de piedras semipreciosas: amatista, ágata y cuarzo.", horario: "08:00 a 17:30 hs", llevar: ["Calzado cómodo", "Abrigo liviano para la mina", "Efectivo para compras"] },
  { id: 6, mapaImg: "/mapas/mapa-ciudad-este.jpg", entrada: { gratis: true }, nombre: "Compras en Ciudad del Este", lugar: "Paraguay", pais: "Paraguay", horas: 4, foto: "/fotos/ciudad-este.jpg", tags: ["🛍️ Compras / interior", "☔ Apto día de lluvia"], resumen: "Cruzás el Puente de la Amistad y te sumergís en uno de los centros comerciales más vibrantes de la región. Recorrés galerías con electrónica, perfumes, indumentaria y mucho más, con un ritmo intenso y lleno de ofertas. Con guía y chofer el día es más fácil, más seguro y mucho más rendidor.", desc: "Tiendas de electrónica, perfumes y mucho más a precios libres de impuestos.", horario: "07:00 a 17:00 hs", llevar: ["Efectivo (dólares o guaraníes)", "Mochila pequeña", "Calzado cómodo", "Agua"] },
  { id: 7, accesible: "Explanada amplia, totalmente plana y con rampas sobre la costanera; ideal para ir al atardecer con bancos para descansar.", mapaImg: "/mapas/mapa-hito.jpg", entrada: { gratis: true }, nombre: "Hito Tres Fronteras", lugar: "Puerto Iguazú", pais: "Argentina", horas: 1.5, foto: "/fotos/hito.jpg", tags: ["♿ Apto cochecito / silla", "☀️ Al aire libre"], resumen: "Un mirador privilegiado sobre la confluencia de los ríos Iguazú y Paraná, donde en una sola postal ves tres países: Argentina, Brasil y Paraguay. Cada orilla tiene su obelisco con los colores de su bandera, y el paseo costero es ideal para caminar sin apuro. Un clásico para el atardecer y para llevarte una foto muy especial.", desc: "Mirador donde se juntan los ríos Iguazú y Paraná y se ven los tres países.", horario: "08:00 a 20:00 hs", llevar: ["Cámara o celular", "Repelente", "Protector solar"] },
  { id: 8, accesible: "Paseo guiado corto con traslado en carro dentro del predio y senderos planos entre recintos de selva.", mapaImg: "/mapas/mapa-guiraoga.jpg", entrada: { moneda: "ARS", general: 35000 }, nombre: "GüiráOga", lugar: "Puerto Iguazú", pais: "Argentina", horas: 2, foto: "/fotos/guiraoga.jpg", tags: ["♿ Apto cochecito / silla", "🥾 Caminata suave", "☀️ Al aire libre"], resumen: "Un centro de rescate donde recorrés senderos de selva y conocés de cerca aves, monos, reptiles y otros animales rescatados que se están recuperando. Los guías te cuentan sus historias y cómo se trabaja para devolverlos a su hábitat. Una experiencia tranquila, educativa y muy emotiva.", desc: "Centro de rescate de fauna silvestre en plena selva misionera.", horario: "09:00 a 17:00 hs", llevar: ["Repelente", "Calzado cerrado", "Agua"] },
  { id: 9, accesible: "Predio compacto, nivelado y con rampas de acceso para recorrer cómodamente sin apuro.", mapaImg: "/mapas/mapa-aripuca.jpg", entrada: { moneda: "ARS", general: 8000 }, nombre: "La Aripuca", lugar: "Puerto Iguazú", pais: "Argentina", horas: 1.5, foto: "/fotos/aripuca.jpg", tags: ["♿ Apto cochecito / silla", "☔ Apto día de lluvia"], resumen: "Una gran construcción hecha con troncos enormes de árboles nativos, inspirada en las trampas que usaban los guaraníes para cazar. Adentro descubrís la historia de la selva misionera, maderas de la región y un espacio de artesanías. Un paseo corto, sorprendente y perfecto para completar tu día en Puerto Iguazú.", desc: "Gran construcción de troncos de árboles nativos, inspirada en una trampa guaraní.", horario: "09:00 a 18:00 hs", llevar: ["Calzado cómodo", "Protector solar", "Efectivo para artesanías"] },
  { id: 10, mapaImg: "/mapas/mapa-san-ignacio.jpg", entrada: { moneda: "ARS", general: 19000, etqGeneral: "Extranjeros", local: 8000, etqLocal: "Argentinos" }, nombre: "Ruinas de San Ignacio", lugar: "Misiones", pais: "Argentina", horas: 5, foto: "/fotos/san-ignacio.jpg", tags: ["🥾 Caminata moderada", "☀️ Al aire libre"], resumen: "Caminás entre las imponentes ruinas de arenisca roja de una de las misiones jesuítico-guaraníes mejor conservadas, Patrimonio de la Humanidad. Recorrés la plaza, la iglesia y los claustros mientras el guía te cuenta cómo vivían jesuitas y guaraníes. Un viaje en el tiempo en medio de la selva.", desc: "Misión jesuítico-guaraní de piedra roja, declarada Patrimonio de la Humanidad.", horario: "07:30 a 18:00 hs", llevar: ["Sombrero o gorra", "Protector solar", "Calzado cómodo", "Agua"] },
  { id: 11, accesible: "Jardines amplios y senderos tranquilos; la parte principal de la explanada es plana y muy serena para recorrer sin esfuerzo.", mapaImg: "/mapas/mapa-templo-budista.jpg", entrada: { gratis: true }, nombre: "Templo Budista Chen Tien", lugar: "Foz do Iguaçu", pais: "Brasil", horas: 1.5, foto: "/fotos/templo-budista.jpg", tags: ["♿ Apto cochecito / silla", "☀️ Al aire libre"], resumen: "Un rincón de calma con arquitectura de inspiración china, jardines cuidados y esculturas que invitan a la contemplación. Es el lugar perfecto para hacer una pausa, caminar en silencio y tomar fotos distintas a todo lo que verás en el viaje. Corto, sereno y muy fotogénico.", desc: "Templo tranquilo con jardines y esculturas, ideal para una pausa.", horario: "09:00 a 17:00 hs", llevar: ["Ropa discreta y respetuosa", "Calzado fácil de quitar", "Agua"] },
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

// ---------- PREGUNTAS FRECUENTES DEL CHAT CON CAPITÁN TANGARÁ ----------
const FAQS_TANGARA = [
  { id: "clima", label: "🌤️ Plan según el clima", pregunta: "¿Qué me recomendás hacer según el clima de estos días?" },
  { id: "cenar", label: "🍽️ ¿Qué puedo cenar hoy?", pregunta: "¿Qué puedo cenar hoy?" },
  { id: "centro", label: "🌙 Salida en el centro", pregunta: "¿Qué me recomendás para una salida en el centro de Puerto Iguazú?" },
  { id: "lluvia", label: "☔ ¿Qué hacer con lluvia?", pregunta: "¿Qué puedo hacer hoy si llueve?" },
  { id: "chicos", label: "👨‍👩‍👧‍👦 Planes con chicos", pregunta: "¿Qué puedo hacer con los chicos (familia con menores) hoy?" },
  { id: "accesible", label: "♿ Turismo accesible / mayores", pregunta: "¿Qué paseos recomiendan para adultos mayores o silla de ruedas?" },
  { id: "documentos", label: "🛂 Documentos frontera", pregunta: "¿Qué documentos necesito para cruzar a Brasil o Paraguay?" },
  { id: "pagos", label: "💳 Cómo pagar (Pix/efectivo)", pregunta: "¿Cómo conviene pagar en Argentina, Brasil y Paraguay?" },
  { id: "movilidad", label: "🚐 Moverme sin auto", pregunta: "¿Cómo me muevo si no tengo vehículo propio?" },
  { id: "cataratas", label: "🎒 Qué llevar a Cataratas", pregunta: "¿Qué tengo que llevar para visitar las Cataratas?" },
];

function normalizarTxt(s) {
  return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function esLluvia(code) {
  return code >= 51;
}

function consejoClimaInteligente(clima, dias, primerNombre, conChicos, conMayores) {
  if (!clima || !clima.length) return "";
  const pref = primerNombre ? `${primerNombre}, ` : "";
  const ventana = clima.slice(0, Math.min(dias, clima.length));
  const lluviosos = ventana.filter((d) => esLluvia(d.code));
  const lindos = ventana.filter((d) => !esLluvia(d.code));
  const maxTemp = Math.max(...ventana.map((d) => d.max));
  const maxLindos = lindos.length ? Math.max(...lindos.map((d) => d.max)) : 0;

  let base = "";
  if (lluviosos.length === 0) {
    base = `¡excelente pronóstico para tus ${dias} ${dias === 1 ? "día" : "días"}! Los próximos ${ventana.length} días vienen sin lluvia (máximas de hasta ${maxTemp}°). Ideal para hacer Cataratas Argentinas, Brasileñas y Parque das Aves al aire libre.`;
    if (maxTemp >= 32) {
      base += " Como va a hacer calor, arrancá temprano (08:00 hs) con agua, gorra y protector solar.";
    }
  } else if (lluviosos.length === ventana.length) {
    base = `se anuncian lluvias en estos ${ventana.length} días (entre ${ventana[0].min}° y ${maxTemp}°). Te sugiero priorizar paseos bajo techo o en bus: Represa de Itaipú, AquaFoz, Dreamland, Minas de Wanda, La Aripuca o compras en Ciudad del Este, y llevar piloto por si vas a los saltos.`;
  } else if (esLluvia(ventana[0].code) && lindos.length > 0) {
    base = `hoy está inestable (${ventana[0].min}°/${ventana[0].max}°), pero en los próximos días mejora. Aprovechá hoy con piloto para Itaipú, AquaFoz, La Aripuca o Wanda, y dejá Cataratas para el día despejado.`;
    if (maxLindos >= 32) {
      base += ` Para ese día de sol (hasta ${maxLindos}°), sumá agua y gorra.`;
    }
  } else {
    base = `vas a tener días variados en tu estadía (algún chaparrón y días lindos hasta ${maxTemp}°). Reservá los días despejados para Cataratas y guardá Itaipú, AquaFoz o Wanda para cuando llueva.`;
    if (maxLindos >= 32) {
      base += " En los días sin lluvia salí temprano con agua y gorra.";
    }
  }

  if (conMayores) {
    base += " Como viajan con adultos mayores o movilidad reducida, mirá «♿ Turismo Accesible» abajo (bus adaptado, tren y senderos planos).";
  } else if (conChicos) {
    base += " Con chicos, sumá Parque das Aves y AquaFoz.";
  }
  const texto = `${pref}${base}`;
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function responderTangara(pregunta, ctx) {
  const q = normalizarTxt(pregunta);
  const { primerNombre, personas, dias, movilidad, clima } = ctx;
  const pref = primerNombre ? `${primerNombre}, ` : "";
  const restColabs = COLABORADORES.filter((c) => c.tipo === "restaurantes");

  if (/(accesib|silla|rueda|mayor|abuelo|anciano|movilidad reducida|caminar poco)/.test(q)) {
    return `${pref}en la pestaña Destinos tenés el bloque "♿ Turismo Accesible" con todas las opciones recomendadas: Cataratas Argentinas (tren ecológico y pasarelas con rampas), Cataratas Brasileñas (bus adaptado y ascensor panorámico), Parque das Aves (sendero plano), Represa de Itaipú (en bus), Hito Tres Fronteras, GüiráOga, La Aripuca y Templo Budista.`;
  }

  if (/(cenar|comer|almorzar|restaurante|parrilla|pizza|comida|gastronomia)/.test(q)) {
    const listaRest = restColabs.length
      ? `Tengo estos lugares aliados para recomendarte: ${restColabs.map((r) => r.nombre).join(", ")}. `
      : "";
    return `${pref}en Puerto Iguazú tenés opciones para todos los gustos: por la zona de Av. Brasil y Av. Córdoba (pleno centro) encontrás parrillas, pescados de río (como surubí o dorado), pastas y cervecerías artesanales. Si querés algo distinto, la Feirinha (Av. Victoria Aguirre y Brasil) es ideal para picar empanadas, quesos y picadas al aire libre. ${listaRest}Si querés que te recomiende un lugar puntual para ${personas} ${personas === 1 ? "persona" : "personas"} según tu presupuesto, escribile a Alan por WhatsApp.`;
  }

  if (/(centro|noche|salida|pasear|caminar|tomar algo|bar|feirinha)/.test(q)) {
    return `${pref}para una salida tranquila por el centro de Puerto Iguazú te recomiendo arrancar al atardecer en el Hito Tres Fronteras (gratis, con vista a los dos ríos y show de aguas danzantes), después caminar por la Av. Victoria Aguirre y la Av. Brasil donde están los bares, heladerías, chocolaterías y la famosa Feirinha. También podés mirar el mapa del "Centro de Puerto Iguazú" en la pestaña Mapas para ubicarte fácil.`;
  }

  if (/(lluvia|llueve|llover|tormenta|nublado|clima|tiempo|pronostico|segun el clima)/.test(q)) {
    const recClima = consejoClimaInteligente(clima, dias, primerNombre, ctx.conChicos, ctx.conMayores);
    if (recClima) return recClima;
    return `${pref}si toca día de lluvia, ¡no se suspende el viaje! Te recomiendo opciones bajo techo o protegidas: Minas de Wanda (túneles y piedras semipreciosas), La Aripuca, Represa de Itaipú (visita en bus panorámico), el acuario AquaFoz, Dreamland (Museo de Cera) o tarde de compras en las galerías de Ciudad del Este.`;
  }

  if (/(chico|nino|menor|familia|bebe|cochecito|hijo)/.test(q)) {
    return `${pref}para disfrutar en familia con chicos, los favoritos son: Parque das Aves (caminan entre tucanes y guacamayos en senderos planos), AquaFoz (acuario gigante), Dreamland (Museo de Cera), GüiráOga (centro de rescate de animales) y La Aripuca. Además, tanto Cataratas Argentinas como Brasileñas son aptas para cochecito (evitando solo Gran Aventura / Macuco si son muy chiquitos).`;
  }

  if (/(documento|dni|pasaporte|frontera|cruzar|aduana|migracion|autorizacion)/.test(q)) {
    return `${pref}¡dato clave! Para cruzar a Brasil o Paraguay necesitás DNI físico vigente (Mercosur) o Pasaporte original en buen estado: NO aceptan fotos en el celu ni fotocopias. Si viajan menores sin ambos padres, es obligatorio llevar autorización de viaje legalizada. Tip: en el Puente Tancredo Neves conviene cruzar antes de las 08:00 hs o después de las 15:00 hs para evitar demoras.`;
  }

  if (/(pagar|pago|pix|efectivo|dolar|real|peso|tarjeta|cambio|moneda)/.test(q)) {
    return `${pref}en Brasil aceptan Pix y tarjetas de débito/crédito en casi todos lados. En Argentina y Paraguay te conviene llevar algo de efectivo (pesos, reales o dólares billete azul en buen estado) para ferias, propinas y algunas boleterías. En la pestaña Destinos podés cambiar la moneda de referencia para calcular tus entradas.`;
  }

  if (/(auto|vehiculo|movilidad|traslado|chofer|colectivo|remis|taxi)/.test(q)) {
    return movilidad === "si"
      ? `${pref}como tenés vehículo propio podés moverte a tu ritmo, pero tené en cuenta que cruzar la frontera en auto particular a veces tiene filas largas en aduana y en Ciudad del Este el tránsito es intenso. Si algún día querés relajarte y evitar el estacionamiento o la aduana, podés pedirle traslado privado a Alan.`
      : `${pref}si no tenés movilidad propia, lo más cómodo y rendidor es coordinar traslados privados con chofer y guía: te pasan a buscar por tu hotel, optimizan los cruces de frontera y no perdés horas esperando colectivos. En Destinos armás tu carrito y lo enviás directo por WhatsApp para cotizar.`;
  }

  if (/(llevar|mochila|ropa|calzado|repelente|piloto|cataratas)/.test(q)) {
    return `${pref}para Cataratas llevá: calzado cerrado y antideslizante, ropa liviana, piloto de lluvia (en Garganta del Diablo y Salto Floriano te mojás con el rocío), repelente de insectos, protector solar, gorra y botella de agua. Si hacés Gran Aventura o Macuco Safari, sumá una muda de ropa seca.`;
  }

  if (/(hotel|hospedaje|alojamiento|dormir|ceibo)/.test(q)) {
    return `${pref}en la pestaña Colaboradores → Hoteles tenés a nuestro aliado destacado: Complejo El Ceibo, rodeado de selva y con piscina, ideal para ${personas} ${personas === 1 ? "persona" : "personas"} (${dias} ${dias === 1 ? "día" : "días"}). Podés consultarles disponibilidad directo por WhatsApp desde ahí.`;
  }

  if (/(ciudad del este|paraguay|compras|electronica|perfume)/.test(q)) {
    return `${pref}Ciudad del Este abre bien temprano (desde las 07:00 hs) y conviene ir por la mañana para aprovechar galerías de electrónica, perfumes e indumentaria. Se puede combinar perfecto con Saltos del Monday por la tarde. Llevá documento original y efectivo (dólares o guaraníes).`;
  }

  if (/(aventura|bici|kayak|aves|sunset|atardecer)/.test(q)) {
    return `${pref}en la pestaña Destinos tenés el bloque "Turismo Aventura" con paseos privados a medida: bicicleta por la selva, kayak, bird watching y Sunset en la Selva. Tocá «Quiero saber más» en cualquiera de ellos para consultar disponibilidad según tu fecha.`;
  }

  if (/(reservar|sena|precio|entrada|boleteria|costo|cuanto sale)/.test(q)) {
    return `${pref}armás tu itinerario día por día en la pestaña Destinos (recordá: 1 país por día) y tocás "Confirmar y Reservar por WhatsApp". La seña del 50% aplica solo a traslados y guías; las entradas a cada parque se pagan aparte en boletería o su web oficial.`;
  }

  return `${pref}¡buena pregunta! Para ese tema te puedo orientar sobre destinos, turismo accesible, clima, documentos, qué cenar, salidas por el centro o qué hacer con lluvia. Si necesitás una recomendación puntual para tu grupo (${personas} ${personas === 1 ? "persona" : "personas"}, ${dias} ${dias === 1 ? "día" : "días"}), tocá el botón de abajo y hablá directo con Alan por WhatsApp.`;
}

// ---------- CLIMA EN VIVO (OPEN-METEO) ----------
function iconoClima(code) {
  if (code === 0) return "☀️";
  if (code === 1 || code === 2) return "⛅";
  if (code === 3) return "☁️";
  if (code === 45 || code === 48) return "🌫️";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "🌧️";
  if (code >= 95) return "⛈️";
  return "🌤️";
}

function etiquetaDiaClima(fechaStr, idx, t, idioma) {
  if (idx === 0) return t.climaHoy;
  if (idx === 1) return t.climaManana;
  const loc = idioma === "pt" ? "pt-BR" : idioma === "en" ? "en-US" : "es-AR";
  const d = new Date(`${fechaStr}T12:00:00`);
  const txt = d.toLocaleDateString(loc, { weekday: "short" }).replace(".", "");
  return txt.charAt(0).toUpperCase() + txt.slice(1);
}

// ---------- 3 PLUMAS ANIMADAS A 60 FPS (SIN LÍNEAS DE VIENTO) ----------
function PlumasTransicion({ rafaga, onFin }) {
  const refs = [useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (!rafaga) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      onFin();
      return;
    }

    const esIzq = rafaga.dir === "izq";
    const dirNum = esIzq ? -1 : 1;
    const vw = window.innerWidth || 390;
    const vh = window.innerHeight || 800;

    const configs = [
      { delay: 0, dur: 1950, y0: vh * 0.22, dist: vw * 0.72, loopX: 46, loopY: 44, driftY: 75, baseRot: -18, phase: 0.2 },
      { delay: 160, dur: 1750, y0: vh * 0.44, dist: vw * 0.60, loopX: 38, loopY: 36, driftY: 55, baseRot: 24, phase: 1.7 },
      { delay: 90, dur: 2050, y0: vh * 0.62, dist: vw * 0.76, loopX: 52, loopY: 42, driftY: 65, baseRot: -10, phase: 3.1 },
    ];

    const start = performance.now();
    let frameId = 0;

    const animar = (ahora) => {
      let todasTerminaron = true;

      configs.forEach((cfg, i) => {
        const el = refs[i].current;
        if (!el) return;

        const elapsed = ahora - start - cfg.delay;
        if (elapsed < 0) {
          todasTerminaron = false;
          el.style.opacity = "0";
          return;
        }

        const t = Math.min(1, elapsed / cfg.dur);
        if (t < 1) todasTerminaron = false;

        const ease = 1 - Math.pow(1 - t, 2.8);
        const startX = esIzq ? vw + 40 : -72;

        const env = Math.exp(-Math.pow((t - 0.52) / 0.19, 2));
        const ondaX = Math.sin(t * Math.PI * 3.2 + cfg.phase) * cfg.loopX * env;
        const ondaY = -Math.cos(t * Math.PI * 3.2 + cfg.phase) * cfg.loopY * env + Math.sin(t * Math.PI * 2.2) * 18;

        const x = startX + dirNum * (cfg.dist * ease) + dirNum * ondaX;
        const y = cfg.y0 + ondaY + cfg.driftY * Math.pow(t, 1.5);

        const rotZ = dirNum * (cfg.baseRot + Math.sin(t * Math.PI * 3.6 + cfg.phase) * 32 + t * 38);
        const rotX = Math.sin(t * Math.PI * 4.4 + cfg.phase) * 28;
        const rotY = Math.cos(t * Math.PI * 3.1 + cfg.phase) * 24;
        const scale = 0.88 + Math.sin(t * Math.PI) * 0.14;

        let op = 1;
        if (t < 0.1) op = t / 0.1;
        else if (t > 0.64) op = Math.max(0, 1 - Math.pow((t - 0.64) / 0.36, 1.45));

        el.style.opacity = op.toFixed(3);
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rotZ.toFixed(1)}deg) rotateX(${rotX.toFixed(1)}deg) rotateY(${rotY.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
      });

      if (!todasTerminaron) {
        frameId = requestAnimationFrame(animar);
      } else {
        onFin();
      }
    };

    frameId = requestAnimationFrame(animar);
    return () => cancelAnimationFrame(frameId);
  }, [rafaga]);

  if (!rafaga) return null;
  const esIzq = rafaga.dir === "izq";
  const uid = rafaga.id;

  return (
    <div className="plumas-capa" aria-hidden="true">
      <svg ref={refs[0]} className="pluma-raf" viewBox="0 0 90 60" style={{ width: 72, height: 48 }}>
        <defs>
          <linearGradient id={`pAzul1-${uid}`} x1="0%" y1="30%" x2="100%" y2="70%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="45%" stopColor="#0284c7" />
            <stop offset="82%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#bae6fd" />
          </linearGradient>
        </defs>
        <g transform={esIzq ? "" : "scale(-1, 1) translate(-90, 0)"}>
          <path d="M84 14 L67 28 C58 24, 55 15, 51 11 L53 24 C45 18, 41 13, 35 12 L40 20 C27 12, 13 11, 5 18 C7 24, 15 33, 28 38 C39 42, 51 41, 61 36 L58 47 L66 39 C68 35, 69 31, 71 28 Z"
            fill={`url(#pAzul1-${uid})`} />
          <path d="M9 20 C24 28, 45 34, 65 29 C73 26, 79 20, 85 13" stroke="#e0f2fe" strokeWidth="1.9" strokeLinecap="round" fill="none" />
          <path d="M18 19 L11 16 M27 23 L19 18 M37 26 L29 20 M24 31 L31 35 M36 34 L43 38 M48 33 L54 37" stroke="rgba(255,255,255,0.45)" strokeWidth="1" strokeLinecap="round" fill="none" />
        </g>
      </svg>

      <svg ref={refs[1]} className="pluma-raf" viewBox="0 0 70 60" style={{ width: 44, height: 38 }}>
        <defs>
          <linearGradient id={`pRoja-${uid}`} x1="10%" y1="90%" x2="90%" y2="10%">
            <stop offset="0%" stopColor="#991b1b" />
            <stop offset="55%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#fecaca" />
          </linearGradient>
        </defs>
        <g transform="rotate(28 35 30)">
          <path d="M10 50 L22 39 C19 32, 22 21, 30 13 L32 19 L38 9 C45 8, 52 10, 55 16 C54 25, 48 34, 38 40 L33 36 L29 44 C26 44, 23 42, 21 40 Z"
            fill={`url(#pRoja-${uid})`} />
          <path d="M9 51 C21 40, 35 27, 52 14" stroke="#fee2e2" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <path d="M27 33 L24 25 M35 26 L32 18 M42 21 L47 25" stroke="rgba(255,255,255,0.42)" strokeWidth="0.95" strokeLinecap="round" fill="none" />
        </g>
      </svg>

      <svg ref={refs[2]} className="pluma-raf" viewBox="0 0 80 60" style={{ width: 58, height: 44 }}>
        <defs>
          <linearGradient id={`pAzul2-${uid}`} x1="0%" y1="80%" x2="100%" y2="20%">
            <stop offset="0%" stopColor="#1d4ed8" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#7dd3fc" />
          </linearGradient>
        </defs>
        <g transform="rotate(-18 40 30)">
          <path d="M6 44 L23 36 C21 29, 27 20, 37 14 L38 20 L46 11 C57 8, 68 9, 74 15 C71 24, 62 33, 49 38 L44 34 L38 41 C33 41, 28 39, 25 36 Z"
            fill={`url(#pAzul2-${uid})`} />
          <path d="M5 45 C22 37, 45 27, 70 14" stroke="#dbeafe" strokeWidth="1.7" strokeLinecap="round" fill="none" />
          <path d="M31 31 L27 23 M42 26 L38 18 M54 20 L50 13 M47 29 L54 33" stroke="rgba(255,255,255,0.42)" strokeWidth="1" strokeLinecap="round" fill="none" />
        </g>
      </svg>
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

function reproducirAleteo() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const ahora = ctx.currentTime;
    const durBuffer = 0.5;
    const bufferSize = Math.floor(ctx.sampleRate * durBuffer);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    // 3 batidos suaves de alas/plumas
    [0, 0.12, 0.24].forEach((offset, idx) => {
      const src = ctx.createBufferSource();
      src.buffer = buffer;

      const filtro = ctx.createBiquadFilter();
      filtro.type = "bandpass";
      filtro.Q.value = 1.6;
      const baseFreq = 540 - idx * 70;
      filtro.frequency.setValueAtTime(baseFreq, ahora + offset);
      filtro.frequency.exponentialRampToValueAtTime(baseFreq + 360, ahora + offset + 0.07);
      filtro.frequency.exponentialRampToValueAtTime(280, ahora + offset + 0.16);

      const gain = ctx.createGain();
      const pico = 0.11 - idx * 0.025;
      gain.gain.setValueAtTime(0.001, ahora + offset);
      gain.gain.linearRampToValueAtTime(pico, ahora + offset + 0.045);
      gain.gain.exponentialRampToValueAtTime(0.001, ahora + offset + 0.17);

      src.connect(filtro);
      filtro.connect(gain);
      gain.connect(ctx.destination);
      src.start(ahora + offset);
      src.stop(ahora + offset + 0.19);
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

// ---------- BIENVENIDA EN PRIMER PLANO (SOLO PRIMERA VEZ) ----------
const POSES_BIENVENIDA = [
  "/fotos/asistente-posado.png",
  "/fotos/asistente-hablando.png",
  "/fotos/asistente-posado.png",
  "/fotos/asistente-hablando.png",
  "/fotos/asistente-hablando.png",
  "/fotos/asistente-sonriendo.png",
  "/fotos/asistente-sonriendo.png",
  "/fotos/asistente-hablando.png",
];

function BienvenidaTangara({ primerNombre, onElegir }) {
  const [paso, setPaso] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
    const iv = setInterval(() => setPaso((p) => (p + 1) % POSES_BIENVENIDA.length), 340);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="bienvenida-capa" role="dialog" aria-modal="true" aria-labelledby="bienv-titulo">
      <div className="bienvenida-card">
        <img
          className="bienvenida-ave"
          src={POSES_BIENVENIDA[paso]}
          alt="Capitán Tangará dándote la bienvenida"
        />
        <span className="bienvenida-sello">🦜 Capitán Tangará · Tu anfitrión</span>
        <h2 id="bienv-titulo">
          {primerNombre ? `¡Hola ${primerNombre}! Bienvenido a Tres Fronteras` : "¡Hola! Bienvenido a Tres Fronteras"}
        </h2>
        <p>
          Soy el <strong>Capitán Tangará</strong>, un bailarín azul de la selva misionera. Voy a acompañarte para armar tu viaje por Puerto Iguazú, Foz do Iguaçu y Ciudad del Este, con consejos de frontera, clima y horarios.
        </p>
        <p className="bienvenida-preg">¿Querés que te guíe en tus primeros pasos o preferís explorar por tu cuenta?</p>
        <div className="bienvenida-botones">
          <button type="button" className="b-btn si" onClick={() => onElegir("guiado")}>
            🧭 Sí, guíame paso a paso
          </button>
          <button type="button" className="b-btn no" onClick={() => onElegir("libre")}>
            Explorar por mi cuenta
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- CHAT INTERACTIVO CON CAPITÁN TANGARÁ ----------
function ChatTangara({ abierto, onCerrar, ctx, sonar }) {
  const { primerNombre } = ctx;
  const [mensajes, setMensajes] = useState([
    {
      id: 1,
      de: "bot",
      texto: `¡Hola${primerNombre ? ` ${primerNombre}` : ""}! Soy el Capitán Tangará 🦜. Elegí una pregunta rápida abajo o escribime lo que necesites sobre Iguazú y las Tres Fronteras.`,
    },
  ]);
  const [entrada, setEntrada] = useState("");
  const [pose, setPose] = useState("/fotos/asistente-posado.png");
  const finRef = useRef(null);

  useEffect(() => {
    if (abierto) finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, abierto]);

  if (!abierto) return null;

  const preguntar = (textoPregunta) => {
    const limpia = textoPregunta.trim();
    if (!limpia) return;
    const resp = responderTangara(limpia, ctx);
    setMensajes((prev) => [
      ...prev,
      { id: Date.now(), de: "user", texto: limpia },
      { id: Date.now() + 1, de: "bot", texto: resp },
    ]);
    setEntrada("");
    sonar();
    setPose("/fotos/asistente-hablando.png");
    window.setTimeout(() => setPose("/fotos/asistente-sonriendo.png"), 450);
    window.setTimeout(() => setPose("/fotos/asistente-posado.png"), 1100);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    preguntar(entrada);
  };

  return (
    <div className="chat-capa" role="dialog" aria-modal="true" aria-label="Chat con Capitán Tangará" onClick={onCerrar}>
      <div className="chat-caja" onClick={(e) => e.stopPropagation()}>
        <div className="chat-cab">
          <div className="chat-cab-info">
            <img src={pose} alt="Capitán Tangará" className="chat-avatar" />
            <div>
              <strong>Capitán Tangará</strong>
              <small>Asistente turístico local · En línea</small>
            </div>
          </div>
          <button type="button" className="chat-cerrar" onClick={onCerrar} aria-label="Cerrar chat">✕</button>
        </div>

        <div className="chat-mensajes">
          {mensajes.map((m) => (
            <div key={m.id} className={`chat-burbuja ${m.de}`}>
              {m.texto}
            </div>
          ))}
          <div ref={finRef} />
        </div>

        <div className="chat-faqs" aria-label="Preguntas frecuentes">
          {FAQS_TANGARA.map((f) => (
            <button key={f.id} type="button" className="chat-faq-btn" onClick={() => preguntar(f.pregunta)}>
              {f.label}
            </button>
          ))}
        </div>

        <form className="chat-form" onSubmit={onSubmit}>
          <input
            type="text"
            value={entrada}
            onChange={(e) => setEntrada(e.target.value)}
            placeholder="Escribí tu pregunta acá..."
            aria-label="Escribí tu pregunta para Capitán Tangará"
          />
          <button type="submit" disabled={!entrada.trim()}>Enviar</button>
        </form>

        <a
          className="chat-wa"
          target="_blank"
          rel="noopener noreferrer"
          href={`https://wa.me/${GUIA.whatsapp}?text=${encodeURIComponent(`¡Hola Alan!${primerNombre ? ` Soy ${primerNombre}.` : ""} Vengo del chat de Capitán Tangará en App Iguazú y quería consultarte:`)}`}
        >
          💬 Hablar directo con Alan por WhatsApp
        </a>
      </div>
    </div>
  );
}

// ---------- COMPONENTES AUXILIARES ----------
function CapitanTangara({ modo, setModo, volando, mensaje, inline = false, botonesRapidos = null, onAbrirChat }) {
  const [cuadro, setCuadro] = useState(0);
  useEffect(() => {
    if (!volando) return;
    const iv = setInterval(() => setCuadro((c) => (c === 0 ? 1 : 0)), 130);
    return () => clearInterval(iv);
  }, [volando]);

  if (modo === "libre") {
    if (!inline) {
      return (
        <button type="button" className="tangara-mini" onClick={onAbrirChat}
          aria-label="Chatear con Capitán Tangará" title="Preguntarle al Capitán Tangará">
          <img src="/fotos/asistente-posado.png" alt="Capitán Tangará" />
          <span>💬 Preguntar</span>
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
        <div className="tangara-acciones">
          <button type="button" className="t-btn si" onClick={onAbrirChat}>
            💬 Preguntarle al Capitán
          </button>
        </div>
      </div>
      <img className="tangara-ave" src={imgActual} alt="Capitán Tangará" onClick={onAbrirChat} style={{ cursor: "pointer" }} />
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

const ICONOS_MEDALLON = {
  ar: "data:image/jpeg;base64,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",
  br: "data:image/jpeg;base64,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",
  py: "data:image/jpeg;base64,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",
  accesible: "data:image/jpeg;base64,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",
  aventura: "data:image/jpeg;base64,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",
};

const TITULO_CARTEL_IMG = "data:image/webp;base64,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";

function MedallonAcuarela({ tipo, alt }) {
  return (
    <img
      src={ICONOS_MEDALLON[tipo]}
      alt={alt}
      className="medallon-acuarela-img"
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
  const [agendaCat, setAgendaCat] = useState("todos");
  const [diaClimaTip, setDiaClimaTip] = useState(null);
  const [busquedaColab, setBusquedaColab] = useState("");
  const refColabLista = useRef(null);
  const [mapaAmpliado, setMapaAmpliado] = useState(null);
  const [zoomMapa, setZoomMapa] = useState(1);
  const [scrollY, setScrollY] = useState(0);
  const [bienvenidaVista, setBienvenidaVista] = useState(Boolean(guardado.bienvenidaVista));
  const [modoTangara, setModoTangara] = useState(guardado.modoTangara || "guiado");
  const [chatAbierto, setChatAbierto] = useState(false);
  const [volandoTangara, setVolandoTangara] = useState(false);
  const timerTangara = useRef(null);
  const volarTangara = () => {
    setVolandoTangara(true);
    clearTimeout(timerTangara.current);
    timerTangara.current = setTimeout(() => setVolandoTangara(false), 650);
  };

  const [dias, setDias] = useState(guardado.dias || 3);
  const [personas, setPersonas] = useState(guardado.personas || 2);
  const [conChicos, setConChicos] = useState(Boolean(guardado.conChicos));
  const [conMayores, setConMayores] = useState(Boolean(guardado.conMayores));
  const [movilidad, setMovilidad] = useState(guardado.movilidad || "no");
  const [hotel, setHotel] = useState(guardado.hotel || "");
  const [nombreTurista, setNombreTurista] = useState(guardado.nombreTurista || "");
  const [origen, setOrigen] = useState(guardado.origen || "");
  const [carrito, setCarrito] = useState(Array.isArray(guardado.carrito) ? guardado.carrito : []);
  const [divisa, setDivisa] = useState(guardado.divisa || "ARS");
  const [idioma, setIdioma] = useState(guardado.idioma || "es");
  const [modoClaro, setModoClaro] = useState(Boolean(guardado.modoClaro));
  const [clima, setClima] = useState(null);
  const [climaEstado, setClimaEstado] = useState("cargando");

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

  const elegirBienvenida = (eleccion) => {
    setModoTangara(eleccion);
    setBienvenidaVista(true);
    if (sonido) reproducirAleteo();
    if (eleccion === "guiado") volarTangara();
  };

  const cambiarPestana = (nueva, dirForzada = null) => {
    if (nueva === pestana) return;
    const idxActual = ORDEN_PESTANAS.indexOf(pestana);
    const idxNueva = ORDEN_PESTANAS.indexOf(nueva);
    const dir = dirForzada || (idxNueva > idxActual ? "izq" : "der");
    setDirVista(dir);
    setRafagaPlumas({ id: Date.now(), dir });
    setPestana(nueva);
    if (sonido) reproducirAleteo();
    if (modoTangara === "guiado") volarTangara();
  };

  const onTouchStartTab = (e) => {
    if (!bienvenidaVista || chatAbierto || mapaAmpliado || e.touches.length !== 1) return;
    const ignorar = Boolean(e.target.closest(".deslizable.puede, .carrusel, .mapa-scroll, .chat-capa, .bento-destacados, input, select, textarea"));
    swipeTabRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, ignorar };
  };

  const onTouchEndTab = (e) => {
    const { x, y, ignorar } = swipeTabRef.current;
    if (!bienvenidaVista || chatAbierto || ignorar || !e.changedTouches.length || mapaAmpliado) return;
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

  const t = TEXTOS[idioma] || TEXTOS.es;

  const cargarClima = () => {
    setClimaEstado("cargando");
    fetch("https://api.open-meteo.com/v1/forecast?latitude=-25.5991&longitude=-54.5735&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=America%2FArgentina%2FBuenos_Aires&forecast_days=3")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data?.daily?.time) {
          setClimaEstado("error");
          return;
        }
        const lista = data.daily.time.slice(0, 3).map((fecha, i) => ({
          fecha,
          code: data.daily.weather_code[i],
          min: Math.round(data.daily.temperature_2m_min[i]),
          max: Math.round(data.daily.temperature_2m_max[i]),
        }));
        setClima(lista);
        setClimaEstado("listo");
      })
      .catch(() => {
        setClimaEstado("error");
      });
  };

  useEffect(() => {
    cargarClima();
  }, []);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScrollY(Math.min(480, window.scrollY || 0));
        raf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ dias, personas, conChicos, conMayores, movilidad, hotel, nombreTurista, origen, carrito, divisa, idioma, modoClaro, bienvenidaVista, modoTangara })
      );
    } catch {
      // ignorar
    }
  }, [dias, personas, conChicos, conMayores, movilidad, hotel, nombreTurista, origen, carrito, divisa, idioma, modoClaro, bienvenidaVista, modoTangara]);

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
    setConChicos(false);
    setConMayores(false);
    setMovilidad("no");
    setHotel("");
    setNombreTurista("");
    setOrigen("");
    setPlanCargado("");
    setAviso(null);
    setAvisoCombo(null);
    setAvisoGlobal("");
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ dias: 3, personas: 2, conChicos: false, conMayores: false, movilidad: "no", hotel: "", nombreTurista: "", origen: "", carrito: [], divisa, idioma, modoClaro, bienvenidaVista: true, modoTangara })
      );
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
  const listaAccesible = ATRACTIVOS.filter((a) => a.accesible);

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
  const rawPrimer = nombre.split(/\s+/)[0] || "";
  const primerNombre = rawPrimer ? rawPrimer.charAt(0).toUpperCase() + rawPrimer.slice(1) : "";
  const origenTxt = origen.trim();
  const grupoExtras = [
    conChicos ? "con chicos/menores" : "",
    conMayores ? "con adultos mayores / movilidad reducida" : "",
  ].filter(Boolean).join(" y ");

  const saludo = nombre
    ? `¡Hola! Soy ${nombre} y me encantaría coordinar mi viaje por las Tres Fronteras con ustedes. Les comparto mi itinerario:`
    : "¡Hola! Me encantaría coordinar mi viaje por las Tres Fronteras con ustedes. Les comparto mi itinerario:";
  const mensajeReserva =
    `${saludo}\n\n` +
    `*Datos del viaje*\n` +
    (origenTxt ? `- De dónde vengo: ${origenTxt}\n` : "") +
    `- Días de estadía: ${dias}\n- Cantidad de personas: ${personas}${grupoExtras ? ` (${grupoExtras})` : ""}\n` +
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
    { id: "agenda", etiqueta: t.tabs.agenda, icono: "🎭" },
    { id: "guia", etiqueta: t.tabs.guia, icono: "💬" },
  ];

  const qColab = normalizarTxt(busquedaColab.trim());
  const colabsDeCategoria = qColab
    ? COLABORADORES.filter((c) =>
        normalizarTxt(`${c.nombre} ${c.categoria} ${c.descripcion} ${c.servicios.join(" ")}`).includes(qColab)
      )
    : COLABORADORES.filter((c) => c.tipo === colabCat);
  const destacadosColab = COLABORADORES.filter((c) => c.destacado);
  const promosActivas = colabsDeCategoria.filter((c) => c.promo && c.promo.trim());

  const seleccionarBento = (idCat) => {
    setBusquedaColab("");
    setColabCat(idCat);
    if (modoTangara === "guiado") volarTangara();
    window.setTimeout(() => refColabLista.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60);
  };

  const tienePais = (p) => carrito.some((x) => x.pais === p);
  const consejoTangara = (() => {
    const hola = primerNombre ? `¡Hola ${primerNombre}! ` : "¡Hola! ";
    const pref = primerNombre ? `${primerNombre}, ` : "";

    if (pestana === "mapas") {
      return `${pref}importante: estos mapas son meramente ilustrativos para darte una orientación general; ningún mapa representa con total exactitud el recorrido real. Usá el botón de Google Maps para navegar con precisión.`;
    }
    if (pestana === "colab") {
      const listaNombres = colabsDeCategoria.map((c) => c.nombre).join(", ");
      const promoTexto = promosActivas.length
        ? ` Promos activas ahora: ${promosActivas.map((p) => `${p.nombre} (${p.promo})`).join(" · ")}.`
        : "";
      if (colabCat === "hoteles") {
        return `${pref}¿estás buscando hospedaje para ${personas} ${personas === 1 ? "persona" : "personas"} (${dias} ${dias === 1 ? "día" : "días"})? Hoy te recomiendo consultar disponibilidad en: ${listaNombres || "nuestros aliados"}.${promoTexto}`;
      }
      if (colabCat === "restaurantes") {
        return colabsDeCategoria.length
          ? `${pref}¿viendo qué cenar o almorzar en la ciudad? Te recomiendo: ${listaNombres}.${promoTexto}`
          : `${pref}¿viendo qué cenar en la ciudad? Muy pronto vamos a sumar restaurantes aliados con promos. Mientras tanto, preguntale a Alan por WhatsApp sus lugares favoritos.`;
      }
      if (colabCat === "guias") {
        return colabsDeCategoria.length
          ? `${pref}¿buscás un guía habilitado de confianza? Podés contactar a: ${listaNombres}.${promoTexto}`
          : `${pref}¿necesitás un guía de confianza para tu recorrido? Pronto sumamos el listado completo; por ahora coordinamos directo con Alan por WhatsApp.`;
      }
      if (colabCat === "choferes") {
        return colabsDeCategoria.length
          ? `${pref}¿buscás chofer o traslado privado? Tenés disponible a: ${listaNombres}.${promoTexto}`
          : `${pref}¿necesitás chofer o traslado privado entre Argentina, Brasil y Paraguay? Pronto sumamos más choferes acá; consultanos por WhatsApp para reservar.`;
      }
      if (colabCat === "actividades") {
        return colabsDeCategoria.length
          ? `${pref}¿buscando experiencias extras? Mirá estas opciones: ${listaNombres}.${promoTexto}`
          : `${pref}muy pronto sumamos actividades y experiencias de aliados locales acá. Mientras tanto, consultale a Alan por WhatsApp.`;
      }
    }
    if (pestana === "agenda") {
      return AGENDA_CULTURAL.length
        ? `${pref}mirá la Agenda Cultural de Iguazú y las Tres Fronteras: ferias, música en vivo, muestras y eventos locales para sumar a tu viaje.`
        : `${pref}acá vamos a publicar ferias municipales, recitales, muestras y maratones que nos envíen nuestros colaboradores. Podés consultarle a Alan qué hay esta semana por WhatsApp.`;
    }
    if (pestana === "guia") return `${pref}¿tenés dudas antes de reservar? Escribinos directo por WhatsApp o mail.`;
    if (paisAbierto === "accesible") {
      return `${pref}en Turismo Accesible reunimos todos los paseos con senderos planos, rampas, tren o bus adaptado para que disfruten cómodos adultos mayores, usuarios de silla de ruedas y familias con cochecito.`;
    }
    if (paisAbierto === "Argentina") {
      if (tienePais("Argentina")) {
        return `¡Circuito argentino listo${primerNombre ? `, ${primerNombre}` : ""}! Llevá DNI físico vigente, calzado cerrado, piloto de lluvia, repelente y agua.${dias >= 2 && dias <= 3 && !tienePais("Brasil") ? " Con " + dias + " días te recomiendo sumar Brasil mañana." : ""}`;
      }
      return dias <= 2
        ? `${pref}con ${dias} días priorizá Cataratas Argentinas (7 hs) y sumá Gran Aventura si querés lancha. Luego te recomiendo cruzar a Brasil.`
        : `${pref}en ${dias} días podés hacer Cataratas Argentinas un día y dejar Minas de Wanda, GüiráOga o San Ignacio para otro día.`;
    }
    if (paisAbierto === "Brasil") {
      if (tienePais("Brasil")) {
        return `¡Gran circuito en Foz${primerNombre ? `, ${primerNombre}` : ""}! Llevá DNI o pasaporte original (sin fotocopias) para aduana, protector solar, gorra y piloto.`;
      }
      return `${pref}Cataratas Brasileñas lleva medio día: combinala el mismo día con Parque das Aves, Macuco Safari, Helisul o AquaFoz.`;
    }
    if (paisAbierto === "Paraguay") {
      if (tienePais("Paraguay")) {
        return `${pref}para el Puente de la Amistad llevá documento original vigente, efectivo (USD o Gs) y calzado antideslizante para Saltos del Monday.`;
      }
      return `${pref}en Paraguay podés combinar Compras en Ciudad del Este por la mañana y Saltos del Monday por la tarde.`;
    }
    if (paisAbierto === "aventura") {
      return `${pref}son tours privados a medida (bici, kayak, aves o sunset). Tocá «Quiero saber más» y coordinamos según el clima.`;
    }
    if (diaClimaTip !== null && clima?.[diaClimaTip]) {
      const d = clima[diaClimaTip];
      const etq = etiquetaDiaClima(d.fecha, diaClimaTip, t, idioma);
      if (esLluvia(d.code)) {
        return `${pref}para ${etq} se esperan lluvias (${d.min}°/${d.max}°). Te recomiendo Itaipú (en bus), AquaFoz, Dreamland, Minas de Wanda o La Aripuca para disfrutar sin mojarte.`;
      }
      if (d.max >= 32) {
        return `${pref}para ${etq} hace calor (${d.min}°/${d.max}°). Ideal para Cataratas temprano, Parque das Aves con sombra o Saltos del Monday; llevá agua, gorra y protector.`;
      }
      return `${pref}para ${etq} pinta un día ideal (${d.min}°/${d.max}°). Excelente para Cataratas Argentinas, Brasileñas, Parque das Aves o Hito Tres Fronteras.`;
    }
    if (conMayores && conChicos) {
      return `${pref}como viajan con chicos y adultos mayores, lo más cómodo son paseos planos y con transporte interno: Parque das Aves, Cataratas Brasileñas (bus + ascensor), Itaipú en bus, AquaFoz y Cataratas Argentinas (tren + Circuito Superior). Mirá «♿ Turismo Accesible» abajo.`;
    }
    if (conMayores) {
      return `${pref}como viajan con adultos mayores o movilidad reducida, abrí «♿ Turismo Accesible» abajo: tenés Cataratas Argentinas (tren + rampas), Brasileñas (bus + ascensor), Itaipú en bus, Parque das Aves y Hito Tres Fronteras con bancos para descansar.`;
    }
    if (conChicos) {
      return `${pref}como viajan con chicos, los imperdibles son Parque das Aves (aves libres y sendero plano), AquaFoz, Dreamland, GüiráOga y ambos lados de Cataratas (aptos para cochecito).`;
    }
    if (clima && clima.length > 0 && carrito.length === 0) {
      return consejoClimaInteligente(clima, dias, primerNombre, conChicos, conMayores);
    }
    if (carrito.length > 0) {
      return `¡Vas bárbaro${primerNombre ? `, ${primerNombre}` : ""}! Ya armaste ${carrito.length} actividad(es). Recordá que la seña del 50% es solo por traslados y guías; entradas en boletería.`;
    }
    return dias <= 3
      ? `${hola}Completá tus datos abajo y para ${dias} días te sugiero empezar abriendo Argentina o cargar un plan sugerido en 1 clic.`
      : `${hola}Completá tus datos abajo y con ${dias} días podés recorrer los 3 países tranquilos. Abrí un bloque para empezar.`;
  })();

  const botonesColabTangara = pestana === "colab"
    ? CATEGORIAS_COLAB.map((cat) => ({
        id: cat.id,
        label: cat.preguntaBtn,
        activo: colabCat === cat.id && !qColab,
        onClick: () => seleccionarBento(cat.id),
      }))
    : null;

  const dondeSePosa =
    pestana === "mapas" ? "mapas-top" :
    pestana === "colab" ? "colab-top" :
    pestana !== "destinos" ? "pestana" :
    paisAbierto ? `pais-${paisAbierto}` :
    carrito.length > 0 ? "carrito" : "inicio";

  const ctxChat = { primerNombre, personas, dias, movilidad, clima, conChicos, conMayores };

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
        .app { --tinta: #f4f4f5; --rio: #34d399; --niebla: #1c1c21; --papel: #141417; --suave: #a1a1aa; --fondo: #09090b;
          position: relative; color-scheme: dark; text-align: left; min-height: 100vh; background: var(--fondo); color: var(--tinta);
          font-family: "Segoe UI", system-ui, sans-serif; padding: 16px 16px 48px; transition: background .25s, color .25s; touch-action: pan-y; }
        .fondo-portada { position: absolute; top: 0; left: 0; right: 0; height: clamp(340px, 62vw, 480px); overflow: hidden; pointer-events: none; z-index: 0;
          -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 42%, rgba(0,0,0,0) 100%);
          mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 42%, rgba(0,0,0,0) 100%); }
        .fondo-portada.difuminado { filter: blur(8px) brightness(.72); }
        .fondo-portada-img { position: absolute; inset: -16px 0 -40px; width: 100%; height: calc(100% + 56px); object-fit: cover; object-position: center 35%;
          will-change: transform; opacity: .88; }
        .fondo-portada-velo { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(5,16,26,.48) 0%, rgba(9,9,11,.28) 55%, var(--fondo) 100%); }
        .app.claro .fondo-portada-velo { background: linear-gradient(180deg, rgba(10,25,35,.42) 0%, rgba(228,228,231,.22) 55%, var(--fondo) 100%); }
        .contenedor { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; transition: filter .35s ease; }
        .contenedor.difuminado { filter: blur(8px) brightness(.72); pointer-events: none; user-select: none; -webkit-user-select: none; }
        .app h1, .app h2, .app h3 { color: var(--tinta); }
        @keyframes entrarVista { from { opacity: 0; transform: translateY(12px) scale(.99); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes entrarDesdeDer { from { opacity: 0; transform: translateX(28px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes entrarDesdeIzq { from { opacity: 0; transform: translateX(-28px); } to { opacity: 1; transform: translateX(0); } }
        .vista-animada { animation: entrarVista .3s cubic-bezier(.22, 1, .36, 1) both; }
        .vista-animada.dir-izq { animation: entrarDesdeDer .28s cubic-bezier(.22, 1, .36, 1) both; }
        .vista-animada.dir-der { animation: entrarDesdeIzq .28s cubic-bezier(.22, 1, .36, 1) both; }
        .plumas-capa { position: fixed; inset: 0; pointer-events: none; z-index: 900; overflow: hidden; perspective: 600px; }
        .pluma-raf { position: absolute; top: 0; left: 0; opacity: 0; will-change: transform, opacity; filter: drop-shadow(0 8px 14px rgba(0,0,0,.45)); }
        .bienvenida-capa { position: fixed; inset: 0; z-index: 950; display: flex; align-items: center; justify-content: center; padding: 18px;
          background: rgba(9,9,11,.55); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); animation: lbEntrada .35s ease; }
        .bienvenida-card { width: 100%; max-width: 440px; background: rgba(20,20,23,.96); border: 1.5px solid #34d399; border-radius: 24px;
          padding: 22px 20px 20px; text-align: center; box-shadow: 0 24px 60px rgba(0,0,0,.7), 0 0 0 1px rgba(52,211,153,.25);
          display: flex; flex-direction: column; align-items: center; gap: 10px; animation: entrarVista .38s cubic-bezier(.22, 1, .36, 1); }
        .bienvenida-ave { width: clamp(148px, 38vw, 196px); height: auto; display: block; filter: drop-shadow(0 12px 24px rgba(0,0,0,.55)); animation: flotarAve 3.2s ease-in-out infinite; }
        .bienvenida-sello { display: inline-block; font-size: .78rem; font-weight: 800; color: #34d399; background: rgba(16,185,129,.14); border: 1px solid #065f46; border-radius: 999px; padding: 4px 12px; }
        .bienvenida-card h2 { margin: 2px 0 0; font-family: Georgia, serif; font-size: clamp(1.3rem, 4.5vw, 1.6rem); line-height: 1.2; }
        .bienvenida-card p { margin: 0; font-size: .92rem; line-height: 1.45; color: #d4d4d8; }
        .bienvenida-preg { font-weight: 700; color: #f4f4f5 !important; margin-top: 2px !important; }
        .bienvenida-botones { width: 100%; display: flex; flex-direction: column; gap: 9px; margin-top: 6px; }
        .b-btn { width: 100%; border: none; border-radius: 14px; padding: 13px 16px; font-family: inherit; font-weight: 800; font-size: .96rem; cursor: pointer; transition: transform .15s; }
        .b-btn:active { transform: scale(.98); }
        .b-btn.si { background: linear-gradient(135deg, #34d399, #10b981); color: #04261a; }
        .b-btn.no { background: #27272a; color: #e4e4e7; border: 1px solid #3f3f46; }
        .chat-capa { position: fixed; inset: 0; z-index: 980; display: flex; align-items: flex-end; justify-content: center; padding: 12px;
          background: rgba(9,9,11,.65); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); animation: lbEntrada .2s ease; }
        @media (min-width: 640px) { .chat-capa { align-items: center; } }
        .chat-caja { width: 100%; max-width: 480px; max-height: 88vh; display: flex; flex-direction: column; background: var(--papel);
          border: 1.5px solid #34d399; border-radius: 22px; overflow: hidden; box-shadow: 0 24px 60px rgba(0,0,0,.7); animation: entrarVista .25s ease; }
        .chat-cab { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px 14px; background: rgba(16,185,129,.1); border-bottom: 1px solid #27272a; }
        .chat-cab-info { display: flex; align-items: center; gap: 10px; }
        .chat-avatar { width: 44px; height: 44px; object-fit: contain; }
        .chat-cab-info strong { display: block; font-size: .98rem; color: #34d399; }
        .chat-cab-info small { display: block; font-size: .75rem; color: var(--suave); }
        .chat-cerrar { width: 34px; height: 34px; border-radius: 50%; border: 1px solid #3f3f46; background: #27272a; color: #f4f4f5; font-size: 1rem; cursor: pointer; }
        .chat-mensajes { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px; min-height: 160px; max-height: 42vh; }
        .chat-burbuja { max-width: 88%; padding: 10px 13px; border-radius: 16px; font-size: .88rem; line-height: 1.45; }
        .chat-burbuja.bot { align-self: flex-start; background: var(--niebla); border: 1px solid #27272a; color: var(--tinta); border-bottom-left-radius: 4px; }
        .chat-burbuja.user { align-self: flex-end; background: linear-gradient(135deg, #34d399, #10b981); color: #04261a; font-weight: 600; border-bottom-right-radius: 4px; }
        .chat-faqs { display: flex; gap: 6px; padding: 8px 12px; overflow-x: auto; border-top: 1px solid #27272a; background: rgba(255,255,255,.02); }
        .chat-faq-btn { flex: none; border: 1px solid #3f3f46; background: var(--niebla); color: var(--tinta); border-radius: 999px; padding: 6px 11px; font-size: .76rem; font-weight: 700; cursor: pointer; white-space: nowrap; }
        .chat-faq-btn:hover { border-color: #34d399; }
        .chat-form { display: flex; gap: 8px; padding: 10px 12px; border-top: 1px solid #27272a; }
        .chat-form input { flex: 1; padding: 10px 12px; border-radius: 12px; border: 1.5px solid #3f3f46; background: var(--niebla); color: var(--tinta); font-size: .92rem; }
        .chat-form button { border: none; border-radius: 12px; padding: 0 16px; background: linear-gradient(135deg, #34d399, #10b981); color: #04261a; font-weight: 800; cursor: pointer; }
        .chat-form button:disabled { background: #27272a; color: #71717a; cursor: default; }
        .chat-wa { display: block; text-align: center; text-decoration: none; padding: 9px 12px; font-size: .8rem; font-weight: 700; color: #6ee7b7; background: rgba(16,185,129,.08); border-top: 1px solid #27272a; }
        .grupo-checks { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
        .check-pill { display: flex; align-items: center; gap: 8px; padding: 7px 10px; border-radius: 10px; border: 1px solid #27272a; background: var(--niebla); font-size: .82rem; font-weight: 600; cursor: pointer; user-select: none; }
        .check-pill input { width: 16px; height: 16px; margin: 0; accent-color: #10b981; cursor: pointer; flex: none; }
        .check-pill.activo { border-color: #10b981; background: rgba(16,185,129,.12); color: #6ee7b7; }
        .acc-nota { margin: 0; padding: 8px 10px; border-radius: 8px; background: rgba(2,132,199,.14); border-left: 3px solid #38bdf8; font-size: .83rem; line-height: 1.4; color: var(--tinta); }

        /* ---------- BENTO GRID MODERNO EN COLABORADORES (OPCIÓN 1) ---------- */
        .bento-buscador { display: flex; align-items: center; gap: 8px; margin: 14px 0 14px; padding: 4px 12px; border-radius: 14px; background: var(--papel); border: 1.5px solid #27272a; box-shadow: 0 4px 16px rgba(0,0,0,.25); }
        .bento-buscador:focus-within { border-color: #10b981; }
        .bento-buscador input { flex: 1; border: none; background: transparent; color: var(--tinta); font-size: .95rem; padding: 10px 4px; outline: none; }
        .bento-buscador input::placeholder { color: var(--suave); }
        .bento-limpiar { border: none; background: #27272a; color: #f4f4f5; width: 26px; height: 26px; border-radius: 50%; font-size: .8rem; cursor: pointer; }
        .bento-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-bottom: 18px; }
        @media (min-width: 720px) { .bento-grid { grid-template-columns: 1.25fr 1fr 1fr; } }
        .bento-card { position: relative; min-height: 104px; border-radius: 18px; overflow: hidden; border: 1.5px solid #27272a; background-color: #141417; background-size: cover; background-position: center;
          padding: 14px; display: flex; flex-direction: column; justify-content: space-between; align-items: flex-start; text-align: left; color: #fff; font-family: inherit; cursor: pointer; transition: transform .18s, border-color .2s, box-shadow .2s; }
        .bento-card::before { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(9,9,11,.5) 0%, rgba(9,9,11,.84) 100%); transition: opacity .2s; }
        .bento-card > * { position: relative; z-index: 1; }
        .bento-card:hover { transform: translateY(-2px); border-color: #34d399; }
        .bento-card.activa { border-color: #34d399; box-shadow: 0 0 0 2px rgba(52,211,153,.35), 0 12px 28px rgba(0,0,0,.5); }
        .bento-card.grande { grid-row: span 2; min-height: 218px; }
        .bento-top { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 6px; }
        .bento-ico { width: 34px; height: 34px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: rgba(16,185,129,.22); border: 1px solid rgba(52,211,153,.45); font-size: 1.1rem; }
        .bento-badge { font-size: .68rem; font-weight: 800; padding: 3px 8px; border-radius: 999px; background: #fbbf24; color: #1c0b00; }
        .bento-cant { font-size: .72rem; font-weight: 700; padding: 2px 8px; border-radius: 999px; background: rgba(255,255,255,.14); color: #f4f4f5; }
        .bento-titulo { font-family: Georgia, serif; font-size: clamp(1rem, 3.2vw, 1.18rem); font-weight: 700; line-height: 1.15; margin: 0; color: #fff; text-shadow: 0 2px 6px rgba(0,0,0,.6); }
        .bento-sub { font-size: .76rem; color: #d4d4d8; margin-top: 2px; }
        .bento-destacados { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 18px; scroll-snap-type: x mandatory; }
        .bento-mini-card { flex: 0 0 min(330px, 88%); scroll-snap-align: start; display: flex; gap: 12px; align-items: center; padding: 10px; border-radius: 18px; background: var(--papel); border: 1px solid #27272a; box-shadow: 0 8px 24px rgba(0,0,0,.35); }
        .bento-mini-foto { width: 96px; height: 84px; border-radius: 12px; object-fit: cover; flex: none; background: #27272a; }
        .bento-mini-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
        .bento-mini-info strong { font-size: .95rem; line-height: 1.15; display: block; color: var(--tinta); }
        .bento-mini-btns { display: flex; gap: 6px; flex-wrap: wrap; }
        .bento-mini-btns a { text-decoration: none; font-size: .74rem; font-weight: 800; padding: 5px 10px; border-radius: 999px; }
        .bento-mini-wa { background: #10b981; color: #04261a; }
        .bento-mini-map { background: #27272a; color: #f4f4f5; border: 1px solid #3f3f46; }
        .colab-sec-titulo { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin: 6px 0 14px; font-family: Georgia, serif; font-size: 1.2rem; }

        @media (prefers-reduced-motion: reduce) {
          .vista-animada, .vista-animada.dir-izq, .vista-animada.dir-der, .bienvenida-capa, .bienvenida-card, .bienvenida-ave, .chat-capa, .chat-caja { animation: none; }
          .plumas-capa { display: none; }
        }
        .app .portada { border-radius: 0; padding: clamp(62px, 10vw, 96px) clamp(8px, 3vw, 24px) clamp(26px, 5vw, 42px); margin-bottom: 10px;
          background: transparent; position: relative; border: none; }
        .titulo-cartel-wrap { margin: 4px 0 6px; padding: 0; display: flex; align-items: center; }
        .titulo-cartel-img { width: min(100%, 440px); height: auto; display: block; filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.55)); }
        .app .portada .subtitulo { color: #fff; margin: 0; font-size: 1.05rem; text-shadow: 0 1px 6px rgba(0,0,0,.4); }
        .controles-top { position: absolute; top: 12px; right: 12px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
        .ctrl-top { height: 36px; min-width: 36px; padding: 0 10px; border-radius: 999px; border: 1px solid rgba(255,255,255,.28); background: rgba(9,9,11,.6);
          -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); color: #fff; font-size: .82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
        .ctrl-top.activo { background: #10b981; color: #04261a; border-color: #10b981; }
        .app button:focus-visible, .app select:focus-visible, .app input:focus-visible, .app a:focus-visible { outline: 3px solid #f2b705; outline-offset: 2px; }
        .clima-tira { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap;
          padding: 8px 14px; margin: 0 auto 18px; border-radius: 12px; background: var(--papel); border: 1px solid #27272a; font-size: .8rem; }
        .clima-etiq { font-weight: 700; color: var(--suave); white-space: nowrap; }
        .clima-dias { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .clima-chip { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 999px; background: var(--niebla); border: 1px solid #27272a; color: var(--tinta); white-space: nowrap; font-family: inherit; font-size: inherit; cursor: pointer; transition: border-color .2s; }
        .clima-chip:hover, .clima-chip.activo { border-color: #34d399; background: rgba(16,185,129,.14); }
        .clima-chip strong { font-weight: 700; color: var(--suave); font-size: .76rem; }
        .clima-chip span { font-weight: 700; }
        .clima-reintentar { border: 1px solid #3f3f46; background: transparent; color: var(--rio); border-radius: 999px; padding: 2px 9px; font-size: .76rem; font-weight: 700; cursor: pointer; }
        .caja { background: var(--papel); border-radius: 16px; padding: 20px; box-shadow: 0 2px 10px rgba(11,37,64,.12); }
        .caja h2 { margin: 0 0 14px; font-family: Georgia, serif; font-size: 1.35rem; }
        .form { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-bottom: 24px; }
        .campo label { display: block; font-weight: 700; margin-bottom: 6px; font-size: .92rem; }
        .campo select, .campo input[type="text"], .campo input[type="number"] { width: 100%; font-size: 1rem; padding: 10px 12px; border-radius: 8px; border: 2px solid var(--rio); background: var(--papel); color: var(--tinta); }
        .layout { display: grid; grid-template-columns: 1fr; gap: 24px; align-items: start; }
        @media (min-width: 900px) { .layout { grid-template-columns: 3fr 2fr; } .carrito { position: sticky; top: 16px; } }
        .paises { display: flex; flex-direction: column; gap: 14px; }
        .pais-bloque { background: var(--papel); border-radius: 16px; overflow: hidden; box-shadow: 0 2px 10px rgba(11,37,64,.12); border-left: 8px solid var(--c); }
        .pais-cab { width: 100%; display: flex; align-items: center; gap: 14px; padding: 16px 18px; border: none; background: transparent; color: var(--tinta); cursor: pointer; text-align: left; font-family: inherit; }
        .pais-bandera { font-size: 2.2rem; line-height: 1; }
        .medallon-acuarela-img { width: 46px; height: 46px; border-radius: 50%; object-fit: cover; flex-shrink: 0; border: 1.5px solid rgba(251, 191, 36, 0.42); box-shadow: 0 3px 12px rgba(0, 0, 0, 0.45); display: block; }
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
        .historias { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px; max-width: 540px; margin: 4px auto 22px; }
        .historia { display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 0; padding: 0; border: none; background: transparent; color: #a1a1aa; font-family: inherit; cursor: pointer; }
        .historia.activa { color: var(--tinta); }
        .aro { position: relative; width: min(64px, 14.8vw); height: min(64px, 14.8vw); padding: 3px; border-radius: 50%; background: #3f3f46; transition: transform .2s; }
        .historia:hover .aro { transform: scale(1.06); }
        .historia.activa .aro { background: linear-gradient(45deg, #f9ce34, #ee2a7b 55%, #6228d7); box-shadow: 0 0 18px rgba(238,42,123,.45); }
        .aro-interior { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 3px solid #09090b; background: radial-gradient(circle at 30% 25%, #2e2e35, #141417); font-size: clamp(1.2rem, 4.8vw, 1.7rem); }
        .aro-cont { position: absolute; top: -3px; right: -3px; min-width: 20px; height: 20px; padding: 0 5px; display: flex; align-items: center; justify-content: center; border-radius: 999px; border: 2px solid #09090b; background: #10b981; color: #04261a; font-size: .72rem; font-weight: 800; }
        .historia-titulo { font-size: clamp(.56rem, 2.35vw, .76rem); font-weight: 700; white-space: nowrap; }
        .agenda-cab { margin-bottom: 14px; }
        .agenda-cab h2 { margin: 0 0 4px; font-family: Georgia, serif; font-size: clamp(1.4rem, 4vw, 1.8rem); }
        .agenda-cab p { margin: 0; color: var(--suave); font-size: .92rem; }
        .agenda-filtros { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 16px; }
        .agenda-pill { flex: none; border: 1px solid #27272a; background: var(--papel); color: var(--tinta); border-radius: 999px; padding: 8px 14px; font-family: inherit; font-weight: 700; font-size: .84rem; cursor: pointer; white-space: nowrap; }
        .agenda-pill.activa { background: linear-gradient(135deg, #34d399, #10b981); color: #04261a; border-color: #10b981; }
        .agenda-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr)); gap: 18px; }
        .agenda-card { background: var(--papel); border: 1px solid #27272a; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 10px 28px rgba(0,0,0,.4); }
        .agenda-foto { width: 100%; height: 170px; object-fit: cover; display: block; background: #1c1c21; }
        .agenda-cuerpo { padding: 16px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .agenda-badge { align-self: flex-start; font-size: .74rem; font-weight: 800; padding: 3px 10px; border-radius: 999px; background: rgba(16,185,129,.16); color: #6ee7b7; border: 1px solid #065f46; }
        .agenda-cuerpo h3 { margin: 0; font-family: Georgia, serif; font-size: 1.15rem; }
        .agenda-meta { font-size: .84rem; color: var(--suave); display: grid; gap: 3px; }
        .agenda-desc { margin: 2px 0 6px; font-size: .9rem; line-height: 1.45; }
        .app.claro .agenda-pill, .app.claro .agenda-card { border-color: #d4d4d8; box-shadow: 0 6px 20px rgba(0,0,0,.07); }
        .app.claro .agenda-badge { color: #059669; border-color: #a7f3d0; }
        .caja, .pais-bloque, .mapa-tarjeta, .colab-card { box-shadow: 0 0 0 1px #27272a, 0 12px 32px rgba(0,0,0,.55); }
        .tarjeta, .combo { border: 1px solid #27272a; }
        .tarjeta-foto { background: #27272a; }
        .campo select, .campo input[type="text"], .campo input[type="number"], .asignar select { background: #1c1c21; border: 2px solid #27272a; color: #f4f4f5; }
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
        .app.claro { --tinta: #18181b; --rio: #059669; --niebla: #f4f4f5; --papel: #ffffff; --suave: #52525b; --fondo: #e4e4e7; color-scheme: light; background: #e4e4e7; color: #18181b; }
        .app.claro .bienvenida-capa { background: rgba(228,228,231,.65); }
        .app.claro .bienvenida-card { background: rgba(255,255,255,.97); border-color: #059669; box-shadow: 0 20px 50px rgba(0,0,0,.18); }
        .app.claro .bienvenida-card p { color: #3f3f46; }
        .app.claro .bienvenida-preg { color: #18181b !important; }
        .app.claro .bienvenida-sello { color: #059669; background: rgba(16,185,129,.12); border-color: #a7f3d0; }
        .app.claro .b-btn.no { background: #f4f4f5; color: #18181b; border-color: #d4d4d8; }
        .app.claro .chat-caja { border-color: #059669; box-shadow: 0 20px 50px rgba(0,0,0,.22); }
        .app.claro .chat-cab, .app.claro .chat-faqs, .app.claro .chat-form, .app.claro .chat-wa, .app.claro .chat-burbuja.bot { border-color: #d4d4d8; }
        .app.claro .chat-cerrar { background: #f4f4f5; color: #18181b; border-color: #d4d4d8; }
        .app.claro .chat-faq-btn, .app.claro .chat-form input { border-color: #cbd5e1; }
        .app.claro .chat-wa { color: #059669; }
        .app.claro .check-pill { border-color: #cbd5e1; background: #f8fafc; }
        .app.claro .check-pill.activo { border-color: #059669; background: rgba(16,185,129,.12); color: #065f46; }
        .app.claro .acc-nota { background: rgba(2,132,199,.08); }
        .app.claro .bento-buscador, .app.claro .bento-mini-card { border-color: #d4d4d8; box-shadow: 0 4px 16px rgba(0,0,0,.08); }
        .app.claro .bento-limpiar, .app.claro .bento-mini-map { background: #e4e4e7; color: #18181b; border-color: #cbd5e1; }
        .app.claro .portada { border-color: #d4d4d8; }
        .app.claro .clima-tira, .app.claro .clima-chip { border-color: #d4d4d8; }
        .app.claro .caja, .app.claro .pais-bloque, .app.claro .mapa-tarjeta, .app.claro .colab-card, .app.claro .tips-card, .app.claro .colab-vacio { box-shadow: 0 0 0 1px #d4d4d8, 0 8px 24px rgba(0,0,0,.08); border-color: #d4d4d8; }
        .app.claro .campo select, .app.claro .campo input[type="text"], .app.claro .campo input[type="number"], .app.claro .asignar select { background: #ffffff; border-color: #cbd5e1; color: #18181b; }
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

      <PlumasTransicion rafaga={rafagaPlumas} onFin={() => setRafagaPlumas(null)} />

      {!bienvenidaVista && <BienvenidaTangara primerNombre={primerNombre} onElegir={elegirBienvenida} />}

      <ChatTangara
        abierto={chatAbierto}
        onCerrar={() => setChatAbierto(false)}
        ctx={ctxChat}
        sonar={sonar}
      />

      <div className={`fondo-portada ${!bienvenidaVista ? "difuminado" : ""}`} aria-hidden="true">
        <img
          src="/fotos/portada.jpg"
          alt=""
          className="fondo-portada-img"
          style={{ transform: `translate3d(0, ${(scrollY * 0.28).toFixed(1)}px, 0) scale(${(1.03 + Math.min(0.07, scrollY * 0.00018)).toFixed(3)})` }}
        />
        <div className="fondo-portada-velo" />
      </div>

      <div className={`contenedor ${!bienvenidaVista ? "difuminado" : ""}`}>
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
          <h1 className="titulo-cartel-wrap"><img src={TITULO_CARTEL_IMG} alt="Iguazú Explora" className="titulo-cartel-img" /></h1>
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

        <div className="clima-tira" aria-label={t.climaTitulo}>
          <span className="clima-etiq">🌤️ {t.climaTitulo}</span>
          <div className="clima-dias">
            {climaEstado === "listo" && clima ? (
              clima.map((d, i) => (
                <button
                  key={d.fecha}
                  type="button"
                  className={`clima-chip ${diaClimaTip === i ? "activo" : ""}`}
                  title="Ver recomendación del Capitán Tangará para este día"
                  onClick={() => {
                    setDiaClimaTip(diaClimaTip === i ? null : i);
                    setModoTangara("guiado");
                    volarTangara();
                  }}
                >
                  <strong>{etiquetaDiaClima(d.fecha, i, t, idioma)}</strong>
                  <span aria-hidden="true">{iconoClima(d.code)}</span>
                  <span>{d.min}° / {d.max}°</span>
                </button>
              ))
            ) : climaEstado === "error" ? (
              <>
                <span className="clima-etiq">{t.climaError}</span>
                <button type="button" className="clima-reintentar" onClick={cargarClima}>↻</button>
              </>
            ) : (
              <span className="clima-etiq">{t.climaCargando}</span>
            )}
          </div>
        </div>

        {/* ---------- PESTAÑA 1: Destinos y Carrito ---------- */}
        {pestana === "destinos" && (
          <div key="destinos" className={`vista-animada dir-${dirVista}`}>
            {bienvenidaVista && dondeSePosa === "inicio" && <CapitanTangara modo={modoTangara} setModo={setModoTangara} volando={volandoTangara} mensaje={consejoTangara} onAbrirChat={() => setChatAbierto(true)} inline />}
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
                  <label htmlFor="origen">{t.origen}</label>
                  <input id="origen" type="text" placeholder={t.origenPh} autoComplete="address-level1" value={origen}
                    onChange={(e) => setOrigen(e.target.value)} />
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
                  <div className="grupo-checks">
                    <label className={`check-pill ${conChicos ? "activo" : ""}`}>
                      <input type="checkbox" checked={conChicos} onChange={(e) => {
                        const v = e.target.checked;
                        setConChicos(v);
                        setDiaClimaTip(null);
                        if (v) { setModoTangara("guiado"); volarTangara(); }
                      }} />
                      <span>{t.conChicos}</span>
                    </label>
                    <label className={`check-pill ${conMayores ? "activo" : ""}`}>
                      <input type="checkbox" checked={conMayores} onChange={(e) => {
                        const v = e.target.checked;
                        setConMayores(v);
                        setDiaClimaTip(null);
                        if (v) { setModoTangara("guiado"); volarTangara(); }
                      }} />
                      <span>{t.conMayores}</span>
                    </label>
                  </div>
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
                      {bienvenidaVista && dondeSePosa === `pais-${pais}` && <CapitanTangara modo={modoTangara} setModo={setModoTangara} volando={volandoTangara} mensaje={consejoTangara} onAbrirChat={() => setChatAbierto(true)} inline />}
                      <div className="pais-bloque" style={{ "--c": datos.color }}>
                        <button className="pais-cab" aria-expanded={abierto} onClick={() => { setPaisAbierto(abierto ? null : pais); setExpandidas({}); setCombosExpandidos({}); if (modoTangara === "guiado") volarTangara(); }}>
                          <MedallonAcuarela tipo={datos.tipoIcono} alt={pais} />
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

                {bienvenidaVista && dondeSePosa === "pais-accesible" && <CapitanTangara modo={modoTangara} setModo={setModoTangara} volando={volandoTangara} mensaje={consejoTangara} onAbrirChat={() => setChatAbierto(true)} inline />}
                <div className="pais-bloque" style={{ "--c": "#0284c7" }}>
                  <button className="pais-cab" aria-expanded={paisAbierto === "accesible"} onClick={() => { setPaisAbierto(paisAbierto === "accesible" ? null : "accesible"); setExpandidas({}); setCombosExpandidos({}); if (modoTangara === "guiado") volarTangara(); }}>
                    <MedallonAcuarela tipo="accesible" alt={t.accesibleTitulo} />
                    <span>
                      <span className="pais-nombre">{t.accesibleTitulo}</span>
                      <span className="pais-cant">{listaAccesible.length} opciones · {t.accesibleSub}</span>
                    </span>
                    <span className={`pais-flecha ${paisAbierto === "accesible" ? "abierta" : ""}`} aria-hidden="true">▼</span>
                  </button>

                  {paisAbierto === "accesible" && (
                    <div className="pais-cuerpo">
                      {listaAccesible.map((a) => {
                        const keyAcc = `acc-${a.id}`;
                        const agregado = carrito.some((x) => x.id === a.id);
                        const abierta = !!expandidas[keyAcc];
                        return (
                          <div key={keyAcc} className={`act ${abierta ? "abierta" : ""} ${agregado ? "conectada" : ""}`}>
                            <BarraResumen
                              foto={a.foto}
                              nombre={`${PAISES[a.pais]?.bandera || ""} ${a.nombre}`}
                              meta={`${a.pais} · ⏱ ${a.horas} hs · 🎟️ ${textoEntrada(a.entrada, divisa)}`}
                              tags={a.tags}
                              conectado={agregado}
                              abierto={abierta}
                              onClick={() => setExpandidas({ ...expandidas, [keyAcc]: !abierta })}
                            />
                            {abierta && (
                              <div className="tarjeta">
                                <Foto className="tarjeta-foto" src={a.foto} alt={a.nombre} />
                                <div className="tarjeta-cuerpo">
                                  <p className="acc-nota"><strong>♿ Accesibilidad:</strong> {a.accesible}</p>
                                  <p className="desc">{a.desc}</p>
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
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {bienvenidaVista && dondeSePosa === "pais-aventura" && <CapitanTangara modo={modoTangara} setModo={setModoTangara} volando={volandoTangara} mensaje={consejoTangara} onAbrirChat={() => setChatAbierto(true)} inline />}
                <div className="pais-bloque" style={{ "--c": "#d97706" }}>
                  <button className="pais-cab" aria-expanded={paisAbierto === "aventura"} onClick={() => { setPaisAbierto(paisAbierto === "aventura" ? null : "aventura"); setExpandidas({}); setCombosExpandidos({}); if (modoTangara === "guiado") volarTangara(); }}>
                    <MedallonAcuarela tipo="aventura" alt="Turismo Aventura" />
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
                          `\n\n*Datos del viaje*` +
                          (origenTxt ? `\n- De dónde vengo: ${origenTxt}` : "") +
                          `\n- Días de estadía: ${dias}\n- Personas: ${personas}${grupoExtras ? ` (${grupoExtras})` : ""}` +
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
                {bienvenidaVista && dondeSePosa === "carrito" && <CapitanTangara modo={modoTangara} setModo={setModoTangara} volando={volandoTangara} mensaje={consejoTangara} onAbrirChat={() => setChatAbierto(true)} inline />}
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
            {bienvenidaVista && (
              <CapitanTangara
                modo={modoTangara === "libre" ? "guiado" : modoTangara}
                setModo={setModoTangara}
                volando={volandoTangara}
                mensaje={consejoTangara}
                onAbrirChat={() => setChatAbierto(true)}
                inline
              />
            )}
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

        {/* ---------- PESTAÑA 3: Colaboradores (Bento Grid Opción 1) ---------- */}
        {pestana === "colab" && (
          <section key="colab" className={`vista-animada dir-${dirVista}`}>
            {bienvenidaVista && (
              <CapitanTangara
                modo={modoTangara === "libre" ? "guiado" : modoTangara}
                setModo={setModoTangara}
                volando={volandoTangara}
                mensaje={consejoTangara}
                botonesRapidos={botonesColabTangara}
                onAbrirChat={() => setChatAbierto(true)}
                inline
              />
            )}

            <div className="bento-buscador">
              <span aria-hidden="true">🔍</span>
              <input
                type="text"
                value={busquedaColab}
                onChange={(e) => setBusquedaColab(e.target.value)}
                placeholder="Buscar hotel, restaurante o actividad..."
                aria-label="Buscar colaboradores"
              />
              {busquedaColab && (
                <button type="button" className="bento-limpiar" onClick={() => setBusquedaColab("")} aria-label="Limpiar búsqueda">✕</button>
              )}
            </div>

            {!qColab && (
              <div className="bento-grid" role="tablist" aria-label="Categorías de colaboradores">
                {CATEGORIAS_COLAB.map((cat) => {
                  const listaCat = COLABORADORES.filter((c) => c.tipo === cat.id);
                  const tienePromo = listaCat.some((c) => c.promo && c.promo.trim());
                  const primero = listaCat[0];
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      role="tab"
                      aria-selected={colabCat === cat.id}
                      className={`bento-card ${cat.grande ? "grande" : ""} ${colabCat === cat.id ? "activa" : ""}`}
                      style={{ backgroundImage: `url('${cat.foto}')` }}
                      onClick={() => seleccionarBento(cat.id)}
                    >
                      <div className="bento-top">
                        <span className="bento-ico" aria-hidden="true">{cat.icono}</span>
                        {tienePromo ? (
                          <span className="bento-badge">Promo activa</span>
                        ) : (
                          <span className="bento-cant">{listaCat.length > 0 ? `${listaCat.length} aliado${listaCat.length > 1 ? "s" : ""}` : "Pronto"}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="bento-titulo">{cat.titulo}</h3>
                        {cat.grande && primero && <span className="bento-sub">{primero.nombre}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {!qColab && destacadosColab.length > 0 && (
              <div className="bento-destacados" aria-label="Aliados destacados">
                {destacadosColab.map((d) => (
                  <div key={`dest-${d.id}`} className="bento-mini-card">
                    <Foto className="bento-mini-foto" src={d.fotos[0]} alt={d.nombre} />
                    <div className="bento-mini-info">
                      <strong>{d.nombre}</strong>
                      <div className="bento-mini-btns">
                        <a
                          className="bento-mini-wa"
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`https://wa.me/${d.whatsapp}?text=${encodeURIComponent(`Hola!${primerNombre ? ` Soy ${primerNombre},` : ""} los contacto desde la web de ${GUIA.nombre}. Quiero consultar disponibilidad en ${d.nombre} para ${personas} ${personas === 1 ? "persona" : "personas"} (${dias} ${dias === 1 ? "día" : "días"}).`)}`}
                        >
                          💬 WhatsApp
                        </a>
                        <a
                          className="bento-mini-map"
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.mapa)}`}
                        >
                          📍 Ubicación
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div ref={refColabLista} key={qColab ? `busq-${qColab}` : colabCat} className="vista-animada">
              <div className="colab-sec-titulo">
                <span>
                  {qColab
                    ? `🔎 Resultados para «${busquedaColab}»`
                    : `${CATEGORIAS_COLAB.find((c) => c.id === colabCat)?.icono} ${CATEGORIAS_COLAB.find((c) => c.id === colabCat)?.titulo}`}
                </span>
              </div>

              {colabsDeCategoria.length === 0 ? (
                <div className="colab-vacio">
                  <h3>
                    {qColab
                      ? "No encontramos coincidencias"
                      : `${CATEGORIAS_COLAB.find((c) => c.id === colabCat)?.icono} ${CATEGORIAS_COLAB.find((c) => c.id === colabCat)?.titulo}`}
                  </h3>
                  <p>
                    {qColab
                      ? "Probá con otra palabra o escribinos por WhatsApp para que te recomendemos opciones de confianza según tu estadía."
                      : "Muy pronto vamos a ir sumando aliados verificados en esta sección. Mientras tanto, escribinos por WhatsApp y te recomendamos opciones de confianza según tu estadía."}
                  </p>
                  <a
                    className="btn-whatsapp"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://wa.me/${GUIA.whatsapp}?text=${encodeURIComponent(`Hola Alan!${primerNombre ? ` Soy ${primerNombre}.` : ""} Estoy viendo la sección de ${CATEGORIAS_COLAB.find((c) => c.id === colabCat)?.titulo || "Colaboradores"} en App Iguazú y quería pedirte recomendaciones para ${personas} ${personas === 1 ? "persona" : "personas"} (${dias} ${dias === 1 ? "día" : "días"}).`)}`}
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
                            href={`https://wa.me/${c.whatsapp}?text=${encodeURIComponent(`Hola!${primerNombre ? ` Soy ${primerNombre},` : ""} los contacto desde la web de ${GUIA.nombre}. Quiero consultar disponibilidad en ${c.nombre} para ${personas} ${personas === 1 ? "persona" : "personas"} y una estadía de ${dias} ${dias === 1 ? "día" : "días"}.`)}`}>
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

        {/* ---------- PESTAÑA 4: Agenda Cultural ---------- */}
        {pestana === "agenda" && (
          <section key="agenda" className={`vista-animada dir-${dirVista}`}>
            {bienvenidaVista && (
              <CapitanTangara
                modo={modoTangara === "libre" ? "guiado" : modoTangara}
                setModo={setModoTangara}
                volando={volandoTangara}
                mensaje={consejoTangara}
                onAbrirChat={() => setChatAbierto(true)}
                inline
              />
            )}

            <div className="agenda-cab">
              <h2>🎭 Agenda Cultural</h2>
              <p>Eventos, ferias municipales, música en vivo, muestras y maratones compartidos por nuestros colaboradores.</p>
            </div>

            <div className="agenda-filtros" role="tablist" aria-label="Categorías de Agenda Cultural">
              {CATEGORIAS_AGENDA.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={agendaCat === cat.id}
                  className={`agenda-pill ${agendaCat === cat.id ? "activa" : ""}`}
                  onClick={() => setAgendaCat(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {(() => {
              const eventos = AGENDA_CULTURAL.filter((ev) => agendaCat === "todos" || ev.categoria === agendaCat);
              if (eventos.length === 0) {
                return (
                  <div className="colab-vacio">
                    <h3>🎭 Agenda Cultural de las Tres Fronteras</h3>
                    <p>
                      Muy pronto vas a encontrar acá las ferias municipales, fechas de música en vivo, muestras de arte, maratones y eventos locales que nos envían nuestros colaboradores.
                    </p>
                    <a
                      className="btn-whatsapp"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://wa.me/${GUIA.whatsapp}?text=${encodeURIComponent(`Hola Alan!${primerNombre ? ` Soy ${primerNombre}.` : ""} Quería consultar qué eventos o ferias hay esta semana en Puerto Iguazú (o enviar un evento para la Agenda Cultural).`)}`}
                    >
                      Consultar agenda de esta semana por WhatsApp
                    </a>
                  </div>
                );
              }
              return (
                <div className="agenda-grid">
                  {eventos.map((ev) => (
                    <article key={ev.id} className="agenda-card">
                      {ev.foto && <Foto className="agenda-foto" src={ev.foto} alt={ev.titulo} />}
                      <div className="agenda-cuerpo">
                        <span className="agenda-badge">
                          {CATEGORIAS_AGENDA.find((c) => c.id === ev.categoria)?.label || "🎭 Evento"}
                        </span>
                        <h3>{ev.titulo}</h3>
                        <div className="agenda-meta">
                          <span>📅 {ev.fecha}</span>
                          <span>📍 {ev.lugar}</span>
                          {ev.entrada && <span>🎟️ {ev.entrada}</span>}
                          {ev.organiza && <span>🤝 Invita: {ev.organiza}</span>}
                        </div>
                        <p className="agenda-desc">{ev.descripcion}</p>
                        <div className="mapa-botones">
                          {ev.mapa && (
                            <a
                              className="btn-link"
                              target="_blank"
                              rel="noopener noreferrer"
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.mapa)}`}
                            >
                              📍 Cómo llegar
                            </a>
                          )}
                          <a
                            className="btn-whatsapp"
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`https://wa.me/${GUIA.whatsapp}?text=${encodeURIComponent(`Hola Alan!${primerNombre ? ` Soy ${primerNombre}.` : ""} Quería consultar por el evento "${ev.titulo}" de la Agenda Cultural.`)}`}
                          >
                            Consultar
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              );
            })()}
            <p className="nota">¿Sos colaborador, organizás un evento, feria o show y querés difundirlo acá? Envianos la info por WhatsApp desde Contactos.</p>
          </section>
        )}

        {/* ---------- PESTAÑA 5: Contacto del Guía ---------- */}
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

      {bienvenidaVista && carrito.length > 0 && !(pestana === "destinos" && carritoVisible) && (
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
      {bienvenidaVista && (dondeSePosa === "pestana" || (modoTangara === "libre" && pestana !== "mapas" && pestana !== "colab" && pestana !== "agenda")) && (
        <CapitanTangara modo={modoTangara} setModo={setModoTangara} volando={volandoTangara} mensaje={consejoTangara} onAbrirChat={() => setChatAbierto(true)} inline={false} />
      )}
    </div>
  );
}