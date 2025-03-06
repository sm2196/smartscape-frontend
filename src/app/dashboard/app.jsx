import { DashboardContent } from "../../components/dashboard/DashboardContent"
import DashboardNavbar from "../../components/navbar/DashboardNavbar"
import "../styles-kc.css"

export default function DashboardPage() {
  return (
    <div className="dashboardLayout">
      <DashboardNavbar/>
      <main className="mainContent">
        <DashboardContent />
      </main>
    </div>
  )
}