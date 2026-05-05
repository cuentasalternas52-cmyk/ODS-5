import express from "express";
import dotenv from "dotenv";
import pkg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";

dotenv.config();

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* =========================
   🗄️ BASE DE DATOS
========================= */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

/* =========================
   🔐 REGISTRO
========================= */
app.post("/registro", async (req, res) => {
  const { usuario, nombre, correo, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO usuarios (usuario, nombre, correo, password) VALUES ($1,$2,$3,$4)",
      [usuario, nombre, correo, hash]
    );

    res.json({ mensaje: "Usuario registrado" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar" });
  }
});

/* =========================
   🔐 LOGIN
========================= */
app.post("/login", async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE usuario=$1",
      [usuario]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no existe" });
    }

    const user = result.rows[0];
    const valido = await bcrypt.compare(password, user.password);

    if (!valido) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET
    );

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en login" });
  }
});

/* =========================
   👤 PERFIL
========================= */
app.get("/perfil", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      "SELECT usuario, nombre, correo FROM usuarios WHERE id=$1",
      [decoded.id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Token inválido" });
  }
});

/* =========================
   🎤 API VOZ
========================= */
app.post("/voz", async (req, res) => {
  try {
    const response = await fetch("https://api.ejemplo.com", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en API de voz" });
  }
});

/* =========================
   💬 CHAT IA
========================= */
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `Eres una asistente de apoyo emocional:\n${userMessage}`
      })
    });

    const data = await response.json();

    res.json({
      reply: data.output?.[0]?.content?.[0]?.text || "Sin respuesta"
    });

  } catch (error) {
    console.error(error);
    res.json({ reply: "Error en la IA" });
  }
});

/* =========================
   🚀 SERVIDOR
========================= */
module.exports = (req, res) => {
  res.status(200).json({ ok: true });
};