"use client"

import { DashboardContent } from "../../components/dashboard/DashboardContent"
import DashboardNavbar from "../../components/navbar/DashboardNavbar"
import { FirebaseProvider, useFirebase } from "../../firebase/FirebaseContext"
import "../styles-kc.css"
import styles from "./app.module.css"

// Dashboard wrapper that shows loading state
function DashboardWrapper() {
  const { loading } = useFirebase()

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="dashboardLayout">
      <DashboardNavbar />
      <main className="mainContent">
        <DashboardContent />
      </main>
    </div>
  )
}

// Main app component with Firebase provider
export default function DashboardPage() {
  return (
    <FirebaseProvider>
      <DashboardWrapper />
    </FirebaseProvider>
  )
}