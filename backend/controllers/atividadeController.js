// Tabela 'atividades' removida do projeto. Endpoints foram desativados.
exports.criarAtividade = (req, res) =>
  res.status(410).json({ erro: "Recurso 'atividades' removido" });

exports.listarAtividades = (req, res) =>
  res.status(410).json({ erro: "Recurso 'atividades' removido" });

exports.buscarAtividadePorId = (req, res) =>
  res.status(410).json({ erro: "Recurso 'atividades' removido" });

exports.atualizarAtividade = (req, res) =>
  res.status(410).json({ erro: "Recurso 'atividades' removido" });

exports.removerAtividade = (req, res) =>
  res.status(410).json({ erro: "Recurso 'atividades' removido" });
