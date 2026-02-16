import React from "react";
import { Instagram, Twitter, Youtube, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-gray-300 mt-24">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-10 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Logo + Description */}
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold">
              AI
            </div>
            <h2 className="text-white font-semibold text-lg">
              AI-CPTPP
            </h2>
          </div>

          <p className="mt-4 text-sm text-gray-400 leading-relaxed">
            Intelligent project tracking and payment management for modern teams.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-6">
            <a href="#" className="hover:text-white transition">
              <Instagram size={18} />
            </a>
            <a href="#" className="hover:text-white transition">
              <Globe size={18} />
            </a>
            <a href="#" className="hover:text-white transition">
              <Twitter size={18} />
            </a>
            <a href="#" className="hover:text-white transition">
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* Product Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Product</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="hover:text-white cursor-pointer">Dashboard</li>
            <li className="hover:text-white cursor-pointer">Modules</li>
            <li className="hover:text-white cursor-pointer">Analytics</li>
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="hover:text-white cursor-pointer">About us</li>
            <li className="hover:text-white cursor-pointer">Contact us</li>
            <li className="hover:text-white cursor-pointer">Supports</li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="hover:text-white cursor-pointer">Privacy</li>
            <li className="hover:text-white cursor-pointer">
              Terms of service
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700 py-6 text-center text-sm text-gray-500">
        © 2026 AI-CPTPP. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
