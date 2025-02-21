import SettingsNavbar from '../../components/navbar/SettingsNavbar';
import ProfileContent from '../../components/profiles/ProfileContent-as';
import InfoPanel from '../../components/profiles/InfoPanel-as';
import '../styles-as.css'; // Importing global styles under different name

export default function SettingsPage() {
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