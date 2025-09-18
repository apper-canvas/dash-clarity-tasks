import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ 
  className, 
  error = "Something went wrong", 
  onRetry,
  showRetry = true,
  ...props 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)} {...props}>
      <div className="flex flex-col items-center space-y-4 max-w-md">
        <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Oops! Something went wrong</h3>
          <p className="text-gray-600">{error}</p>
        </div>
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="btn-primary flex items-center space-x-2"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default Error