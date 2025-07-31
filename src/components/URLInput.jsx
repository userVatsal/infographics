import React, { useState } from 'react'
import { Link, Loader2, AlertCircle, FileText } from 'lucide-react'

const URLInput = ({ url, setUrl, onGenerate, isGenerating, error }) => {
  const [showTextInput, setShowTextInput] = useState(false)
  const [articleText, setArticleText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onGenerate()
  }

  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="consulting-card p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-consulting-navy mb-3">
            Get Started
          </h2>
          <p className="text-consulting-gray">
            Paste an article URL from McKinsey, BCG, Bain, HBR, or any publication
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!showTextInput ? (
            <div className="space-y-4">
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-consulting-gray w-5 h-5" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.mckinsey.com/your-article-url"
                  className="consulting-input pl-12"
                  disabled={isGenerating}
                />
              </div>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowTextInput(true)}
                  className="text-consulting-blue hover:text-consulting-navy transition-colors text-sm"
                  disabled={isGenerating}
                >
                  Can't access the URL? Paste article text instead
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-consulting-gray w-5 h-5" />
                <textarea
                  value={articleText}
                  onChange={(e) => setArticleText(e.target.value)}
                  placeholder="Paste the full article content here..."
                  rows={6}
                  className="consulting-input pl-12 resize-none"
                  disabled={isGenerating}
                />
              </div>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowTextInput(false)}
                  className="text-consulting-blue hover:text-consulting-navy transition-colors text-sm"
                  disabled={isGenerating}
                >
                  Back to URL input
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="text-center">
            <button
              type="submit"
              disabled={isGenerating || (!url.trim() && !articleText.trim())}
              className="consulting-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto min-w-[200px]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Generate Infographics'
              )}
            </button>
          </div>
        </form>

        {/* Example URLs */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-consulting-gray mb-3 text-center">Try these example articles:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              'McKinsey Insights',
              'BCG Articles', 
              'Harvard Business Review',
              'Bain & Company'
            ].map((source) => (
              <span
                key={source}
                className="px-3 py-1 bg-consulting-lightgray text-consulting-gray text-sm rounded-full"
              >
                {source}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default URLInput 