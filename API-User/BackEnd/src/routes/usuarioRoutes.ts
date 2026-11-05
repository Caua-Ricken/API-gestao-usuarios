import { Router } from "express";
import UsuarioController from "../controllers/usuarioController.js";

const router = Router();

router.post("/", UsuarioController.cadastrar);

router.get("/", UsuarioController.listar);

router.get("/:id", UsuarioController.buscarPorId);

router.patch("/:id", UsuarioController.atualizar);

router.delete("/:id", UsuarioController.excluir);

export default router;