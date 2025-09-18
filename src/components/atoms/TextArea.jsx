import React from "react"
import { cn } from "@/utils/cn"

const TextArea = React.forwardRef(({ 
  className, 
  error = false,
  rows = 3,
  ...props 
}, ref) => {
  return (
    <textarea
      className={cn(
        "form-input resize-none",
        error && "border-red-300 focus:border-red-500 focus:ring-red-500",
        className
      )}
      rows={rows}
      ref={ref}
      {...props}
    />
  )
})

TextArea.displayName = "TextArea"

export default TextArea