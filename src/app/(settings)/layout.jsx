import SettingsNavbar from "@/components/SettingsNavbar";
import "@/app/global.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="tw:font-roboto">
      <body className="tw:m-0">
        <div className="tw:flex tw:h-screen">
          <SettingsNavbar />
          <div
            className="tw:flex tw:w-full
            tw:max-sm:flex-col tw:max-sm:pt-16"
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
