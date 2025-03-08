import SettingsNavbar from '../../../components/SettingsNavbar';
import './global.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <SettingsNavbar />
          {children}
        </div>
      </body>
    </html>
  );
}