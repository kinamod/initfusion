'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Header } from './components/Header';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Parking Management Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions for managing parking zones, tariffs, and operations
            </p>
          </div>

          {/* Apps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Parking Zone Manager Card */}
            <Link href="/zones">
              <div className="h-full rounded-lg border border-gray-200 bg-white hover:shadow-lg hover:border-blue-300 transition-all duration-200 overflow-hidden cursor-pointer group">
                {/* Card Header Background */}
                <div className="h-32 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <div className="bg-blue-600 rounded-lg p-4 group-hover:bg-blue-700 transition">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                    Parking Zone Manager
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Create and manage parking zones on an interactive map, configure tariffs, and visualize parking areas with real-time coordinate tracking.
                  </p>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs font-medium text-gray-500">Launch Application</span>
                    <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Info Section */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 mb-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Start</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">1</div>
                <h4 className="font-medium text-gray-900 mb-2">Create Zones</h4>
                <p className="text-sm text-gray-600">
                  Draw parking zones directly on the interactive map by clicking points to define boundaries.
                </p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">2</div>
                <h4 className="font-medium text-gray-900 mb-2">Configure Tariffs</h4>
                <p className="text-sm text-gray-600">
                  Set pricing for different time durations and manage tariff structures for each zone.
                </p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
                <h4 className="font-medium text-gray-900 mb-2">Track & Optimize</h4>
                <p className="text-sm text-gray-600">
                  View coordinates, edit zone shapes, and maintain your parking infrastructure efficiently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Arrive Tooling</h4>
              <p className="text-sm text-gray-600">
                Enterprise parking management solutions for modern cities.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition">
                    Updates
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-600">
              &copy; 2024 Arrive Tooling. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition">
                Twitter
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition">
                LinkedIn
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
