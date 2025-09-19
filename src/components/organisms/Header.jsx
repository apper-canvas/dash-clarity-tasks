import { useState, useContext } from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import { AuthContext } from "@/App"
const Header = ({ 
  onCreateTask,
  onSearch,
  onFilterChange,
  categories = [],
  isMobileMenuOpen,
  onMobileMenuToggle
}) => {
  const [showSearch, setShowSearch] = useState(false)
  const { logout } = useContext(AuthContext)

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMobileMenuToggle}
              className="p-2 h-auto"
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
            </Button>
          </div>

          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckCircle2" className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Clarity Tasks</h1>
                <p className="text-xs text-gray-500">Streamlined Task Management</p>
              </div>
            </div>
          </div>

          {/* Desktop Actions */}
<div className="hidden md:flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Search" className="w-4 h-4" />
              <span>Search</span>
            </Button>
            
            <Button
              variant="primary"
              onClick={onCreateTask}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span>Add Task</span>
            </Button>

            <Button
              variant="ghost"
              onClick={logout}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="LogOut" className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
<div className="hidden md:flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Search" className="w-4 h-4" />
              <span>Search</span>
            </Button>
            
            <Button
              variant="primary"
              onClick={onCreateTask}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span>Add Task</span>
            </Button>
          </div>

          {/* Mobile Actions */}
<div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 h-auto"
            >
              <ApperIcon name="Search" className="w-5 h-5" />
            </Button>
            
            <Button
              variant="primary"
              size="sm"
              onClick={onCreateTask}
              className="p-2 h-auto"
            >
              <ApperIcon name="Plus" className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="p-2 h-auto"
            >
              <ApperIcon name="LogOut" className="w-5 h-5" />
            </Button>
          </div>
<div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 h-auto"
            >
              <ApperIcon name="Search" className="w-5 h-5" />
            </Button>
            
            <Button
              variant="primary"
              size="sm"
              onClick={onCreateTask}
              className="p-2 h-auto"
            >
              <ApperIcon name="Plus" className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="pb-4 border-t border-gray-100 mt-2 pt-4">
            <SearchBar
              onSearch={onSearch}
              onFilterChange={onFilterChange}
              categories={categories}
            />
          </div>
        )}
      </div>
    </header>
  )
}

export default Header