import React from "react"
import { cn } from "@/utils/cn"

const Checkbox = React.forwardRef(({ 
  className, 
  checked = false,
  onChange,
  animated = false,
  ...props 
}, ref) => {
  return (
    <input
      type="checkbox"
      className={cn(
        "checkbox-custom",
        animated && checked && "animate-checkmark",
        className
      )}
      ref={ref}
      checked={checked}
      onChange={onChange}
      {...props}
    />
  )
})

Checkbox.displayName = "Checkbox"

export default Checkbox