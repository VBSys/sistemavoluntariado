// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
  course: String,
  role: { type: String, enum: ["beneficiario", "voluntario"] },
  description: String,
  // campos específicos
  limitations: [String],
  skills: [String],
  hoursAccumulated: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", UserSchema);
