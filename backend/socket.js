const db = require("./config/db");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Novo usuário conectado:", socket.id);

    socket.on("mensagem", (data) => {
      const { id_remetente, id_destinatario, mensagem } = data;

      const query = `
        INSERT INTO chat_mensagens (id_remetente, id_destinatario, mensagem)
        VALUES (?, ?, ?)
      `;
      db.query(query, [id_remetente, id_destinatario, mensagem], (err) => {
        if (err) {
          console.error("❌ Erro ao salvar mensagem:", err.message);
          return;
        }

        io.emit("mensagem", {
          id_remetente,
          id_destinatario,
          mensagem,
          data_envio: new Date(),
        });
      });
    });

    socket.on("disconnect", () => {
      console.log("🔴 Usuário desconectado:", socket.id);
    });
  });
};
