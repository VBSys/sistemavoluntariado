// controllers/userController.js
const User = require("../models/user");

exports.createUser = async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
};

exports.listUsers = async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  const users = await User.find(filter);
  res.json(users);
};

// outros métodos: getById, update, remove...
