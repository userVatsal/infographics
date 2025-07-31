import React, { useState } from 'react'
import { Twitter, Linkedin, Instagram, Youtube, Facebook, Copy, Check } from 'lucide-react'

const SocialMediaGenerator = ({ content }) => {
  const [activeTab, setActiveTab] = useState('twitter')
  const [copiedPlatform, setCopiedPlatform] = useState(null)

  if (!content || !content.socialPosts) {
    return (
      <div className="consulting-card p-8 text-center">
        <p className="text-consulting-gray">No social media content generated yet.</p>
      </div>
    )
  }

  const platforms = [
    { id: 'twitter', name: 'X (Twitter)', icon: Twitter, color: 'bg-black' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-600' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'bg-red-600' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-700' }
  ]

  const copyToClipboard = async (text, platform) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedPlatform(platform)
      setTimeout(() => setCopiedPlatform(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const formatPost = (post) => {
    if (typeof post === 'string') return post
    
    let formatted = ''
    
    if (post.hook) formatted += `${post.hook}\n\n`
    if (post.content) formatted += `${post.content}\n\n`
    if (post.callToAction) formatted += `${post.callToAction}\n\n`
    if (post.hashtags && post.hashtags.length > 0) {
      formatted += post.hashtags.join(' ')
    }
    
    return formatted.trim()
  }

  const getPostPreview = (platform) => {
    const post = content.socialPosts[platform]
    if (!post) return 'No content available for this platform.'
    
    return formatPost(post)
  }

  const getCharacterCount = (platform) => {
    const text = getPostPreview(platform)
    return text.length
  }

  const getCharacterLimit = (platform) => {
    const limits = {
      twitter: 280,
      linkedin: 3000,
      instagram: 2200,
      youtube: 5000,
      facebook: 63206
    }
    return limits[platform] || 0
  }

  const isOverLimit = (platform) => {
    return getCharacterCount(platform) > getCharacterLimit(platform)
  }

  return (
    <div className="consulting-card p-6">
      {/* Platform Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
        {platforms.map((platform) => {
          const Icon = platform.icon
          return (
            <button
              key={platform.id}
              onClick={() => setActiveTab(platform.id)}
              className={`flex items-center px-4 py-2 rounded-t-lg transition-all ${
                activeTab === platform.id
                  ? 'bg-white border-b-2 border-consulting-blue text-consulting-navy'
                  : 'text-consulting-gray hover:text-consulting-navy'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {platform.name}
            </button>
          )
        })}
      </div>

      {/* Active Platform Content */}
      <div className="space-y-6">
        {platforms.map((platform) => {
          if (activeTab !== platform.id) return null
          
          const Icon = platform.icon
          const post = content.socialPosts[platform.id]
          const postText = getPostPreview(platform.id)
          const charCount = getCharacterCount(platform.id)
          const charLimit = getCharacterLimit(platform.id)
          const isOver = isOverLimit(platform.id)

          return (
            <div key={platform.id} className="space-y-4">
              {/* Platform Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${platform.color} text-white mr-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-consulting-navy">
                      {platform.name} Post
                    </h3>
                    <p className="text-sm text-consulting-gray">
                      Optimized for {platform.name.toLowerCase()} audience
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => copyToClipboard(postText, platform.id)}
                  className="flex items-center px-4 py-2 bg-consulting-blue text-white rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  {copiedPlatform === platform.id ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Text
                    </>
                  )}
                </button>
              </div>

              {/* Character Count */}
              <div className="flex items-center justify-between text-sm">
                <span className={`${isOver ? 'text-red-500' : 'text-consulting-gray'}`}>
                  {charCount} / {charLimit} characters
                </span>
                {isOver && (
                  <span className="text-red-500 text-xs">
                    ⚠️ Exceeds platform limit
                  </span>
                )}
              </div>

              {/* Post Preview */}
              <div className="border border-gray-200 rounded-lg">
                {/* Mock Platform Header */}
                <div className="flex items-center p-4 border-b border-gray-100 bg-gray-50">
                  <div className="w-8 h-8 bg-consulting-blue rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">IA</span>
                  </div>
                  <div>
                    <div className="font-medium text-sm">InfographAI</div>
                    <div className="text-xs text-gray-500">
                      {platform.id === 'linkedin' ? 'Executive Intelligence Platform' : '@infographai'}
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-4">
                  <div className="whitespace-pre-wrap text-gray-800 text-sm leading-relaxed">
                    {postText}
                  </div>
                  
                  {/* Platform-specific elements */}
                  {platform.id === 'instagram' && (
                    <div className="mt-4 p-3 bg-gray-50 rounded border text-xs text-gray-600">
                      💡 Tip: Pair this with your infographic carousel for maximum engagement
                    </div>
                  )}
                  
                  {platform.id === 'linkedin' && (
                    <div className="mt-4 p-3 bg-blue-50 rounded border text-xs text-blue-800">
                      📊 Perfect for sharing with your professional network
                    </div>
                  )}
                  
                  {platform.id === 'youtube' && (
                    <div className="mt-4 p-3 bg-red-50 rounded border text-xs text-red-800">
                      🎥 Use this as your video description or script outline
                    </div>
                  )}
                </div>
              </div>

              {/* Platform-specific details */}
              {post && typeof post === 'object' && (
                <div className="bg-consulting-lightgray p-4 rounded-lg">
                  <h4 className="font-medium text-consulting-navy mb-3">
                    Content Breakdown
                  </h4>
                  <div className="space-y-2 text-sm">
                    {post.hook && (
                      <div>
                        <span className="font-medium text-consulting-navy">Hook:</span>
                        <span className="text-consulting-gray ml-2">{post.hook}</span>
                      </div>
                    )}
                    {post.callToAction && (
                      <div>
                        <span className="font-medium text-consulting-navy">CTA:</span>
                        <span className="text-consulting-gray ml-2">{post.callToAction}</span>
                      </div>
                    )}
                    {post.hashtags && post.hashtags.length > 0 && (
                      <div>
                        <span className="font-medium text-consulting-navy">Hashtags:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {post.hashtags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-white text-consulting-blue text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SocialMediaGenerator 