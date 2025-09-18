import { useState } from "react"
import { format, isToday, isFuture, isPast } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Checkbox from "@/components/atoms/Checkbox"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import { cn } from "@/utils/cn"

const TaskCard = ({ 
  task, 
  category,
  onToggleComplete,
  onEdit,
  onDelete,
  className 
}) => {
  const [isCompleting, setIsCompleting] = useState(false)

  const handleToggleComplete = async () => {
    setIsCompleting(true)
    await new Promise(resolve => setTimeout(resolve, 300)) // Animation delay
    onToggleComplete?.(task.Id)
    setIsCompleting(false)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-500"
      case "medium": return "bg-orange-500"
      case "low": return "bg-blue-500"
      default: return "bg-gray-500"
    }
  }

  const getDateStatus = () => {
    if (!task.dueDate) return null
    
    const dueDate = new Date(task.dueDate)
    if (isToday(dueDate)) return "today"
    if (isPast(dueDate) && !task.completed) return "overdue"
    if (isFuture(dueDate)) return "upcoming"
    return null
  }

  const dateStatus = getDateStatus()

  return (
    <div 
      className={cn(
        "card p-4 border-l-4 transition-all duration-300",
        task.completed && "task-completed animate-task-complete",
        isCompleting && "animate-task-complete",
        className
      )}
      style={{
        borderLeftColor: category?.color || "#64748b"
      }}
    >
      <div className="flex items-start space-x-3">
        <Checkbox
          checked={task.completed}
          onChange={handleToggleComplete}
          animated={true}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <div 
                  className={cn("w-2 h-2 rounded-full", getPriorityColor(task.priority))}
                />
                <h3 className={cn(
                  "font-medium text-gray-900 truncate",
                  task.completed && "line-through text-gray-500"
                )}>
                  {task.title}
                </h3>
              </div>
              
              {task.description && (
                <p className={cn(
                  "text-sm text-gray-600 mb-2",
                  task.completed && "line-through text-gray-400"
                )}>
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center space-x-2 text-xs">
                {category && (
                  <Badge 
                    variant="default"
                    size="sm"
                    className="category-badge"
                    style={{
                      backgroundColor: `${category.color}20`,
                      color: category.color,
                      borderColor: `${category.color}40`
                    }}
                  >
                    {category.name}
                  </Badge>
                )}
                
                <Badge variant={task.priority} size="sm">
                  {task.priority}
                </Badge>
                
                {dateStatus && (
                  <Badge 
                    variant={dateStatus === "overdue" ? "danger" : dateStatus === "today" ? "warning" : "default"}
                    size="sm"
                  >
                    {dateStatus === "today" ? "Due Today" : 
                     dateStatus === "overdue" ? "Overdue" : "Upcoming"}
                  </Badge>
                )}
              </div>
              
              {task.dueDate && (
                <div className="flex items-center space-x-1 mt-2 text-xs text-gray-500">
                  <ApperIcon name="Calendar" className="w-3 h-3" />
                  <span>{format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-1 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(task)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
              >
                <ApperIcon name="Edit2" className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete?.(task)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskCard