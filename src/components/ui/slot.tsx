import React, { type ReactNode } from "react";

interface SlotProps {
  children?: ReactNode;
  [key: string]: unknown;
}

const Slot = ({ children, ...props }: SlotProps) => {
  if (!children || !React.isValidElement(children)) {
    return null;
  }

  const childProps: Record<string, unknown> = {};
  for (const key in props) {
    if (key !== "children") {
      childProps[key] = props[key];
    }
  }

  return React.cloneElement(children, childProps);
};

Slot.displayName = "Slot";

export { Slot };
