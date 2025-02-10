"use client"

import { useState, useEffect } from "react"
import { MdWbSunny, MdCloud, MdGrain, MdAcUnit, MdThunderstorm, MdFilterDrama, MdLocationOn } from "react-icons/md";
import styles from "./Weather.module.css"

const mockWeather = {
  temp: 19,
  condition: "sunny",
  location: "Edinburgh, UK",
}

const weatherIcons = {
  sunny: MdWbSunny,
  cloudy: MdCloud,
  rain: MdGrain,
  snow: MdAcUnit,
  storm: MdThunderstorm,
  fog: MdFilterDrama,
}

export function WeatherWidget() {
  const [weather, setWeather] = useState(mockWeather)

  useEffect(() => {
    const interval = setInterval(() => {
      setWeather((prev) => ({
        ...prev,
        temp: prev.temp + (Math.random() > 0.5 ? 1 : -1),
      }))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const WeatherIcon = weatherIcons[weather.condition]

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
  )
}
