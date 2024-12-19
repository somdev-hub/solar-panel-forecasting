const express = require("express");
const axios = require("axios");
const env = require("dotenv").config();

const app = express();
const port = 3000;

const WEATHER_API_KEY = process.env.WEATHER_API; // Replace with your actual API key
const WEATHER_API_URL = "http://api.weatherapi.com/v1/forecast.json";

function mapWeatherCondition(condition) {
  const conditionLower = condition.toLowerCase();
  if (conditionLower.includes("sunny") || conditionLower.includes("clear")) {
    return "Sunny";
  } else if (
    conditionLower.includes("cloudy") ||
    conditionLower.includes("overcast")
  ) {
    return "Cloudy";
  } else if (
    conditionLower.includes("scattered clouds") ||
    conditionLower.includes("partly cloudy")
  ) {
    return "Scattered clouds";
  } else if (conditionLower.includes("passing clouds")) {
    return "Passing clouds";
  } else if (
    conditionLower.includes("fog") ||
    conditionLower.includes("mist") ||
    conditionLower.includes("haze")
  ) {
    return "Fog";
  } else {
    return "Passing clouds"; // Default case if none of the conditions match
  }
}

app.get("/forecast", async (req, res) => {
  try {
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        key: WEATHER_API_KEY,
        q: "Mumbai", // Replace with your actual location
        days: 15
      }
    });

    const forecastData = response.data.forecast.forecastday.map((day) => ({
      date: day.date,
      temp: day.day.avgtemp_c,
      weather: mapWeatherCondition(day.day.condition.text),
      wind: day.day.maxwind_kph,
      humidity: day.day.avghumidity
    }));

    const forecastPowerGeneration = await Promise.all(
      forecastData.map(async (day) => {
        const response = await axios.post("http://localhost:8000/predict", {
          temp: day.temp,
          wind: day.wind,
          humidity: day.humidity,
          weather: day.weather,
          date: day.date
        });
        return { ...day, generatedPower: response.data.prediction };
      })
    );

    res.json(forecastPowerGeneration);

    // res.json(forecastData);
  } catch (error) {
    console.log(error);

    res.status(500).send("Error fetching weather data");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
