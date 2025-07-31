import React, { useState } from 'react'
import { Download, FileImage, FileText, Archive, Loader2 } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const ExportSection = ({ content }) => {
  const [isExporting, setIsExporting] = useState({})

  if (!content || !content.slides) {
    return (
      <div className="consulting-card p-8 text-center">
        <p className="text-consulting-gray">No content available for export.</p>
      </div>
    )
  }

  const setExportingState = (type, state) => {
    setIsExporting(prev => ({ ...prev, [type]: state }))
  }

  const exportToPNG = async (slideIndex = null) => {
    const exportType = slideIndex !== null ? `png-slide-${slideIndex}` : 'png-all'
    setExportingState(exportType, true)

    try {
      if (slideIndex !== null) {
        // Export single slide
        const slideElement = document.getElementById(`slide-${slideIndex}`)
        if (!slideElement) throw new Error('Slide element not found')

        const canvas = await html2canvas(slideElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        })

        canvas.toBlob((blob) => {
          saveAs(blob, `infograph-slide-${slideIndex + 1}.png`)
        })
      } else {
        // Export all slides
        const zip = new JSZip()
        
        for (let i = 0; i < content.slides.length; i++) {
          const slideElement = document.getElementById(`slide-${i}`)
          if (slideElement) {
            const canvas = await html2canvas(slideElement, {
              scale: 2,
              useCORS: true,
              backgroundColor: '#ffffff'
            })
            
            canvas.toBlob((blob) => {
              zip.file(`slide-${i + 1}.png`, blob)
            })
          }
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' })
        saveAs(zipBlob, 'infographics-all-slides.zip')
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setExportingState(exportType, false)
    }
  }

  const exportToPDF = async () => {
    setExportingState('pdf', true)

    try {
      const pdf = new jsPDF('landscape', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      for (let i = 0; i < content.slides.length; i++) {
        if (i > 0) pdf.addPage()

        const slideElement = document.getElementById(`slide-${i}`)
        if (slideElement) {
          const canvas = await html2canvas(slideElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
          })

          const imgData = canvas.toDataURL('image/png')
          const imgWidth = pageWidth - 20
          const imgHeight = (canvas.height * imgWidth) / canvas.width

          pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, Math.min(imgHeight, pageHeight - 20))
        }
      }

      pdf.save('infographics-presentation.pdf')
    } catch (error) {
      console.error('PDF export failed:', error)
      alert('PDF export failed. Please try again.')
    } finally {
      setExportingState('pdf', false)
    }
  }

  const exportCarouselZip = async () => {
    setExportingState('carousel', true)

    try {
      const zip = new JSZip()
      
      // Add all slides as PNG files
      for (let i = 0; i < content.slides.length; i++) {
        const slideElement = document.getElementById(`slide-${i}`)
        if (slideElement) {
          const canvas = await html2canvas(slideElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
          })
          
          canvas.toBlob((blob) => {
            zip.file(`carousel-slide-${String(i + 1).padStart(2, '0')}.png`, blob)
          })
        }
      }

      // Add social media content as text files
      if (content.socialPosts) {
        const socialFolder = zip.folder('social-media-posts')
        
        Object.entries(content.socialPosts).forEach(([platform, post]) => {
          let content = typeof post === 'string' ? post : ''
          
          if (typeof post === 'object') {
            if (post.hook) content += `${post.hook}\n\n`
            if (post.content) content += `${post.content}\n\n`
            if (post.callToAction) content += `${post.callToAction}\n\n`
            if (post.hashtags) content += post.hashtags.join(' ')
          }
          
          socialFolder.file(`${platform}-post.txt`, content.trim())
        })
      }

      // Add instructions file
      const instructions = `INFOGRAPHIC CAROUSEL EXPORT
================================

This package contains:
1. ${content.slides.length} infographic slides optimized for carousel posts
2. Platform-specific social media content

USAGE INSTRUCTIONS:
- Upload slides in order to LinkedIn, Instagram, or Facebook as a carousel
- Use the social media text files for captions
- Slides are numbered for easy ordering

Generated by InfographAI
${new Date().toLocaleDateString()}`

      zip.file('README.txt', instructions)

      const zipBlob = await zip.generateAsync({ type: 'blob' })
      saveAs(zipBlob, 'infographics-carousel-package.zip')
    } catch (error) {
      console.error('Carousel export failed:', error)
      alert('Carousel export failed. Please try again.')
    } finally {
      setExportingState('carousel', false)
    }
  }

  return (
    <div className="consulting-card p-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* PNG Export */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FileImage className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-consulting-navy mb-2">PNG Images</h3>
            <p className="text-sm text-consulting-gray mb-4">
              High-quality images perfect for social media and presentations
            </p>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => exportToPNG()}
              disabled={isExporting['png-all']}
              className="w-full consulting-button disabled:opacity-50 text-sm"
            >
              {isExporting['png-all'] ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Exporting...</>
              ) : (
                <><Download className="w-4 h-4 mr-2" />All Slides</>
              )}
            </button>
            
            {content.slides.map((_, index) => (
              <button
                key={index}
                onClick={() => exportToPNG(index)}
                disabled={isExporting[`png-slide-${index}`]}
                className="w-full px-3 py-2 text-sm border border-consulting-blue text-consulting-blue rounded hover:bg-consulting-blue hover:text-white transition-colors disabled:opacity-50"
              >
                {isExporting[`png-slide-${index}`] ? (
                  <><Loader2 className="w-3 h-3 mr-2 animate-spin" />Exporting...</>
                ) : (
                  <>Slide {index + 1}</>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* PDF Export */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-consulting-navy mb-2">PDF Document</h3>
            <p className="text-sm text-consulting-gray mb-4">
              Professional presentation format for executives and meetings
            </p>
          </div>
          
          <button
            onClick={exportToPDF}
            disabled={isExporting.pdf}
            className="w-full consulting-button disabled:opacity-50"
          >
            {isExporting.pdf ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating PDF...</>
            ) : (
              <><Download className="w-4 h-4 mr-2" />Download PDF</>
            )}
          </button>
        </div>

        {/* Carousel Package */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Archive className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-consulting-navy mb-2">Carousel Package</h3>
            <p className="text-sm text-consulting-gray mb-4">
              Complete package optimized for LinkedIn and Instagram carousels
            </p>
          </div>
          
          <button
            onClick={exportCarouselZip}
            disabled={isExporting.carousel}
            className="w-full consulting-button disabled:opacity-50"
          >
            {isExporting.carousel ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating Package...</>
            ) : (
              <><Download className="w-4 h-4 mr-2" />Download ZIP</>
            )}
          </button>
        </div>

        {/* Social Media Package */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-consulting-navy mb-2">Social Content</h3>
            <p className="text-sm text-consulting-gray mb-4">
              Platform-optimized text content ready for posting
            </p>
          </div>
          
          <button
            onClick={async () => {
              const zip = new JSZip()
              
              if (content.socialPosts) {
                Object.entries(content.socialPosts).forEach(([platform, post]) => {
                  let content = typeof post === 'string' ? post : ''
                  
                  if (typeof post === 'object') {
                    if (post.hook) content += `${post.hook}\n\n`
                    if (post.content) content += `${post.content}\n\n`
                    if (post.callToAction) content += `${post.callToAction}\n\n`
                    if (post.hashtags) content += post.hashtags.join(' ')
                  }
                  
                  zip.file(`${platform}-post.txt`, content.trim())
                })
              }

              const zipBlob = await zip.generateAsync({ type: 'blob' })
              saveAs(zipBlob, 'social-media-content.zip')
            }}
            className="w-full consulting-button"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Content
          </button>
        </div>
      </div>

      {/* Export Tips */}
      <div className="mt-8 p-4 bg-consulting-lightgray rounded-lg">
        <h4 className="font-semibold text-consulting-navy mb-3">💡 Export Tips</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-consulting-gray">
          <div>
            <strong>For LinkedIn Carousels:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Use the Carousel Package ZIP</li>
              <li>Upload slides in numerical order</li>
              <li>Use LinkedIn post content as caption</li>
            </ul>
          </div>
          <div>
            <strong>For Executive Presentations:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Download PDF for easy sharing</li>
              <li>PNG files for custom presentations</li>
              <li>Print-ready high resolution</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExportSection 