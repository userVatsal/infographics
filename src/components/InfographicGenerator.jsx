import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Download, Eye } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

const InfographicGenerator = ({ content }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  if (!content || !content.slides) {
    return (
      <div className="consulting-card p-8 text-center">
        <p className="text-consulting-gray">No infographic content generated yet.</p>
      </div>
    )
  }

  const slides = content.slides
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

  const renderChart = (slide) => {
    if (!slide.chartData || !slide.chartData.data) return null

    const { type, data } = slide.chartData

    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
                label={(entry) => `${entry.name}: ${entry.value}%`}
                labelLine={false}
                fontSize={12}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )
      
      default:
        return null
    }
  }

  const InfographicSlide = ({ slide, index }) => (
    <div 
      id={`slide-${index}`}
      className="consulting-card p-8 h-[600px] bg-white relative overflow-hidden"
      style={{ aspectRatio: '16/9' }}
    >
      {/* Header */}
      <div className="border-b border-consulting-lightgray pb-4 mb-6">
        <h1 className="text-2xl font-bold text-consulting-navy mb-2">
          {slide.headline}
        </h1>
        <div className="flex items-center justify-between">
          <p className="text-sm text-consulting-gray">
            {slide.subtitle || `Slide ${index + 1} of ${slides.length}`}
          </p>
          <div className="text-xs text-consulting-gray">
            InfographAI
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-12 gap-6 h-[450px]">
        {/* Left Column - Text Content */}
        <div className="col-span-7 space-y-4">
          {slide.keyPoints && slide.keyPoints.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-consulting-navy mb-3">
                Key Insights
              </h3>
              <ul className="space-y-2">
                {slide.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="w-2 h-2 bg-consulting-blue rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-consulting-gray leading-relaxed">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {slide.statistics && slide.statistics.length > 0 && (
            <div className="bg-consulting-lightgray p-4 rounded-lg">
              <h4 className="font-semibold text-consulting-navy mb-2">Key Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                {slide.statistics.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-2xl font-bold text-consulting-blue">
                      {stat.value}
                    </div>
                    <div className="text-sm text-consulting-gray">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Chart/Visual */}
        <div className="col-span-5">
          {slide.chartData ? (
            <div className="h-full">
              <h4 className="font-semibold text-consulting-navy mb-4">
                {slide.chartData.title || 'Data Visualization'}
              </h4>
              {renderChart(slide)}
            </div>
          ) : (
            <div className="h-full bg-consulting-lightgray rounded-lg flex items-center justify-center">
              <div className="text-center text-consulting-gray">
                <BarChart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Visual placeholder</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-8 right-8 border-t border-consulting-lightgray pt-2">
        <div className="flex items-center justify-between text-xs text-consulting-gray">
          <span>© 2024 InfographAI</span>
          <span>{index + 1}/{slides.length}</span>
        </div>
      </div>
    </div>
  )

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={prevSlide}
            disabled={slides.length <= 1}
            className="consulting-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </button>
          
          <span className="text-consulting-gray">
            Slide {currentSlide + 1} of {slides.length}
          </span>
          
          <button
            onClick={nextSlide}
            disabled={slides.length <= 1}
            className="consulting-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex items-center px-4 py-2 text-consulting-blue border border-consulting-blue rounded-lg hover:bg-consulting-blue hover:text-white transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            {isPreviewMode ? 'Exit Preview' : 'Preview All'}
          </button>
        </div>
      </div>

      {/* Slide Display */}
      {isPreviewMode ? (
        <div className="grid gap-6">
          {slides.map((slide, index) => (
            <InfographicSlide key={index} slide={slide} index={index} />
          ))}
        </div>
      ) : (
        <InfographicSlide slide={slides[currentSlide]} index={currentSlide} />
      )}

      {/* Slide Navigation Dots */}
      {!isPreviewMode && slides.length > 1 && (
        <div className="flex justify-center space-x-2 pt-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-consulting-blue' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default InfographicGenerator 