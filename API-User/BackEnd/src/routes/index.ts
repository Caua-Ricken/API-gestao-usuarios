import { Router } from "express";
const router = Router();

import usuarioRouter from './usuarioRoutes.js'
router.use('/usuario', usuarioRouter);

export default router;