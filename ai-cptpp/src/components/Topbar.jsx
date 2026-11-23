import React from 'react'
import { Bell, Settings } from 'lucide-react'

// Topbar component for the admin dashboard
// Contains notification and settings icons
const Topbar = () => {
  return (
    <div className="flex justify-end items-center mb-6 gap-4 text-gray-500">
          <Bell className="cursor-pointer hover:text-gray-700" />
          <Settings className="cursor-pointer hover:text-gray-700" />
        </div>
  )
}

export default Topbar
