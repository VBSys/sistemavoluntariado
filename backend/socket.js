const db = require("./config/db");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Novo usuário conectado:", socket.id);

    // 🔹 Buscar mensagens antigas (histórico)
    const queryHistorico = `
      SELECT id_remetente, id_destinatario, mensagem, data_envio
      FROM chat_mensagens
      ORDER BY data_envio ASC
    `;

    db.query(queryHistorico, (err, results) => {
      if (err) {
        console.error("❌ Erro ao buscar histórico:", err.message);
      } else {
        // envia somente ao novo usuário conectado
        socket.emit("mensagensAntigas", results);
      }
    });

    // 🔹 Receber nova mensagem
    socket.on("mensagem", (data) => {
      const { id_remetente, id_destinatario, mensagem } = data;

      const insertQuery = `
        INSERT INTO chat_mensagens (id_remetente, id_destinatario, mensagem)
        VALUES (?, ?, ?)
      `;

      db.query(
        insertQuery,
        [id_remetente, id_destinatario, mensagem],
        (err) => {
          if (err) {
            console.error("❌ Erro ao salvar mensagem:", err.message);
            return;
          }

          // envia mensagem nova a todos os clientes conectados
          io.emit("mensagem", {
            id_remetente,
            id_destinatario,
            mensagem,
            data_envio: new Date(),
          });
        }
      );
    });

    socket.on("disconnect", () => {
      console.log("🔴 Usuário desconectado:", socket.id);
    });
  });
};
