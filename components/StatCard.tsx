import clsx from "clsx";
import Image from "next/image";
import React from "react";

interface StatCardProps {
  type: "scheduled" | "pending" | "cancelled";
  count: number | undefined;
  label: string;
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({
  type,
  count = 0,
  label,
  icon,
}) => {
  return (
    <div
      className={clsx("stat-card", {
        "bg-appointments": type === "scheduled",
        "bg-pending": type === "pending",
        "bg-cancelled": type === "cancelled",
      })}
    >
      <div className="flex items-center gap-4">
        <Image
          src={icon}
          alt={label}
          width={24}
          height={24}
          className="size-8 w-fit"
        />
        <h2 className="text-32-bold text-white">{count}</h2>
      </div>
      <p className="text-14-regular">{label}</p>
    </div>
  );
};

export default StatCard;
