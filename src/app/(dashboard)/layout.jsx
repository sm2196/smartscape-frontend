import DashboardNavbar from "@/components/DashboardNavbar";
import "@/app/global.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="tw:font-roboto">
      <body
        className="tw:m-0
      tw:bg-gradient-to-b tw:from-[var(--oxford-blue)] tw:to-[var(--space-cadet)]"
      >
        <div className="tw:flex tw:h-screen">
          <DashboardNavbar />
          <div
            className="tw:overflow-auto tw:w-full
           tw:max-lg:overflow-visible tw:max-lg:flex-col tw:max-lg:pt-16 tw:max-lg:flex"
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
