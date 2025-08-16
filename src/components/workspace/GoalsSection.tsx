"use client"

import { useState, useEffect } from "react"
import { Target, Plus, Edit, Trash2, Calendar, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Goal {
  id: string
  title: string
  description: string
  targetDate: string
  status: "active" | "completed" | "paused"
  progress: number
  category: string
  createdAt: string
}

export default function GoalsSection() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetDate: "",
    category: "personal",
  })

  // Mock data for now - will be replaced with API calls
  useEffect(() => {
    const mockGoals: Goal[] = [
      {
        id: "1",
        title: "Launch GrindFlow MVP",
        description: "Complete the core features and launch the first version",
        targetDate: "2024-03-31",
        status: "active",
        progress: 75,
        category: "business",
        createdAt: "2024-01-15",
      },
      {
        id: "2",
        title: "Read 24 Books This Year",
        description: "Read 2 books per month to expand knowledge",
        targetDate: "2024-12-31",
        status: "active",
        progress: 25,
        category: "personal",
        createdAt: "2024-01-01",
      },
      {
        id: "3",
        title: "Complete React Course",
        description: "Finish the advanced React course on Udemy",
        targetDate: "2024-02-28",
        status: "completed",
        progress: 100,
        category: "learning",
        createdAt: "2024-01-10",
      },
    ]
    setGoals(mockGoals)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingGoal) {
      // Update existing goal
      setGoals(
        goals.map((goal) =>
          goal.id === editingGoal.id ? { ...goal, ...formData } : goal
        )
      )
      setEditingGoal(null)
    } else {
      // Add new goal
      const newGoal: Goal = {
        id: Date.now().toString(),
        ...formData,
        status: "active",
        progress: 0,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setGoals([...goals, newGoal])
    }

    setFormData({
      title: "",
      description: "",
      targetDate: "",
      category: "personal",
    })
    setShowAddForm(false)
  }

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal)
    setFormData({
      title: goal.title,
      description: goal.description,
      targetDate: goal.targetDate,
      category: goal.category,
    })
    setShowAddForm(true)
  }

  const handleDelete = (goalId: string) => {
    setGoals(goals.filter((goal) => goal.id !== goalId))
  }

  const handleStatusChange = (goalId: string, newStatus: Goal["status"]) => {
    setGoals(
      goals.map((goal) =>
        goal.id === goalId ? { ...goal, status: newStatus } : goal
      )
    )
  }

  const getStatusColor = (status: Goal["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "business":
        return "bg-purple-100 text-purple-800"
      case "personal":
        return "bg-indigo-100 text-indigo-800"
      case "learning":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Target className="h-8 w-8 text-indigo-600" />
            Goals
          </h1>
          <p className="text-gray-600 mt-2">
            Set clear goals and track your progress towards achieving them
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">
            {editingGoal ? "Edit Goal" : "Add New Goal"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your goal"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="personal">Personal</option>
                  <option value="business">Business</option>
                  <option value="learning">Learning</option>
                  <option value="health">Health</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
                placeholder="Describe your goal in detail"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Date
              </label>
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) =>
                  setFormData({ ...formData, targetDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {editingGoal ? "Update Goal" : "Add Goal"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingGoal(null)
                  setFormData({
                    title: "",
                    description: "",
                    targetDate: "",
                    category: "personal",
                  })
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {goal.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(goal)}
                  className="p-1 hover:bg-gray-100"
                >
                  <Edit className="h-4 w-4 text-gray-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(goal.id)}
                  className="p-1 hover:bg-gray-100 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{goal.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Meta Info */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Target: {new Date(goal.targetDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>
                  Created: {new Date(goal.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Status and Category */}
            <div className="flex items-center justify-between mt-4">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  goal.status
                )}`}
              >
                {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                  goal.category
                )}`}
              >
                {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
              </span>
            </div>

            {/* Status Actions */}
            <div className="flex gap-2 mt-4">
              {goal.status === "active" && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(goal.id, "completed")}
                    className="text-green-600 border-green-600 hover:bg-green-50"
                  >
                    Mark Complete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(goal.id, "paused")}
                    className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                  >
                    Pause
                  </Button>
                </>
              )}
              {goal.status === "paused" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange(goal.id, "active")}
                  className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                >
                  Resume
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {goals.length === 0 && !showAddForm && (
        <div className="text-center py-12">
          <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No goals yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start by creating your first goal to track your progress
          </p>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Goal
          </Button>
        </div>
      )}
    </div>
  )
}
