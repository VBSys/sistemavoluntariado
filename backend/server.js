// server.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const db = require("./config/db"); // importa a conexão
const userRoutes = require("./routes/userRoutes");
app.use("/usuarios", userRoutes);

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/teste-conexao", (req, res) => {
  db.query("SELECT * FROM usuarios", (err, results) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(results);
  });
});

server.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
