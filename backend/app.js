// app.js
const express = require("express");

const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const horasRoutes = require("./routes/horasRoutes");
const avaliacaoRoutes = require("./routes/avaliacaoRoutes");
const denunciaRoutes = require("./routes/denunciaRoutes");
const tipoUsuarioRoutes = require("./routes/tipoUsuarioRoutes");

app.use("/api/tipos-usuario", tipoUsuarioRoutes);

const app = express();
mongoose.connect(process.env.MONGO_URI);

app.use("/api/usuarios", userRoutes);
// atividades routes removed - tabela 'atividades' não existe mais
app.use("/api/horas", horasRoutes);
app.use("/api/avaliacoes", avaliacaoRoutes);
app.use("/api/denuncias", denunciaRoutes);
app.use("/denuncias", denunciaRoutes);

app.listen(3000, () => console.log("API rodando na porta 3000"));
