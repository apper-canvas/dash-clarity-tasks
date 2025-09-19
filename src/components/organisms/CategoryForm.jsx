import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Input from "@/components/atoms/Input"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"

const CategoryForm = ({ 
  category = null, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    name: "",
    color: "#2563eb"
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultColors = [
    "#2563eb", "#dc2626", "#059669", "#d97706", 
    "#7c3aed", "#db2777", "#0891b2", "#65a30d"
  ]

  useEffect(() => {
if (category) {
      setFormData({
        name: category.name || "",
        color: category.color || "#2563eb"
      })
    }
  }, [category])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Category name is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Please fix the errors below")
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit(formData)
      toast.success(category ? "Category updated successfully!" : "Category created successfully!")
      
      if (!category) {
        setFormData({
          name: "",
          color: "#2563eb"
        })
      }
    } catch (error) {
      toast.error("Failed to save category. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField 
        label="Category Name" 
        required 
        error={errors.name}
      >
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter category name"
          error={!!errors.name}
          maxLength={50}
        />
      </FormField>

      <FormField 
        label="Color" 
        error={errors.color}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-8 gap-2">
            {defaultColors.map((color) => (
              <button
                key={color}
                type="button"
                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                  formData.color === color 
                    ? "border-gray-400 scale-110" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => handleChange("color", color)}
              />
            ))}
          </div>
          
          <div className="flex items-center space-x-3">
            <Input
              type="color"
              value={formData.color}
              onChange={(e) => handleChange("color", e.target.value)}
              className="w-12 h-10 p-1 border-gray-300"
            />
            <span className="text-sm text-gray-600">Custom color</span>
          </div>
        </div>
      </FormField>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? (category ? "Updating..." : "Creating...") 
            : (category ? "Update Category" : "Create Category")
          }
        </Button>
      </div>
    </form>
  )
}

export default CategoryForm