import React from "react";

type Status = "on-schedule" | "delayed" | "en-route";

interface StatusBadgeProps {
  status: Status;
  label: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const statusStyles: Record<Status, { bg: string; text: string }> = {
    "on-schedule": {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      text: "text-emerald-700 dark:text-emerald-300",
    },
    delayed: {
      bg: "bg-amber-50 dark:bg-amber-950/40",
      text: "text-amber-700 dark:text-amber-300",
    },
    "en-route": {
      bg: "bg-blue-50 dark:bg-blue-950/40",
      text: "text-blue-700 dark:text-blue-300",
    },
  };

  const styles = statusStyles[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${styles.bg} ${styles.text}`}
    >
      <span className={`inline-block w-2 h-2 rounded-full
        ${status === 'on-schedule' ? 'bg-emerald-500 dark:bg-emerald-400' : ''}
        ${status === 'delayed' ? 'bg-amber-500 dark:bg-amber-400' : ''}
        ${status === 'en-route' ? 'bg-blue-500 dark:bg-blue-400' : ''}
      `} />
      {label}
    </span>
  );
}
