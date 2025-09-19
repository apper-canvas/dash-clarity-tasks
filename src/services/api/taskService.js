import { toast } from 'react-toastify';

class TaskService {
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "category_id_c"}}
        ]
      };

      const response = await client.fetchRecords('task_c', params);
      
      if (!response.success) {
        console.error("Error fetching tasks:", response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database fields to UI format
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name || '',
        description: task.description_c || '',
        completed: task.completed_c || false,
        priority: task.priority_c || 'medium',
categoryId: task.category_id_c?.Id || task.category_id_c || null,
        status: task.status_c || 'Not Started',
        dueDate: task.due_date_c || null,
        createdAt: task.created_at_c || task.CreatedOn || new Date(),
        completedAt: task.completed_at_c || null
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      toast.error("Failed to load tasks");
      return [];
    }
  }

  async getById(id) {
    try {
      const client = this.getClient();
      const params = {
        fields: [
{"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "category_id_c"}}
        ]
      };

      const response = await client.getRecordById('task_c', id, params);

      if (!response.success) {
        console.error(`Error fetching task ${id}:`, response.message);
        toast.error(response.message);
        return null;
      }

      // Transform database fields to UI format
      const task = response.data;
      return {
        Id: task.Id,
        title: task.title_c || task.Name || '',
description: task.description_c || '',
        completed: task.completed_c || false,
        status: task.status_c || 'Not Started',
        priority: task.priority_c || 'medium',
        categoryId: task.category_id_c?.Id || task.category_id_c || null,
        dueDate: task.due_date_c || null,
        createdAt: task.created_at_c || task.CreatedOn || new Date(),
        completedAt: task.completed_at_c || null
      };
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to load task");
      return null;
    }
  }

  async create(taskData) {
    try {
      const client = this.getClient();
      
      // Transform UI data to database format - only updateable fields
      const dbTaskData = {
        Name: taskData.title || '',
        title_c: taskData.title || '',
        description_c: taskData.description || '',
completed_c: false,
        status_c: taskData.status || 'Not Started',
        priority_c: taskData.priority || 'medium',
        category_id_c: taskData.categoryId ? parseInt(taskData.categoryId) : null,
        due_date_c: taskData.dueDate || null,
        created_at_c: new Date().toISOString(),
        completed_at_c: null
      };

      const params = {
        records: [dbTaskData]
      };

      const response = await client.createRecord('task_c', params);

      if (!response.success) {
        console.error("Error creating task:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, JSON.stringify(failed));
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdTask = successful[0].data;
          // Transform back to UI format
          return {
            Id: createdTask.Id,
            title: createdTask.title_c || createdTask.Name || '',
            description: createdTask.description_c || '',
completed: createdTask.completed_c || false,
            status: createdTask.status_c || 'Not Started',
            priority: createdTask.priority_c || 'medium',
            categoryId: createdTask.category_id_c?.Id || createdTask.category_id_c || null,
            dueDate: createdTask.due_date_c || null,
            createdAt: createdTask.created_at_c || new Date(),
            completedAt: createdTask.completed_at_c || null
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      toast.error("Failed to create task");
      return null;
    }
  }

  async update(id, taskData) {
    try {
      const client = this.getClient();
      
      // Transform UI data to database format - only updateable fields
      const dbTaskData = {
        Id: id,
        Name: taskData.title || taskData.Name || '',
title_c: taskData.title || '',
        description_c: taskData.description || '',
        completed_c: taskData.completed !== undefined ? taskData.completed : false,
        status_c: taskData.status || 'Not Started',
        priority_c: taskData.priority || 'medium',
        category_id_c: taskData.categoryId ? parseInt(taskData.categoryId) : null,
        due_date_c: taskData.dueDate || null,
        completed_at_c: taskData.completedAt || null
      };

      const params = {
        records: [dbTaskData]
      };

      const response = await client.updateRecord('task_c', params);

      if (!response.success) {
        console.error("Error updating task:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, JSON.stringify(failed));
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedTask = successful[0].data;
          // Transform back to UI format
          return {
            Id: updatedTask.Id,
            title: updatedTask.title_c || updatedTask.Name || '',
description: updatedTask.description_c || '',
            completed: updatedTask.completed_c || false,
            status: updatedTask.status_c || 'Not Started',
            priority: updatedTask.priority_c || 'medium',
            categoryId: updatedTask.category_id_c?.Id || updatedTask.category_id_c || null,
            dueDate: updatedTask.due_date_c || null,
            createdAt: updatedTask.created_at_c || updatedTask.CreatedOn || new Date(),
            completedAt: updatedTask.completed_at_c || null
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      toast.error("Failed to update task");
      return null;
    }
  }

  async delete(id) {
    try {
      const client = this.getClient();
      const params = {
        RecordIds: [id]
      };

      const response = await client.deleteRecord('task_c', params);

      if (!response.success) {
        console.error("Error deleting task:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      toast.error("Failed to delete task");
      return false;
    }
  }
}

export const taskService = new TaskService()