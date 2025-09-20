"use client"

import { useState, useEffect } from "react"
import {
  CheckCircle,
  Edit,
  Trash2,
  Clock,
  MoreVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
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
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoStatus,
  type Todo,
} from "@/services"

interface TodosSectionProps {
  showTodoForm: boolean
  setShowTodoForm: (show: boolean) => void
  filter: "all" | "pending" | "completed" | "upcoming" | "past"
  priorityFilter?: "all" | "high" | "medium" | "low"
  categoryFilter?:
    | "all"
    | "personal"
    | "work"
    | "learning"
    | "health"
    | "shopping"
    | "finance"
  onCountsUpdate?: (counts: {
    all: number
    pending: number
    completed: number
    upcoming: number
    past: number
  }) => void
}

export default function TodosSection({
  showTodoForm,
  setShowTodoForm,
  filter,
  priorityFilter = "all",
  categoryFilter = "all",
  onCountsUpdate,
}: TodosSectionProps) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [, setCurrentTime] = useState(new Date())
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

   const todayISO = new Date().toISOString().split("T")[0]

   // Helper function to capitalize first letter only
   const capitalizeFirst = (str: string) => {
     if (!str) return str
     return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
   }

   // Helper function to check if todo toggle should be disabled
   const isToggleDisabled = (scheduledDate: string) => {
     const d = new Date(scheduledDate)
     const y = d.getUTCFullYear()
     const m = String(d.getUTCMonth() + 1).padStart(2, "0")
     const da = String(d.getUTCDate()).padStart(2, "0")
     const iso = `${y}-${m}-${da}`
     
     // Disable toggle for past and future todos (only allow today)
     return iso !== todayISO
   }

   // Helper function to check if current time is within todo's time block
   const isCurrentlyActive = (scheduledDate: string, startTime: string, endTime: string) => {
     const todoDate = new Date(scheduledDate).toISOString().split('T')[0]
     const today = new Date().toISOString().split('T')[0]
     
     // Only check if it's today's todo
     if (todoDate !== today) return false
     
     const now = new Date()
     const currentTime = now.getHours() * 60 + now.getMinutes() // Current time in minutes
     
     // Parse start and end times
     const [startHour, startMin] = startTime.split(':').map(Number)
     const [endHour, endMin] = endTime.split(':').map(Number)
     
     const startMinutes = startHour * 60 + startMin
     const endMinutes = endHour * 60 + endMin
     
     return currentTime >= startMinutes && currentTime <= endMinutes
   }

  // Removed left border accent by date to simplify UI
  const getTodoCardStyling = () => {
    return ""
  }

  // Load todos from API
  const loadTodos = async () => {
    try {
      setLoading(true)
      const fetchedTodos = await getTodos()
      setTodos(fetchedTodos)
    } catch (error) {
      console.error("Failed to load todos:", error)
      // You might want to show a toast notification here
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTodos()
  }, [])

  // Smart timer that updates exactly when todos start/end
  useEffect(() => {
    const updateTimer = () => {
      setCurrentTime(new Date())
      
      // Calculate when the next update should happen
      const now = new Date()
      const currentMinutes = now.getHours() * 60 + now.getMinutes()
      
      // Get today's todos to check their start/end times
      const today = now.toISOString().split('T')[0]
      const todayTodos = todos.filter(todo => {
        const todoDateStr = new Date(todo.scheduledDate).toISOString().split('T')[0]
        return todoDateStr === today
      })
      
      // Collect all start and end times for today's todos
      const allTimes: number[] = []
      todayTodos.forEach(todo => {
        const [startHour, startMin] = todo.startTime.split(':').map(Number)
        const [endHour, endMin] = todo.endTime.split(':').map(Number)
        
        const startMinutes = startHour * 60 + startMin
        const endMinutes = endHour * 60 + endMin
        
        // Only add future times
        if (startMinutes > currentMinutes) allTimes.push(startMinutes)
        if (endMinutes > currentMinutes) allTimes.push(endMinutes)
      })
      
      // Find the next time when a todo starts or ends
      const nextTime = allTimes.length > 0 ? Math.min(...allTimes) : null
      
      let nextUpdateMs: number
      if (nextTime !== null) {
        // Update exactly when the next todo starts or ends
        const minutesUntilNext = nextTime - currentMinutes
        nextUpdateMs = minutesUntilNext * 60 * 1000
        
        // Add a small buffer (1 second) to ensure we're past the transition
        nextUpdateMs += 1000
      } else {
        // No more todos today, update at the next minute boundary
        const secondsUntilNextMinute = 60 - now.getSeconds()
        nextUpdateMs = secondsUntilNextMinute * 1000
      }
      
      // Set timeout for the calculated time
      return setTimeout(updateTimer, Math.max(1000, nextUpdateMs))
    }
    
    // Initial update
    const timer = updateTimer()
    
    return () => clearTimeout(timer)
  }, [todos]) // Re-run when todos change

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const start = formData.startTime
      const end = formData.endTime
      if (start && end && start >= end) {
        toast.error("End time must be later than start time.")
        return
      }

      if (!formData.dueDate || formData.dueDate < todayISO) {
        toast.error("Date must be today or a future date.")
        return
      }

      if (editingTodo) {
        // Update existing todo
        const updatedTodo = await updateTodo({
          _id: editingTodo._id,
          title: formData.title,
          description: "",
          priority: formData.priority,
          dueDate: formData.dueDate,
          category: formData.category,
          startTime: formData.startTime,
          endTime: formData.endTime,
          icon: formData.icon,
          recurring: formData.recurring,
          days: formData.days,
        })

        setTodos(
          todos.map((todo) =>
            todo._id === editingTodo._id ? updatedTodo : todo
          )
        )
        setEditingTodo(null)
        // Refresh todos from server to ensure consistency
        await loadTodos()
      } else {
        // Add new todo
        const newTodo = await createTodo({
          title: formData.title,
          description: "",
          priority: formData.priority,
          dueDate: formData.dueDate,
          category: formData.category,
          startTime: formData.startTime,
          endTime: formData.endTime,
          icon: formData.icon,
          recurring: formData.recurring,
          days: formData.days,
        })

        setTodos([...todos, newTodo])
      }

      // Reset form
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
      toast.success(editingTodo ? "Todo updated" : "Todo created")
    } catch (error) {
      console.error("Failed to save todo:", error)
      toast.error("Failed to save todo")
      // You might want to show a toast notification here
    }
  }

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo)
    
    // Convert UTC date properly for form input
    const date = new Date(todo.scheduledDate)
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, "0")
    const day = String(date.getUTCDate()).padStart(2, "0")
    const formattedDate = `${year}-${month}-${day}`
    
    setFormData({
      title: todo.title,
      description: "",
      priority: todo.priority,
      dueDate: formattedDate,
      category: todo.category,
      startTime: todo.startTime,
      endTime: todo.endTime,
      icon: todo.icon,
      recurring: todo.recurring,
      days: todo.days,
    })
    setShowTodoForm(true)
  }

  const handleDelete = async (todoId: string) => {
    try {
      await deleteTodo(todoId)
      setTodos(todos.filter((todo) => todo._id !== todoId))
      toast.success("Todo deleted successfully")
    } catch (error) {
      console.error("Failed to delete todo:", error)
      toast.error("Failed to delete todo")
    }
  }

  const handleStatusChange = async (todoId: string, isCompleted: boolean) => {
    try {
      const updatedTodo = await toggleTodoStatus(todoId)
      setTodos(todos.map((todo) => (todo._id === todoId ? updatedTodo : todo)))
      toast.success(isCompleted ? "Todo marked as completed" : "Todo marked as pending")
    } catch (error) {
      console.error("Failed to update todo status:", error)
      toast.error("Failed to update todo status")
    }
  }

  // removed usage in cards; helper not needed right now

  const filteredTodos = todos.filter((todo) => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0]
    
    // Get todo's date in YYYY-MM-DD format  
    const todoDateStr = new Date(todo.scheduledDate).toISOString().split('T')[0]
    
    // Check if todo is scheduled for today
    const isToday = todoDateStr === today
    const isPast = todoDateStr < today
    const isFuture = todoDateStr > today
    
    // Extra filters
    const matchesPriority =
      priorityFilter === "all" || todo.priority === priorityFilter
    const matchesCategory =
      categoryFilter === "all" || todo.category === categoryFilter
    
    if (filter === "all") {
      // Show only today's todos (both completed and pending)
      return isToday && matchesPriority && matchesCategory
    }
    if (filter === "pending") {
      // Show only today's incomplete todos
      return !todo.isCompleted && isToday && matchesPriority && matchesCategory
    }
    if (filter === "completed") {
      // Show only today's completed todos
      return todo.isCompleted && isToday && matchesPriority && matchesCategory
    }
    if (filter === "upcoming") {
      // Show future incomplete todos
      return isFuture && !todo.isCompleted && matchesPriority && matchesCategory
    }
    if (filter === "past") {
      // Show past todos (completed and incomplete)
      return isPast && matchesPriority && matchesCategory
    }
    return matchesPriority && matchesCategory
  })

  // (Removed date display in cards) left helper unused previously

  // Group todos by date
  const groupTodosByDate = (todos: Todo[]) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    const formatDate = (date: Date) => {
      const year = date.getUTCFullYear()
      const month = String(date.getUTCMonth() + 1).padStart(2, "0")
      const day = String(date.getUTCDate()).padStart(2, "0")
      return `${year}-${month}-${day}`
    }
    const todayStr = formatDate(today)
    const tomorrowStr = formatDate(tomorrow)
    const yesterdayStr = formatDate(yesterday)

    const grouped: { [key: string]: Todo[] } = {}

    todos.forEach((todo) => {
      // Convert scheduledDate to YYYY-MM-DD format for grouping
      const d = new Date(todo.scheduledDate)
      const todoDate = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`
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
        timeZone: "UTC",
      })
    }

    return sortedDates.map((dateStr) => ({
      date: dateStr,
      label: getDateLabel(dateStr),
      todos: grouped[dateStr].sort((a, b) => {
        // Sort by creation date (newest first)
        // If createdAt is available, use it; otherwise use _id (which is typically chronological in MongoDB)
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
        // Fallback to _id comparison (newer MongoDB ObjectIds are greater)
        return b._id.localeCompare(a._id)
      }),
    }))
  }

  const groupedTodos = groupTodosByDate(filteredTodos)

  // Update counts whenever todos change
  useEffect(() => {
    if (onCountsUpdate) {
      const today = new Date().toISOString().split('T')[0]
      
      // Filter todos by date categories
      const todayTodos = todos.filter((todo) => {
        const todoDateStr = new Date(todo.scheduledDate).toISOString().split('T')[0]
        return todoDateStr === today
      })
      
      const pastTodos = todos.filter((todo) => {
        const todoDateStr = new Date(todo.scheduledDate).toISOString().split('T')[0]
        return todoDateStr < today
      })
      
      const upcomingTodos = todos.filter((todo) => {
        const todoDateStr = new Date(todo.scheduledDate).toISOString().split('T')[0]
        return todoDateStr > today && !todo.isCompleted
      })

      const counts = {
        all: todayTodos.length, // Today's todos (completed + pending)
        pending: todayTodos.filter((todo) => !todo.isCompleted).length, // Today's pending
        completed: todayTodos.filter((todo) => todo.isCompleted).length, // Today's completed
        upcoming: upcomingTodos.length, // Future incomplete todos
        past: pastTodos.length, // All past todos
      }
      onCountsUpdate(counts)
    }
  }, [todos, onCountsUpdate])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading todos...</div>
      </div>
    )
  }

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
                <div className="flex items-center gap-2">
                  <Label htmlFor="dueDate">Date</Label>
                  <Badge
                    variant="secondary"
                    className={`text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 border border-gray-200 ${
                      formData.dueDate && formData.dueDate > todayISO
                        ? ""
                        : "invisible"
                    }`}
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    Scheduled
                  </Badge>
                </div>
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
            <div className="flex flex-wrap gap-4 ">
              {group.todos.map((todo) => (
                 <div
                   key={todo._id}
                   className={`border-2 border-gray-300 transition-all bg-white h-auto min-h-[96px] w-[320px] ${getTodoCardStyling()}`}
                 >
                  {/* Top Section - Title and Actions */}
                  <div className="flex items-center justify-between  px-3 pt-3 ">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Checkbox
                        checked={todo.isCompleted}
                        onCheckedChange={(checked) =>
                          handleStatusChange(todo._id, checked as boolean)
                        }
                        disabled={isToggleDisabled(todo.scheduledDate)}
                        className={`h-8 w-8 rounded-full border-1 border-green-500 data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white shrink-0 ${
                          isToggleDisabled(todo.scheduledDate) 
                            ? "opacity-50 cursor-not-allowed" 
                            : ""
                        }`}
                        id={`todo-${todo._id}`}
                      />
                      <div className="flex flex-col justify-between gap-1 flex-1 min-w-0">
                        <Label
                          htmlFor={`todo-${todo._id}`}
                          className={`text font-semibold truncate cursor-pointer block ${
                            todo.isCompleted
                              ? "line-through text-gray-400"
                              : "text-gray-900"
                          }`}
                        >
                          {capitalizeFirst(todo.title)}
                        </Label>
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
                              onClick={() => handleDelete(todo._id)}
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

                  {/* Bottom Section - Time (left) and Live/Scheduled (right) */}
                  <div className="flex items-center justify-between mt-2 px-3 py-2 text-xs text-gray-600">
                    {/* Left: time */}
                    <div className="flex items-center gap-2  ">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700 font-medium">
                        {todo.startTime} - {todo.endTime}
                      </span>
                    </div>
                    {/* Right: live + scheduled */}
                    <div className="flex items-center gap-3 ">
                      {isCurrentlyActive(todo.scheduledDate, todo.startTime, todo.endTime) && (
                        <span className="flex items-center gap-1 text-purple-600" title="Happening now">
                          <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                          Live
                        </span>
                      )}
                      {(() => {
                      const d = new Date(todo.scheduledDate)
                      const y = d.getUTCFullYear()
                      const m = String(d.getUTCMonth() + 1).padStart(2, "0")
                      const da = String(d.getUTCDate()).padStart(2, "0")
                      const iso = `${y}-${m}-${da}`
                      const isFuture = iso > todayISO
                      return (
                        <Badge
                          variant="secondary"
                          className={`text-xs px-2 py-0.5 bg-blue-100 text-blue-700 border border-blue-200 ${
                            isFuture ? "" : "hidden"
                          }`}
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          Scheduled
                        </Badge>
                      )
                      })()}
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
        <div className="w-full flex items-center justify-center py-24">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-gray-300 mb-3 mx-auto" />
            <h3 className="text-base font-medium text-gray-900 mb-2">
              No todos found
            </h3>
            <p className="text-gray-600 mb-4 max-w-md text-sm mx-auto">
              {filter === "all"
                ? "Start by creating your first todo to organize your day"
                : filter === "upcoming"
                ? "No upcoming todos found. Schedule some tasks for the future!"
                : `No ${filter} todos found. Try changing the filter or add new todos.`}
            </p>
            <Button
              onClick={() => setShowTodoForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2"
            >
              Create Your First Todo
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
