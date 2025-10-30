"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const deliveryData = [
  { hour: "8 AM", volume: 12 },
  { hour: "10 AM", volume: 28 },
  { hour: "12 PM", volume: 35 },
  { hour: "2 PM", volume: 42 },
  { hour: "4 PM", volume: 31 },
  { hour: "6 PM", volume: 48 },
];

export function DeliveryVolumeChart() {
  return (
    <div className="w-full h-80 mt-8 p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
        Delivery Volume by Hour
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={deliveryData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e4e4e7"
            opacity={0.5}
          />
          <XAxis
            dataKey="hour"
            stroke="#71717a"
            style={{ fontSize: "12px" }}
          />
          <YAxis stroke="#71717a" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: "8px",
              color: "#fafafa",
            }}
            cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
          />
          <Bar
            dataKey="volume"
            fill="#3b82f6"
            radius={[8, 8, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
