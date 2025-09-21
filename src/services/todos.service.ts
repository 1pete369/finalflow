import { axiosInstance } from "@/lib/axiosInstance"

export interface Todo {
  _id: string
  title: string
  description: string
  isCompleted: boolean
  startTime: string
  endTime: string
  category: string
  icon: string
  recurring: "none" | "daily" | "weekly" | "monthly"
  days: string[]
  priority: "low" | "medium" | "high"
  completedDates: string[]
  scheduledDate: string
  color: "blue" | "green" | "purple" | "orange" | "red" | "pink" | "indigo" | "teal" | "yellow" | "gray"
  createdAt: string
  updatedAt: string
}

export interface CreateTodoData {
  title: string
  description: string
  priority: "low" | "medium" | "high"
  dueDate: string
  category: string
  startTime: string
  endTime: string
  icon: string
  recurring: "none" | "daily" | "weekly" | "monthly"
  days: string[]
  color: "blue" | "green" | "purple" | "orange" | "red" | "pink" | "indigo" | "teal" | "yellow" | "gray"
}

export interface UpdateTodoData extends Partial<CreateTodoData> {
  _id: string
}

const baseUrl = "/task"

// Get all todos
export const getTodos = async (): Promise<Todo[]> => {
  try {
    const response = await axiosInstance.get(baseUrl)
    return response.data
  } catch (error) {
    console.error("Error fetching todos:", error)
    throw error
  }
}

// Create a new todo
export const createTodo = async (todoData: CreateTodoData): Promise<Todo> => {
  try {
    const response = await axiosInstance.post(baseUrl, {
      ...todoData,
      scheduledDate: todoData.dueDate,
      isCompleted: false,
      completedDates: [],
    })
    return response.data
  } catch (error) {
    console.error("Error creating todo:", error)
    throw error
  }
}

// Update an existing todo
export const updateTodo = async (todoData: UpdateTodoData): Promise<Todo> => {
  try {
    const { _id, ...updateData } = todoData
    const response = await axiosInstance.patch(`${baseUrl}/${_id}`, {
      ...updateData,
      scheduledDate: updateData.dueDate,
    })
    return response.data
  } catch (error) {
    console.error("Error updating todo:", error)
    throw error
  }
}

// Delete a todo
export const deleteTodo = async (todoId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`${baseUrl}/${todoId}`)
  } catch (error) {
    console.error("Error deleting todo:", error)
    throw error
  }
}

// Toggle todo completion status
export const toggleTodoStatus = async (todoId: string): Promise<Todo> => {
  try {
    const response = await axiosInstance.patch(`${baseUrl}/${todoId}/toggle`)
    return response.data
  } catch (error) {
    console.error("Error toggling todo status:", error)
    throw error
  }
}
