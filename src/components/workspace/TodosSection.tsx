"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Plus, Edit, Trash2, Calendar, Flag, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Todo {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  status: "pending" | "in-progress" | "completed"
  dueDate: string
  category: string
  linkedGoal?: string
  linkedHabit?: string
  createdAt: string
}

export default function TodosSection() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    dueDate: "",
    category: "personal"
  })

  // Mock data for now - will be replaced with API calls
  useEffect(() => {
    const mockTodos: Todo[] = [
      {
        id: "1",
        title: "Complete React component",
        description: "Finish building the HabitsSection component",
        priority: "high",
        status: "in-progress",
        dueDate: "2024-01-20",
        category: "work",
        createdAt: "2024-01-15"
      },
      {
        id: "2",
        title: "Read Chapter 5",
        description: "Read the productivity chapter from Atomic Habits",
        priority: "medium",
        status: "pending",
        dueDate: "2024-01-18",
        category: "learning",
        createdAt: "2024-01-16"
      },
      {
        id: "3",
        title: "Grocery shopping",
        description: "Buy ingredients for dinner this week",
        priority: "low",
        status: "completed",
        dueDate: "2024-01-17",
        category: "personal",
        createdAt: "2024-01-17"
      }
    ]
    setTodos(mockTodos)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingTodo) {
      // Update existing todo
      setTodos(todos.map(todo => 
        todo.id === editingTodo.id 
          ? { ...todo, ...formData }
          : todo
      ))
      setEditingTodo(null)
    } else {
      // Add new todo
      const newTodo: Todo = {
        id: Date.now().toString(),
        ...formData,
        status: "pending",
        createdAt: new Date().toISOString().split('T')[0]
      }
      setTodos([...todos, newTodo])
    }
    
    setFormData({ title: "", description: "", priority: "medium", dueDate: "", category: "personal" })
    setShowAddForm(false)
  }

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo)
    setFormData({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      dueDate: todo.dueDate,
      category: todo.category
    })
    setShowAddForm(true)
  }

  const handleDelete = (todoId: string) => {
    setTodos(todos.filter(todo => todo.id !== todoId))
  }

  const handleStatusChange = (todoId: string, newStatus: Todo["status"]) => {
    setTodos(todos.map(todo => 
      todo.id === todoId 
        ? { ...todo, status: newStatus }
        : todo
    ))
  }

  const getPriorityColor = (priority: Todo["priority"]) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: Todo["status"]) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800"
      case "in-progress": return "bg-blue-100 text-blue-800"
      case "pending": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "work": return "bg-blue-100 text-blue-800"
      case "personal": return "bg-purple-100 text-purple-800"
      case "learning": return "bg-green-100 text-green-800"
      case "health": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === "all") return true
    if (filter === "pending") return todo.status === "pending"
    if (filter === "completed") return todo.status === "completed"
    return true
  })

  const getPriorityIcon = (priority: Todo["priority"]) => {
    switch (priority) {
      case "high": return "🔴"
      case "medium": return "🟡"
      case "low": return "🟢"
      default: return "⚪"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-blue-600" />
            Todos
          </h1>
          <p className="text-gray-600 mt-2">
            Organize your daily tasks and stay on top of your priorities
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Todo
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All ({todos.length})
        </Button>
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("pending")}
        >
          Pending ({todos.filter(t => t.status === "pending").length})
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("completed")}
        >
          Completed ({todos.filter(t => t.status === "completed").length})
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">
            {editingTodo ? "Edit Todo" : "Add New Todo"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Todo Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your todo"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="learning">Learning</option>
                  <option value="health">Health</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe your todo in detail"
                required
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingTodo ? "Update Todo" : "Add Todo"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingTodo(null)
                  setFormData({ title: "", description: "", priority: "medium", dueDate: "", category: "personal" })
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Todos List */}
      <div className="space-y-4">
        {filteredTodos.map((todo) => (
          <div key={todo.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg">{getPriorityIcon(todo.priority)}</span>
                  <h3 className={`text-lg font-semibold ${
                    todo.status === "completed" ? "line-through text-gray-500" : "text-gray-900"
                  }`}>
                    {todo.title}
                  </h3>
                </div>
                <p className={`text-sm ${
                  todo.status === "completed" ? "text-gray-400" : "text-gray-600"
                }`}>
                  {todo.description}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(todo)}
                  className="p-1 hover:bg-gray-100"
                >
                  <Edit className="h-4 w-4 text-gray-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(todo.id)}
                  className="p-1 hover:bg-gray-100 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-gray-500" />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                  {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-gray-500" />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(todo.status)}`}>
                  {todo.status.charAt(0).toUpperCase() + todo.status.slice(1).replace('-', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">
                  {new Date(todo.dueDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(todo.category)}`}>
                  {todo.category.charAt(0).toUpperCase() + todo.category.slice(1)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {todo.status === "pending" && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(todo.id, "in-progress")}
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    Start
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(todo.id, "completed")}
                    className="text-green-600 border-green-600 hover:bg-green-50"
                  >
                    Complete
                  </Button>
                </>
              )}
              {todo.status === "in-progress" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange(todo.id, "completed")}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  Mark Complete
                </Button>
              )}
              {todo.status === "completed" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange(todo.id, "pending")}
                  className="text-gray-600 border-gray-600 hover:bg-gray-50"
                >
                  Reopen
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTodos.length === 0 && !showAddForm && (
        <div className="text-center py-12">
          <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No todos found</h3>
          <p className="text-gray-600 mb-4">
            {filter === "all" 
              ? "Start by creating your first todo to organize your day"
              : `No ${filter} todos found. Try changing the filter or add new todos.`
            }
          </p>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Todo
          </Button>
        </div>
      )}
    </div>
  )
}
