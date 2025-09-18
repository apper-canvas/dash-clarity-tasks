import categoriesData from "@/services/mockData/categories.json"

class CategoryService {
  constructor() {
    this.categories = [...categoriesData]
  }

  async getAll() {
    await this.delay(250)
    return [...this.categories]
  }

  async getById(id) {
    await this.delay(200)
    const category = this.categories.find(c => c.Id === id)
    if (!category) {
      throw new Error("Category not found")
    }
    return { ...category }
  }

  async create(categoryData) {
    await this.delay(350)
    
    const newCategory = {
      Id: this.getNextId(),
      name: categoryData.name,
      color: categoryData.color,
      taskCount: 0
    }

    this.categories.push(newCategory)
    return { ...newCategory }
  }

  async update(id, categoryData) {
    await this.delay(300)
    
    const categoryIndex = this.categories.findIndex(c => c.Id === id)
    if (categoryIndex === -1) {
      throw new Error("Category not found")
    }

    const updatedCategory = {
      ...this.categories[categoryIndex],
      ...categoryData
    }

    this.categories[categoryIndex] = updatedCategory
    return { ...updatedCategory }
  }

  async delete(id) {
    await this.delay(300)
    
    const categoryIndex = this.categories.findIndex(c => c.Id === id)
    if (categoryIndex === -1) {
      throw new Error("Category not found")
    }

    const deletedCategory = this.categories.splice(categoryIndex, 1)[0]
    return { ...deletedCategory }
  }

  getNextId() {
    const maxId = Math.max(...this.categories.map(c => parseInt(c.Id)), 0)
    return (maxId + 1).toString()
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const categoryService = new CategoryService()