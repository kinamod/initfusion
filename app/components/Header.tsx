'use client';

import Link from 'next/link';

export function Header() {
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
