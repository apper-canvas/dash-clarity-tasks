import { toast } from 'react-toastify';

class CategoryService {
  constructor() {
    // Initialize ApperClient
    this.getClient = () => {
      const { ApperClient } = window.ApperSDK;
      return new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    };
  }

  async getAll() {
    try {
      const client = this.getClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "task_count_c"}}
        ]
      };

      const response = await client.fetchRecords('category_c', params);
      
      if (!response.success) {
        console.error("Error fetching categories:", response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database fields to UI format
      return response.data.map(category => ({
        Id: category.Id,
        name: category.name_c || category.Name || '',
        color: category.color_c || '#64748b',
        taskCount: category.task_count_c || 0
      }));
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error);
      toast.error("Failed to load categories");
      return [];
    }
  }

  async getById(id) {
    try {
      const client = this.getClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "task_count_c"}}
        ]
      };

      const response = await client.getRecordById('category_c', id, params);

      if (!response.success) {
        console.error(`Error fetching category ${id}:`, response.message);
        toast.error(response.message);
        return null;
      }

      // Transform database fields to UI format
      const category = response.data;
      return {
        Id: category.Id,
        name: category.name_c || category.Name || '',
        color: category.color_c || '#64748b',
        taskCount: category.task_count_c || 0
      };
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to load category");
      return null;
    }
  }

  async create(categoryData) {
    try {
      const client = this.getClient();
      
      // Transform UI data to database format - only updateable fields
      const dbCategoryData = {
        Name: categoryData.name || '',
        name_c: categoryData.name || '',
        color_c: categoryData.color || '#64748b',
        task_count_c: 0
      };

      const params = {
        records: [dbCategoryData]
      };

      const response = await client.createRecord('category_c', params);

      if (!response.success) {
        console.error("Error creating category:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} categories:`, JSON.stringify(failed));
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdCategory = successful[0].data;
          // Transform back to UI format
          return {
            Id: createdCategory.Id,
            name: createdCategory.name_c || createdCategory.Name || '',
            color: createdCategory.color_c || '#64748b',
            taskCount: createdCategory.task_count_c || 0
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating category:", error?.response?.data?.message || error);
      toast.error("Failed to create category");
      return null;
    }
  }

  async update(id, categoryData) {
    try {
      const client = this.getClient();
      
      // Transform UI data to database format - only updateable fields
      const dbCategoryData = {
        Id: id,
        Name: categoryData.name || categoryData.Name || '',
        name_c: categoryData.name || '',
        color_c: categoryData.color || '#64748b',
        task_count_c: categoryData.taskCount !== undefined ? categoryData.taskCount : 0
      };

      const params = {
        records: [dbCategoryData]
      };

      const response = await client.updateRecord('category_c', params);

      if (!response.success) {
        console.error("Error updating category:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} categories:`, JSON.stringify(failed));
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedCategory = successful[0].data;
          // Transform back to UI format
          return {
            Id: updatedCategory.Id,
            name: updatedCategory.name_c || updatedCategory.Name || '',
            color: updatedCategory.color_c || '#64748b',
            taskCount: updatedCategory.task_count_c || 0
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating category:", error?.response?.data?.message || error);
      toast.error("Failed to update category");
      return null;
    }
  }

  async delete(id) {
    try {
      const client = this.getClient();
      const params = {
        RecordIds: [id]
      };

      const response = await client.deleteRecord('category_c', params);

      if (!response.success) {
        console.error("Error deleting category:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} categories:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting category:", error?.response?.data?.message || error);
      toast.error("Failed to delete category");
      return false;
    }
  }
}

export const categoryService = new CategoryService()