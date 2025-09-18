import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Header from "@/components/organisms/Header"
import CategorySidebar from "@/components/organisms/CategorySidebar"
import TaskList from "@/components/organisms/TaskList"
import TaskForm from "@/components/organisms/TaskForm"
import CategoryForm from "@/components/organisms/CategoryForm"
import Modal from "@/components/molecules/Modal"
import ConfirmDialog from "@/components/molecules/ConfirmDialog"
import { taskService } from "@/services/api/taskService"
import { categoryService } from "@/services/api/categoryService"

const TasksPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    priority: "all"
  })
  const [categories, setCategories] = useState([])
  
  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Current items
  const [currentTask, setCurrentTask] = useState(null)
  const [currentCategory, setCurrentCategory] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [deleteType, setDeleteType] = useState("task")
  
  // Refresh trigger
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    loadCategories()
  }, [refreshTrigger])

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (err) {
      console.error("Error loading categories:", err)
    }
  }

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId)
    
    // Update filters based on selection
    if (categoryId === "all") {
      setFilters(prev => ({ ...prev, status: "all", category: "all" }))
    } else if (categoryId === "completed") {
      setFilters(prev => ({ ...prev, status: "completed", category: "all" }))
    } else if (categoryId === "pending") {
      setFilters(prev => ({ ...prev, status: "pending", category: "all" }))
    } else {
      setFilters(prev => ({ ...prev, status: "all", category: categoryId }))
    }
    
    // Close mobile menu
    setIsMobileMenuOpen(false)
  }

  const handleCreateTask = () => {
    setCurrentTask(null)
    setIsTaskModalOpen(true)
  }

  const handleEditTask = (task) => {
    setCurrentTask(task)
    setIsTaskModalOpen(true)
  }

  const handleDeleteTask = (task) => {
    setItemToDelete(task)
    setDeleteType("task")
    setIsDeleteDialogOpen(true)
  }

  const handleTaskSubmit = async (taskData) => {
    try {
      if (currentTask) {
        await taskService.update(currentTask.Id, taskData)
      } else {
        await taskService.create(taskData)
      }
      
      setIsTaskModalOpen(false)
      setCurrentTask(null)
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      throw error
    }
  }

  const handleCreateCategory = () => {
    setCurrentCategory(null)
    setIsCategoryModalOpen(true)
  }

  const handleEditCategory = (category) => {
    setCurrentCategory(category)
    setIsCategoryModalOpen(true)
  }

  const handleDeleteCategory = (category) => {
    setItemToDelete(category)
    setDeleteType("category")
    setIsDeleteDialogOpen(true)
  }

  const handleCategorySubmit = async (categoryData) => {
    try {
      if (currentCategory) {
        await categoryService.update(currentCategory.Id, categoryData)
      } else {
        await categoryService.create(categoryData)
      }
      
      setIsCategoryModalOpen(false)
      setCurrentCategory(null)
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      throw error
    }
  }

  const handleConfirmDelete = async () => {
    try {
      if (deleteType === "task") {
        await taskService.delete(itemToDelete.Id)
        toast.success("Task deleted successfully")
      } else {
        await categoryService.delete(itemToDelete.Id)
        toast.success("Category deleted successfully")
      }
      
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      toast.error(`Failed to delete ${deleteType}`)
      console.error(`Error deleting ${deleteType}:`, error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onCreateTask={handleCreateTask}
        onSearch={setSearchTerm}
        onFilterChange={setFilters}
        categories={categories}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <CategorySidebar
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
              onCategoryEdit={handleEditCategory}
              onCategoryDelete={handleDeleteCategory}
              refreshTrigger={refreshTrigger}
            />
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div 
              className="fixed inset-0 bg-black opacity-50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative flex flex-col w-80 bg-white transform transition-transform duration-300 ease-in-out translate-x-0">
              <div className="p-6">
                <CategorySidebar
                  selectedCategory={selectedCategory}
                  onCategorySelect={handleCategorySelect}
                  onCategoryEdit={handleEditCategory}
                  onCategoryDelete={handleDeleteCategory}
                  refreshTrigger={refreshTrigger}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          <div className="max-w-4xl mx-auto p-6">
            <TaskList
              searchTerm={searchTerm}
              filters={filters}
              onTaskEdit={handleEditTask}
              onTaskDelete={handleDeleteTask}
              refreshTrigger={refreshTrigger}
            />
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false)
          setCurrentTask(null)
        }}
        title={currentTask ? "Edit Task" : "Create New Task"}
        size="lg"
      >
        <TaskForm
          task={currentTask}
          categories={categories}
          onSubmit={handleTaskSubmit}
          onCancel={() => {
            setIsTaskModalOpen(false)
            setCurrentTask(null)
          }}
        />
      </Modal>

      {/* Category Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false)
          setCurrentCategory(null)
        }}
        title={currentCategory ? "Edit Category" : "Create New Category"}
      >
        <CategoryForm
          category={currentCategory}
          onSubmit={handleCategorySubmit}
          onCancel={() => {
            setIsCategoryModalOpen(false)
            setCurrentCategory(null)
          }}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete ${deleteType === "task" ? "Task" : "Category"}`}
        message={`Are you sure you want to delete "${itemToDelete?.title || itemToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  )
}

export default TasksPage