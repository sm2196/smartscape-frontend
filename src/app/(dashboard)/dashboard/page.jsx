import DashboardContent from "./DashboardContent.jsx";
import { FirebaseProvider } from "./backend/FirebaseContext.jsx";

export default function DashboardPage() {
  return (
    <FirebaseProvider>
      <DashboardContent />
    </FirebaseProvider>
  );
}
