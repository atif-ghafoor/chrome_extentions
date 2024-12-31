const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/weather", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.weatherapi.com/v1/forecast.json?key=${process.env.Weather_API_Key}&q=${req.query.q}&days=7&aqi=no&alerts=no`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "failed to fetch data!" });
  }
});

app.get("/sunTime", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.weatherapi.com/v1/astronomy.json?key=${process.env.Weather_API_Key}&q=${req.query.q}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "failed to fetch data!" });
  }
});

app.listen(port, () => {
  console.log("server is runing....");
});
