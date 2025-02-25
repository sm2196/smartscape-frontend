import SettingsNavbar from "../../../components/SettingsNavbar";
import "./global.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="tw:flex tw:flex-row tw:max-h-screen tw:overflow-hidden">
          <SettingsNavbar />
          {children}
        </div>
      </body>
    </html>
  );
}
