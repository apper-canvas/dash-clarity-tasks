import tasksData from "@/services/mockData/tasks.json"

class TaskService {
  constructor() {
    this.tasks = [...tasksData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.tasks]
  }

  async getById(id) {
    await this.delay(200)
    const task = this.tasks.find(t => t.Id === id)
    if (!task) {
      throw new Error("Task not found")
    }
    return { ...task }
  }

  async create(taskData) {
    await this.delay(400)
    
    const newTask = {
      Id: this.getNextId(),
      title: taskData.title,
      description: taskData.description || "",
      completed: false,
      priority: taskData.priority,
      categoryId: taskData.categoryId || null,
      dueDate: taskData.dueDate,
      createdAt: new Date(),
      completedAt: null
    }

    this.tasks.push(newTask)
    return { ...newTask }
  }

  async update(id, taskData) {
    await this.delay(350)
    
    const taskIndex = this.tasks.findIndex(t => t.Id === id)
    if (taskIndex === -1) {
      throw new Error("Task not found")
    }

    const updatedTask = {
      ...this.tasks[taskIndex],
      ...taskData
    }

    this.tasks[taskIndex] = updatedTask
    return { ...updatedTask }
  }

  async delete(id) {
    await this.delay(300)
    
    const taskIndex = this.tasks.findIndex(t => t.Id === id)
    if (taskIndex === -1) {
      throw new Error("Task not found")
    }

    const deletedTask = this.tasks.splice(taskIndex, 1)[0]
    return { ...deletedTask }
  }

  getNextId() {
    const maxId = Math.max(...this.tasks.map(t => t.Id), 0)
    return maxId + 1
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const taskService = new TaskService()