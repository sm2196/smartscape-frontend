"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, BarChart2, Shield, Monitor, HeadphonesIcon, LogOut, Settings, Bell } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ConsumptionChart } from "./components/consumption-chart"

const menuItems = [
  { icon: Home, label: "Dashboard", href: "#dashboard" },
  { icon: BarChart2, label: "Consumption Analysis", href: "#analysis" },
  { icon: Shield, label: "Emergency Controls", href: "#emergency" },
  { icon: Monitor, label: "Device Controls", href: "#devices" },
  { icon: HeadphonesIcon, label: "Customer Support", href: "#support" },
]

export default function Home() {
  const [timeframe, setTimeframe] = useState("Monthly")
  const [activePage, setActivePage] = useState("Consumption Analysis")

  return (
    <div className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Header */}
      <header className="border-b" style={{ background: "var(--background)" }}>
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <img src="/vercel.svg" alt="SmartScape" className="h-8" />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="search"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
                style={{ background: "var(--background)", color: "var(--foreground)" }}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-500">
              <Settings className="h-5 w-5" style={{ color: "var(--foreground)" }} />
            </button>
            <button className="p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-500">
              <Bell className="h-5 w-5" style={{ color: "var(--foreground)" }} />
            </button>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className="w-64 bg-green-900 min-h-[calc(100vh-4rem)] text-white font-sans"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          <nav className="p-4">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                  activePage === item.label ? "bg-green-800" : "hover:bg-green-800/50"
                }`}
                onClick={(e) => {
                  e.preventDefault()
                  setActivePage(item.label)
                }}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </a>
            ))}
            <a href="#logout" className="flex items-center gap-3 px-4 py-3 rounded-lg mt-auto hover:bg-green-800/50">
              <LogOut className="h-5 w-5" />
              Logout
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6" style={{ fontFamily: "var(--font-geist-sans)" }}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
              {activePage}
            </h1>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-40">
                <SelectValue>{timeframe}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Quarterly">Quarterly</SelectItem>
                <SelectItem value="Yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card
              className="bg-opacity-5"
              style={{ background: "var(--background)", borderColor: "rgba(var(--gray-rgb), 0.1)" }}
            >
              <CardHeader>
                <CardTitle style={{ color: "var(--foreground)" }}>Consumption Charts</CardTitle>
              </CardHeader>
              <CardContent>
                <ConsumptionChart type="bar" timeframe={timeframe} />
              </CardContent>
            </Card>

            <Card
              className="bg-opacity-5"
              style={{ background: "var(--background)", borderColor: "rgba(var(--gray-rgb), 0.1)" }}
            >
              <CardHeader>
                <CardTitle style={{ color: "var(--foreground)" }}>Electricity Consumption</CardTitle>
              </CardHeader>
              <CardContent>
                <ConsumptionChart type="electricity" />
              </CardContent>
            </Card>

            <Card
              className="bg-opacity-5"
              style={{ background: "var(--background)", borderColor: "rgba(var(--gray-rgb), 0.1)" }}
            >
              <CardHeader>
                <CardTitle style={{ color: "var(--foreground)" }}>Water Consumption</CardTitle>
              </CardHeader>
              <CardContent>
                <ConsumptionChart type="water" />
              </CardContent>
            </Card>

            <Card
              className="bg-opacity-5"
              style={{ background: "var(--background)", borderColor: "rgba(var(--gray-rgb), 0.1)" }}
            >
              <CardHeader>
                <CardTitle style={{ color: "var(--foreground)" }}>Savings Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ConsumptionChart type="savings" />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

