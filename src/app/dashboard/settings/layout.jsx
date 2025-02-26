import SettingsNavbar from "../../../components/SettingsNavbar";
import "./global.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="tw:m-0">
        <div className="tw:flex tw:flex-row tw:max-h-screen tw:overflow-hidden">
          <SettingsNavbar />
          <div
            className="tw:flex tw:flex-row tw:w-full tw:overflow-x-hidden
          tw:max-sm:flex-col tw:max-sm:pt-16 tw:max-sm:h-[calc(100vh-4rem)]"
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
