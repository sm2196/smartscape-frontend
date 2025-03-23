// Function to generate mock hourly data for testing
export function generateMockHourlyData() {
  const hourlyData = {
    electricity: {},
    water: {},
  }

  // Generate data for each hour
  for (let hour = 0; hour < 24; hour++) {
    // Base consumption that varies by time of day
    let baseElectricity

    // Morning hours (6am-9am)
    if (hour >= 6 && hour <= 9) {
      baseElectricity = 2.0 + Math.random() * 1.0 // 2.0-3.0 kWh
    }
    // Midday (10am-4pm)
    else if (hour >= 10 && hour <= 16) {
      baseElectricity = 1.5 + Math.random() * 1.0 // 1.5-2.5 kWh
    }
    // Evening peak (6pm-8pm)
    else if (hour >= 18 && hour <= 20) {
      baseElectricity = 3.5 + Math.random() * 1.5 // 3.5-5.0 kWh (peak)
    }
    // Night (9pm-11pm)
    else if (hour >= 21 && hour <= 23) {
      baseElectricity = 2.0 + Math.random() * 1.0 // 2.0-3.0 kWh
    }
    // Late night/early morning
    else {
      baseElectricity = 0.5 + Math.random() * 0.5 // 0.5-1.0 kWh
    }

    // Water consumption follows a similar pattern
    let baseWater

    // Morning peak (6am-9am)
    if (hour >= 6 && hour <= 9) {
      baseWater = 150 + Math.random() * 50 // 150-200 liters
    }
    // Midday
    else if (hour >= 10 && hour <= 16) {
      baseWater = 80 + Math.random() * 40 // 80-120 liters
    }
    // Evening peak (6pm-9pm)
    else if (hour >= 18 && hour <= 21) {
      baseWater = 180 + Math.random() * 70 // 180-250 liters (peak)
    }
    // Night/early morning
    else {
      baseWater = 20 + Math.random() * 30 // 20-50 liters
    }

    hourlyData.electricity[hour] = Number.parseFloat(baseElectricity.toFixed(2))
    hourlyData.water[hour] = Math.round(baseWater)
  }

  return hourlyData
}

