import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  className,
  title = "No items found",
  description = "Get started by adding your first item",
  actionLabel = "Add Item",
  onAction,
  icon = "Inbox",
  ...props 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)} {...props}>
      <div className="flex flex-col items-center space-y-6 max-w-md">
        <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-50 to-primary-100 rounded-full">
          <ApperIcon name={icon} className="w-10 h-10 text-primary-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className="btn-primary flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>{actionLabel}</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default Empty