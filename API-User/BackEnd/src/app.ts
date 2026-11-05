import express from "express";
const app = express();

import usuarioRoutes from "./routes/index.js";
import tratarErro from "./middlewares/tratarErro.js";
import logRequisicoes from "./middlewares/logRequisicoes.js";

app.use(express.json());
app.use(logRequisicoes);

app.get("/", (req, res) => {
  res.status(200).json({
    mensagem: "API de usuários funcionando!",
  });
});

app.use("/api", usuarioRoutes);

app.use((req, res) => {
  res.status(404).json({
    mensagem: "Rota não encontrada.",
  });
});

app.use(tratarErro);

export default app;