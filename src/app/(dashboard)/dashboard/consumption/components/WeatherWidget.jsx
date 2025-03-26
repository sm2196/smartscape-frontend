"use client"

import { useState, useEffect } from "react"
import { Cloud, CloudRain, Sun, Thermometer, Wind, Droplets } from "lucide-react"

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // For demo purposes, we'll use a mock weather data
    // In production, you would replace this with an actual API call
    const fetchWeather = async () => {
      try {
        setLoading(true)

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock weather data
        const mockWeather = {
          location: "Dubai, UAE",
          temperature: 32,
          condition: "Sunny",
          humidity: 45,
          windSpeed: 12,
          feelsLike: 34,
          icon: "sun",
        }

        setWeather(mockWeather)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching weather:", err)
        setError("Failed to load weather data")
        setLoading(false)
      }
    }

    fetchWeather()

    // Refresh weather data every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  // Weather icon based on condition
  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case "rain":
      case "rainy":
      case "showers":
        return <CloudRain size={36} className="weather-icon rain" />
      case "cloudy":
      case "clouds":
      case "overcast":
        return <Cloud size={36} className="weather-icon cloudy" />
      case "sunny":
      case "clear":
      default:
        return <Sun size={36} className="weather-icon sunny" />
    }
  }

  if (loading) {
    return <div className="weather-widget loading">Loading weather data...</div>
  }

  if (error) {
    return <div className="weather-widget error">{error}</div>
  }

  return (
    <div className="weather-widget">
      <div className="weather-main">
        {getWeatherIcon(weather.condition)}
        <div className="weather-temp">
          <span className="temp-value">{weather.temperature}°C</span>
          <span className="temp-location">{weather.location}</span>
        </div>
      </div>

      <div className="weather-details">
        <div className="weather-detail-item">
          <Thermometer size={16} />
          <span>Feels like: {weather.feelsLike}°C</span>
        </div>
        <div className="weather-detail-item">
          <Droplets size={16} />
          <span>Humidity: {weather.humidity}%</span>
        </div>
        <div className="weather-detail-item">
          <Wind size={16} />
          <span>Wind: {weather.windSpeed} km/h</span>
        </div>
      </div>

      <div className="weather-impact">
        <h4>Weather Impact</h4>
        <p>
          {weather.temperature > 30
            ? "High temperatures may increase AC usage. Consider energy-saving cooling options."
            : weather.temperature < 18
              ? "Cooler temperatures may increase heating usage. Ensure proper insulation."
              : "Current weather conditions are optimal for energy efficiency."}
        </p>
      </div>
    </div>
  )
}

