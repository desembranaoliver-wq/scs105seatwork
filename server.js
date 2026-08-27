const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const PORT = process.env.PORT || 5000;

// UPDATED DATABASE CONNECTION
const pool = mysql.createPool({
    host: 'sql.freedb.tech',
    user: 'u_5D98eU',
    password: '9AHRw8i8fEck',
    database: 'u_5D98eU', // Freedb typically uses the username as the database name
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
});

// GET ALL BOOKS/ARTICLES
app.get("/api/freedb_NBb9Q59r", (req, res) => {
    pool.query("SELECT * FROM booklist", (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// GET SINGLE BOOK/ARTICLE
app.get("/api/freedb_NBb9Q59r/:id", (req, res) => {
    const id = req.params.id;
    pool.query("SELECT * FROM booklist WHERE id = ?", [id], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        if (rows.length > 0) {
            res.json(rows[0]); 
        } else {
            res.status(404).json({ msg: `ID ${id} not found` });
        }
    });
});

// POST NEW BOOK/ARTICLE
app.post('/api/freedb_NBb9Q59r', (req, res) => {
    const { author, title, ypubl } = req.body;
    pool.query(
        "INSERT INTO booklist (author, title, ypubl) VALUES (?, ?, ?)", 
        [author, title, ypubl], 
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: err.message });
            }
            res.json({ msg: "Data inserted successfully", id: result.insertId });
    }); 
});

// UPDATE BOOK/ARTICLE
app.put('/api/freedb_NBb9Q59r/:id', (req, res) => {
    const id = req.params.id;
    const { author, title, ypubl } = req.body;
    pool.query(
        "UPDATE booklist SET author = ?, title = ?, ypubl = ? WHERE id = ?", 
        [author, title, ypubl, id], 
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: err.message });
            }
            res.json({ msg: `Successfully updated ID ${id}` });
    }); 
});

// DELETE BOOK/ARTICLE
app.delete('/api/userdata/:id', (req, res) => {
    const id = req.params.id;
    pool.query("DELETE FROM booklist WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ msg: `Successfully deleted ID ${id}` });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
