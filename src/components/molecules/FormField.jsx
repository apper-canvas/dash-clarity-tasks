import Label from "@/components/atoms/Label"
import { cn } from "@/utils/cn"

const FormField = ({ 
  label, 
  error, 
  required = false,
  children,
  className 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label required={required}>
          {label}
        </Label>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export default FormField