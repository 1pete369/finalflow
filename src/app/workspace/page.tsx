"use client"

import { useState, useEffect } from "react"
import { useAuthContext } from "@/context/useAuthContext"
import { redirect, useSearchParams, useRouter } from "next/navigation"
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader"
import Sidebar from "@/components/workspace/Sidebar"

import TodosSection from "@/components/workspace/TodosSection"
import GoalsSection from "@/components/workspace/GoalsSection"
import HabitsSection from "@/components/workspace/HabitsSection"
import NotesSection from "@/components/workspace/NotesSection"
import JournalsSection from "@/components/workspace/JournalsSection"
import FinanceSection from "@/components/workspace/FinanceSection"

export default function WorkspacePage() {
  const { authUser } = useAuthContext()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("todos")
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showTodoForm, setShowTodoForm] = useState(false)
  const [showFinanceForm, setShowFinanceForm] = useState(false)
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all")
  const [todoCounts, setTodoCounts] = useState({
    all: 0,
    pending: 0,
    completed: 0,
  })

  // Read initial section from URL on mount
  useEffect(() => {
    const urlSection = searchParams.get("section")
    if (
      urlSection &&
      ["todos", "goals", "habits", "notes", "journals", "finance"].includes(
        urlSection
      )
    ) {
      setActiveSection(urlSection)
    }
  }, [searchParams])

  // Update URL when section changes (debounced to avoid excessive URL updates)
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(`/workspace?section=${activeSection}`, { scroll: false })
    }, 100)
    return () => clearTimeout(timer)
  }, [activeSection, router])

  // Handle section changes
  const handleSectionChange = (section: string) => {
    setActiveSection(section)
    // URL will be updated automatically via useEffect above
  }

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
      case "todos":
        return (
          <TodosSection
            showTodoForm={showTodoForm}
            setShowTodoForm={setShowTodoForm}
            filter={filter}
            onCountsUpdate={setTodoCounts}
          />
        )
      case "goals":
        return <GoalsSection />
      case "habits":
        return <HabitsSection />
      case "notes":
        return <NotesSection />
      case "journals":
        return <JournalsSection />
      case "finance":
        return (
          <FinanceSection
            showFinanceForm={showFinanceForm}
            setShowFinanceForm={setShowFinanceForm}
          />
        )
      default:
        return (
          <TodosSection
            showTodoForm={showTodoForm}
            setShowTodoForm={setShowTodoForm}
            filter={filter}
            onCountsUpdate={setTodoCounts}
          />
        )
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <WorkspaceHeader
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={setIsMobileMenuOpen}
      />

      <div className="flex flex-1 min-h-0">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={setIsMobileMenuOpen}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-4 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Greeting and Add Button Row */}
            <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Greeting Section */}
              <div>
                <h1 className="text-xl font-bold text-gray-900 mb-1">
                  Good{" "}
                  {new Date().getHours() < 12
                    ? "Morning"
                    : new Date().getHours() < 18
                    ? "Afternoon"
                    : "Evening"}
                  !
                </h1>
                <p className="text-gray-600 text-sm">
                  Manage your daily tasks and priorities
                </p>
              </div>

              {/* Filters + Add Button */}
              <div className="flex items-center gap-4">
                {/* Filter Buttons */}
                {activeSection === "todos" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilter("all")}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg flex items-center gap-2 ${
                        filter === "all"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                      }`}
                    >
                      <span>All</span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${
                          filter === "all"
                            ? "bg-white/20 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {todoCounts.all}
                      </span>
                    </button>
                    <button
                      onClick={() => setFilter("pending")}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg flex items-center gap-2 ${
                        filter === "pending"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                      }`}
                    >
                      <span>Pending</span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${
                          filter === "pending"
                            ? "bg-white/20 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {todoCounts.pending}
                      </span>
                    </button>
                    <button
                      onClick={() => setFilter("completed")}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg flex items-center gap-2 ${
                        filter === "completed"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                      }`}
                    >
                      <span>Completed</span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${
                          filter === "completed"
                            ? "bg-white/20 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {todoCounts.completed}
                      </span>
                    </button>
                  </div>
                )}

                {/* Add Button */}
                <button
                  onClick={() => {
                    if (activeSection === "todos") {
                      setShowTodoForm(true)
                    } else if (activeSection === "finance") {
                      setShowFinanceForm(true)
                    }
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm"
                >
                  <span className="text-lg">+</span>
                  <span className="hidden sm:inline">
                    Add{" "}
                    {activeSection.charAt(0).toUpperCase() +
                      activeSection.slice(1)}
                  </span>
                </button>
              </div>
            </div>

            {/* Content Section */}
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </div>
  )
}
