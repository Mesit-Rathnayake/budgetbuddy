import React from "react";
import { Github, Linkedin } from "lucide-react"; // optional icons

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-indigo-500/10 via-white to-indigo-500/10 border-t border-gray-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600">
        
        {/* Left Side */}
        <div className="text-center sm:text-left">
          © {new Date().getFullYear()} <span className="font-medium">BudgetBuddy</span>. All rights reserved.
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3 mt-3 sm:mt-0">
          <span className="text-gray-500">Developed by : </span>
          <a
            href="https://github.com/MesithRathnayake"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200 hover:underline"
          >
            Mesith Testing Testing
          </a>

          {/* Optional Icons */}
          <div className="flex items-center gap-2 ml-2">
            <a
              href="https://github.com/Mesit-Rathnayake"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-indigo-600 transition-transform transform hover:scale-110"
            >
              <Github size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/Mesith-Rathnayake"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-indigo-600 transition-transform transform hover:scale-110"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
