// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Este arquivo define e exporta o Express `app` mas NÃO inicia
// o listener. O arquivo `server.js` é o entrypoint que deve
// criar o servidor HTTP/Socket.IO e chamar `listen`.

const app = express();

// Rotas (a aplicação usa MySQL via `config/db.js`)
const userRoutes = require("./routes/userRoutes");
const horasRoutes = require("./routes/horasRoutes");
const avaliacaoRoutes = require("./routes/avaliacaoRoutes");
const denunciaRoutes = require("./routes/denunciaRoutes");
const tipoUsuarioRoutes = require("./routes/tipoUsuarioRoutes");
const perfilRoutes = require("./routes/perfilRoutes");

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use("/api/usuarios", userRoutes);
app.use("/api/perfil", perfilRoutes);
app.use("/api/horas", horasRoutes);
app.use("/api/avaliacoes", avaliacaoRoutes);
app.use("/api/denuncias", denunciaRoutes);
app.use("/api/tipos-usuario", tipoUsuarioRoutes);
app.use("/api/perfil", perfilRoutes);

// Exporta o app para que `server.js` seja responsável pelo listen
module.exports = app;
