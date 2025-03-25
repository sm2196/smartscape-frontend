"use client"

import { useState, useEffect, useCallback } from "react"
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  AreaChart,
  Area,
} from "recharts"
import { generateDashboardData, CHART_COLORS } from "./utils/generateDashboardData"
import { FirebaseProvider, useFirebase } from "./firebase/FirebaseContext"
import PeakHourNotification from "./components/PeakHourNotification"
import NotificationCenter from "./components/NotificationCenter"
import DashboardNavbar from "./components/DashboardNavbar"
import WeatherWidget from "./components/WeatherWidget"
import ExportOptions from "./components/ExportOptions"
import "./styles.css"
import PeakHourInfoBar from "./components/PeakHourInfoBar"

// Wrap the main component with the FirebaseProvider
export default function PageWrapper() {
  return (
    <FirebaseProvider>
      <Page />
    </FirebaseProvider>
  )
}

function Page() {
  // Change default period from "monthly" to "daily"
  const [period, setPeriod] = useState("daily")
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0) // Used to force chart refresh
  const firebase = useFirebase()

  // Generate random data on initial load and when period changes
  useEffect(() => {
    // Simulate a loading delay for realism
    setLoading(true)

    const timer = setTimeout(() => {
      setChartData(generateDashboardData(period))
      setLoading(false)
    }, 500) // Short delay to simulate data loading

    return () => clearTimeout(timer)
  }, [period, refreshKey])

  // Handle period change
  const handlePeriodChange = (e) => {
    setPeriod(e.target.value)
  }

  // Function to refresh data
  const refreshData = useCallback(() => {
    setRefreshKey((prev) => prev + 1)
  }, [])

  // Auto-refresh data every 30 seconds for dynamic updates
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData()
    }, 30000)

    return () => clearInterval(interval)
  }, [refreshData])

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Check if this is within peak hours (6PM-8PM)
      const hour = Number.parseInt(label.split(":")[0], 10)
      const isPeakHour = hour >= 18 && hour <= 20

      return (
        <div className={`custom-tooltip ${isPeakHour ? "peak-hour-tooltip" : ""}`}>
          <p className="label">{`${label} ${isPeakHour ? "⚠️ PEAK HOUR" : ""}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey === "electricity" ? "Electricity (kWh)" : "Water (m³)"}: {entry.value}
            </p>
          ))}
          {isPeakHour && (
            <p className="peak-hour-note">
              This is during peak hours (6PM-8PM).
              <br />
              Consider reducing consumption during this time.
            </p>
          )}
        </div>
      )
    }
    return null
  }

  // Show loading state
  if (loading || firebase.loading) {
    return <div className="loading">Loading dashboard data...</div>
  }

  // Show Firebase error if any
  if (firebase.firebaseError) {
    console.log("Firebase error:", firebase.firebaseError)
    // Continue with the dashboard anyway since we're using mock data as fallback
  }

  return (
    <div className="dashboard">
      {/* Dashboard Navbar */}
      <DashboardNavbar />

      {/* Main Content */}
      <main className="main-content">
        {/* Firebase Error Banner (if any) */}
        {firebase.firebaseError && (
          <div className="firebase-error-banner">
            <p>
              <strong>Note:</strong> Using mock data. Firebase connection error: {firebase.firebaseError}
            </p>
          </div>
        )}

        {/* Peak Hour Info Bar */}
        <PeakHourInfoBar />

        {/* Peak Hour Notification */}
        <PeakHourNotification />

        <div className="content-header">
          <h2>Consumption Analysis</h2>
          <div className="header-right">
            <NotificationCenter />
            {/* Removed the red peak hour indicator */}
            <select value={period} onChange={handlePeriodChange} className="period-select export-button">
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            <ExportOptions data={chartData.monthlyData} period={period} />
            <button onClick={refreshData} className="refresh-button">
              Refresh Data
            </button>
          </div>
        </div>

        {/* Top Row - Weather and Summary */}
        <div className="top-row">
          <div className="weather-card">
            <WeatherWidget />
          </div>
          <div className="summary-card">
            <h3>Consumption Summary</h3>
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-value">
                  {Math.round(chartData.monthlyData.reduce((sum, item) => sum + item.electricity, 0))}
                </span>
                <span className="stat-label">Total Electricity (kWh)</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">
                  {Math.round(chartData.monthlyData.reduce((sum, item) => sum + item.water, 0))}
                </span>
                <span className="stat-label">Total Water (m³)</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{firebase.totalVoltage}W</span>
                <span className="stat-label">Current Power Usage</span>
              </div>
            </div>
          </div>
        </div>

        <div className="charts-grid">
          {/* Consumption Charts - Keeping this unchanged */}
          <div className="chart-card">
            <h3>Consumption Trends</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData.monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  animationDuration={1000}
                >
                  <defs>
                    <linearGradient id="colorElectricity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.1} />
                    </linearGradient>
                    {/* Add gradient for peak hour highlight */}
                    <linearGradient id="peakHourGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(239, 68, 68, 0.2)" />
                      <stop offset="100%" stopColor="rgba(239, 68, 68, 0.05)" />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />

                  {/* Add peak hour range highlight if in daily view */}
                  {period === "daily" && (
                    <rect
                      x={
                        (chartData.monthlyData.findIndex((item) => item.name === "18:00") /
                          chartData.monthlyData.length) *
                        100
                      }
                      width={
                        ((chartData.monthlyData.findIndex((item) => item.name === "20:00") -
                          chartData.monthlyData.findIndex((item) => item.name === "18:00") +
                          1) /
                          chartData.monthlyData.length) *
                        100
                      }
                      y="0%"
                      height="100%"
                      fill="url(#peakHourGradient)"
                      fillOpacity={0.6}
                    />
                  )}

                  <Area
                    type="monotone"
                    dataKey="electricity"
                    stroke="#94a3b8"
                    fillOpacity={1}
                    fill="url(#colorElectricity)"
                    name="Electricity (kWh)"
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />
                  <Area
                    type="monotone"
                    dataKey="water"
                    stroke="#60a5fa"
                    fillOpacity={1}
                    fill="url(#colorWater)"
                    name="Water (m³)"
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />

                  {/* Add reference lines for peak hour range if in daily view */}
                  {period === "daily" && (
                    <>
                      <ReferenceLine
                        x="18:00"
                        stroke="#ff4d4f"
                        strokeWidth={2}
                        label={{ value: "Peak Hours Start (6PM)", position: "top", fill: "#ff4d4f" }}
                      />
                      <ReferenceLine
                        x="20:00"
                        stroke="#ff4d4f"
                        strokeWidth={2}
                        label={{ value: "Peak Hours End (8PM)", position: "top", fill: "#ff4d4f" }}
                      />
                      {/* Add a text annotation for peak hours */}
                      <text x="50%" y="15%" textAnchor="middle" fill="#ff4d4f" fontSize="14" fontWeight="bold">
                        Peak Hours: 6PM - 8PM
                      </text>
                    </>
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Electricity Consumption */}
          <div className="chart-card">
            <h3>Electricity Consumption</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.electricityData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value}%)`}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  >
                    {chartData.electricityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS.electricity.pie[index % CHART_COLORS.electricity.pie.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Water Consumption */}
          <div className="chart-card">
            <h3>Water Consumption</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.waterData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value}%)`}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  >
                    {chartData.waterData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS.water.pie[index % CHART_COLORS.water.pie.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Savings Distribution */}
          <div className="chart-card">
            <h3>Savings Distribution</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.savingsData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value}%)`}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  >
                    {chartData.savingsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS.savings[index % CHART_COLORS.savings.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

