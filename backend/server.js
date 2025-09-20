const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const db = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

// Inicializa o Express
const app = express();

// Inicializa o servidor HTTP e Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware para JSON e arquivos estáticos
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// Swagger config
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API do TCC",
      version: "1.0.0",
      description: "Documentação da API REST para voluntariado",
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Importa rotas
const userRoutes = require("./routes/userRoutes");
const atividadesRoutes = require("./routes/atividadeRoutes");
const horasRoutes = require("./routes/horasRoutes");
const avaliacaoRoutes = require("./routes/avaliacaoRouter");
const denunciaRoutes = require("./routes/denunciaRoutes");

// Define rotas com prefixo
app.use("/api/usuarios", userRoutes);
app.use("/api/atividades", atividadesRoutes);
app.use("/api/horas", horasRoutes);
app.use("/api/avaliacoes", avaliacaoRoutes);
app.use("/api/denuncias", denunciaRoutes);

// Rota de teste de conexão
app.get("/api/teste-conexao", (req, res) => {
  db.query("SELECT * FROM usuarios", (err, results) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(results);
  });
});

// Middleware global de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ erro: "Erro interno do servidor" });
});

// Socket.IO
io.on("connection", (socket) => {
  console.log("🟢 Novo usuário conectado");

  socket.on("chat message", ({ userId, username, msg }) => {
    const mensagemFormatada = `${username || "Usuário"}: ${msg}`;
    io.emit("chat message", mensagemFormatada);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Usuário desconectado");
  });
});

// Inicializa o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
