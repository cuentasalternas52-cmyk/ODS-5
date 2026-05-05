import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import pkg from "pg";
import path from "path";
dotenv.config();

const { Pool } = pkg;
const app = express();

// =========================
// 🔹 MIDDLEWARES
// =========================
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

// =========================
// 🗄️ BASE DE DATOS
// =========================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// =========================
// 🔐 REGISTRO
// =========================
app.post("/registro", async (req, res) => {
  try {
    const { usuario, nombre, correo, password } = req.body;

    if (!usuario || !nombre || !correo || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO usuarios (usuario, nombre, correo, password) VALUES ($1,$2,$3,$4)",
      [usuario, nombre, correo, hash]
    );

    res.json({ mensaje: "Usuario registrado" });

  } catch (err) {
    console.error("REGISTRO ERROR:", err);
    res.status(500).json({ error: "Error al registrar" });
  }
});

// =========================
// 🔐 LOGIN
// =========================
app.post("/login", async (req, res) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

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
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Error en login" });
  }
});

// =========================
// 👤 PERFIL
// =========================
app.get("/perfil", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      "SELECT usuario, nombre, correo FROM usuarios WHERE id=$1",
      [decoded.id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error("PERFIL ERROR:", err);
    res.status(401).json({ error: "Token inválido" });
  }
});

// =========================
// 💬 CHAT IA
// =========================
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

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
      reply: data?.output?.[0]?.content?.[0]?.text || "Sin respuesta"
    });

  } catch (error) {
    console.error("CHAT ERROR:", error);
    res.status(500).json({ reply: "Error en la IA" });
  }
});

app.get("/", (req, res) => {
  res.json({
    estado: "OK",
    mensaje: "VozSegura API funcionando 🚀"
  });
});

// =========================
// 🚀 SERVER START (RENDER)
// =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});