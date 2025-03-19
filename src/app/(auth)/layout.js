import "@/app/globals.css";
import "./Rushaan.css"

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="tw:font-roboto">
      <body className="tw:m-0">
        <main>{children}</main>
      </body>
    </html>
  );
}
