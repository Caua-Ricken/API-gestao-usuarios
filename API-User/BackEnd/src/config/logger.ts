import "dotenv/config";
import { pino } from "pino";

const logger = pino({
  level:
    process.env.NODE_ENV === "test"
      ? "silent"
      : process.env.LOG_LEVEL || "info",

  base: {
    servico: "usuarios-api",
  },

  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;