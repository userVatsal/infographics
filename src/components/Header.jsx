import React from 'react'
import { BarChart3, Sparkles } from 'lucide-react'

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="bg-consulting-blue bg-opacity-10 p-2 rounded-lg mr-3">
                <BarChart3 className="w-8 h-8 text-consulting-blue" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-consulting-navy">
                  InfographAI
                </h1>
                <p className="text-sm text-consulting-gray">
                  Executive Intelligence Platform
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-consulting-lightgray px-3 py-1 rounded-full">
              <Sparkles className="w-4 h-4 text-consulting-blue mr-2" />
              <span className="text-sm font-medium text-consulting-navy">
                Powered by GPT-4
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 