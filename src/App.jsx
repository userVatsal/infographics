import React, { useState } from 'react'
import { Sparkles, Link, Download, Share2, BarChart3 } from 'lucide-react'
import Header from './components/Header'
import URLInput from './components/URLInput'
import InfographicGenerator from './components/InfographicGenerator'
import SocialMediaGenerator from './components/SocialMediaGenerator'
import ExportSection from './components/ExportSection'

function App() {
  const [articleUrl, setArticleUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState(null)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!articleUrl.trim()) {
      setError('Please enter a valid article URL')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      // Call Netlify function to process the article
      const response = await fetch('/.netlify/functions/process-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: articleUrl }),
      })

      if (!response.ok) {
        throw new Error('Failed to process article')
      }

      const data = await response.json()
      setGeneratedContent(data)
    } catch (err) {
      setError(err.message || 'An error occurred while processing the article')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-consulting-lightgray to-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-consulting-navy mb-6">
              Transform Articles into 
              <span className="text-consulting-blue"> Executive Infographics</span>
            </h1>
            <p className="text-xl text-consulting-gray mb-8">
              AI-powered tool that converts any article into professional, McKinsey-style infographics 
              and optimized social media content in seconds.
            </p>
          </div>
        </section>

        {/* URL Input Section */}
        <section className="mb-12">
          <URLInput
            url={articleUrl}
            setUrl={setArticleUrl}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            error={error}
          />
        </section>

        {/* Generated Content */}
        {generatedContent && (
          <>
            {/* Infographic Section */}
            <section className="mb-12">
              <div className="flex items-center mb-8">
                <BarChart3 className="w-8 h-8 text-consulting-blue mr-3" />
                <h2 className="text-3xl font-bold text-consulting-navy">
                  Executive Infographics
                </h2>
              </div>
              <InfographicGenerator content={generatedContent} />
            </section>

            {/* Social Media Section */}
            <section className="mb-12">
              <div className="flex items-center mb-8">
                <Share2 className="w-8 h-8 text-consulting-blue mr-3" />
                <h2 className="text-3xl font-bold text-consulting-navy">
                  Social Media Content
                </h2>
              </div>
              <SocialMediaGenerator content={generatedContent} />
            </section>

            {/* Export Section */}
            <section className="mb-12">
              <div className="flex items-center mb-8">
                <Download className="w-8 h-8 text-consulting-blue mr-3" />
                <h2 className="text-3xl font-bold text-consulting-navy">
                  Export & Download
                </h2>
              </div>
              <ExportSection content={generatedContent} />
            </section>
          </>
        )}

        {/* Features Overview */}
        {!generatedContent && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-consulting-navy text-center mb-12">
              Professional Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="consulting-card p-8 text-center">
                <div className="bg-consulting-blue bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-consulting-blue" />
                </div>
                <h3 className="text-xl font-semibold text-consulting-navy mb-3">
                  AI-Powered Analysis
                </h3>
                <p className="text-consulting-gray">
                  Advanced GPT-4 processing extracts key insights and creates structured content optimized for executive consumption.
                </p>
              </div>
              
              <div className="consulting-card p-8 text-center">
                <div className="bg-consulting-green bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-consulting-green" />
                </div>
                <h3 className="text-xl font-semibold text-consulting-navy mb-3">
                  McKinsey-Style Design
                </h3>
                <p className="text-consulting-gray">
                  Professional layouts inspired by top consulting firms with clean typography and data-first visualizations.
                </p>
              </div>
              
              <div className="consulting-card p-8 text-center">
                <div className="bg-primary-500 bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-8 h-8 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-consulting-navy mb-3">
                  Multi-Platform Content
                </h3>
                <p className="text-consulting-gray">
                  Automatically generates optimized posts for LinkedIn, Twitter, Instagram, YouTube, and Facebook.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App 