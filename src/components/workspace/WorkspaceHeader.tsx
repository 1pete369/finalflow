"use client"

import { useState, useRef, useEffect } from "react"
import { useAuthContext } from "@/context/useAuthContext"
import { Bell, Search, Settings, LogOut, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WorkspaceHeader({
  isMobileMenuOpen,
  onMobileMenuToggle,
}: {
  isMobileMenuOpen: boolean
  onMobileMenuToggle: (open: boolean) => void
}) {
  const { authUser, logout } = useAuthContext()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Search */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            {/* Logo */}
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">GF</span>
              </div>
              <span className="text-lg lg:text-xl font-bold text-gray-900 hidden sm:block">
                GrindFlow
              </span>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search goals, habits, todos..."
                className="pl-10 pr-4 py-2 w-64 lg:w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right side - Notifications and User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile Menu Button - Only on mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2 hover:bg-gray-100"
              onClick={() => onMobileMenuToggle(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </Button>

            {/* Search Button - Mobile only */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2 hover:bg-gray-100"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              <Search className="h-5 w-5 text-gray-600" />
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2 hover:bg-gray-100"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>

            {/* Settings */}
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-gray-100 hidden sm:flex"
            >
              <Settings className="h-5 w-5 text-gray-600" />
            </Button>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <Button
                variant="ghost"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100"
              >
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-indigo-600" />
                </div>
                <span className="text-gray-700 font-medium hidden sm:block">
                  {authUser?.email?.split("@")[0] || "User"}
                </span>
              </Button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {authUser?.email || "user@example.com"}
                    </p>
                    <p className="text-xs text-gray-500">Free Trial</p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            showMobileSearch
              ? "max-h-20 opacity-100 mt-4"
              : "max-h-0 opacity-0 mt-0"
          }`}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search goals, habits, todos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
