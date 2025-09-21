import { axiosInstance } from '@/lib/axiosInstance'

export interface Habit {
  _id: string
  title: string
  description: string
  frequency: 'daily' | 'weekly' | 'monthly'
  days: string[]
  startDate: string
  completedDates: string[]
  streak: number
  longestStreak: number
  lastCompletedAt: string | null
  linkedGoalId: string | null
  icon: string
  category: string
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateHabitData {
  title: string
  frequency: 'daily' | 'weekly' | 'monthly'
  days?: string[]
  startDate: string
  icon?: string
  category: string
  linkedGoalId?: string
}

export interface UpdateHabitData extends Partial<CreateHabitData> {
  _id: string
}

export const habitsService = {
  // Get all habits
  getHabits: async (): Promise<Habit[]> => {
    const response = await axiosInstance.get('/habit')
    return response.data
  },

  // Create new habit
  createHabit: async (data: CreateHabitData): Promise<Habit> => {
    const response = await axiosInstance.post('/habit', data)
    return response.data
  },

  // Update habit
  updateHabit: async (data: UpdateHabitData): Promise<Habit> => {
    const { _id, ...updateData } = data
    const response = await axiosInstance.patch(`/habit/${_id}`, updateData)
    return response.data
  },

  // Delete habit
  deleteHabit: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/habit/${id}`)
  },

  // Toggle today's completion
  toggleTodayCompletion: async (id: string): Promise<Habit> => {
    const response = await axiosInstance.patch(`/habit/${id}/complete`)
    return response.data.habit
  }
}
