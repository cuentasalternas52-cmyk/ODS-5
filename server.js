const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

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
            reply: data.output[0].content[0].text
        });

    } catch (error) {
        res.json({ reply: "Error en la IA" });
    }
});

app.listen(3000, () => console.log("Servidor corriendo"));