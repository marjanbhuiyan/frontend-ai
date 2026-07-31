import * as React from "react"
import { cn } from "@/lib/utils"

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  checked?: boolean | "indeterminate"
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    const innerRef = React.useRef<HTMLInputElement>(null)
    const resolvedRef = (ref || innerRef) as React.RefObject<HTMLInputElement>

    React.useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = checked === "indeterminate"
      }
    }, [checked, resolvedRef])

    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={checked === "indeterminate" ? "mixed" : checked}
        data-state={checked === true ? "checked" : checked === "indeterminate" ? "indeterminate" : "unchecked"}
        className={cn(
          "peer h-4 w-4 shrink-0 rounded border transition-colors outline-none",
          "border-gray-300 bg-white hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          checked === true && "border-blue-600 bg-blue-600 hover:bg-blue-600",
          checked === "indeterminate" && "border-blue-600 bg-blue-600 hover:bg-blue-600",
          className
        )}
        onClick={() => {
          if (checked === "indeterminate") {
            onCheckedChange?.(true)
          } else {
            onCheckedChange?.(!checked)
          }
        }}
        {...props}
      >
        {checked === true && (
          <svg
            className="h-3 w-3 text-white"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {checked === "indeterminate" && (
          <svg
            className="h-3 w-3 text-white"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.5 7H10.5"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>
    )
  }
)

Checkbox.displayName = "Checkbox"

export { Checkbox }
