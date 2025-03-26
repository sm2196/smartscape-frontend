"use client"

import { useState, useEffect } from "react"
import { TrendingDown, TrendingUp, Zap, Droplet, AlertTriangle, Info } from "lucide-react"
import { useFirebase } from "@/app/firebase/FirebaseContext"

export default function ConsumptionInsights() {
  const { hourlyData, totalVoltage, isPeakHour } = useFirebase()
  const [insights, setInsights] = useState([])

  useEffect(() => {
    // Generate insights based on current data
    const currentHour = new Date().getHours()
    const currentElectricity = hourlyData.electricity[currentHour] || 0
    const previousHour = (currentHour - 1 + 24) % 24
    const previousElectricity = hourlyData.electricity[previousHour] || 0

    const electricityTrend = currentElectricity > previousElectricity ? "up" : "down"

    // Create insights array
    const newInsights = [
      {
        id: 1,
        title: "Energy Trend",
        description:
          electricityTrend === "up"
            ? "Your energy usage is increasing compared to the previous hour."
            : "Your energy usage is decreasing compared to the previous hour.",
        icon: electricityTrend === "up" ? TrendingUp : TrendingDown,
        color: electricityTrend === "up" ? "text-amber-500" : "text-green-500",
        action: electricityTrend === "up" ? "Consider turning off unused devices." : "Great job conserving energy!",
      },
      {
        id: 2,
        title: "High Consumption Devices",
        description: "Your Heater and AC are the highest energy consumers.",
        icon: Zap,
        color: "text-blue-500",
        action: "Consider adjusting your AC by 1-2 degrees to save energy.",
      },
      {
        id: 3,
        title: "Water Usage",
        description: "Your water consumption is within normal range.",
        icon: Droplet,
        color: "text-blue-400",
        action: "Continue your water conservation efforts.",
      },
    ]

    // Add peak hour insight if applicable
    if (isPeakHour) {
      newInsights.push({
        id: 4,
        title: "Peak Hour Alert",
        description: `Current usage (${totalVoltage}W) during peak hours.`,
        icon: AlertTriangle,
        color: "text-red-500",
        action: "Shift high-power activities to off-peak hours to save on costs.",
      })
    }

    setInsights(newInsights)
  }, [hourlyData, totalVoltage, isPeakHour])

  return (
    <div className="consumption-insights">
      <h3 className="insights-title">Smart Insights</h3>
      <div className="insights-grid">
        {insights.map((insight) => (
          <div key={insight.id} className="insight-card">
            <div className={`insight-icon ${insight.color}`}>
              <insight.icon size={24} />
            </div>
            <div className="insight-content">
              <h4>{insight.title}</h4>
              <p>{insight.description}</p>
              <div className="insight-action">
                <Info size={14} />
                <span>{insight.action}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

