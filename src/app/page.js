"use client"
import { Sidebar } from "./components/sidebar-hk"
import EmergencyControl from "./hk-emergencycontrol"

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <EmergencyControl />
    </div>
  )
}


