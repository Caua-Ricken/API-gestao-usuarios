import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { Prisma } from "../generated/prisma/client.js";

const tratarErro: ErrorRequestHandler = (
  erro,
  req,
  res,
  _next
) => {
  if (erro instanceof ZodError) {
    res.status(400).json({
      mensagem: "Dados inválidos.",
      erros: erro.issues.map((item) => ({
        campo: item.path.join("."),
        mensagem: item.message,
      })),
    });

    return;
  }

  if (erro instanceof Prisma.PrismaClientKnownRequestError) {
    if (erro.code === "P2002") {
      res.status(409).json({
        mensagem: "Este email já está cadastrado.",
      });

      return;
    }

    if (erro.code === "P2025") {
      res.status(404).json({
        mensagem: "Usuário não encontrado.",
      });

      return;
    }
  }

  if (
    erro instanceof SyntaxError &&
    "type" in erro &&
    erro.type === "entity.parse.failed"
  ) {
    res.status(400).json({
      mensagem: "O JSON enviado é inválido.",
    });

    return;
  }

  req.log.error(
    {
      err: erro,
      evento: "erro_interno",
    },
    "Erro inesperado na API"
  );

  res.status(500).json({
    mensagem: "Erro interno do servidor.",
  });
};

export default tratarErro;