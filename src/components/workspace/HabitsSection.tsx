"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Plus, Edit, Trash2, Calendar, Flame, Target } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Habit {
  id: string
  title: string
  description: string
  frequency: "daily" | "weekly" | "monthly"
  goal: number
  currentStreak: number
  longestStreak: number
  completedToday: boolean
  category: string
  linkedGoal?: string
  createdAt: string
}

export default function HabitsSection() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    frequency: "daily" as const,
    goal: 1,
    category: "personal",
    linkedGoal: ""
  })

  // Mock data for now - will be replaced with API calls
  useEffect(() => {
    const mockHabits: Habit[] = [
      {
        id: "1",
        title: "Morning Exercise",
        description: "30 minutes of cardio or strength training",
        frequency: "daily",
        goal: 1,
        currentStreak: 7,
        longestStreak: 21,
        completedToday: true,
        category: "health",
        createdAt: "2024-01-01"
      },
      {
        id: "2",
        title: "Read 30 Minutes",
        description: "Read non-fiction books for personal growth",
        frequency: "daily",
        goal: 1,
        currentStreak: 3,
        longestStreak: 45,
        completedToday: false,
        category: "learning",
        createdAt: "2024-01-05"
      },
      {
        id: "3",
        title: "Code Practice",
        description: "Work on coding projects or learn new skills",
        frequency: "daily",
        goal: 1,
        currentStreak: 12,
        longestStreak: 12,
        completedToday: true,
        category: "learning",
        createdAt: "2024-01-10"
      }
    ]
    setHabits(mockHabits)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingHabit) {
      // Update existing habit
      setHabits(habits.map(habit => 
        habit.id === editingHabit.id 
          ? { ...habit, ...formData }
          : habit
      ))
      setEditingHabit(null)
    } else {
      // Add new habit
      const newHabit: Habit = {
        id: Date.now().toString(),
        ...formData,
        currentStreak: 0,
        longestStreak: 0,
        completedToday: false,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setHabits([...habits, newHabit])
    }
    
    setFormData({ title: "", description: "", frequency: "daily", goal: 1, category: "personal", linkedGoal: "" })
    setShowAddForm(false)
  }

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit)
    setFormData({
      title: habit.title,
      description: habit.description,
      frequency: habit.frequency,
      goal: habit.goal,
      category: habit.category,
      linkedGoal: habit.linkedGoal || ""
    })
    setShowAddForm(true)
  }

  const handleDelete = (habitId: string) => {
    setHabits(habits.filter(habit => habit.id !== habitId))
  }

  const toggleTodayCompletion = (habitId: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const completedToday = !habit.completedToday
        let newStreak = habit.currentStreak
        
        if (completedToday) {
          newStreak += 1
        } else {
          newStreak = Math.max(0, newStreak - 1)
        }
        
        return {
          ...habit,
          completedToday,
          currentStreak: newStreak,
          longestStreak: Math.max(habit.longestStreak, newStreak)
        }
      }
      return habit
    }))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "health": return "bg-green-100 text-green-800"
      case "learning": return "bg-blue-100 text-blue-800"
      case "personal": return "bg-purple-100 text-purple-800"
      case "business": return "bg-indigo-100 text-indigo-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case "daily": return "Daily"
      case "weekly": return "Weekly"
      case "monthly": return "Monthly"
      default: return frequency
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-green-600" />
            Habits
          </h1>
          <p className="text-gray-600 mt-2">
            Build consistent habits that compound over time
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Habit
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">
            {editingHabit ? "Edit Habit" : "Add New Habit"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Habit Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your habit"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="personal">Personal</option>
                  <option value="health">Health</option>
                  <option value="learning">Learning</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
                placeholder="Describe your habit in detail"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({...formData, frequency: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal (times per {formData.frequency})
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.goal}
                  onChange={(e) => setFormData({...formData, goal: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                {editingHabit ? "Update Habit" : "Add Habit"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingHabit(null)
                  setFormData({ title: "", description: "", frequency: "daily", goal: 1, category: "personal", linkedGoal: "" })
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Habits Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {habits.map((habit) => (
          <div key={habit.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{habit.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{habit.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(habit)}
                  className="p-1 hover:bg-gray-100"
                >
                  <Edit className="h-4 w-4 text-gray-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(habit.id)}
                  className="p-1 hover:bg-gray-100 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Streak Info */}
            <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="flex items-center gap-1 text-orange-600">
                  <Flame className="h-4 w-4" />
                  <span className="text-sm font-medium">Current</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{habit.currentStreak}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Goal</div>
                <div className="text-lg font-semibold text-gray-900">{habit.goal}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Best</div>
                <div className="text-lg font-semibold text-gray-900">{habit.longestStreak}</div>
              </div>
            </div>

            {/* Today's Status */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Today's Progress</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  habit.completedToday 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {habit.completedToday ? "Completed" : "Not Done"}
                </span>
              </div>
            </div>

            {/* Meta Info */}
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span>{getFrequencyText(habit.frequency)} habit</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Created: {new Date(habit.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Category */}
            <div className="mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(habit.category)}`}>
                {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
              </span>
            </div>

            {/* Action Button */}
            <Button
              onClick={() => toggleTodayCompletion(habit.id)}
              className={`w-full ${
                habit.completedToday
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {habit.completedToday ? "Mark Incomplete" : "Mark Complete"}
            </Button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {habits.length === 0 && !showAddForm && (
        <div className="text-center py-12">
          <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No habits yet</h3>
          <p className="text-gray-600 mb-4">Start building your first habit to create lasting change</p>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Habit
          </Button>
        </div>
      )}
    </div>
  )
}
