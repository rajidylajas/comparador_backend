const express = require("express");
const router = express.Router();
const db = require("../db");
const verifyToken = require("../middleware/authMiddleware");

// ADICIONAR FAVORITO
router.post("/", verifyToken, (req, res) => {
    const userId = req.user.id;

    console.log("BODY RECEBIDO:", req.body);

    const product_id = req.body?.product_id;

    if (!product_id) {
        return res.status(400).json({
            message: "product_id não enviado",
            body: req.body
        });
    }

    const sql = "INSERT INTO favorites (user_id, product_id) VALUES (?, ?)";

    db.query(sql, [userId, product_id], (err) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "Produto adicionado aos favoritos" });
    });
});

// LISTAR FAVORITOS DO USER
router.get("/", verifyToken, (req, res) => {
    const userId = req.user.id;

    const sql = `
    SELECT products.*
    FROM favorites
    JOIN products ON favorites.product_id = products.id
    WHERE favorites.user_id = ?
  `;

    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json(err);

        res.json(results);
    });
});

module.exports = router;