'use client';

import Link from 'next/link';

interface HeaderProps {
  showSimulationToggle?: boolean;
  simulationEnabled?: boolean;
  onSimulationToggle?: (enabled: boolean) => void;
}

export function Header({ showSimulationToggle = false, simulationEnabled = false, onSimulationToggle }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
          <img
            src="https://a.storyblok.com/f/333594/109x31/6532cf8b92/logo_main_menu.svg"
            alt="Arrive Tooling"
            className="h-8"
          />
          <h1 className="text-xl font-semibold text-gray-900">Arrive Tooling Home</h1>
        </Link>
        <nav className="flex items-center gap-6">
          {showSimulationToggle && (
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm font-medium text-gray-700">Simulate Car Activity</span>
              <div
                onClick={() => onSimulationToggle?.(!simulationEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  simulationEnabled ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    simulationEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </div>
            </label>
          )}
          <a href="#" className="text-sm text-gray-700 hover:text-gray-900 transition">
            Documentation
          </a>
          <a href="#" className="text-sm text-gray-700 hover:text-gray-900 transition">
            Support
          </a>
        </nav>
      </div>
    </header>
  );
}
