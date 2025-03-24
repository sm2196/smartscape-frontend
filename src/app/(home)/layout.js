import { Providers } from "@/components/Providers"
import SMNavbar from "@/components/HomeNavbar/SMNavbar"
import SMFooter from "@/components/HomeFooter/SMFooter"
import "./App.css"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SMNavbar />
        <Providers>{children}</Providers>
        <SMFooter />
      </body>
    </html>
  )
}