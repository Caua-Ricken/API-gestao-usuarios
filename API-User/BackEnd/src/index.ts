import "dotenv/config";

import app from "./app.js";
import prisma from "./db/prisma.js";
import logger from "./config/logger.js";

const PORT = Number(process.env.PORT || 3000);

async function iniciarServidor() {
  try {
    await prisma.$connect();

    console.log("Conectado ao MySQL!");

    logger.info("Conectado ao MySQL");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`API rodando na porta ${PORT}`);
    });
  } catch (erro) {
    console.error("Erro ao iniciar a API:", erro);

    logger.fatal(
      { err: erro },
      "Não foi possível iniciar a API"
    );
    
    await prisma.$disconnect();
    process.exit(1);

    await prisma.$disconnect();
    process.exit(1);
  }
}

iniciarServidor();