const express = require("express");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const db = require("./db");

const verifyToken = require("./middleware/authMiddleware");

const app = express();

const favoriteRoutes = require("./routes/favoriteRoutes");

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.use("/favorites", favoriteRoutes);


app.get("/", (req, res) => {
    res.send("API do Comparador de Preços está a funcionar!");
});

// ROTA PARA VER PRODUTOS DA BASE DE DADOS
app.get("/products", (req, res) => {
    db.query("SELECT * FROM products", (err, results) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json(results);
        }
    });
});

app.get("/perfil", verifyToken, (req, res) => {
    res.json({
        message: "Acesso autorizado!",
        user: req.user
    });
});

app.get("/search", (req, res) => {
    const q = req.query.q;

    const sql = "SELECT * FROM products WHERE nome LIKE ?";

    db.query(sql, [`%${q}%`], (err, results) => {
        if (err) return res.status(500).json(err);

        res.json(results);
    });
});

app.listen(3000, () => {
    console.log("Servidor a correr na porta 3000");
});