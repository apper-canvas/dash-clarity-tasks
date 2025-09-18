import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import CategoryItem from "@/components/molecules/CategoryItem"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { categoryService } from "@/services/api/categoryService"
import { taskService } from "@/services/api/taskService"

const CategorySidebar = ({ 
  selectedCategory,
  onCategorySelect,
  onCategoryEdit,
  onCategoryDelete,
  refreshTrigger = 0
}) => {
  const [categories, setCategories] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = async () => {
    setLoading(true)
    setError("")
    
    try {
      const [categoriesData, tasksData] = await Promise.all([
        categoryService.getAll(),
        taskService.getAll()
      ])
      
      // Calculate task counts for each category
      const categoriesWithCounts = categoriesData.map(category => ({
        ...category,
        taskCount: tasksData.filter(task => task.categoryId === category.Id).length
      }))
      
      setCategories(categoriesWithCounts)
      setTasks(tasksData)
    } catch (err) {
      setError("Failed to load categories")
      console.error("Error loading categories:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [refreshTrigger])

  const getTotalTaskCount = () => tasks.length
  const getCompletedTaskCount = () => tasks.filter(task => task.completed).length
  const getPendingTaskCount = () => tasks.filter(task => !task.completed).length

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return <Error error={error} onRetry={loadData} showRetry={false} />
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Overview
        </h3>
        
        <motion.div
          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-sm ${
            selectedCategory === "all" 
              ? "bg-primary-50 border-primary-200 shadow-sm" 
              : "bg-white border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => onCategorySelect("all")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-primary-400 to-primary-600" />
            <div>
              <h4 className="font-medium text-gray-900">All Tasks</h4>
              <p className="text-xs text-gray-500">{getTotalTaskCount()} total</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-sm ${
            selectedCategory === "completed" 
              ? "bg-success-50 border-success-200 shadow-sm" 
              : "bg-white border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => onCategorySelect("completed")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-success-400 to-success-600" />
            <div>
              <h4 className="font-medium text-gray-900">Completed</h4>
              <p className="text-xs text-gray-500">{getCompletedTaskCount()} tasks</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-sm ${
            selectedCategory === "pending" 
              ? "bg-orange-50 border-orange-200 shadow-sm" 
              : "bg-white border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => onCategorySelect("pending")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-orange-400 to-orange-600" />
            <div>
              <h4 className="font-medium text-gray-900">Pending</h4>
              <p className="text-xs text-gray-500">{getPendingTaskCount()} tasks</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Categories
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCategoryEdit(null)}
            className="p-2 h-auto"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <motion.div
                key={category.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CategoryItem
                  category={category}
                  isActive={selectedCategory === category.Id}
                  onClick={() => onCategorySelect(category.Id)}
                  onEdit={onCategoryEdit}
                  onDelete={onCategoryDelete}
                />
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <ApperIcon name="FolderPlus" className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-3">No categories yet</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onCategoryEdit(null)}
              >
                Create First Category
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategorySidebar