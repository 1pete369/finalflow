"use client"

interface GreetingSectionProps {
  activeSection?: string
}

export default function GreetingSection({
  activeSection,
}: GreetingSectionProps) {
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Morning"
    if (hour < 18) return "Afternoon"
    return "Evening"
  }

  const getSectionSubtitle = (section?: string) => {
    switch (section) {
      case "todos":
        return "Manage your daily tasks and priorities"
      case "goals":
        return "Track your long-term objectives and milestones"
      case "habits":
        return "Build consistent routines and positive behaviors"
      case "notes":
        return "Capture ideas and important information"
      case "journals":
        return "Reflect on your thoughts and experiences"
      case "finance":
        return "Monitor your financial health and expenses"
      default:
        return "Manage your daily tasks and priorities"
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 ">
        Good {getTimeBasedGreeting()}!
      </h1>
      <p className="text-gray-600 text-sm">
        {getSectionSubtitle(activeSection)}
      </p>
    </div>
  )
}
