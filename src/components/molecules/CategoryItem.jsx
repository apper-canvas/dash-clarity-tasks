import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { cn } from "@/utils/cn"

const CategoryItem = ({ 
  category, 
  isActive = false,
  onClick,
  onEdit,
  onDelete,
  className 
}) => {
  return (
    <div 
      className={cn(
        "group flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-sm",
        isActive ? "bg-primary-50 border-primary-200 shadow-sm" : "bg-white border-gray-200 hover:border-gray-300",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div 
          className="w-4 h-4 rounded-full flex-shrink-0"
          style={{ backgroundColor: category.color }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">
            {category.name}
          </h3>
          <p className="text-xs text-gray-500">
            {category.taskCount} {category.taskCount === 1 ? "task" : "tasks"}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onEdit?.(category)
          }}
          className="p-1 h-auto"
        >
          <ApperIcon name="Edit2" className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.(category)
          }}
          className="p-1 h-auto text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <ApperIcon name="Trash2" className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export default CategoryItem