"use client"

import { useState, useEffect } from "react"
import {
  MdWbSunny,
  MdCloud,
  MdGrain,
  MdAcUnit,
  MdThunderstorm,
  MdFilterDrama,
  MdLocationOn,
  MdNightsStay,
} from "react-icons/md"

const weatherIcons = {
  clear: MdWbSunny,
  cloudy: MdCloud,
  rain: MdGrain,
  snow: MdAcUnit,
  storm: MdThunderstorm,
  fog: MdFilterDrama,
  night: MdNightsStay,
}

const UPDATE_INTERVAL = 15 * 60 * 1000 // 15 minutes in milliseconds
const RETRY_INTERVAL = 60 * 1000 // 1 minute in milliseconds

export function WeatherWidget() {
  const [weather, setWeather] = useState({
    temp: "--",
    condition: "loading",
    location: "Detecting...",
  })

  useEffect(() => {
    let retryTimeout
    let mounted = true

    async function fetchLocationAndWeather() {
      try {
        const locationResponse = await fetch("http://ip-api.com/json")
        if (!locationResponse.ok) {
          throw new Error("Failed to fetch location")
        }
        const locationData = await locationResponse.json()
        const { lat, lon, city, countryCode } = locationData

        if (!mounted) return

        try {
          const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
          )
          if (!weatherResponse.ok) {
            throw new Error("Failed to fetch weather data")
          }
          const weatherData = await weatherResponse.json()
          const condition = mapWeatherCodeToCondition(weatherData.current_weather.weathercode)

          if (!mounted) return

          setWeather({
            temp: weatherData.current_weather.temperature,
            condition: condition,
            location: `${city}, ${countryCode}`,
            isDay: weatherData.current_weather.is_day === 1, // 1 for day, 0 for night
          })
        } catch (weatherError) {
          console.error("Error fetching weather data:", weatherError)
          // Keep retrying weather data if location was successful
          if (mounted) {
            retryTimeout = setTimeout(fetchLocationAndWeather, RETRY_INTERVAL)
          }
        }
      } catch (error) {
        console.error("Error fetching location data:", error)
        // Schedule retry
        if (mounted) {
          retryTimeout = setTimeout(fetchLocationAndWeather, RETRY_INTERVAL)
        }
      }
    }

    // Initial fetch
    fetchLocationAndWeather()

    // Set up regular update interval
    const updateInterval = setInterval(fetchLocationAndWeather, UPDATE_INTERVAL)

    // Cleanup function
    return () => {
      mounted = false
      clearInterval(updateInterval)
      if (retryTimeout) {
        clearTimeout(retryTimeout)
      }
    }
  }, [])

  const mapWeatherCodeToCondition = (code) => {
    if ([0, 1].includes(code)) return "clear"
    if ([2, 3].includes(code)) return "cloudy"
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "rain"
    if ([71, 73, 75, 85, 86].includes(code)) return "snow"
    if ([95, 96, 99].includes(code)) return "storm"
    if ([45, 48].includes(code)) return "fog"
    return "unknown"
  }

  let WeatherIcon

  if (weather.isDay) {
    // Daytime logic
    WeatherIcon = weatherIcons[weather.condition] || MdFilterDrama
  } else {
    // Nighttime logic
    WeatherIcon =
      weather.condition === "clear"
        ? weatherIcons.night // If it's night and clear, show night icon
        : weatherIcons[weather.condition] || MdFilterDrama // Otherwise show condition icon or default to fog
  }

  return (
    <div className="tw:text-[color:var(--text-primary)] tw:flex tw:justify-between tw:-mx-8 tw:px-8 tw:py-4 tw:bg-[color:#d2dcf50d]">
      <div className="tw:flex tw:items-center tw:gap-3">
        <WeatherIcon className="tw:text-[32px] tw:opacity-90" />
        <div className="tw:flex tw:flex-col tw:gap-0.5">
          <div className="tw:text-xl tw:leading-none tw:tracking-[-0.5px]">{weather.temp}°C</div>
          <div className="tw:text-[13px] tw:text-[color:var(--text-secondary)] tw:capitalize">{weather.condition}</div>
        </div>
      </div>
      <div className="tw:flex tw:items-center tw:gap-1 tw:text-[13px] tw:text-[color:var(--text-secondary)] tw:pl-4 tw:border-l-[color:var(--active)] tw:border-l">
        <MdLocationOn className="tw:text-sm" />
        <span>{weather.location}</span>
      </div>
    </div>
  )
}

