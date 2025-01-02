const express = require("express");
const axios = require("axios");
require("dotenv").config();
const app = express();
app.use(express.json());
const port = 3000;

app.post("/generate", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4", // or "gpt-4" for better translations
        messages: [
          {
            role: "system",
            content: "You are a professional translator.",
          },
          {
            role: "user",
            content: `Translate this: '${req.body.text}' into ${req.body.language}. Only provide the translation text, no extra information.`,
          },
        ],
        max_tokens: 100,
        temperature: 0.2,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.open_ai_key}`,
        },
      }
    );
    res.json(response.data.choices[0].message.content);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
});

app.listen(port, () => {
  console.log("server is runing....");
});
