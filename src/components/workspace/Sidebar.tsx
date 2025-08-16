"use client"

import {
  Target,
  TrendingUp,
  CheckCircle,
  FileText,
  BookOpen,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export default function Sidebar({
  activeSection,
  onSectionChange,
}: SidebarProps) {
  const menuItems = [
    {
      id: "goals",
      label: "Goals",
      icon: Target,
      description: "Set and track your goals",
    },
    {
      id: "habits",
      label: "Habits",
      icon: TrendingUp,
      description: "Build daily habits",
    },
    {
      id: "todos",
      label: "Todos",
      icon: CheckCircle,
      description: "Manage daily tasks",
    },
    {
      id: "notes",
      label: "Notes",
      icon: FileText,
      description: "Capture ideas and insights",
    },
    {
      id: "journals",
      label: "Journals",
      icon: BookOpen,
      description: "Reflect on your progress",
    },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        {/* Quick Actions */}
        <div className="mb-6">
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-indigo-50 border border-indigo-200 text-indigo-700"
                    : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isActive
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div
                      className={`text-xs ${
                        isActive ? "text-indigo-600" : "text-gray-500"
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </nav>

        {/* Progress Summary */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Today's Progress
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Goals</span>
              <span className="font-medium">2/5 completed</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Habits</span>
              <span className="font-medium">4/6 done</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Todos</span>
              <span className="font-medium">8/12 done</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
