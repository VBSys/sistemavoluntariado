const TipoUsuario = require("../models/tipoUsuario");

// Criar um novo tipo de usuário
exports.create = async (req, res) => {
  try {
    const tipoUsuario = new TipoUsuario(req.body);
    await tipoUsuario.save();
    res.status(201).json(tipoUsuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Listar todos os tipos de usuário
exports.list = async (req, res) => {
  try {
    const tiposUsuario = await TipoUsuario.find();
    res.json(tiposUsuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obter um tipo de usuário específico
exports.get = async (req, res) => {
  try {
    const tipoUsuario = await TipoUsuario.findById(req.params.id);
    if (!tipoUsuario) {
      return res
        .status(404)
        .json({ message: "Tipo de usuário não encontrado" });
    }
    res.json(tipoUsuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Atualizar um tipo de usuário
exports.update = async (req, res) => {
  try {
    const tipoUsuario = await TipoUsuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!tipoUsuario) {
      return res
        .status(404)
        .json({ message: "Tipo de usuário não encontrado" });
    }
    res.json(tipoUsuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
