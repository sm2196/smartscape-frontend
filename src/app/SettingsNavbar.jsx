"use client";

import { useState, useEffect } from "react";
import {
  MdPerson,
  MdSecurity,
  MdSettings,
  MdNotifications,
  MdDevices,
  MdArrowBackIosNew,
  MdMenu,
  MdClose,
} from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Profiles", href: "/dashboard/settings", icon: MdPerson },
  {
    name: "Privacy & Security",
    href: "/dashboard/settings/privacy",
    icon: MdSecurity,
  },
  { name: "Admin Settings",
    href: "/dashboard/settings/admin",
    icon: MdSettings
  },
  {
    name: "Notifications",
    href: "/dashboard/settings/notifications",
    icon: MdNotifications,
  },
  {
    name: "Rooms & Devices",
    href: "/dashboard/settings/roomdevices",
    icon: MdDevices,
  },
  { name: "Dashboard", href: "/dashboard", icon: MdArrowBackIosNew },
];

export default function SettingsNavbar() {
  const pathname = usePathname();
  const [time, setTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours() % 12 || 12;
  const minutes = time.getMinutes();
  const ampm = time.getHours() >= 12 ? "PM" : "AM";

  const timeString = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${ampm}`;

  const dateString = time.toLocaleDateString("en-AE", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div
      className={`tw:w-[280px] tw:flex tw:flex-col tw:p-8 tw:pb-0
        tw:bg-gradient-to-b tw:from-[var(--oxford-blue)] tw:to-[var(--space-cadet)]

        tw:max-lg:w-full tw:max-lg:fixed tw:max-lg:z-[1]
        tw:max-lg:h-auto tw:max-lg:px-4 tw:max-lg:py-2
        ${isMenuOpen ? "tw:max-lg:h-screen" : ""}`} // Expands navbar to full height on mobile
    >
      <div className="tw:max-lg:flex tw:max-lg:h-10">
        <div className="tw:flex-col tw:mb-10 tw:max-lg:hidden">
          <div className="tw:text-[clamp(2.5rem,3.5vw,3.5rem)] tw:font-light
          tw:text-[color:var(--text-primary)] tw:leading-[1.1] tw:mb-2"
          suppressHydrationWarning={true}>
            {timeString}
          </div>
          <div className="tw:text-[clamp(1rem,2vw,1.125rem)]
          tw:text-[color:var(--text-secondary)]"
          suppressHydrationWarning={true}>
            {dateString}
          </div>
        </div>
        <button className="tw:hidden tw:max-lg:block tw:text-[color:var(--text-primary)]
         tw:p-1 tw:bg-transparent tw:border-none" onClick={toggleMenu}>
          {isMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>
      </div>
      <nav className={`tw:flex tw:flex-col tw:gap-2 tw:max-lg:mt-3 tw:max-lg:pb-3
      ${isMenuOpen ? "tw:max-lg:block" : "tw:max-lg:hidden"}`}>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`tw:flex tw:items-center tw:gap-4 tw:text-[color:var(--text-primary)] tw:no-underline tw:transition-all tw:duration-300 tw:ease-[ease] tw:font-medium tw:px-4 tw:py-3 tw:rounded-xl tw:hover:bg-[color:#d2dcf50d]

              tw:max-lg:text-lg tw:max-lg:min-h-[48px] tw:max-lg:p-4
              ${isActive ? "tw:bg-[color:var(--active)]" : ""}`}
              onClick={() => setIsMenuOpen(false)}>
              <item.icon className="tw:text-2xl" />
              <span className="tw:flex-1">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}