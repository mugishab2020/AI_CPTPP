import React from 'react'

const Navbar = () => {
  return (
    <div>
       <nav className="flex items-center justify-between px-20 py-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold">
            AI
          </div>
          <h1 className="font-semibold text-lg text-gray-800">
            AI-CPTPP
          </h1>
        </div>

        {/* Links */}
        <ul className="hidden md:flex gap-8 text-gray-500 font-medium">
          <li className="hover:text-gray-900 cursor-pointer">Features</li>
          <li className="hover:text-gray-900 cursor-pointer">Contact</li>
          <li className="hover:text-gray-900 cursor-pointer">Faqs</li>
          <li className="text-sky-500 hover:text-sky-600 cursor-pointer">
            Sign in
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar
