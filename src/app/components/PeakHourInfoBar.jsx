"use client"

import { Clock } from "lucide-react"

export default function PeakHourInfoBar() {
  // Get current hour to check if we're in peak hours
  const currentHour = new Date().getHours()
  const isCurrentlyPeakHour = currentHour >= 18 && currentHour <= 20

  return (
    <div className="peak-hour-info-bar">
      <Clock size={16} className="peak-hour-info-icon" />
      <span className="peak-hour-info-text">
        Peak hour is between <strong>6PM to 8PM</strong>
        {isCurrentlyPeakHour && <span className="peak-hour-active"> (Active Now)</span>}
      </span>
    </div>
  )
}

