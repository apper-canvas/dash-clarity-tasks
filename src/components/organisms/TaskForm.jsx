import { useState, useEffect } from "react"
import { format } from "date-fns"
import { toast } from "react-toastify"
import Input from "@/components/atoms/Input"
import TextArea from "@/components/atoms/TextArea"
import Select from "@/components/atoms/Select"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"

const TaskForm = ({ 
  task = null, 
  categories = [],
  onSubmit, 
  onCancel 
}) => {
const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "Not Started",
    categoryId: "",
    dueDate: ""
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (task) {
setFormData({
        title: task.title || "",
        description: task.description || "",
priority: task.priority || "medium",
        status: task.status || "Not Started",
        categoryId: task.categoryId || "",
        dueDate: task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : ""
      })
    }
  }, [task])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required"
    }
    
    if (formData.dueDate && new Date(formData.dueDate) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.dueDate = "Due date cannot be in the past"
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
const taskData = {
...formData,
        dueDate: formData.dueDate ? formData.dueDate : null
      }

      await onSubmit(taskData)
      toast.success(task ? "Task updated successfully!" : "Task created successfully!")
      
      if (!task) {
        setFormData({
          title: "",
description: "",
          priority: "medium",
          status: "Not Started",
          categoryId: "",
          dueDate: ""
        })
      }
    } catch (error) {
      toast.error("Failed to save task. Please try again.")
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
        label="Task Title" 
        required 
        error={errors.title}
      >
        <Input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="What needs to be done?"
          error={!!errors.title}
          maxLength={100}
        />
      </FormField>

      <FormField 
        label="Description" 
        error={errors.description}
      >
        <TextArea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Add more details about this task..."
          rows={3}
          maxLength={500}
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField 
          label="Priority" 
          error={errors.priority}
        >
          <Select
            value={formData.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </Select>
        </FormField>

        <FormField 
          label="Category" 
          error={errors.categoryId}
        >
          <Select
            value={formData.categoryId}
            onChange={(e) => handleChange("categoryId", e.target.value)}
          >
            <option value="">No Category</option>
            {categories.map((category) => (
<option key={category.Id} value={category.Id}>
                {category.name}
              </option>
            ))}
          </Select>
        </FormField>
      </div>
<FormField 
        label="Status" 
        error={errors.status}
      >
        <Select
          value={formData.status}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
        </Select>
      </FormField>

      <FormField
        label="Due Date" 
        error={errors.dueDate}
      >
        <Input
          type="date"
          value={formData.dueDate}
          onChange={(e) => handleChange("dueDate", e.target.value)}
          min={format(new Date(), "yyyy-MM-dd")}
          error={!!errors.dueDate}
        />
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
            ? (task ? "Updating..." : "Creating...") 
            : (task ? "Update Task" : "Create Task")
          }
        </Button>
      </div>
    </form>
  )
}

export default TaskForm