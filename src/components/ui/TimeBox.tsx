"use client"

import { Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Time formatting helper
const formatTo12Hour = (time24: string): string => {
  const [hours, minutes] = time24.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`
}

interface TimeBoxProps {
  title: string
  startTime: string
  endTime: string
  category: string
  conflicts: unknown[]
  isCompleted?: boolean
  className?: string
}

export default function TimeBox({
  title,
  startTime,
  endTime,
  category,
  conflicts,
  isCompleted = false,
  className = "",
}: TimeBoxProps) {
  // Calculate duration
  const [startHour, startMin] = startTime.split(':').map(Number)
  const [endHour, endMin] = endTime.split(':').map(Number)
  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin
  const duration = endMinutes - startMinutes
  
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  // Category colors
  const getCategoryColor = (category: string) => {
    const colors = {
      personal: 'bg-blue-500',
      work: 'bg-purple-500',
      learning: 'bg-green-500',
      health: 'bg-red-500',
      shopping: 'bg-yellow-500',
      finance: 'bg-indigo-500',
    }
    return colors[category as keyof typeof colors] || colors.personal
  }

  const hasConflicts = conflicts.length > 0

  return (
    <div className={`relative rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all ${className}`}>
      {/* Category Color Bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${getCategoryColor(category)}`} />
      
      {/* Content */}
      <div className="p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-600" />
            <span className="font-medium text-gray-900 text-sm">
              {title}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {isCompleted && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            {hasConflicts && (
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            )}
          </div>
        </div>

        {/* Time and Duration */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-mono text-gray-600">
            {formatTo12Hour(startTime)} - {formatTo12Hour(endTime)}
          </span>
          <Badge
            variant="outline"
            className="text-xs bg-gray-50 text-gray-600"
          >
            {formatDuration(duration)}
          </Badge>
        </div>

        {/* Category */}
        <div className="mt-2">
          <Badge
            variant="secondary"
            className="text-xs capitalize"
          >
            {category}
          </Badge>
        </div>
      </div>
    </div>
  )
}

interface TimeBoxGridProps {
  todos: Array<{
    _id: string
    title: string
    startTime: string
    endTime: string
    category: string
    isCompleted: boolean
    conflicts: unknown[]
  }>
  date: string
  className?: string
}

export function TimeBoxGrid({ todos, date, className = "" }: TimeBoxGridProps) {
  // Sort todos by start time
  const sortedTodos = [...todos].sort((a, b) => {
    const timeA = a.startTime.split(':').map(Number)
    const timeB = b.startTime.split(':').map(Number)
    return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1])
  })

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-gray-600" />
        <h3 className="font-medium text-gray-900">
          Time Blocks - {new Date(date).toLocaleDateString()}
        </h3>
        <Badge variant="outline" className="text-xs">
          {todos.length} tasks
        </Badge>
      </div>

      {/* TimeBoxes */}
      {sortedTodos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p>No tasks scheduled for this day</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTodos.map((todo) => (
            <TimeBox
              key={todo._id}
              title={todo.title}
              startTime={todo.startTime}
              endTime={todo.endTime}
              category={todo.category}
              conflicts={todo.conflicts}
              isCompleted={todo.isCompleted}
            />
          ))}
        </div>
      )}
    </div>
  )
}
