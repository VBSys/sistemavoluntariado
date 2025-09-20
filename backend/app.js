// app.js
const express = require("express");

const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const atividadeRoutes = require("./routes/atividadeRoutes");
const horasRoutes = require("./routes/horasRoutes");
const avaliacaoRoutes = require("./routes/avaliacaoRoutes");
const denunciaRoutes = require("./routes/denunciaRoutes");

const app = express();
mongoose.connect(process.env.MONGO_URI);

app.use("/api/usuarios", userRoutes);
app.use("/api/atividades", atividadeRoutes);
app.use("/api/horas", horasRoutes);
app.use("/api/avaliacoes", avaliacaoRoutes);
app.use("/api/denuncias", denunciaRoutes);

app.listen(3000, () => console.log("API rodando na porta 3000"));
