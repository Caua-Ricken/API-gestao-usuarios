import { z } from "zod";

const textoOpcional = (limite: number) =>
  z.string().trim().min(1).max(limite).nullable().optional();

const estados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF",
  "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS",
  "RO", "RR", "SC", "SP", "SE", "TO",
];

const dataNascimento = z.iso
  .date()
  .refine(
    (valor) => valor <= new Date().toISOString().slice(0, 10),
    { message: "A data de nascimento não pode estar no futuro." }
  )
  .transform((valor) => new Date(`${valor}T00:00:00.000Z`))
  .nullable()
  .optional();

export const cadastrarUsuarioSchema = z.strictObject({
  nome: z.string().trim().min(2).max(100),

  email: z.string().trim().toLowerCase().pipe(
    z.email().max(191)
  ),

  telefone: z.string()
    .trim()
    .regex(
      /^\+?[0-9 ()-]{8,20}$/,
      "Informe um telefone válido."
    )
    .nullable()
    .optional(),

  dataNascimento,

  cep: z.string()
    .trim()
    .regex(/^\d{5}-?\d{3}$/, "Informe um CEP válido.")
    .nullable()
    .optional(),

  rua: textoOpcional(150),
  numero: textoOpcional(20),
  complemento: textoOpcional(100),
  bairro: textoOpcional(100),
  cidade: textoOpcional(100),

  estado: z.string()
    .trim()
    .toUpperCase()
    .refine(
      (valor) => estados.includes(valor),
      { message: "Informe uma UF válida, como SC." }
    )
    .nullable()
    .optional(),
});

export const atualizarUsuarioSchema = cadastrarUsuarioSchema
  .partial()
  .extend({
    ativo: z.boolean().optional(),
  })
  .refine(
    (dados) => Object.keys(dados).length > 0,
    { message: "Informe pelo menos um campo para atualizar." }
  );

export const usuarioIdSchema = z.string()
  .regex(/^[1-9]\d*$/, "O ID deve ser um inteiro positivo.")
  .transform(Number)
  .pipe(z.number().int().positive().max(2147483647));

export type CadastroUsuario = z.output<
  typeof cadastrarUsuarioSchema
>;

export type AtualizacaoUsuario = z.output<
  typeof atualizarUsuarioSchema
>;