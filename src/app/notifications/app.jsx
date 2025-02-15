import SettingsNavbar from '../../components/navbar/SettingsNavbar';
import Notifications from '../../components/notifications/NotificationsPage';
import '../styles-as.css'; // Importing global styles under different name

export default function App() {
  return (
    <div className="container">
      <SettingsNavbar />
      <div className="mainContent">
        <Notifications />
      </div>
    </div>
  );
}