const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTO
exports.register = (req, res) => {
  const { nome, email, senha } = req.body;

  bcrypt.hash(senha, 10, (err, hash) => {
    if (err) return res.status(500).json(err);

    const sql = "INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)";
    db.query(sql, [nome, email, hash], (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Utilizador criado com sucesso!" });
    });
  });
};

// LOGIN
exports.login = (req, res) => {
  const { email, senha } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0) {
      return res.status(404).json({ message: "Utilizador não encontrado" });
    }

    const user = results[0]; // 🔥 AQUI o user passa a existir

    bcrypt.compare(senha, user.senha, (err, match) => {
      if (!match) {
        return res.status(401).json({ message: "Senha incorreta" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        "segredo_super",
        { expiresIn: "1h" }
      );

      return res.json({
        message: "Login feito com sucesso",
        token
      });
    });
  });
};