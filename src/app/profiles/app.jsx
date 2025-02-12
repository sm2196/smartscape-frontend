import SettingsNavbar from '../../components/navbar/SettingsNavbar';
import ProfileContent from '../../components/profiles/ProfileContent';
import InfoPanel from '../../components/profiles/InfoPanel';
import '../styles-as.css'; // Importing global styles under different name

export default function App() {
  return (
    <div className="container">
      <SettingsNavbar />
      <div className="mainContent">
        <ProfileContent />
        <InfoPanel />
      </div>
    </div>
  );
}