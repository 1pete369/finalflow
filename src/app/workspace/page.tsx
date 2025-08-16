"use client"

import { useState, useEffect } from "react"
import { useAuthContext } from "@/context/useAuthContext"
import { redirect } from "next/navigation"
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader"
import GoalsSection from "@/components/workspace/GoalsSection"
import HabitsSection from "@/components/workspace/HabitsSection"
import TodosSection from "@/components/workspace/TodosSection"
import NotesSection from "@/components/workspace/NotesSection"
import JournalsSection from "@/components/workspace/JournalsSection"
import Sidebar from "@/components/workspace/Sidebar"

export default function WorkspacePage() {
  const { authUser } = useAuthContext()
  const [activeSection, setActiveSection] = useState("goals")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authUser) {
      redirect("/login")
    }
    setIsLoading(false)
  }, [authUser])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case "goals":
        return <GoalsSection />
      case "habits":
        return <HabitsSection />
      case "todos":
        return <TodosSection />
      case "notes":
        return <NotesSection />
      case "journals":
        return <JournalsSection />
      default:
        return <GoalsSection />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WorkspaceHeader />

      <div className="flex">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">{renderActiveSection()}</div>
        </main>
      </div>
    </div>
  )
}
