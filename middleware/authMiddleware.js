const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  console.log("TOKEN RECEBIDO:", token);

  if (!token) {
    return res.status(403).json({ message: "Token inválido" });
  }

  jwt.verify(token, "segredo_super", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido ou expirado" });
    }

    req.user = decoded; // guarda info do utilizador
    next(); // permite acesso à rota
  });
};

module.exports = verifyToken;