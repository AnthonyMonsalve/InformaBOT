require('dotenv').config();

const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS,
} = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MongoAdapter = require('@bot-whatsapp/database/mongo');
const path = require('path');
const fs = require('fs');

const mensajesDir = path.join(__dirname, 'mensajes');

const readMessage = (fileName) => {
  const filePath = path.join(mensajesDir, fileName);
  return fs.readFileSync(filePath, 'utf8');
};

const menuPath = path.join(mensajesDir, 'Republica.txt');
const menu = fs.readFileSync(menuPath, 'utf8');

function isValidResponse(response) {
  const validResponses = [
    'sí',
    'Sí',
    'SI',
    'SÍ',
    'si',
    'Si',
    'no',
    'NO',
    'No',
    '1',
    '2',
  ];
  return validResponses.includes(response);
}

function isYesResponse(response) {
  const yesResponses = ['sí', 'Sí', 'SI', 'SÍ', 'si', 'Si', '1'];
  return yesResponses.includes(response);
}

function isNoResponse(response) {
  const noResponses = ['no', 'NO', 'No', '2'];
  return noResponses.includes(response);
}

const flowInvestiga = addKeyword(EVENTS.ACTION).addAnswer(
  'prueba investiga',
  { capture: false },
  async (ctx, { gotoFlow }) => {
    return gotoFlow(flowMenu);
  }
);

const flowBoletin = addKeyword(EVENTS.ACTION).addAnswer(
  '¡Únete a nuestro *canal de difusión* para estar al tanto de lo que sucede! 📢📺 https://shorturl.at/hQntC',
  { capture: false },
  async (ctx, { gotoFlow }) => {
    return gotoFlow(flowMenu);
  }
);

const flowRedes = addKeyword(EVENTS.ACTION).addAnswer(
  'prueba redes',
  { capture: false },
  async (ctx, { gotoFlow }) => {
    return gotoFlow(flowMenu);
  }
);

const flowCursoFinal = addKeyword(EVENTS.ACTION).addAnswer(
  readMessage('Testfinal.txt'),
  { capture: false },
  async (ctx, { gotoFlow }) => {
    return gotoFlow(flowMenu);
  }
);

const flowCurso7 = addKeyword(EVENTS.ACTION).addAnswer(
  readMessage('Test7.txt'),
  { capture: true },
  async (ctx, { flowDynamic, gotoFlow }) => {
    if (ctx.body.toLowerCase() === 'b') {
      await flowDynamic(
        '¡Correcto! Verifica la autenticidad de una imagen o video.'
      );
    } else {
      await flowDynamic(
        'Incorrecto. Usa Google Imágenes y TinEye para verificar imágenes y videos.'
      );
    }
    return gotoFlow(flowCursoFinal);
  }
);

const flowCurso6 = addKeyword(EVENTS.ACTION).addAnswer(
  readMessage('Test6.txt'),
  { capture: true },
  async (ctx, { flowDynamic, gotoFlow }) => {
    if (ctx.body.toLowerCase() === 'a') {
      await flowDynamic('¡Correcto! Todos debemos verificar la información.');
    } else {
      await flowDynamic('Incorrecto. La respuesta correcta es A.');
    }
    return gotoFlow(flowCurso7);
  }
);

const flowCurso5 = addKeyword(EVENTS.ACTION).addAnswer(
  readMessage('Test5.txt'),
  { capture: true },
  async (ctx, { flowDynamic, gotoFlow }) => {
    if (ctx.body.toLowerCase() === 'c') {
      await flowDynamic(
        '¡Correcto! Los memes son formatos creativos para presentar hechos.'
      );
    } else {
      await flowDynamic('Incorrecto. Algunos memes pueden ayudar a informar.');
    }
    return gotoFlow(flowCurso6);
  }
);

const flowCurso4 = addKeyword(EVENTS.ACTION).addAnswer(
  readMessage('Test4.txt'),
  { capture: true },
  async (ctx, { flowDynamic, gotoFlow }) => {
    if (ctx.body.toLowerCase() === 'b') {
      await flowDynamic(
        '¡Correcto! Recuerda que es importante verificar la fuente.'
      );
    } else {
      await flowDynamic('Incorrecto. Recuerda verificar la fuente.');
    }
    return gotoFlow(flowCurso5);
  }
);

const flowCurso3 = addKeyword(EVENTS.ACTION).addAnswer(
  readMessage('Test3.txt'),
  { capture: true },
  async (ctx, { flowDynamic, gotoFlow }) => {
    if (ctx.body.toLowerCase() === 'a') {
      await flowDynamic(
        '¡Correcto! Toda información falsa presentada como verdadera es desinformación.*'
      );
    } else {
      await flowDynamic('Incorrecto. La respuesta correcta es A.');
    }
    return gotoFlow(flowCurso4);
  }
);

const flowCurso2 = addKeyword(EVENTS.ACTION).addAnswer(
  readMessage('Test2.txt'),
  { capture: true },
  async (ctx, { gotoFlow, flowDynamic }) => {
    const response = ctx.body.trim().toLowerCase();

    if (!isValidResponse(response)) {
      await flowDynamic(
        'Respuesta no válida. Por favor selecciona "Sí", "No", "1" o "2".'
      );
      return gotoFlow(flowCurso2);
    }

    if (isYesResponse(response)) {
      return gotoFlow(flowCurso3);
    }

    if (isNoResponse(response)) {
      await flowDynamic(
        'Vale, quizás necesitas un café para volver con más energía ☕⚡'
      );
      return gotoFlow(flowMenu);
    }
  }
);

const flowCurso = addKeyword(EVENTS.ACTION).addAnswer(
  readMessage('Test1.txt'),
  { capture: true },
  async (ctx, { gotoFlow, flowDynamic }) => {
    const response = ctx.body.trim().toLowerCase();

    if (!isValidResponse(response)) {
      await flowDynamic(
        'Respuesta no válida. Por favor selecciona "Sí", "No", "1" o "2".'
      );
      return gotoFlow(flowCurso);
    }

    if (isYesResponse(response)) {
      return gotoFlow(flowCurso2);
    }

    if (isNoResponse(response)) {
      await flowDynamic('*Datavenger: Ok acá estaré esperándote*');
      return gotoFlow(flowMenu);
    }
  }
);

const flowCierre = addKeyword(EVENTS.ACTION).addAnswer(
  'prueba ¡chao!',
  { capture: true },
  async (ctx, { gotoFlow }) => {
    if (['republica', 'República'].includes(ctx.body.toLowerCase())) {
      return gotoFlow(flowMenu);
    }
  }
);

const flowMenu = addKeyword([
  'republica',
  'república',
  'República',
  'Republica',
  'REPÚBLICA',
  'rEPÚBLICA',
  'rEPUBLICA',
  'REPUBLICA',
  'Menu',
  'Menú',
  'MENU',
  'MENÚ',
]).addAnswer(
  menu,
  { capture: true, delay: 2500 },
  async (ctx, { gotoFlow, flowDynamic }) => {
    switch (ctx.body) {
      case '1':
        return gotoFlow(flowCurso);
      case '2':
        return gotoFlow(flowInvestiga);
      case '3':
        return gotoFlow(flowBoletin);
      case '4':
        return gotoFlow(flowRedes);
      case '0':
        await flowDynamic(
          'Saliendo... Puedes volver a acceder a este menú escribiendo *República*'
        );
        return;
      default:
        await flowDynamic(
          'Respuesta no válida, por favor selecciona una de las opciones.'
        );
        return gotoFlow(flowMenu);
    }
  }
);

const flowInicio = addKeyword([
  'datavenger',
  'Datavenger',
  'DATAVENGER',
  'DataAvenger',
  'Hola',
  'hola',
  'HOLA',
  'hOLA',
])
  .addAnswer(
    '🙌 ¡Hola! Soy DatAvenger🦸🏽‍♀🦸🏻‍♂, tu aliado contra la desinformación creado por La República TV',
    { delay: 1000 }
  )
  .addAnswer(
    'Mi misión es garantizarte un libre, verídico y confiable acceso a la información pública ✅',
    { delay: 1000 }
  )
  .addAnswer(
    '➡ Acá podrás enviar esos datos que te tienen dudando, y nuestro equipo verificará si son ciertos o te quieren ver la cara 🤡',
    { delay: 1000 }
  )
  .addAnswer('➡También podrás sugerirme temas que quieres que investigue ', {
    delay: 1000,
  })
  .addAnswer(
    '➡ Y además tendrás la oportunidad de hacer el curso express para combatir la desinformación y convertirte en un #HeroeXLaInformación 🦸🏻‍♂🦸🏽‍♀',
    { delay: 1000 }
  )
  .addAnswer(
    '🤖 ¿En qué podemos ayudarte? Escribe *República* para ver las opciones',
    { delay: 1000, capture: true },
    async (ctx, { gotoFlow, flowMenu }) => {
      if (
        [
          'republica',
          'república',
          'República',
          'Republica',
          'REPÚBLICA',
          'rEPÚBLICA',
          'rEPUBLICA',
          'REPUBLICA',
        ].includes(ctx.body.toLowerCase())
      ) {
        return gotoFlow(flowMenu);
      }
    }
  );

const main = async () => {
  const adapterDB = new MongoAdapter({
    dbUri: process.env.MONGO_DB_URI,
    dbName: 'Mensajes',
    options: {
      tlsInsecure: true,
    },
  });
  const adapterFlow = createFlow([
    flowInicio,
    flowMenu,
    flowCurso,
    flowCurso2,
    flowCurso3,
    flowCurso4,
    flowCurso5,
    flowCurso6,
    flowCurso7,
    flowCursoFinal,
    flowInvestiga,
    flowBoletin,
    flowRedes,
    flowCierre,
  ]);
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
