"use client";

import { useState, useEffect } from "react";
import { MdShield, MdLock, MdRemoveRedEye } from "react-icons/md";

export default function InfoPanel() {
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    section1: true,
    section2: true,
    section3: true,
  });

  const sections = [
    {
      id: "section1",
      icon: MdShield,
      iconColor: "#9BBEC7",
      title: "Why isn't my info shown here?",
      content: "We're hiding some account details to protect your identity.",
    },
    {
      id: "section2",
      icon: MdLock,
      iconColor: "#E2C391",
      title: "Which details can be edited?",
      content:
        "You can edit contact info and personal details but may need to verify your identity again.",
    },
    {
      id: "section3",
      icon: MdRemoveRedEye,
      iconColor: "#A8B7AB",
      title: "What info is shared with others?",
      content:
        "Your usage of SmartScape, feedback, and savings percentage may be shared with others.",
    },
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1023);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Base paragraph styling applied to both collapsed and expanded states.
  const paragraphBaseClasses =
    "tw:text-[#717171] tw:text-base tw:transition-all tw:duration-300 tw:ease-out tw:bg-[#F1F0F5] tw:rounded-lg tw:max-lg:px-2 tw:max-lg:py-0";
  // When expanded, the paragraph becomes fully visible.
  const paragraphExpandedClasses =
    "tw:max-h-[1000px] tw:opacity-100 tw:mt-2.5 tw:p-2.5 tw:max-lg:mt-2";
  // When collapsed, the paragraph is hidden.
  const paragraphCollapsedClasses = "tw:max-h-0 tw:opacity-0 tw:mt-0 tw:px-2.5";

  return (
    <aside className="tw:max-w-[400px] tw:border tw:shadow-md tw:my-2.5 tw:p-5 tw:rounded-xl tw:border-solid tw:border-[#ddd] tw:mx-auto tw:max-lg:my-0 tw:max-lg:p-3 tw:max-lg:max-w-full">
      <div className="tw:flex tw:flex-col tw:gap-[15px] tw:max-lg:gap-1 tw:max-lg:bg-[#f8f9fa] tw:max-lg:mb-1">
        {sections.map(({ id, icon: Icon, iconColor, title, content }) => (
          <div
            key={id}
            className="tw:bg-[#f9f9f9] tw:p-2.5 tw:rounded-lg tw:hover:translate-y-[-5px]  tw:max-lg:p-1.5"
          >
            <button
              className="tw:flex tw:gap-[15px] tw:w-full tw:cursor-pointer text-lg tw:text-[#333] tw:transition-[background-color] tw:duration-300 tw:rounded-lg tw:border-none tw:hover:bg-[#e0e0e0] tw:items-center tw:px-[15px] tw:bg-transparent tw:text-left tw:text-[18px] tw:max-lg:p-2 tw:max-lg:gap-[10px]"
              onClick={() => toggleSection(id)}
            >
              <Icon size={isMobile ? 24 : 58} color={iconColor} />
              <h2 className="tw:m-0 tw:flex-1 tw:max-lg:text-base">{title}</h2>
            </button>
            <p
              className={`${paragraphBaseClasses} ${
                expandedSections[id]
                  ? paragraphExpandedClasses
                  : paragraphCollapsedClasses
              }`}
            >
              {content}
            </p>
          </div>
        ))}
      </div>
    </aside>
  );
}
