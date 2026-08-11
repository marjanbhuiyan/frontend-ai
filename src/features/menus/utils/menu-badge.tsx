import React from "react";
import type { Menu } from "@/features/menus/types";

export function MenuBadge({
  badge,
}: {
  badge: NonNullable<Menu["badge"]>;
}): React.JSX.Element {
  const variants: Record<string, string> = {
    teal: "bg-teal-50 text-teal-600",
    red: "bg-red-50 text-red-500",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    default: "bg-gray-100 text-gray-500",
  };
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[0.6rem] font-semibold leading-none ${variants[badge.variant] || variants.default}`}
    >
      {badge.title}
    </span>
  );
}
