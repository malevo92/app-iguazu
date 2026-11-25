import { useState, useEffect, useRef, Fragment } from "react";

const STORAGE_KEY = "app_iguazu_v1";
const ORDEN_PESTANAS = ["inicio", "destinos", "mapas", "colab", "agenda", "guia"];

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

const FLYER_AUTOS_MERCOSUR = "data:image/webp;base64,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";

const AGENDA_CULTURAL = [
  {
    id: "ev-barrageiro-2026",
    categoria: "eventos",
    titulo: "2° Aniversario del Mercado Público Barrageiro",
    fecha: "Domingo 29 de noviembre · 11:30 a 22:00 hs",
    fechaFin: "2026-11-29",
    lugar: "Mercado Público Barrageiro, Foz do Iguaçu (Brasil)",
    mapa: "Mercado Público Barrageiro, Foz do Iguaçu, Paraná, Brasil",
    entrada: "Entrada gratuita",
    foto: "data:image/webp;base64,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",
    organiza: "Mercado Público Barrageiro · Itaipu Parquetec",
    descripcion: "Festejo abierto por los dos años del mercado gastronómico y cultural de Foz do Iguaçu, con comidas regionales, feria de artesanías, talleres de cocina y pintura, bingo comunitario, juegos para chicos y corte de torta.",
  },
  {
    id: "ev-somos-selva-2026",
    categoria: "eventos",
    titulo: "Festival Somos la Selva – Día del Yaguareté",
    fecha: "Domingo 29 de noviembre · 18:00 a 21:00 hs",
    fechaFin: "2026-11-29",
    lugar: "Plaza del Bicentenario Gral. San Martín, Wanda (Misiones)",
    mapa: "Plaza del Bicentenario, Wanda, Misiones, Argentina",
    entrada: "Entrada libre y gratuita",
    foto: "data:image/webp;base64,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",
    organiza: "Fundación Vida Silvestre y Municipalidad de Wanda",
    descripcion: "Sexta edición del festival familiar para celebrar al yaguareté y la selva misionera, con teatro infantil, títeres, danza urbana, música en vivo de Mboyeré Trío, feria de artesanos y puestos gastronómicos.",
  },
  {
    id: "ev-autos-mercosur-2026",
    categoria: "eventos",
    titulo: "2° Encuentro de Autos Antiguos del Mercosur",
    fecha: "12 y 13 de diciembre",
    fechaFin: "2026-12-13", // Se oculta automáticamente al pasar esta fecha (AAAA-MM-DD)
    lugar: "Costanera Eduardo Arrabal, Puerto Iguazú",
    mapa: "Costanera Eduardo Arrabal, Puerto Iguazú, Misiones, Argentina",
    entrada: "Entrada gratuita (colaboración solidaria: alimentos no perecederos o leche)",
    foto: FLYER_AUTOS_MERCOSUR,
    organiza: "Encuentro de Autos Antiguos del Mercosur",
    descripcion: "Dos jornadas frente al río con exposición de autos y motos clásicas, música en vivo, sorteos y actividades para disfrutar en familia.",
  },
];

const POLITICA_SENA = "El 50% de seña previa corresponde exclusivamente a los servicios de traslados y guías para confirmar tu reserva (el 50% restante se abona en persona al encontrarse en destino).";
const POLITICA_ENTRADAS = "Importante: Los tickets/entradas a cada parque o atractivo NO están incluidos en el traslado y se abonan directamente en la boletería de cada lugar (o en su web oficial).";
const HORAS_POR_DIA = 8;
const HORAS_CON_COMBOS = 10;
const MAX_COMBOS = 3;

const FONDOS_ATRACTIVOS = {
  1: "/fondos/fondo-cataratas-arg.png",
  2: "/fondos/fondo-cataratas-br.png",
  3: "/fondos/fondo-parque-aves.png",
  4: "/fondos/fondo-itaipu.png",
  5: "/fondos/fondo-wanda.png",
  6: "/fondos/fondo-ciudad-este.png",
  7: "/fondos/fondo-hito.png",
  8: "/fondos/fondo-guiraoga.png",
  9: "/fondos/fondo-aripuca.png",
  10: "/fondos/fondo-san-ignacio.png",
  11: "/fondos/fondo-templo-budista.png",
  12: "/fondos/fondo-saltos-monday.png",
};

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

function BienvenidaTangara({
  t,
  nombreTurista, setNombreTurista,
  origen, setOrigen,
  dias, cambiarDias,
  personas, setPersonas,
  conChicos, setConChicos,
  adultos, setAdultos,
  ninos, setNinos,
  conMayores, setConMayores,
  movilidad, setMovilidad,
  hotel, setHotel,
  divisa, setDivisa,
  onCompletar,
}) {
  const [paso, setPaso] = useState(0);
  const [avisoForm, setAvisoForm] = useState("");

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
    const iv = setInterval(() => setPaso((p) => (p + 1) % POSES_BIENVENIDA.length), 340);
    return () => clearInterval(iv);
  }, []);

  const ingresar = (e) => {
    e.preventDefault();
    if (!nombreTurista.trim()) {
      setAvisoForm("Escribí al menos tu nombre así Capitán Tangará te saluda y personaliza tu viaje 😊");
      return;
    }
    setAvisoForm("");
    onCompletar("guiado");
  };

  return (
    <div className="bienvenida-capa" role="dialog" aria-modal="true" aria-labelledby="bienv-titulo">
      <div
        className="bienvenida-card bienvenida-onboarding"
        style={{ backgroundImage: `linear-gradient(180deg, rgba(250,252,249,0.52) 0%, rgba(250,252,249,0.78) 46%, rgba(250,252,249,0.88) 100%), url(${FONDO_INICIO_ACUARELA})` }}
      >
        <img
          className="bienvenida-ave"
          src={POSES_BIENVENIDA[paso]}
          alt="Capitán Tangará dándote la bienvenida"
        />
        <h2 id="bienv-titulo">¡Bienvenido a Iguazú Explora!</h2>
        <p>
          Soy el <strong>Capitán Tangará</strong>, tu anfitrión en la selva misionera. Acá vas a poder armar tu itinerario por Argentina, Brasil y Paraguay con tiempos reales, mapas ilustrados, agenda cultural y el clima al día.
        </p>
        <p className="bienvenida-preg">Contame un poco de tu viaje para personalizar toda la app:</p>

        <form className="bienvenida-form" onSubmit={ingresar}>
          <div className="b-campo">
            <label htmlFor="b-nombre">{t.nombre} *</label>
            <input
              id="b-nombre"
              type="text"
              placeholder="Ej: Sofía Gómez"
              autoComplete="name"
              value={nombreTurista}
              onChange={(e) => { setNombreTurista(e.target.value); if (e.target.value.trim()) setAvisoForm(""); }}
            />
          </div>

          <div className="b-campo">
            <label htmlFor="b-origen">{t.origen}</label>
            <input
              id="b-origen"
              type="text"
              placeholder={t.origenPh}
              value={origen}
              onChange={(e) => setOrigen(e.target.value)}
            />
          </div>

          <div className="b-fila-2">
            <div className="b-campo">
              <label htmlFor="b-dias">{t.dias}</label>
              <select id="b-dias" value={dias} onChange={(e) => cambiarDias(Number(e.target.value))}>
                {[1, 2, 3, 4, 5, 6, 7].map((n) => <option key={n} value={n}>{n} {n === 1 ? "día" : "días"}</option>)}
              </select>
            </div>
            <div className="b-campo">
              <label htmlFor="b-personas">{t.personas}</label>
              <input
                id="b-personas"
                type="number"
                min={conChicos ? 2 : 1}
                max="50"
                value={personas}
                onChange={(e) => {
                  const p = Math.min(50, Math.max(conChicos ? 2 : 1, Math.floor(Number(e.target.value)) || 1));
                  setPersonas(p);
                  if (conChicos) {
                    const nk = Math.min(Math.max(1, ninos), p - 1);
                    setNinos(nk);
                    setAdultos(p - nk);
                  } else {
                    setAdultos(p);
                    setNinos(0);
                  }
                }}
              />
            </div>
          </div>

          <div className="grupo-checks">
            <label className={`check-pill ${conChicos ? "activo" : ""}`}>
              <input
                type="checkbox"
                checked={conChicos}
                onChange={(e) => {
                  const v = e.target.checked;
                  setConChicos(v);
                  if (v) {
                    const p = Math.max(2, personas);
                    const nk = Math.min(Math.max(1, ninos || 1), p - 1);
                    setPersonas(p);
                    setNinos(nk);
                    setAdultos(p - nk);
                  } else {
                    setAdultos(personas);
                    setNinos(0);
                  }
                }}
              />
              <span>{t.conChicos}</span>
            </label>

            {conChicos && (
              <div className="desglose-chicos">
                <div>
                  <label htmlFor="b-adultos">Adultos</label>
                  <input
                    id="b-adultos"
                    type="number"
                    min="1"
                    max={Math.max(1, personas - 1)}
                    value={adultos}
                    onChange={(e) => {
                      const a = Math.min(Math.max(1, personas - 1), Math.max(1, Math.floor(Number(e.target.value)) || 1));
                      setAdultos(a);
                      setNinos(Math.max(1, personas - a));
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="b-ninos">Niños</label>
                  <input
                    id="b-ninos"
                    type="number"
                    min="1"
                    max={Math.max(1, personas - 1)}
                    value={ninos}
                    onChange={(e) => {
                      const k = Math.min(Math.max(1, personas - 1), Math.max(1, Math.floor(Number(e.target.value)) || 1));
                      setNinos(k);
                      setAdultos(Math.max(1, personas - k));
                    }}
                  />
                </div>
              </div>
            )}

            <label className={`check-pill ${conMayores ? "activo" : ""}`}>
              <input
                type="checkbox"
                checked={conMayores}
                onChange={(e) => setConMayores(e.target.checked)}
              />
              <span>{t.conMayores}</span>
            </label>
          </div>

          <div className="b-campo">
            <label htmlFor="b-movilidad">{t.movilidad}</label>
            <select id="b-movilidad" value={movilidad} onChange={(e) => setMovilidad(e.target.value)}>
              <option value="no">{t.movNo}</option>
              <option value="si">{t.movSi}</option>
            </select>
          </div>

          <div className="b-fila-2">
            <div className="b-campo">
              <label htmlFor="b-hotel">{t.hotel}</label>
              <input
                id="b-hotel"
                type="text"
                placeholder="Nombre del hotel"
                value={hotel}
                onChange={(e) => setHotel(e.target.value)}
              />
            </div>
            <div className="b-campo">
              <label htmlFor="b-divisa">Moneda</label>
              <select id="b-divisa" value={divisa} onChange={(e) => setDivisa(e.target.value)}>
                {Object.entries(MONEDAS).map(([codigo, m]) => <option key={codigo} value={codigo}>{codigo} ({m.simbolo})</option>)}
              </select>
            </div>
          </div>

          {avisoForm && <p className="aviso-nombre" role="alert">{avisoForm}</p>}

          <div className="bienvenida-botones">
            <button type="submit" className="b-btn si">
              🧭 Comenzar mi viaje →
            </button>
            <button type="button" className="b-btn no" onClick={() => onCompletar("libre")}>
              Omitir y explorar por mi cuenta
            </button>
          </div>
        </form>
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

const FONDO_INICIO_ACUARELA = "data:image/webp;base64,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";

const ICONOS_MEDALLON = {
  ar: "data:image/webp;base64,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",
  br: "data:image/webp;base64,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",
  py: "data:image/webp;base64,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",
  accesible: "data:image/webp;base64,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",
  aventura: "data:image/webp;base64,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",
};

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

function FondoAtractivoDinamico({ src, modoClaro }) {
  const [estado, setEstado] = useState("cargando");

  useEffect(() => {
    if (!src) { setEstado("vacio"); return; }
    setEstado("cargando");
  }, [src]);

  if (!src || estado === "error") return null;

  return (
    <div className={`fondo-atractivo-capa ${estado === "listo" ? "visible" : ""} ${modoClaro ? "claro" : ""}`} aria-hidden="true">
      {!modoClaro && <div className="fondo-atractivo-halo" />}
      <img
        key={src}
        src={src}
        alt=""
        className="fondo-atractivo-img"
        onLoad={() => setEstado("listo")}
        onError={() => setEstado("error")}
      />
    </div>
  );
}

const TX_INICIO = {
  es: {
    locale: "es-AR",
    hola: "¡Hola, explorador!",
    globoNombre: (n) => `¡Hola ${n}! Aventuras te esperan hoy`,
    globo: "¡Aventuras te esperan hoy!",
    preguntar: "💬 Tocá para preguntarme",
    tituloChat: "Hablar con el Capitán Tangará",
    clima: (min, max, cielo) => `Iguazú hoy: ${min}° / ${max}° · ${cielo}`,
    climaCargando: "Consultando clima en Iguazú...",
    climaError: "Clima no disponible por ahora",
    cielo: { despejado: "Soleado", parcial: "Parcialmente nublado", nublado: "Nublado", niebla: "Niebla", lluvia: "Lluvia", tormenta: "Tormenta" },
    cataratas: "Cataratas abiertas · Caudal normal",
    horario: "Horario de ingreso del Parque: 08:00 a 18:00 hs",
    cta: "INGRESAR A LOS PASEOS →",
    enViaje: (n) => `${n} en tu viaje`,
    agenda: { t: "AGENDA CULTURAL", s: "Eventos, ferias y música" },
    mapas: { t: "MAPAS ILUSTRADOS", s: "Recorridos en acuarela" },
    colab: { t: "COLABORADORES", s: "Hoteles, guías y más" },
    guia: { t: "INFO Y CONTACTO", s: "Consultas por WhatsApp" },
  },
  pt: {
    locale: "pt-BR",
    hola: "Olá, explorador!",
    globoNombre: (n) => `Olá ${n}! Aventuras te esperam hoje`,
    globo: "Aventuras te esperam hoje!",
    preguntar: "💬 Toque para me perguntar",
    tituloChat: "Falar com o Capitão Tangará",
    clima: (min, max, cielo) => `Iguaçu hoje: ${min}° / ${max}° · ${cielo}`,
    climaCargando: "Consultando o clima em Iguaçu...",
    climaError: "Clima indisponível por enquanto",
    cielo: { despejado: "Ensolarado", parcial: "Parcialmente nublado", nublado: "Nublado", niebla: "Neblina", lluvia: "Chuva", tormenta: "Tempestade" },
    cataratas: "Cataratas abertas · Vazão normal",
    horario: "Horário de entrada do Parque: 08:00 às 18:00 h",
    cta: "ENTRAR NOS PASSEIOS →",
    enViaje: (n) => `${n} na sua viagem`,
    agenda: { t: "AGENDA CULTURAL", s: "Eventos, feiras e música" },
    mapas: { t: "MAPAS ILUSTRADOS", s: "Roteiros em aquarela" },
    colab: { t: "PARCEIROS", s: "Hotéis, guias e mais" },
    guia: { t: "INFO E CONTATO", s: "Consultas pelo WhatsApp" },
  },
  en: {
    locale: "en-US",
    hola: "Hello, explorer!",
    globoNombre: (n) => `Hello ${n}! Adventures await you today`,
    globo: "Adventures await you today!",
    preguntar: "💬 Tap to ask me",
    tituloChat: "Talk to Captain Tangará",
    clima: (min, max, cielo) => `Iguazú today: ${min}° / ${max}° · ${cielo}`,
    climaCargando: "Checking the weather in Iguazú...",
    climaError: "Weather not available right now",
    cielo: { despejado: "Sunny", parcial: "Partly cloudy", nublado: "Cloudy", niebla: "Fog", lluvia: "Rain", tormenta: "Storm" },
    cataratas: "Falls open · Normal water flow",
    horario: "Park entry hours: 08:00 to 18:00",
    cta: "EXPLORE THE TOURS →",
    enViaje: (n) => `${n} in your trip`,
    agenda: { t: "CULTURAL EVENTS", s: "Events, fairs and music" },
    mapas: { t: "ILLUSTRATED MAPS", s: "Watercolor routes" },
    colab: { t: "PARTNERS", s: "Hotels, guides and more" },
    guia: { t: "INFO & CONTACT", s: "Questions via WhatsApp" },
  },
};

const iconoClimaHoy = (code) => {
  if (code === 0) return "☀️";
  if (code === 1 || code === 2) return "⛅";
  if (code === 3) return "☁️";
  if (code === 45 || code === 48) return "🌫️";
  if (code >= 95) return "⛈️";
  if (code >= 51 && code <= 82) return "🌧️";
  return "🌤️";
};

const cieloDeHoy = (code, c) => {
  if (code === 0) return c.despejado;
  if (code <= 2) return c.parcial;
  if (code === 3) return c.nublado;
  if (code === 45 || code === 48) return c.niebla;
  if (code >= 95) return c.tormenta;
  if (code >= 51 && code <= 82) return c.lluvia;
  return c.parcial;
};

function PantallaInicio({
  primerNombre,
  clima,
  climaEstado,
  onNavegar,
  onAbrirChat,
  cantidadCarrito,
  modoClaro,
  idioma = "es",
  controles = null,
}) {
  const tx = TX_INICIO[idioma] || TX_INICIO.es;
  const fecha = new Date().toLocaleDateString(tx.locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const hoyTexto = idioma === "en" ? fecha : fecha.replace(",", "");

  const climaHoy = climaEstado === "listo" && clima?.[0] ? clima[0] : null;
  const textoClima = climaHoy
    ? `${climaHoy.max}°C · ${cieloDeHoy(climaHoy.code, tx.cielo)} (${climaHoy.min}° / ${climaHoy.max}°)`
    : climaEstado === "error" ? tx.climaError : tx.climaCargando;

  const accesos = [
    { id: "agenda", ico: "📅", ...tx.agenda, hoja: true },
    { id: "mapas", ico: "🌿", ...tx.mapas, hoja: true },
    { id: "colab", ico: "⭐", ...tx.colab },
    { id: "guia", ico: "ℹ️", ...tx.guia },
  ];

  return (
    <section
      className={`inicio-papel ${modoClaro ? "claro" : ""}`}
      style={{
        backgroundImage: modoClaro
          ? `url(${FONDO_INICIO_ACUARELA})`
          : `linear-gradient(180deg, rgba(10, 18, 15, 0.8) 0%, rgba(9, 13, 12, 0.86) 100%), url(${FONDO_INICIO_ACUARELA})`,
      }}
    >
      {controles && <div className="inicio-top">{controles}</div>}

      <header className="inicio-cabecera">
        <p className="inicio-hola">{tx.hola}</p>
        <h1 className="inicio-marca-typo">IGUAZÚ EXPLORA</h1>
      </header>

      <div className="inicio-escena">
        <div
          className="inicio-ave-wrap"
          onClick={onAbrirChat}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onAbrirChat(); }}
          title={tx.tituloChat}
        >
          <img
            src="/fotos/asistente-posado.png"
            alt="Capitán Tangará"
            className="inicio-ave"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        </div>
        <button type="button" className="inicio-globo" onClick={onAbrirChat}>
          {primerNombre ? tx.globoNombre(primerNombre) : tx.globo}
          <small>{tx.preguntar}</small>
        </button>
      </div>

      <div className="inicio-glass">
        <div className="inicio-fecha">{hoyTexto}</div>
        <div className="inicio-fila">
          <span className="inicio-ico ico-sol">{climaHoy ? iconoClimaHoy(climaHoy.code) : "☀️"}</span>
          <span>{textoClima}</span>
        </div>
        <div className="inicio-fila">
          <span className="inicio-ico ico-ok">✓</span>
          <span>{tx.cataratas}</span>
        </div>
        <div className="inicio-fila">
          <span className="inicio-ico ico-hora">🕒</span>
          <span>{tx.horario}</span>
        </div>
      </div>

      <button type="button" className="inicio-cta" onClick={() => onNavegar("destinos")}>
        <span>{tx.cta}</span>
        {cantidadCarrito > 0 ? (
          <span className="inicio-cta-badge">{tx.enViaje(cantidadCarrito)}</span>
        ) : (
          <span className="inicio-cta-ico" aria-hidden="true">🗺️</span>
        )}
      </button>

      <div className="inicio-grid">
        {accesos.map((a) => (
          <button key={a.id} type="button" className={`inicio-card-btn ${a.hoja ? "con-hoja" : ""}`} onClick={() => onNavegar(a.id)}>
            <div>
              <strong>{a.t}</strong>
              <small>{a.s}</small>
            </div>
            <span className="inicio-card-ico" aria-hidden="true">{a.ico}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function BarraInferior({ pestana, onNavegar, cantidadCarrito, modoClaro }) {
  const items = [
    { id: "inicio", icono: "🏠", label: "Inicio" },
    { id: "destinos", icono: "🏞️", label: "Paseos", badge: cantidadCarrito },
    { id: "mapas", icono: "🗺️", label: "Mapas" },
    { id: "agenda", icono: "🎭", label: "Agenda" },
    { id: "guia", icono: "💬", label: "Contacto" },
  ];

  return (
    <nav className={`nav-inf ${modoClaro ? "claro" : ""}`} aria-label="Navegación principal">
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

export default function App() {
  const guardado = useRef(cargarGuardado()).current;

  // ---------- ESTADO ----------
  const [pestana, setPestana] = useState("inicio");
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
  const [bienvenidaVista, setBienvenidaVista] = useState(Boolean(guardado.onboardingV2));
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
  const [adultos, setAdultos] = useState(() => guardado.adultos ?? Math.max(1, (guardado.personas || 2) - (guardado.conChicos ? 1 : 0)));
  const [ninos, setNinos] = useState(() => guardado.ninos ?? (guardado.conChicos ? 1 : 0));
  const [conMayores, setConMayores] = useState(Boolean(guardado.conMayores));
  const [datosMinimizados, setDatosMinimizados] = useState(Boolean(guardado.datosMinimizados));
  const [movilidad, setMovilidad] = useState(guardado.movilidad || "no");
  const [hotel, setHotel] = useState(guardado.hotel || "");
  const [nombreTurista, setNombreTurista] = useState(guardado.nombreTurista || "");
  const [origen, setOrigen] = useState(guardado.origen || "");
  const [carrito, setCarrito] = useState(Array.isArray(guardado.carrito) ? guardado.carrito : []);
  const [divisa, setDivisa] = useState(guardado.divisa || "ARS");
  const [idioma, setIdioma] = useState(guardado.idioma || "es");
  const [modoClaro, setModoClaro] = useState(guardado.modoClaroV2 !== undefined ? Boolean(guardado.modoClaroV2) : true);
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
    if (nombreTurista.trim()) setDatosMinimizados(true);
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
        JSON.stringify({ dias, personas, conChicos, adultos, ninos, conMayores, datosMinimizados, movilidad, hotel, nombreTurista, origen, carrito, divisa, idioma, modoClaro, modoClaroV2: modoClaro, bienvenidaVista, onboardingV2: bienvenidaVista, modoTangara })
      );
    } catch {
      // ignorar
    }
  }, [dias, personas, conChicos, adultos, ninos, conMayores, datosMinimizados, movilidad, hotel, nombreTurista, origen, carrito, divisa, idioma, modoClaro, bienvenidaVista, modoTangara]);

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
    setAdultos(2);
    setNinos(0);
    setConMayores(false);
    setDatosMinimizados(false);
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
        JSON.stringify({ dias: 3, personas: 2, conChicos: false, adultos: 2, ninos: 0, conMayores: false, datosMinimizados: false, movilidad: "no", hotel: "", nombreTurista: "", origen: "", carrito: [], divisa, idioma, modoClaro, modoClaroV2: modoClaro, bienvenidaVista: true, onboardingV2: true, modoTangara })
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
  const idAtractivoAbierto = pestana === "destinos"
    ? Object.keys(expandidas).find((k) => expandidas[k] && FONDOS_ATRACTIVOS[Number(String(k).replace("acc-", ""))])
    : null;
  const fondoAtractivoActivo = idAtractivoAbierto ? FONDOS_ATRACTIVOS[Number(String(idAtractivoAbierto).replace("acc-", ""))] : null;

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
    conChicos ? `${adultos} ${adultos === 1 ? "adulto" : "adultos"} y ${ninos} ${ninos === 1 ? "niño" : "niños"}` : "",
    conMayores ? "con adultos mayores / movilidad reducida" : "",
  ].filter(Boolean).join(" · ");

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
    setDatosMinimizados(false);
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
      className={`app ${pestana === "inicio" ? "en-inicio" : ""} ${carrito.length > 0 ? "con-barra" : ""} ${modoClaro ? "claro" : ""} ${fondoAtractivoActivo ? "con-fondo-atractivo" : ""}`}
      onTouchStart={onTouchStartTab}
      onTouchEnd={onTouchEndTab}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Outfit:wght@700;800;900&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; display: block; }
        .app { --tinta: #f4f4f5; --rio: #34d399; --niebla: #1c1c21; --papel: #141417; --suave: #a1a1aa; --fondo: #09090b;
          position: relative; color-scheme: dark; text-align: left; min-height: 100vh; background: var(--fondo); color: var(--tinta);
          font-family: "Segoe UI", system-ui, sans-serif; padding: 16px 16px 48px; transition: background .25s, color .25s; touch-action: pan-y; }
        .fondo-portada { position: absolute; top: 0; left: 0; right: 0; height: clamp(380px, 72vw, 540px); overflow: hidden; pointer-events: none; z-index: 0; background: radial-gradient(circle at 20% 20%, rgba(16,185,129,.22), transparent 55%), radial-gradient(circle at 80% 15%, rgba(14,165,233,.18), transparent 52%);
          -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 42%, rgba(0,0,0,0) 100%);
          mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 42%, rgba(0,0,0,0) 100%); }
        .fondo-portada.difuminado { filter: blur(8px) brightness(.72); }
        .fondo-portada-img { position: absolute; inset: -16px 0 -40px; width: 100%; height: calc(100% + 56px); object-fit: cover; object-position: center 35%;
          will-change: transform; opacity: .88; }
        .fondo-portada-velo { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(5,16,26,.48) 0%, rgba(9,9,11,.28) 55%, var(--fondo) 100%); }
        .app.claro .fondo-portada-velo { background: linear-gradient(180deg, rgba(10,25,35,.32) 0%, rgba(244,247,242,.38) 55%, var(--fondo) 100%); }
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
        .caja-cab { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 14px; }
        .caja-cab h2 { margin: 0; }
        .btn-minimizar { border: 1px solid #3f3f46; background: var(--niebla); color: var(--tinta); border-radius: 999px; padding: 6px 12px; font-size: .8rem; font-weight: 700; cursor: pointer; white-space: nowrap; }
        .btn-minimizar:hover { border-color: #34d399; }
        .datos-resumen { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; font-size: .86rem; color: var(--suave); line-height: 1.4; background: var(--niebla); padding: 10px 12px; border-radius: 10px; border: 1px solid #27272a; }
        .datos-resumen strong { color: var(--tinta); }
        .btn-listo-datos { margin-top: 14px; width: 100%; border: 1.5px solid #10b981; background: rgba(16,185,129,.12); color: #6ee7b7; border-radius: 10px; padding: 10px 14px; font-size: .92rem; font-weight: 800; cursor: pointer; font-family: inherit; }
        .app.claro .btn-listo-datos { color: #065f46; }
        .desglose-chicos { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 8px 10px; border-radius: 10px; background: rgba(16,185,129,.08); border: 1px solid rgba(16,185,129,.35); }
        .desglose-chicos label { margin: 0 0 4px; font-size: .78rem; font-weight: 700; color: var(--tinta); }
        .desglose-chicos input { padding: 6px 8px; font-size: .92rem; }
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
        .app.claro { --tinta: #182720; --rio: #059669; --niebla: #f0f5f2; --papel: #ffffff; --suave: #52665c; --fondo: #f4f7f2; color-scheme: light; background: #f4f7f2; color: #182720; }
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

        .app { padding-bottom: 108px !important; }

        /* ---------- BIENVENIDA GUÍA ---------- */
        .bienvenida-guia { margin: 4px 0 2px; padding: 10px 14px; list-style: none; text-align: left; background: rgba(255,255,255,.04); border: 1px solid rgba(52,211,153,.22); border-radius: 14px; display: flex; flex-direction: column; gap: 6px; font-size: .82rem; line-height: 1.35; color: #e4e4e7; width: 100%; }
        .bienvenida-guia strong { color: #6ee7b7; }
        .bienvenida-capa { background: rgba(244, 247, 242, 0.78) !important; }
        .bienvenida-onboarding {
          max-height: 92vh;
          overflow-y: auto;
          padding: 20px 18px 22px;
          gap: 8px;
          background-color: #f8faf6 !important;
          background-size: cover;
          background-position: center top;
          background-repeat: no-repeat;
          border: 1.5px solid rgba(36, 180, 126, 0.35) !important;
          box-shadow: 0 22px 54px rgba(18, 42, 32, 0.2) !important;
          color: #1a3829;
        }
        .bienvenida-onboarding .bienvenida-ave { width: clamp(104px, 28vw, 138px); filter: drop-shadow(0 10px 14px rgba(24, 42, 32, 0.28)); }
        .bienvenida-onboarding h2 { color: #1a3829 !important; font-family: 'Outfit', 'Segoe UI', sans-serif; font-weight: 900; letter-spacing: -0.02em; }
        .bienvenida-onboarding p { color: #2f4a3c !important; }
        .bienvenida-onboarding .bienvenida-preg { color: #1a3829 !important; font-weight: 800; }
        .bienvenida-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 9px;
          text-align: left;
          margin-top: 4px;
          background: rgba(255, 255, 255, 0.78);
          -webkit-backdrop-filter: blur(10px);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.92);
          border-radius: 18px;
          padding: 14px;
          box-shadow: 0 8px 22px rgba(24, 52, 40, 0.08);
        }
        .b-fila-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .b-campo label { display: block; font-size: .78rem; font-weight: 700; color: #243e31; margin-bottom: 4px; }
        .b-campo input, .b-campo select { width: 100%; padding: 9px 10px; border-radius: 10px; border: 1.5px solid #cbd9d0; background: #ffffff; color: #182720; font-size: .92rem; font-family: inherit; }
        .b-campo input::placeholder { color: #7c9186; }
        .b-campo input:focus, .b-campo select:focus { border-color: #1f8a65; outline: none; }
        .bienvenida-onboarding .check-pill { background: #ffffff; border-color: #cbd9d0; color: #1c2b24; }
        .bienvenida-onboarding .check-pill.activo { background: rgba(16, 185, 129, 0.14); border-color: #10b981; color: #065f46; }
        .bienvenida-onboarding .desglose-chicos { background: rgba(16, 185, 129, 0.09); border-color: rgba(16, 185, 129, 0.35); }
        .bienvenida-onboarding .desglose-chicos label { color: #1c2b24; }
        .bienvenida-onboarding .desglose-chicos input { background: #ffffff; border: 1.5px solid #cbd9d0; color: #182720; border-radius: 8px; }
        .bienvenida-onboarding .b-btn.si { background: linear-gradient(90deg, #1b86c6 0%, #24b47e 100%); color: #ffffff; box-shadow: 0 8px 18px rgba(27, 134, 198, 0.26); }
        .bienvenida-onboarding .b-btn.no { background: rgba(24, 46, 36, 0.07); color: #243e31; border: 1px solid #cbd9d0; }

        /* ---------- FONDO DINÁMICO POR ATRACTIVO ---------- */
        .fondo-atractivo-capa { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; opacity: 0; transition: opacity .45s ease; }
        .fondo-atractivo-capa.visible { opacity: 1; }
        .fondo-atractivo-halo { position: absolute; right: -10%; bottom: -10%; width: 78%; height: 68%; border-radius: 50%; background: radial-gradient(circle, rgba(185,115,65,.22) 0%, rgba(16,185,129,.08) 45%, transparent 72%); filter: blur(22px); }
        .fondo-atractivo-img { position: absolute; right: 0; bottom: 0; width: min(100vw, 520px); max-height: 86vh; object-fit: contain; object-position: right bottom; opacity: .68;
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,.85) 38%, #000 100%), linear-gradient(180deg, transparent 0%, #000 16%);
          mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,.85) 38%, #000 100%), linear-gradient(180deg, transparent 0%, #000 16%);
          -webkit-mask-composite: source-in; mask-composite: intersect; }
        .fondo-atractivo-capa.claro .fondo-atractivo-img { opacity: .82; }
        .app.con-fondo-atractivo .caja, .app.con-fondo-atractivo .pais-bloque, .app.con-fondo-atractivo .tarjeta { background: rgba(20, 20, 23, 0.82); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); }
        .app.claro.con-fondo-atractivo .caja, .app.claro.con-fondo-atractivo .pais-bloque, .app.claro.con-fondo-atractivo .tarjeta { background: rgba(255, 255, 255, 0.84); }

        /* ---------- PANTALLA DE INICIO (ESTILO ACUARELA BOTÁNICA) ---------- */
        .app.en-inicio { padding-top: 10px !important; }
        .app.en-inicio.claro { background: #f4f7f2 !important; color: #1d2b24 !important; }
        .app.en-inicio:not(.claro) { background: #090d0c !important; color: #f4f4f5 !important; }
        .app.en-inicio .fondo-portada { display: none; }
        .app.en-inicio.claro .firma span { color: #243b31; opacity: .92; }
        .app.en-inicio:not(.claro) .firma span { color: #e4e4e7; opacity: .88; }
        .titulo-typo-interna { margin: 4px 0 8px; font-family: 'Outfit', 'Segoe UI', sans-serif; font-weight: 900; letter-spacing: -0.02em; font-size: clamp(2rem, 6.2vw, 3.1rem); line-height: 1.05; color: #ffffff !important; text-shadow: 0 3px 14px rgba(0, 0, 0, 0.52); }
        .inicio-papel {
          position: relative;
          max-width: 440px;
          margin: 0 auto;
          padding: 14px 16px 22px;
          border-radius: 28px;
          overflow: hidden;
          background-color: #f8faf6;
          background-size: cover;
          background-position: center top;
          background-repeat: no-repeat;
          color: #1c2b24;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0 18px 46px rgba(15, 36, 26, 0.14);
        }
        .inicio-papel > * { position: relative; z-index: 2; }
        .inicio-top { display: flex; justify-content: flex-end; }
        .inicio-top .controles-top { position: static; flex-wrap: nowrap; gap: 5px; }
        .inicio-top .ctrl-top { height: 28px; min-width: 28px; padding: 0 8px; font-size: .7rem; background: rgba(255, 255, 255, 0.82); color: #1c2b24; border-color: rgba(29, 53, 45, 0.18); box-shadow: 0 2px 6px rgba(0,0,0,.06); }
        .inicio-top .ctrl-top.activo { background: #1f8a65; color: #ffffff; border-color: #1f8a65; }
        .inicio-cabecera { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 2px; margin-top: 0; }
        .inicio-hola { margin: 0; font-size: clamp(1rem, 4.2vw, 1.15rem); font-weight: 700; color: #2b4236; letter-spacing: .01em; }
        .inicio-marca-typo { margin: 0; font-family: 'Outfit', 'Segoe UI', sans-serif; font-weight: 900; letter-spacing: -0.02em; font-size: clamp(1.9rem, 8.2vw, 2.45rem); line-height: 1.05; color: #1a3829 !important; text-shadow: 0 2px 8px rgba(255, 255, 255, 0.85); }
        .inicio-marca-typo::after { content: ""; display: block; width: 64px; height: 3.5px; margin: 6px auto 0; border-radius: 999px; background: linear-gradient(90deg, #1b86c6, #24b47e, #d97706); }
        .inicio-escena { position: relative; display: flex; justify-content: flex-start; align-items: flex-end; height: clamp(176px, 28vh, 230px); margin-top: 2px; margin-bottom: -16px; padding-left: 8%; }
        .inicio-ave-wrap { position: relative; z-index: 2; height: 90%; display: flex; align-items: flex-end; justify-content: center; cursor: pointer; margin-bottom: 6px; }
        .inicio-ave { height: 92%; width: auto; max-width: 48vw; object-fit: contain; filter: drop-shadow(0 12px 14px rgba(28, 36, 30, 0.32)); animation: flotarAve 3.2s ease-in-out infinite; }
        .inicio-globo { position: absolute; z-index: 3; top: 4px; right: 0; max-width: 44%; border: none; background: #e3ebef; color: #1b2c25; font-family: inherit; font-size: .78rem; font-weight: 700; line-height: 1.25; text-align: left; padding: 9px 11px; border-radius: 18px 18px 18px 4px; box-shadow: 0 6px 16px rgba(22, 42, 34, 0.14); cursor: pointer; transition: transform .18s; }
        .inicio-globo small { display: block; margin-top: 3px; font-size: .68rem; font-weight: 600; color: #0f766e; }
        .inicio-globo:hover { transform: scale(1.03); }
        .inicio-glass { position: relative; z-index: 3; background: rgba(255, 255, 255, 0.72); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); border: 1.5px solid rgba(255, 255, 255, 0.9); border-radius: 20px; padding: 14px 16px; box-shadow: 0 12px 28px rgba(28, 52, 42, 0.14); display: flex; flex-direction: column; gap: 9px; color: #1c2b24; }
        .inicio-fecha { text-align: center; font-size: .78rem; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; color: #1e2d26; padding-bottom: 4px; }
        .inicio-fila { display: flex; align-items: center; gap: 11px; font-size: .9rem; font-weight: 600; color: #1e2d26; line-height: 1.3; }
        .inicio-ico { width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: .95rem; flex: none; }
        .inicio-ico.ico-sol { background: rgba(251, 191, 36, 0.22); }
        .inicio-ico.ico-ok { background: #16a34a; color: #ffffff; font-weight: 900; font-size: .88rem; }
        .inicio-ico.ico-hora { background: rgba(28, 43, 36, 0.08); }
        .inicio-cta { width: 100%; border: none; border-radius: 16px; padding: 14px 18px; background: linear-gradient(90deg, #1b86c6 0%, #24b47e 100%); color: #ffffff; font-family: inherit; font-size: .95rem; font-weight: 800; letter-spacing: .03em; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; box-shadow: 0 10px 22px rgba(27, 134, 198, 0.28); transition: transform .16s, box-shadow .16s; }
        .inicio-cta:hover { transform: translateY(-2px); box-shadow: 0 14px 28px rgba(27, 134, 198, 0.36); }
        .inicio-cta:active { transform: scale(.98); }
        .inicio-cta-ico { font-size: 1.15rem; }
        .inicio-cta-badge { background: rgba(0, 0, 0, 0.22); padding: 3px 10px; border-radius: 999px; font-size: .74rem; white-space: nowrap; }
        .inicio-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
        .inicio-card-btn { position: relative; overflow: hidden; background: rgba(255, 255, 255, 0.92); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); border: 1px solid rgba(30, 56, 44, 0.09); border-radius: 16px; padding: 12px 13px; color: #1c2b24; font-family: inherit; text-align: left; display: flex; align-items: center; justify-content: space-between; gap: 8px; cursor: pointer; box-shadow: 0 6px 16px rgba(28, 52, 42, 0.1); transition: transform .16s, border-color .16s; min-width: 0; }
        .inicio-card-btn:hover { transform: translateY(-2px); border-color: #10b981; }
        .inicio-card-ico { font-size: 1.25rem; line-height: 1; flex: none; }
        .inicio-card-btn strong { display: block; font-size: .76rem; font-weight: 800; letter-spacing: .02em; line-height: 1.2; color: #182720; }
        .inicio-card-btn small { display: block; margin-top: 2px; font-size: .66rem; line-height: 1.22; color: #52665c; }

        /* Modo oscuro en Pantalla de Inicio */
        .inicio-papel:not(.claro) { background-color: #0e1714; color: #f4f4f5; box-shadow: 0 18px 46px rgba(0, 0, 0, 0.55); border: 1px solid rgba(52, 211, 153, 0.16); }
        .inicio-papel:not(.claro) .inicio-top .ctrl-top { background: rgba(20, 28, 25, 0.85); color: #f4f4f5; border-color: rgba(255, 255, 255, 0.18); }
        .inicio-papel:not(.claro) .inicio-top .ctrl-top.activo { background: #10b981; color: #04261a; border-color: #10b981; }
        .inicio-papel:not(.claro) .inicio-hola { color: #6ee7b7; }
        .inicio-papel:not(.claro) .inicio-marca-typo { color: #ffffff !important; text-shadow: 0 3px 14px rgba(0, 0, 0, 0.65); }
        .inicio-papel:not(.claro) .inicio-globo { background: rgba(24, 34, 30, 0.94); color: #f4f4f5; border: 1px solid rgba(52, 211, 153, 0.35); }
        .inicio-papel:not(.claro) .inicio-globo small { color: #6ee7b7; }
        .inicio-papel:not(.claro) .inicio-glass { background: rgba(16, 24, 21, 0.78); border-color: rgba(255, 255, 255, 0.14); color: #f4f4f5; box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45); }
        .inicio-papel:not(.claro) .inicio-fecha { color: #34d399; }
        .inicio-papel:not(.claro) .inicio-fila { color: #f4f4f5; }
        .inicio-papel:not(.claro) .inicio-ico.ico-hora { background: rgba(255, 255, 255, 0.1); }
        .inicio-papel:not(.claro) .inicio-card-btn { background: rgba(18, 27, 24, 0.88); border-color: rgba(255, 255, 255, 0.12); color: #f4f4f5; }
        .inicio-papel:not(.claro) .inicio-card-btn strong { color: #ffffff; }
        .inicio-papel:not(.claro) .inicio-card-btn small { color: #a1b5ac; }

        /* ---------- BARRA INFERIOR FIJA (TEAL OSCURO MODERNO) ---------- */
        .nav-inf { position: fixed; left: 50%; transform: translateX(-50%); bottom: 0; width: 100%; max-width: 520px; z-index: 700; display: grid; grid-template-columns: repeat(5, 1fr); padding: 8px 6px calc(8px + env(safe-area-inset-bottom, 0px)); background: #213c3d; border-top: 1px solid rgba(255,255,255,.12); border-radius: 22px 22px 0 0; box-shadow: 0 -8px 28px rgba(12, 28, 28, 0.35); }
        .nav-inf-btn { position: relative; border: none; background: transparent; color: #9eb7b6; font-family: inherit; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 6px 2px 4px; cursor: pointer; transition: color .15s, transform .15s; }
        .nav-inf-btn.activa { color: #38e2b7; transform: translateY(-1px); }
        .nav-inf-btn.activa::before { content: ""; position: absolute; top: -8px; left: 22%; right: 22%; height: 3px; border-radius: 999px; background: #38e2b7; box-shadow: 0 0 10px rgba(56, 226, 183, 0.7); }
        .nav-inf-ico { font-size: 1.18rem; line-height: 1; }
        .nav-inf-lbl { font-size: .68rem; font-weight: 700; }
        .nav-inf-badge { position: absolute; top: 0; right: 18%; min-width: 17px; height: 17px; padding: 0 4px; border-radius: 999px; background: #38e2b7; color: #0b2624; font-size: .65rem; font-weight: 800; display: flex; align-items: center; justify-content: center; }

        /* Pie centrado arriba de la barra inferior sin superposición */
        .firma { justify-content: center !important; text-align: center; margin: 20px auto 84px !important; }
        .barra-movil { bottom: 72px !important; }
        .tangara-flotante { bottom: 76px !important; }
      `}</style>

      <PlumasTransicion rafaga={rafagaPlumas} onFin={() => setRafagaPlumas(null)} />

      {!bienvenidaVista && (
        <BienvenidaTangara
          t={t}
          nombreTurista={nombreTurista} setNombreTurista={setNombreTurista}
          origen={origen} setOrigen={setOrigen}
          dias={dias} cambiarDias={cambiarDias}
          personas={personas} setPersonas={setPersonas}
          conChicos={conChicos} setConChicos={setConChicos}
          adultos={adultos} setAdultos={setAdultos}
          ninos={ninos} setNinos={setNinos}
          conMayores={conMayores} setConMayores={setConMayores}
          movilidad={movilidad} setMovilidad={setMovilidad}
          hotel={hotel} setHotel={setHotel}
          divisa={divisa} setDivisa={setDivisa}
          onCompletar={elegirBienvenida}
        />
      )}

      <ChatTangara
        abierto={chatAbierto}
        onCerrar={() => setChatAbierto(false)}
        ctx={ctxChat}
        sonar={sonar}
      />

      <FondoAtractivoDinamico src={fondoAtractivoActivo} modoClaro={modoClaro} />
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
        {pestana === "inicio" ? (
          <PantallaInicio
            primerNombre={primerNombre}
            clima={clima}
            climaEstado={climaEstado}
            onNavegar={(id) => cambiarPestana(id)}
            onAbrirChat={() => setChatAbierto(true)}
            cantidadCarrito={carrito.length}
            modoClaro={modoClaro}
            idioma={idioma}
            controles={
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
            }
          />
        ) : (
        <>
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
          <h1 className="titulo-typo-interna">IGUAZÚ EXPLORA</h1>
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

        </>
        )}

        {/* ---------- PESTAÑA 1: Destinos y Carrito ---------- */}
        {pestana === "destinos" && (
          <div key="destinos" className={`vista-animada dir-${dirVista}`}>
            {bienvenidaVista && dondeSePosa === "inicio" && <CapitanTangara modo={modoTangara} setModo={setModoTangara} volando={volandoTangara} mensaje={consejoTangara} onAbrirChat={() => setChatAbierto(true)} inline />}
            <section className="caja" style={{ marginBottom: 24 }}>
              <div className="caja-cab" style={{ marginBottom: datosMinimizados ? 10 : 14 }}>
                <h2>{t.datosViajero}</h2>
                <button type="button" className="btn-minimizar" onClick={() => setDatosMinimizados((v) => !v)}>
                  {datosMinimizados ? "✏️ Editar datos" : "▲ Minimizar"}
                </button>
              </div>
              {datosMinimizados ? (
                <div className="datos-resumen" onClick={() => setDatosMinimizados(false)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setDatosMinimizados(false); }}>
                  <span>👤 <strong>{nombre || "Viajero"}</strong>{origenTxt ? ` (${origenTxt})` : ""}</span>
                  <span>·</span>
                  <span>🗓️ {dias} {dias === 1 ? "día" : "días"}</span>
                  <span>·</span>
                  <span>👥 {personas} {personas === 1 ? "pers." : "pers."}{conChicos ? ` (${adultos} ad., ${ninos} ${ninos === 1 ? "niño" : "niños"})` : ""}{conMayores ? " · ♿" : ""}</span>
                  <span>·</span>
                  <span>{movilidad === "si" ? "🚗 Auto propio" : "🚐 Con traslado"}</span>
                  {hotel.trim() && <><span>·</span><span>🏨 {hotel.trim()}</span></>}
                </div>
              ) : (
                <>
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
                  <input id="personas" type="number" min={conChicos ? 2 : 1} max="50" value={personas}
                    onChange={(e) => {
                      const p = Math.min(50, Math.max(conChicos ? 2 : 1, Math.floor(Number(e.target.value)) || 1));
                      setPersonas(p);
                      if (conChicos) {
                        const nk = Math.min(Math.max(1, ninos), p - 1);
                        setNinos(nk);
                        setAdultos(p - nk);
                      } else {
                        setAdultos(p);
                        setNinos(0);
                      }
                    }} />
                  <div className="grupo-checks">
                    <label className={`check-pill ${conChicos ? "activo" : ""}`}>
                      <input type="checkbox" checked={conChicos} onChange={(e) => {
                        const v = e.target.checked;
                        setConChicos(v);
                        setDiaClimaTip(null);
                        if (v) {
                          const p = Math.max(2, personas);
                          const nk = Math.min(Math.max(1, ninos || 1), p - 1);
                          setPersonas(p);
                          setNinos(nk);
                          setAdultos(p - nk);
                          setModoTangara("guiado");
                          volarTangara();
                        } else {
                          setAdultos(personas);
                          setNinos(0);
                        }
                      }} />
                      <span>{t.conChicos}</span>
                    </label>
                    {conChicos && (
                      <div className="desglose-chicos">
                        <div>
                          <label htmlFor="adultos-cant">Adultos</label>
                          <input id="adultos-cant" type="number" min="1" max={Math.max(1, personas - 1)} value={adultos}
                            onChange={(e) => {
                              const a = Math.min(Math.max(1, personas - 1), Math.max(1, Math.floor(Number(e.target.value)) || 1));
                              setAdultos(a);
                              setNinos(Math.max(1, personas - a));
                            }} />
                        </div>
                        <div>
                          <label htmlFor="ninos-cant">Niños</label>
                          <input id="ninos-cant" type="number" min="1" max={Math.max(1, personas - 1)} value={ninos}
                            onChange={(e) => {
                              const k = Math.min(Math.max(1, personas - 1), Math.max(1, Math.floor(Number(e.target.value)) || 1));
                              setNinos(k);
                              setAdultos(Math.max(1, personas - k));
                            }} />
                        </div>
                      </div>
                    )}
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
              <button type="button" className="btn-listo-datos" onClick={() => setDatosMinimizados(true)}>
                ✓ Listo, minimizar datos del viajero
              </button>
              </>
              )}
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
              const hoyIguazu = new Date().toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" });
              const eventos = AGENDA_CULTURAL.filter((ev) => {
                if (ev.fechaFin && ev.fechaFin < hoyIguazu) return false;
                return agendaCat === "todos" || ev.categoria === agendaCat;
              });
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
      {bienvenidaVista && (
        <BarraInferior
          pestana={pestana}
          onNavegar={(id) => cambiarPestana(id)}
          cantidadCarrito={carrito.length}
          modoClaro={modoClaro}
        />
      )}
      {bienvenidaVista && pestana !== "inicio" && (dondeSePosa === "pestana" || (modoTangara === "libre" && pestana !== "mapas" && pestana !== "colab" && pestana !== "agenda")) && (
        <CapitanTangara modo={modoTangara} setModo={setModoTangara} volando={volandoTangara} mensaje={consejoTangara} onAbrirChat={() => setChatAbierto(true)} inline={false} />
      )}
    </div>
  );
}