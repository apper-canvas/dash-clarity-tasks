import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import TaskCard from "@/components/molecules/TaskCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { taskService } from "@/services/api/taskService"
import { categoryService } from "@/services/api/categoryService"

const TaskList = ({ 
  searchTerm = "",
  filters = {},
  onTaskEdit,
  onTaskDelete,
  refreshTrigger = 0
}) => {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = async () => {
    setLoading(true)
    setError("")
    
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ])
      
      setTasks(tasksData)
      setCategories(categoriesData)
    } catch (err) {
      setError("Failed to load tasks")
      console.error("Error loading data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [refreshTrigger])

  const handleToggleComplete = async (taskId) => {
const task = tasks.find(t => t.Id === taskId)
    if (!task) return

const updatedTask = {
      ...task,
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : null
    }

    try {
const result = await taskService.update(taskId, updatedTask)
      if (result) {
        setTasks(prev => prev.map(t => t.Id === taskId ? result : t))
      }
    } catch (err) {
      console.error("Error updating task:", err)
    }
  }

  const filterTasks = () => {
    return tasks.filter(task => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        const matchesTitle = task.title.toLowerCase().includes(search)
        const matchesDescription = task.description?.toLowerCase().includes(search)
        if (!matchesTitle && !matchesDescription) return false
      }

      // Status filter
      if (filters.status === "completed" && !task.completed) return false
      if (filters.status === "pending" && task.completed) return false

      // Category filter
      if (filters.category !== "all" && task.categoryId !== filters.category) return false

      // Priority filter
      if (filters.priority !== "all" && task.priority !== filters.priority) return false

      return true
    })
  }

  const filteredTasks = filterTasks()

  if (loading) {
    return <Loading variant="skeleton" />
  }

  if (error) {
    return <Error error={error} onRetry={loadData} />
  }

  if (tasks.length === 0) {
    return (
      <Empty
        icon="CheckCircle2"
        title="No tasks yet"
        description="Create your first task to get started with better productivity"
        actionLabel="Create First Task"
        onAction={() => onTaskEdit?.(null)}
      />
    )
  }

  if (filteredTasks.length === 0) {
    return (
      <Empty
        icon="Search"
        title="No matching tasks"
        description="Try adjusting your search terms or filters"
        actionLabel="Clear Filters"
      />
    )
  }

const getCategoryById = (categoryId) => {
    // Handle both direct ID and lookup object format
    const id = typeof categoryId === 'object' ? categoryId.Id : categoryId
    return categories.find(cat => cat.Id === id)
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {filteredTasks.map((task, index) => (
          <motion.div
            key={task.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ 
              duration: 0.3,
              delay: Math.min(index * 0.05, 0.3)
            }}
            className="group"
          >
            <TaskCard
              task={task}
              category={getCategoryById(task.categoryId)}
              onToggleComplete={handleToggleComplete}
              onEdit={onTaskEdit}
              onDelete={onTaskDelete}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default TaskList