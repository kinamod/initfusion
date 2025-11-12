'use client';

import Link from 'next/link';

interface HeaderProps {
  showSimulationToggle?: boolean;
  simulationEnabled?: boolean;
  onSimulationToggle?: (enabled: boolean) => void;
  logoSrc?: string;
  logoAlt?: string;
  title?: string;
  brandColor?: string;
  contrastColor?: string;
  homeLink?: string;
}

export function Header({
  showSimulationToggle = false,
  simulationEnabled = false,
  onSimulationToggle,
  logoSrc = "https://a.storyblok.com/f/333594/109x31/6532cf8b92/logo_main_menu.svg",
  logoAlt = "Arrive Tooling",
  title = "Arrive Tooling Home",
  brandColor = "#ffffff",
  contrastColor,
  homeLink = "/"
}: HeaderProps) {
  const headerBgColor = brandColor === "#ffffff" ? "#ffffff" : brandColor;
  const headerTextColor = brandColor === "#ffffff" ? "#000000" : "#ffffff";
  const toggleBgColor = contrastColor || (simulationEnabled ? "bg-green-600" : "bg-gray-300");
  const toggleBgClass = contrastColor
    ? (simulationEnabled ? "transition-colors" : "transition-colors")
    : (simulationEnabled ? "bg-green-600" : "bg-gray-300");

  return (
    <header
      className="border-b sticky top-0 z-40 transition-colors"
      style={{ backgroundColor: headerBgColor, borderBottomColor: contrastColor || "#e5e7eb" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href={homeLink} className="flex items-center gap-3 hover:opacity-80 transition">
          <img
            src={logoSrc}
            alt={logoAlt}
            className="h-8"
          />
          {title && (
            <h1
              className="text-xl font-semibold"
              style={{ color: headerTextColor }}
            >
              {title}
            </h1>
          )}
        </Link>
        <nav className="flex items-center gap-6">
          {showSimulationToggle && (
            <label className="flex items-center gap-2 cursor-pointer">
              <span
                className="text-sm font-medium"
                style={{ color: headerTextColor }}
              >
                Simulate Car Activity
              </span>
              <div
                onClick={() => onSimulationToggle?.(!simulationEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${toggleBgClass}`}
                style={contrastColor ? {
                  backgroundColor: simulationEnabled ? contrastColor : "#cccccc"
                } : {}}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    simulationEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </div>
            </label>
          )}
          <a
            href="#"
            className="text-sm transition"
            style={{ color: headerTextColor }}
          >
            Documentation
          </a>
          <a
            href="#"
            className="text-sm transition"
            style={{ color: headerTextColor }}
          >
            Support
          </a>
        </nav>
      </div>
    </header>
  );
}
