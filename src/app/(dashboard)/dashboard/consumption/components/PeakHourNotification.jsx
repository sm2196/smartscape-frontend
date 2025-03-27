"use client"

import { useState, useEffect } from "react"
import { X, AlertTriangle } from "lucide-react"
import { useFirebase } from "../../hooks/FirebaseContext"

export default function PeakHourNotification() {
  const { isPeakHour, totalVoltage, VOLTAGE_THRESHOLD, showVoltageAlert, dismissVoltageAlert, hourlyData } =
    useFirebase()
  const [isVisible, setIsVisible] = useState(false)

  // Show notification when conditions are met
  useEffect(() => {
    if (showVoltageAlert) {
      setIsVisible(true)
    }
  }, [showVoltageAlert])

  // Handle dismiss
  const handleDismiss = () => {
    setIsVisible(false)
    dismissVoltageAlert()
  }

  if (!isVisible) return null

  // Calculate peak hour metrics for display
  const currentHour = new Date().getHours()
  const currentElectricityUsage = hourlyData.electricity[currentHour] || 0
  const maxElectricityUsage = Math.max(...Object.values(hourlyData.electricity), 0)
  const percentOfPeak = maxElectricityUsage ? Math.round((currentElectricityUsage / maxElectricityUsage) * 100) : 0

  return (
    <div className="peak-hour-notification">
      <div className="notification-icon">
        <AlertTriangle size={24} />
      </div>
      <div className="notification-content">
        <h3>Peak Hour Alert!</h3>
        <p>
          Your current power consumption ({totalVoltage}W) exceeds the recommended threshold ({VOLTAGE_THRESHOLD}W)
          during peak hours (6PM-8PM).
        </p>
        <p className="notification-details">Current usage is {percentOfPeak}% of today&apos;s peak consumption.</p>
        <p className="notification-tip">Consider turning off non-essential devices to reduce consumption.</p>
      </div>
      <button onClick={handleDismiss} className="notification-dismiss" aria-label="Dismiss notification">
        <X size={20} />
      </button>
    </div>
  )
}

