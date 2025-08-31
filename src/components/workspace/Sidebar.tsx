"use client"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  isMobileMenuOpen: boolean
  onMobileMenuToggle: (isOpen: boolean) => void
}

export default function Sidebar({
  activeSection,
  onSectionChange,
  isMobileMenuOpen,
  onMobileMenuToggle,
}: SidebarProps) {
  const menuItems = [
    {
      id: "todos",
      title: "Todos",
      icon: "📝",
      description: "Manage your daily tasks and priorities",
    },
    {
      id: "goals",
      title: "Goals",
      icon: "🎯",
      description: "Set and track your long-term objectives",
    },
    {
      id: "habits",
      title: "Habits",
      icon: "🔄",
      description: "Build and maintain positive routines",
    },
    {
      id: "finance",
      title: "Finance",
      icon: "💰",
      description: "Track income, expenses, and financial goals",
    },
    {
      id: "notes",
      title: "Notes",
      icon: "📔",
      description: "Capture ideas and important information",
    },
    {
      id: "journals",
      title: "Journals",
      icon: "📖",
      description: "Reflect on your daily experiences",
    },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => onMobileMenuToggle(false)} // Close sidebar by triggering section change
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 z-30
          w-64 bg-white border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-4 h-full pt-20 lg:pt-6">
          {/* Navigation Menu */}
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors text-sm ${
                  activeSection === item.id
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="font-medium">{item.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  )
}
