import DashboardNavbar from "@/components/DashboardNavbar";
import "@/app/global.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="tw:font-roboto">
      <body className="tw:m-0 tw:text-[color:var(--text-primary)]">
        <div className="tw:flex tw:h-screen">
          <DashboardNavbar />
          <div className="tw:flex-1 tw:overflow-auto tw:p-8 tw:bg-gradient-to-b tw:from-[var(--oxford-blue)] tw:to-[var(--space-cadet)] tw:max-sm:pt-16">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
