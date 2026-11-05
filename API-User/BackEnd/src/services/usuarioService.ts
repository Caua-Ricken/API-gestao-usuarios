import prisma from "../db/prisma.js";

import type {
  CadastroUsuario,
  AtualizacaoUsuario,
} from "../validators/usuarioValidator.js";

async function cadastrar(dados: CadastroUsuario) {
  return prisma.usuario.create({
    data: removerUndefined(dados),
  });
}

async function listar(pagina: number, limite: number) {
  const [usuarios, total] = await prisma.$transaction([
    prisma.usuario.findMany({
      orderBy: {
        id: "desc",
      },
      skip: (pagina - 1) * limite,
      take: limite,
    }),

    prisma.usuario.count(),
  ]);

  return {
    usuarios,
    total,
    pagina,
    limite,
    totalPaginas: Math.ceil(total / limite),
  };
}

async function buscarPorId(id: number) {
  return prisma.usuario.findUniqueOrThrow({
    where: { id },
  });
}

async function atualizar(
  id: number,
  dados: AtualizacaoUsuario
) {
  return prisma.usuario.update({
    where: { id },
    data: removerUndefined(dados),
  });
}

async function excluir(id: number) {
  await prisma.usuario.delete({
    where: { id },
  });
}

export default {
  cadastrar,
  listar,
  buscarPorId,
  atualizar,
  excluir,
};

function removerUndefined<T extends object>(dados: T) {
  return Object.fromEntries(
    Object.entries(dados).filter(([, valor]) => valor !== undefined)
  ) as {
    [K in keyof T]: Exclude<T[K], undefined>;
  };
}