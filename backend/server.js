const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const db = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const adminRoutes = require("./routes/adminRoutes");
const voluntarioRoutes = require("./routes/voluntarioRoutes");
const beneficiarioRoutes = require("./routes/beneficiarioRoutes");
const certificadoRoutes = require("./routes/certificadoRoutes");

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
require("./socket")(io);
app.use("/nextassist", express.static(path.join(__dirname, "../nextassist")));
// Socket.IO

//Inicializa as Routes
app.use("/api/admin", adminRoutes);
app.use("/api/voluntario", voluntarioRoutes);
app.use("/api/beneficiario", beneficiarioRoutes);
app.use("/api/certificados", certificadoRoutes);

// Middleware para JSON e arquivos estáticos
app.use(express.json());

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
const horasRoutes = require("./routes/horasRoutes");
const avaliacaoRoutes = require("./routes/avaliacaoRouter");
const denunciaRoutes = require("./routes/denunciaRoutes");

// Define rotas com prefixo
app.use("/api/usuarios", userRoutes);
app.use("/api/usuarios", adminRoutes);
// atividades route removed (tabela 'atividades' não existe mais)
app.use("/api/horas", horasRoutes);
app.use("/api/avaliacoes", avaliacaoRoutes);
app.use("/api/denuncias", denunciaRoutes);

// Middleware para arquivos estáticos (depois das rotas da API)
app.use(express.static(path.join(__dirname, "../nextassist")));

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

//Evento Routes
const eventosRoutes = require("./routes/eventosRoutes");
app.use("/api/eventos", eventosRoutes);

//Perfil Routes
const perfilRoutes = require("./routes/perfilRoutes");
app.use("/api/perfil", perfilRoutes);

// Inicializa o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
