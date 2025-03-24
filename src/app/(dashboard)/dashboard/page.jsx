import DashboardContent from "./DashboardContent.jsx";
import { FirebaseProvider } from "./FirebaseContext";

export default function DashboardPage() {
  return (
    <FirebaseProvider>
      <DashboardContent />
    </FirebaseProvider>
  );
}
