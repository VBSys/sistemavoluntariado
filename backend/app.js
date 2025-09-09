// app.js
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");

const app = express();
mongoose.connect(process.env.MONGO_URI);

app.use(express.json());
app.use("/users", userRoutes);
// outras rotas...

app.listen(3000, () => console.log("API rodando na porta 3000"));
