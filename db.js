const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "comparador_precos"
});

connection.connect((err) => {
  if (err) {
    console.log("Erro ao ligar ao MySQL:", err);
  } else {
    console.log("MySQL ligado com sucesso!");
  }
});

module.exports = connection;