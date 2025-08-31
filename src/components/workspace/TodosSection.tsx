"use client"

import { useState, useEffect } from "react"
import {
  CheckCircle,
  Edit,
  Trash2,
  Clock,
  Calendar,
  MoreVertical,
  Tag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Todo {
  id: string
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
  createdAt: string
  updatedAt: string
}

interface TodosSectionProps {
  showTodoForm: boolean
  setShowTodoForm: (show: boolean) => void
  filter: "all" | "pending" | "completed"
  onCountsUpdate?: (counts: {
    all: number
    pending: number
    completed: number
  }) => void
}

export default function TodosSection({
  showTodoForm,
  setShowTodoForm,
  filter,
  onCountsUpdate,
}: TodosSectionProps) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    dueDate: "",
    category: "personal",
    startTime: "09:00",
    endTime: "10:00",
    icon: "⚙️",
    recurring: "none" as "none" | "daily" | "weekly" | "monthly",
    days: [] as string[],
  })

  // Mock data for now - will be replaced with API calls
  useEffect(() => {
    const mockTodos: Todo[] = [
      {
        id: "1",
        title: "Morning Coffee & Check Emails",
        description: "Start the day with coffee and review important emails.",
        isCompleted: true,
        startTime: "07:00",
        endTime: "07:30",
        category: "personal",
        icon: "☕",
        recurring: "daily",
        days: [],
        priority: "low",
        completedDates: [],
        scheduledDate: "2024-01-20",
        createdAt: "2024-01-15",
        updatedAt: "2024-01-15",
      },
      {
        id: "2",
        title: "Take Vitamins & Drink Water",
        description: "Take daily vitamins and drink first glass of water.",
        isCompleted: true,
        startTime: "08:00",
        endTime: "08:05",
        category: "health",
        icon: "💊",
        recurring: "daily",
        days: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        priority: "medium",
        completedDates: [
          "2024-01-15",
          "2024-01-16",
          "2024-01-17",
          "2024-01-18",
          "2024-01-19",
          "2024-01-20",
        ],
        scheduledDate: "2024-01-20",
        createdAt: "2024-01-10",
        updatedAt: "2024-01-20",
      },
      {
        id: "3",
        title: "Call Mom",
        description: "Weekly check-in call with family.",
        isCompleted: false,
        startTime: "18:00",
        endTime: "18:30",
        category: "personal",
        icon: "📞",
        recurring: "weekly",
        days: ["sunday"],
        priority: "high",
        completedDates: [],
        scheduledDate: "2024-01-21",
        createdAt: "2024-01-16",
        updatedAt: "2024-01-16",
      },
      {
        id: "4",
        title: "Prepare Lunch for Tomorrow",
        description: "Meal prep for tomorrow's lunch.",
        isCompleted: false,
        startTime: "20:00",
        endTime: "20:30",
        category: "personal",
        icon: "🥗",
        recurring: "daily",
        days: [],
        priority: "medium",
        completedDates: [],
        scheduledDate: "2024-01-20",
        createdAt: "2024-01-17",
        updatedAt: "2024-01-17",
      },
      {
        id: "5",
        title: "Walk the Dog",
        description: "Evening walk around the neighborhood.",
        isCompleted: false,
        startTime: "19:00",
        endTime: "19:30",
        category: "personal",
        icon: "🐕",
        recurring: "daily",
        days: [],
        priority: "high",
        completedDates: [],
        scheduledDate: "2024-01-20",
        createdAt: "2024-01-18",
        updatedAt: "2024-01-19",
      },
      {
        id: "6",
        title: "Read 20 Minutes Before Bed",
        description: "Wind down with some light reading.",
        isCompleted: false,
        startTime: "21:30",
        endTime: "21:50",
        category: "personal",
        icon: "📖",
        recurring: "daily",
        days: [],
        priority: "low",
        completedDates: [],
        scheduledDate: "2024-01-20",
        createdAt: "2024-01-18",
        updatedAt: "2024-01-19",
      },
    ]
    setTodos(mockTodos)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingTodo) {
      // Update existing todo
      setTodos(
        todos.map((todo) =>
          todo.id === editingTodo.id
            ? { ...todo, ...formData, scheduledDate: formData.dueDate }
            : todo
        )
      )
      setEditingTodo(null)
    } else {
      // Add new todo
      const newTodo: Todo = {
        id: Date.now().toString(),
        ...formData,
        isCompleted: false,
        scheduledDate: formData.dueDate,
        completedDates: [],
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      }
      setTodos([...todos, newTodo])
    }

    setFormData({
      title: "",
      description: "",
      priority: "medium" as "low" | "medium" | "high",
      dueDate: "",
      category: "personal",
      startTime: "09:00",
      endTime: "10:00",
      icon: "⚙️",
      recurring: "none" as "none" | "daily" | "weekly" | "monthly",
      days: [],
    })
    setShowTodoForm(false)
  }

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo)
    setFormData({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      dueDate: todo.scheduledDate, // Map scheduledDate to dueDate for form
      category: todo.category,
      startTime: todo.startTime,
      endTime: todo.endTime,
      icon: todo.icon,
      recurring: todo.recurring,
      days: todo.days,
    })
    setShowTodoForm(true)
  }

  const handleDelete = (todoId: string) => {
    setTodos(todos.filter((todo) => todo.id !== todoId))
  }

  const handleStatusChange = (todoId: string, isCompleted: boolean) => {
    setTodos(
      todos.map((todo) =>
        todo.id === todoId ? { ...todo, isCompleted } : todo
      )
    )
  }

  const getPriorityColor = (priority: Todo["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true
    if (filter === "pending") return !todo.isCompleted
    if (filter === "completed") return todo.isCompleted
    return true
  })

  // Group todos by date
  const groupTodosByDate = (todos: Todo[]) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    const formatDate = (date: Date) => date.toISOString().split("T")[0]
    const todayStr = formatDate(today)
    const tomorrowStr = formatDate(tomorrow)
    const yesterdayStr = formatDate(yesterday)

    const grouped: { [key: string]: Todo[] } = {}

    todos.forEach((todo) => {
      const todoDate = todo.scheduledDate
      if (!grouped[todoDate]) {
        grouped[todoDate] = []
      }
      grouped[todoDate].push(todo)
    })

    // Sort dates
    const sortedDates = Object.keys(grouped).sort()

    const getDateLabel = (dateStr: string) => {
      if (dateStr === todayStr) return "Today"
      if (dateStr === tomorrowStr) return "Tomorrow"
      if (dateStr === yesterdayStr) return "Yesterday"

      const date = new Date(dateStr)
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    }

    return sortedDates.map((dateStr) => ({
      date: dateStr,
      label: getDateLabel(dateStr),
      todos: grouped[dateStr],
    }))
  }

  const groupedTodos = groupTodosByDate(filteredTodos)

  // Update counts whenever todos change
  useEffect(() => {
    if (onCountsUpdate) {
      const counts = {
        all: todos.length,
        pending: todos.filter((todo) => !todo.isCompleted).length,
        completed: todos.filter((todo) => todo.isCompleted).length,
      }
      onCountsUpdate(counts)
    }
  }, [todos, onCountsUpdate])

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <Dialog open={showTodoForm} onOpenChange={setShowTodoForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingTodo ? "Edit Todo" : "Create New Todo"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Todo Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter your todo title"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your todo..."
                rows={3}
                required
              />
            </div>

            {/* Priority and Category Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      priority: value as "low" | "medium" | "high",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      category: value as
                        | "personal"
                        | "work"
                        | "learning"
                        | "health"
                        | "shopping"
                        | "finance",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="learning">Learning</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date and Time Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">Start</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                {editingTodo ? "Update Todo" : "Create Todo"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowTodoForm(false)
                  setEditingTodo(null)
                  setFormData({
                    title: "",
                    description: "",
                    priority: "medium" as "low" | "medium" | "high",
                    dueDate: "",
                    category: "personal",
                    startTime: "09:00",
                    endTime: "10:00",
                    icon: "⚙️",
                    recurring: "none" as
                      | "none"
                      | "daily"
                      | "weekly"
                      | "monthly",
                    days: [],
                  })
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Todos List */}
      <div className="space-y-6">
        {groupedTodos.map((group) => (
          <div key={group.date} className="space-y-3">
            {/* Date Section Header */}
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
              <h3 className="text-sm font-medium text-gray-700">
                {group.label}
              </h3>
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-500">
                {group.todos.length} tasks
              </span>
            </div>

            {/* Tasks for this date */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.todos.map((todo) => (
                <div
                  key={todo.id}
                  className={` border-1 border-gray-200 transition-all w-full${
                    todo.isCompleted ? "opacity-75" : ""
                  }`}
                >
                  {/* Top Section - Title and Actions */}
                  <div className="flex items-center justify-between  px-3 pt-3">
                    <div className="flex items-center gap-2 flex-1 ">
                      <div className="flex items-center gap-2 flex-1 ">
                        <Checkbox
                          checked={todo.isCompleted}
                          onCheckedChange={(checked) =>
                            handleStatusChange(todo.id, checked as boolean)
                          }
                          className="h-8 w-8 rounded-full border-1 border-green-500 data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                          id={`todo-${todo.id}`}
                        />
                        <div className="flex flex-col justify-between gap-1">
                          <Label
                            htmlFor={`todo-${todo.id}`}
                            className={`text font-semibold truncate h-6 cursor-pointer ${
                              todo.isCompleted
                                ? "line-through text-gray-500"
                                : "text-gray-900"
                            }`}
                          >
                            {todo.title}
                          </Label>
                          {/* Middle Section - Description */}
                          <Label
                            htmlFor={`todo-${todo.id}`}
                            className={`text-xs line-clamp-1 cursor-pointer ${
                              todo.isCompleted
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {todo.description}
                          </Label>
                          
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-6 w-6 hover:bg-gray-100"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(todo)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(todo.id)}
                              className="text-red-600 hover:bg-red-100"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section - Details and Category */}
                  <div className="flex items-center justify-between mt-2  px-3 py-2">
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-700 font-medium">
                          {todo.startTime} - {todo.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-700 font-medium">
                          {todo.scheduledDate}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={`text-xs px-2 py-0.5 ${getPriorityColor(
                          todo.priority
                        )}`}
                      >
                        {todo.priority.charAt(0).toUpperCase() +
                          todo.priority.slice(1)}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700"
                      >
                        <Tag className="mr-1 h-3 w-3" />
                        {todo.category.charAt(0).toUpperCase() +
                          todo.category.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTodos.length === 0 && !showTodoForm && (
        <Card className="text-center py-8 border-dashed">
          <CardContent className="flex flex-col items-center">
            <CheckCircle className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-base font-medium text-gray-900 mb-2">
              No todos found
            </h3>
            <p className="text-gray-600 mb-4 max-w-md text-sm">
              {filter === "all"
                ? "Start by creating your first todo to organize your day"
                : `No ${filter} todos found. Try changing the filter or add new todos.`}
            </p>
            <Button
              onClick={() => setShowTodoForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2"
            >
              Create Your First Todo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
