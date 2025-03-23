import "./globals.css"
import "./styles.css"

export const metadata = {
  title: "Consumption Dashboard",
  description: "Smart home consumption analysis dashboard",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

