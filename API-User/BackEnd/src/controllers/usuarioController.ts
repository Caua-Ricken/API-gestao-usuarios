import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { z } from "zod";

import UsuarioService from "../services/usuarioService.js";

import {
  cadastrarUsuarioSchema,
  atualizarUsuarioSchema,
  usuarioIdSchema,
} from "../validators/usuarioValidator.js";

const paginacaoSchema = z.object({
  pagina: z.string()
    .regex(/^[1-9]\d*$/)
    .transform(Number)
    .pipe(z.number().int().max(1000000))
    .default(1),

  limite: z.string()
    .regex(/^[1-9]\d*$/)
    .transform(Number)
    .pipe(z.number().int().max(100))
    .default(10),
});

async function cadastrar(req: Request, res: Response, next: NextFunction) {
  try {
    const dados = cadastrarUsuarioSchema.parse(req.body);

    const usuario = await UsuarioService.cadastrar(dados);

    req.log.info(
      {
        evento: "usuario_cadastrado",
        usuarioId: usuario.id,
      },
      "Usuário cadastrado"
    );

    return res
      .location(`/api/usuario/${usuario.id}`)
      .status(201)
      .json(usuario);
  } catch (erro) {
    next(erro);
  }
}

async function listar(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { pagina, limite } = paginacaoSchema.parse(req.query);

    const resultado = await UsuarioService.listar(
      pagina,
      limite
    );

    return res.status(200).json(resultado);
  } catch (erro) {
    next(erro);
  }
}

async function buscarPorId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = usuarioIdSchema.parse(req.params.id);

    const usuario = await UsuarioService.buscarPorId(id);

    return res.status(200).json(usuario);
  } catch (erro) {
    next(erro);
  }
}

async function atualizar(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = usuarioIdSchema.parse(req.params.id);

    const dados = atualizarUsuarioSchema.parse(req.body);

    const usuario = await UsuarioService.atualizar(
      id,
      dados
    );

    req.log.info(
      {
        evento: "usuario_atualizado",
        usuarioId: id,
        campos: Object.keys(dados),
      },
      "Usuário atualizado"
    );

    return res.status(200).json(usuario);
  } catch (erro) {
    next(erro);
  }
}

async function excluir(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = usuarioIdSchema.parse(req.params.id);

    await UsuarioService.excluir(id);

    await UsuarioService.excluir(id);

    req.log.info(
      {
        evento: "usuario_excluido",
        usuarioId: id,
      },
      "Usuário excluído"
    );

    return res.status(204).send();

    return res.status(204).send();
  } catch (erro) {
    next(erro);
  }
}

export default {
  cadastrar,
  listar,
  buscarPorId,
  atualizar,
  excluir,
};
