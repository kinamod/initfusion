"use client";

import React, { useState, useEffect } from "react";
import { sampleOrders, Order } from "../data/orders";
import { StatusBadge } from "./StatusBadge";
import { DeliveryVolumeChart } from "./DeliveryVolumeChart";

const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: string;
}> = ({ label, value, icon }) => (
  <div className="flex-1 min-w-64 p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
          {label}
        </p>
        <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          {value}
        </p>
      </div>
      <span className="text-2xl">{icon}</span>
    </div>
  </div>
);

function getStatusBadgeInfo(status: Order["status"]): { type: "on-schedule" | "delayed" | "en-route"; label: string } {
  switch (status) {
    case "confirmed":
      return { type: "on-schedule", label: "On Schedule" };
    case "en-route":
      return { type: "en-route", label: "En Route" };
    case "near-delivery":
      return { type: "on-schedule", label: "Arriving Soon" };
    default:
      return { type: "on-schedule", label: "On Schedule" };
  }
}

export function LiveDeliveryDashboard() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(sampleOrders);
  const [hoveredOrderId, setHoveredOrderId] = useState<string | null>(null);

  // Auto-update timestamp every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setCurrentTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter orders based on search term
  useEffect(() => {
    const lowercaseSearch = searchTerm.toLowerCase();
    const filtered = sampleOrders.filter((order) => {
      const matchesId = order.id.toLowerCase().includes(lowercaseSearch);
      const matchesStatus = order.riderStatus
        .toLowerCase()
        .includes(lowercaseSearch);
      return matchesId || matchesStatus;
    });
    setFilteredOrders(filtered);
  }, [searchTerm]);

  const totalActiveOrders = sampleOrders.length;
  const avgDeliveryTime = Math.round(
    sampleOrders.reduce((sum, order) => sum + order.estimatedArrival, 0) /
      totalActiveOrders
  );
  const onTimePercentage = 85;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                Live Delivery Hub
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Real-time Operations Dashboard
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                Current Time
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono">
                {currentTime || "00:00:00"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            label="Total Active Orders"
            value={totalActiveOrders}
            icon="📦"
          />
          <StatCard
            label="Average Delivery Time"
            value={`${avgDeliveryTime} min`}
            icon="⏱️"
          />
          <StatCard
            label="On-Time % Success Rate"
            value={`${onTimePercentage}%`}
            icon="✅"
          />
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by Order ID or Rider Status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600"
          />
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Vendor
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Est. Arrival
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Rider Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Distance
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const badgeInfo = getStatusBadgeInfo(order.status);
                const isHovered = hoveredOrderId === order.id;
                return (
                  <tr
                    key={order.id}
                    onMouseEnter={() => setHoveredOrderId(order.id)}
                    onMouseLeave={() => setHoveredOrderId(null)}
                    className={`border-b border-zinc-200 dark:border-zinc-800 transition-colors cursor-pointer ${
                      isHovered
                        ? "bg-blue-50 dark:bg-blue-950/20"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {order.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-zinc-900 dark:text-zinc-50">
                        {order.customer}
                      </span>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        {order.location}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {order.vendor}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-zinc-900 dark:text-zinc-50">
                        {order.estimatedArrival} min
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        status={badgeInfo.type}
                        label={badgeInfo.label}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-zinc-900 dark:text-zinc-50">
                        {order.distanceRemaining} km
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-zinc-500 dark:text-zinc-400">
                No orders found matching your search.
              </p>
            </div>
          )}
        </div>

        {/* Delivery Volume Chart */}
        <DeliveryVolumeChart />
      </main>
    </div>
  );
}
