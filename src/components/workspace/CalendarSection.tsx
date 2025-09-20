"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getTodos, type Todo } from "@/services"

export default function CalendarSection() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showDateModal, setShowDateModal] = useState(false)

  // Load todos from API
  const loadTodos = async () => {
    try {
      setLoading(true)
      const fetchedTodos = await getTodos()
      setTodos(fetchedTodos)
    } catch (error) {
      console.error("Failed to load todos:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTodos()
  }, [])

  // Get todos for a specific date
  const getTodosForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return todos.filter(todo => {
      const todoDate = new Date(todo.scheduledDate).toISOString().split("T")[0]
      return todoDate === dateStr
    })
  }


  // Calendar navigation
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Handle date click to open time block modal
  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setShowDateModal(true)
  }

  // Get todos for selected date, sorted by time
  const getSelectedDateTodos = () => {
    if (!selectedDate) return []
    
    const dateStr = selectedDate.toISOString().split("T")[0]
    const dateTodos = todos.filter(todo => {
      const todoDate = new Date(todo.scheduledDate).toISOString().split("T")[0]
      return todoDate === dateStr
    })
    
    // Sort by start time
    return dateTodos.sort((a, b) => {
      const [aHour, aMin] = a.startTime.split(':').map(Number)
      const [bHour, bMin] = b.startTime.split(':').map(Number)
      const aMinutes = aHour * 60 + aMin
      const bMinutes = bHour * 60 + bMin
      return aMinutes - bMinutes
    })
  }

  // Get calendar days for current month
  const getCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const today = new Date()
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      
      const isCurrentMonth = date.getMonth() === month
      const isToday = date.toDateString() === today.toDateString()
      const dayTodos = getTodosForDate(date)
      
      days.push({
        date,
        isCurrentMonth,
        isToday,
        todos: dayTodos,
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      })
    }
    
    return days
  }

  const getPriorityColor = (priority: Todo["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const calendarDays = getCalendarDays()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading calendar...</div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Calendar Header */}
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-4 ">
          <h2 className="text-2xl font-bold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button
            onClick={goToToday}
            variant="outline"
            size="sm"
            className="text-sm"
          >
            Today
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mr-2 ">
          <Button
            onClick={goToPreviousMonth}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={goToNextMonth}
            variant="outline"
            size="sm"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="p-0 mr-2  overflow-hidden">
        <CardContent className="p-0">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b">
            {dayNames.map(day => (
              <div
                key={day}
                className="p-2 text-center text-sm font-medium text-gray-500 bg-gray-50"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                onClick={() => handleDateClick(day.date)}
                className={`
                  min-h-[80px] border-r border-b border-gray-200 p-1.5 cursor-pointer
                  ${!day.isCurrentMonth ? 'bg-gray-50' : 'bg-white'}
                  ${day.isWeekend ? 'bg-gray-50' : ''}
                  ${day.isToday ? 'bg-indigo-50 border-indigo-200' : ''}
                  hover:bg-gray-50 transition-colors
                `}
              >
                {/* Date Number */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`
                      text-sm font-medium
                      ${!day.isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
                      ${day.isToday ? 'text-indigo-600 font-bold' : ''}
                    `}
                  >
                    {day.date.getDate()}
                  </span>
                  {day.todos.length > 0 && (
                    <span className="text-xs text-gray-500">
                      {day.todos.length}
                    </span>
                  )}
                </div>

                {/* Todos for this day */}
                <div className="space-y-1">
                  {day.todos.slice(0, 3).map(todo => (
                    <div
                      key={todo._id}
                      className={`
                        p-1 rounded text-xs cursor-pointer transition-all
                        ${todo.isCompleted 
                          ? 'bg-green-100 text-green-800 line-through' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }
                      `}
                      title={`${todo.title} - ${formatTime(todo.startTime)}`}
                    >
                      <div className="flex items-center gap-1">
                        <div className="flex-1 min-w-0">
                          <div className="truncate font-medium">
                            {todo.title}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-2.5 w-2.5" />
                            <span>{formatTime(todo.startTime)}</span>
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(todo.priority)}`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {day.todos.length > 3 && (
                    <div className="text-xs text-gray-500 text-center py-1">
                      +{day.todos.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Block Modal */}
      <Dialog open={showDateModal} onOpenChange={setShowDateModal} >
         <DialogContent className="max-w-2xl min-h-[400px] max-h-[70vh] overflow-y-auto flex flex-col scrollbar-hide">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-600" />
              Time Blocks for {selectedDate?.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </DialogTitle>
          </DialogHeader>
          
           <div className="space-y-3 flex flex-col justify-start flex-1">
            {getSelectedDateTodos().length > 0 ? (
              getSelectedDateTodos().map((todo) => (
                <div
                  key={todo._id}
                    className={`
                     p-4 rounded-lg border transition-all
                     ${todo.isCompleted 
                       ? 'bg-slate-50 border-slate-200' 
                       : 'bg-white border-gray-200 shadow-sm'
                     }
                     hover:shadow-md
                   `}
                >
                  <div className="flex items-start justify-start">
                    <div className="flex-1">
                      <h3 className={`font-semibold text-gray-900 mb-1 ${
                        todo.isCompleted ? 'line-through text-gray-500' : ''
                      }`}>
                        {todo.title}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">
                            {formatTime(todo.startTime)} - {formatTime(todo.endTime)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            todo.priority === 'high' ? 'bg-red-100 text-red-800' :
                            todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                          </span>
                          
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            {todo.category.charAt(0).toUpperCase() + todo.category.slice(1)}
                          </span>
                        </div>
                       </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium">No tasks scheduled</p>
                <p className="text-sm">This date has no todos planned.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}



