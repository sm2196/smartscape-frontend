// Helper function to generate random number within a range
const randomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Main function to generate random dashboard data
export function generateDashboardData(period) {
  // Create a seed based on current time to ensure different data on each refresh
  const seed = Date.now() % 100 // This gives us 100 different variations

  // Generate random consumption data with realistic patterns
  const generateConsumptionData = () => {
    let data = []

    if (period === "daily") {
      // Daily data with hourly intervals
      const baseElectricity = randomInRange(80, 150)
      const baseWater = randomInRange(50, 100)

      // Use all 24 hours for daily view
      const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)

      data = hours.map((hour, index) => {
        // Create a curve with peak during afternoon/evening
        let multiplier = 1

        // Morning (5am-9am)
        if (index >= 5 && index <= 9) {
          multiplier = randomInRange(15, 20) / 10 // 1.5-2.0
        }
        // Midday (10am-3pm)
        else if (index >= 10 && index <= 15) {
          multiplier = randomInRange(10, 15) / 10 // 1.0-1.5
        }
        // Evening peak (6pm-8pm) - Make 6pm-8pm (18:00-20:00) always the highest
        else if (index >= 18 && index <= 20) {
          // Ensure all hours in the 6PM-8PM range have high multipliers
          multiplier = randomInRange(30, 40) / 10 // 3.0-4.0 (highest)
        }
        // Night (10pm-4am)
        else {
          multiplier = randomInRange(5, 10) / 10 // 0.5-1.0
        }

        // Add some randomness but less for 6pm to ensure it stays peak
        const randomFactor =
          index === 18
            ? 0.95 + Math.random() * 0.1 // 0.95-1.05 (less variation for 6pm)
            : 0.8 + Math.random() * 0.4 // 0.8-1.2 (more variation for other hours)

        return {
          name: hour,
          electricity: Math.round(baseElectricity * multiplier * randomFactor),
          water: Math.round(baseWater * multiplier * randomFactor * 0.8), // Water follows electricity but with less variation
        }
      })
    } else if (period === "monthly") {
      // Monthly data
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const baseElectricity = randomInRange(1500, 2500)
      const baseWater = randomInRange(1200, 2000)

      // Seasonal patterns
      const seasonalFactors = {
        electricity: [1.2, 1.1, 1.0, 0.9, 0.8, 1.0, 1.2, 1.3, 1.1, 0.9, 1.0, 1.2], // Higher in summer and winter
        water: [0.8, 0.8, 0.9, 1.0, 1.2, 1.3, 1.4, 1.3, 1.1, 0.9, 0.8, 0.8], // Higher in summer
      }

      // Select a random starting month based on seed
      const startMonth = seed % 12

      data = Array.from({ length: 12 }, (_, i) => {
        const monthIndex = (startMonth + i) % 12
        const randomVariation = 0.8 + ((seed + i) % 10) / 10

        return {
          name: months[monthIndex],
          electricity: Math.round(baseElectricity * seasonalFactors.electricity[monthIndex] * randomVariation),
          water: Math.round(baseWater * seasonalFactors.water[monthIndex] * randomVariation),
        }
      })
    } else if (period === "quarterly") {
      // Quarterly data
      const baseElectricity = randomInRange(6000, 9000)
      const baseWater = randomInRange(4000, 6000)

      // Seasonal patterns by quarter
      const quarterFactors = {
        electricity: [1.1, 0.9, 1.0, 1.2], // Q1 (winter), Q2 (spring), Q3 (summer), Q4 (fall/winter)
        water: [0.8, 1.0, 1.3, 0.9],
      }

      data = ["Q1", "Q2", "Q3", "Q4"].map((quarter, i) => {
        const randomVariation = 0.9 + ((seed + i) % 10) / 20

        return {
          name: quarter,
          electricity: Math.round(baseElectricity * quarterFactors.electricity[i] * randomVariation),
          water: Math.round(baseWater * quarterFactors.water[i] * randomVariation),
        }
      })
    } else if (period === "yearly") {
      // Yearly data
      const currentYear = new Date().getFullYear()
      const baseYear = currentYear - 4
      const baseElectricity = randomInRange(25000, 35000)
      const baseWater = randomInRange(18000, 25000)

      // Yearly growth trend
      const yearlyGrowth = {
        electricity: 1 + randomInRange(5, 15) / 100, // 5-15% yearly growth
        water: 1 + randomInRange(3, 12) / 100, // 3-12% yearly growth
      }

      data = Array.from({ length: 5 }, (_, i) => {
        // Some years might have unexpected spikes or drops
        const electricityAnomaly = i === seed % 5 ? randomInRange(80, 120) / 100 : 1
        const waterAnomaly = i === (seed + 2) % 5 ? randomInRange(85, 115) / 100 : 1

        return {
          name: (baseYear + i).toString(),
          electricity: Math.round(baseElectricity * Math.pow(yearlyGrowth.electricity, i) * electricityAnomaly),
          water: Math.round(baseWater * Math.pow(yearlyGrowth.water, i) * waterAnomaly),
        }
      })
    }

    return data
  }

  // Generate random pie chart data with realistic distributions
  const generatePieData = (type) => {
    let categories = []
    let baseValues = []

    if (type === "electricity") {
      // Different categories based on period
      if (period === "daily") {
        categories = ["Lighting", "HVAC", "Electronics", "Kitchen", "Other"]
        baseValues = [15, 45, 20, 15, 5]
      } else {
        categories = ["HVAC", "Lighting", "Electronics", "Appliances", "Other"]
        baseValues = [40, 20, 15, 15, 10]
      }
    } else if (type === "water") {
      if (period === "daily") {
        categories = ["Shower", "Toilet", "Kitchen", "Laundry", "Other"]
        baseValues = [35, 30, 20, 10, 5]
      } else {
        categories = ["Bathroom", "Kitchen", "Laundry", "Garden", "Other"]
        baseValues = [40, 20, 15, 20, 5]
      }
    } else if (type === "savings") {
      categories = ["Electricity Savings", "Water Savings"]

      // Different savings distribution based on period
      if (period === "daily") {
        baseValues = [60, 40]
      } else if (period === "monthly") {
        baseValues = [55, 45]
      } else if (period === "quarterly") {
        baseValues = [65, 35]
      } else {
        baseValues = [70, 30]
      }
    }

    // Apply random variations based on seed
    const data = categories.map((name, index) => {
      // Random variation of ±20% based on seed and index
      const variation = 0.8 + ((seed + index) % 40) / 100
      const value = Math.round(baseValues[index] * variation)

      return { name, value }
    })

    // Normalize to ensure total is 100%
    const total = data.reduce((sum, item) => sum + item.value, 0)
    return data.map((item) => ({
      ...item,
      value: Math.round((item.value / total) * 100),
    }))
  }

  return {
    monthlyData: generateConsumptionData(),
    electricityData: generatePieData("electricity"),
    waterData: generatePieData("water"),
    savingsData: generatePieData("savings"),
  }
}

// Export color schemes for charts
export const CHART_COLORS = {
  electricity: {
    bar: "#94a3b8",
    pie: ["#0a1529", "#1e40af", "#3b82f6", "#60a5fa", "#93c5fd"],
  },
  water: {
    bar: "#60a5fa",
    pie: ["#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af"],
  },
  savings: ["#94a3b8", "#60a5fa"],
}

