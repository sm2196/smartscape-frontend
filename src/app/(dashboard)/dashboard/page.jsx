import DashboardContent from "./DashboardContent";
import { FirebaseProvider } from "./hooks/FirebaseContext";

export default function DashboardPage() {
  return (
    <FirebaseProvider>
      <DashboardContent />
    </FirebaseProvider>
  );
}
