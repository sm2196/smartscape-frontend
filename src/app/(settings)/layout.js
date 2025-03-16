import SettingsNavbar from "@/components/SettingsNavbar"
import ProtectedRoute from "@/components/ProtectedRoute"
import "@/app/globals.css"

export const viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="tw:font-roboto">
      <body className="tw:m-0 tw:flex tw:h-screen">
        <ProtectedRoute>
          <SettingsNavbar />
          <div
            className="tw:overflow-auto tw:flex tw:w-full
              tw:max-lg:overflow-visible tw:max-lg:flex-col tw:max-lg:pt-16"
          >
            {children}
          </div>
        </ProtectedRoute>
      </body>
    </html>
  )
}

