"use client";

import { useState, useEffect } from "react";
import {
  MdWbSunny,
  MdCloud,
  MdGrain,
  MdAcUnit,
  MdThunderstorm,
  MdFilterDrama,
  MdLocationOn,
  MdNightsStay,
} from "react-icons/md";
import styles from "./ap_Weather.module.css";

const weatherIcons = {
  clear: MdWbSunny,
  cloudy: MdCloud,
  rain: MdGrain,
  snow: MdAcUnit,
  storm: MdThunderstorm,
  fog: MdFilterDrama,
  night: MdNightsStay,
};

const UPDATE_INTERVAL = 15 * 60 * 1000; // 15 minutes in milliseconds

export function WeatherWidget() {
  const [weather, setWeather] = useState({
    temp: "--",
    condition: "loading",
    location: "Detecting...",
  });
  const [lastUpdateTime, setLastUpdateTime] = useState(0);

  useEffect(() => {
    async function fetchLocationAndWeather() {
      try {
        const now = Date.now();
        if (now - lastUpdateTime < UPDATE_INTERVAL) {
          console.log("Skipping update due to rate limit");
          return;
        }

        const locationResponse = await fetch("http://ip-api.com/json");
        if (!locationResponse.ok) throw new Error("Failed to fetch location");
        const locationData = await locationResponse.json();
        const { lat, lon, city, countryCode } = locationData;

        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        if (!weatherResponse.ok)
          throw new Error("Failed to fetch weather data");
        const weatherData = await weatherResponse.json();
        const condition = mapWeatherCodeToCondition(
          weatherData.current_weather.weathercode
        );

        setWeather({
          temp: weatherData.current_weather.temperature,
          condition: condition,
          location: `${city}, ${countryCode}`,
          isDay: weatherData.current_weather.is_day === 1, // 1 for day, 0 for night
        });

        setLastUpdateTime(now);
      } catch (error) {
        console.error("Error fetching location or weather data:", error);
      }
    }

    fetchLocationAndWeather();

    const intervalId = setInterval(fetchLocationAndWeather, UPDATE_INTERVAL);
    return () => clearInterval(intervalId);
  }, [lastUpdateTime]);

  const mapWeatherCodeToCondition = (code) => {
    if ([0, 1].includes(code)) return "clear";
    if ([2, 3].includes(code)) return "cloudy";
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "rain";
    if ([71, 73, 75, 85, 86].includes(code)) return "snow";
    if ([95, 96, 99].includes(code)) return "storm";
    if ([45, 48].includes(code)) return "fog";
    return "unknown";
  };

  const WeatherIcon = weather.isDay
    ? weatherIcons[weather.condition] || MdFilterDrama
    : weatherIcons.night;

  return (
    <div className={styles.weatherWidget}>
      <div className={styles.leftContent}>
        <WeatherIcon className={styles.weatherIcon} />
        <div className={styles.weatherInfo}>
          <div className={styles.temperature}>{weather.temp}°C</div>
          <div className={styles.condition}>{weather.condition}</div>
        </div>
      </div>
      <div className={styles.location}>
        <MdLocationOn className={styles.locationIcon} />
        <span>{weather.location}</span>
      </div>
    </div>
  );
}
