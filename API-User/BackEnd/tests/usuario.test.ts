import { describe, it, expect, vi } from "vitest";
import request from "supertest";

const banco = vi.hoisted(() => ({
  criar: vi.fn(),
  atualizar: vi.fn(),
  buscarPorId: vi.fn(),
  excluir: vi.fn(),
}));

// Substitui a conexão real com o MySQL.
vi.mock("../src/db/prisma.js", () => ({
  default: {
    usuario: {
      create: banco.criar,
      update: banco.atualizar,
      findUniqueOrThrow: banco.buscarPorId,
      delete: banco.excluir,
    },
  },
}));

import app from "../src/app.js";
import { Prisma } from "../src/generated/prisma/client.js";

describe("Cadastro de usuários", () => {
  it("cadastra e normaliza os dados enviados", async () => {
    banco.criar.mockResolvedValue({
      id: 1,
      nome: "Cauã Ricken",
      email: "caua@exemplo.com",
      estado: "SC",
    });

    const resposta = await request(app)
      .post("/api/usuario")
      .send({
        nome: "  Cauã Ricken  ",
        email: "  CAUA@EXEMPLO.COM  ",
        estado: "sc",
        dataNascimento: "2006-05-15",
      });

    expect(resposta.status).toBe(201);
    expect(resposta.body.id).toBe(1);
    expect(resposta.headers.location).toBe("/api/usuario/1");

    expect(banco.criar).toHaveBeenCalledWith({
      data: {
        nome: "Cauã Ricken",
        email: "caua@exemplo.com",
        estado: "SC",
        dataNascimento: new Date("2006-05-15T00:00:00.000Z"),
      },
    });
  });

  it("rejeita email inválido sem acessar o banco", async () => {
    const resposta = await request(app)
      .post("/api/usuario")
      .send({
        nome: "Cauã",
        email: "email-invalido",
      });

    expect(resposta.status).toBe(400);
    expect(banco.criar).not.toHaveBeenCalled();
  });

  it("rejeita campos controlados pelo servidor", async () => {
    const resposta = await request(app)
      .post("/api/usuario")
      .send({
        id: 999,
        nome: "Cauã",
        email: "caua@exemplo.com",
      });

    expect(resposta.status).toBe(400);
    expect(banco.criar).not.toHaveBeenCalled();
  });

  it("retorna 409 quando o banco informa email duplicado", async () => {
    banco.criar.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError(
        "Unique constraint failed",
        {
          code: "P2002",
          clientVersion: "test",
          meta: { target: ["email"] },
        }
      )
    );

    const resposta = await request(app)
      .post("/api/usuario")
      .send({
        nome: "Cauã",
        email: "caua@exemplo.com",
      });

    expect(resposta.status).toBe(409);
    expect(resposta.body.mensagem).toBe(
      "Este email já está cadastrado."
    );
  });
});

describe("Atualização de usuários", () => {
  it("atualiza somente os campos enviados e preserva null", async () => {
    banco.atualizar.mockResolvedValue({
      id: 1,
      cidade: "Tubarão",
      complemento: null,
    });

    const resposta = await request(app)
      .patch("/api/usuario/1")
      .send({
        cidade: "Tubarão",
        complemento: null,
      });

    expect(resposta.status).toBe(200);

    expect(banco.atualizar).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        cidade: "Tubarão",
        complemento: null,
      },
    });
  });

  it("rejeita uma atualização vazia", async () => {
    const resposta = await request(app)
      .patch("/api/usuario/1")
      .send({});

    expect(resposta.status).toBe(400);
    expect(banco.atualizar).not.toHaveBeenCalled();
  });
});

describe("Busca e exclusão de usuários", () => {
  it("rejeita ID inválido sem consultar o banco", async () => {
    const resposta = await request(app)
      .get("/api/usuario/abc");

    expect(resposta.status).toBe(400);
    expect(banco.buscarPorId).not.toHaveBeenCalled();
  });

  it("retorna 404 para usuário inexistente", async () => {
    banco.buscarPorId.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError(
        "Record not found",
        {
          code: "P2025",
          clientVersion: "test",
        }
      )
    );

    const resposta = await request(app)
      .get("/api/usuario/999");

    expect(resposta.status).toBe(404);
    expect(resposta.body.mensagem).toBe(
      "Usuário não encontrado."
    );
  });

  it("exclui um usuário e retorna resposta sem conteúdo", async () => {
    banco.excluir.mockResolvedValue({ id: 1 });

    const resposta = await request(app)
      .delete("/api/usuario/1");

    expect(resposta.status).toBe(204);
    expect(resposta.text).toBe("");

    expect(banco.excluir).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});