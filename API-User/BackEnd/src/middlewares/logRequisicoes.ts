import { randomUUID } from "node:crypto";
import { pinoHttp } from "pino-http";

import logger from "../config/logger.js";

const logRequisicoes = pinoHttp({
  logger,

  genReqId(_req, res) {
    const id = randomUUID();

    res.setHeader("X-Request-Id", id);

    return id;
  },

  serializers: {
    req(req) {
      return {
        id: req.id,
        metodo: req.method,
        caminho: req.url?.split("?")[0],
      };
    },

    res(res) {
      return {
        status: res.statusCode,
      };
    },
  },

  customLogLevel(_req, res, erro) {
    if (erro || res.statusCode >= 500) {
      return "error";
    }

    if (res.statusCode >= 400) {
      return "warn";
    }

    return "info";
  },

  customSuccessMessage() {
    return "Requisição concluída";
  },

  customErrorMessage() {
    return "Requisição finalizada com erro";
  },
});

export default logRequisicoes;