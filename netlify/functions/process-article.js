const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { url, text } = JSON.parse(event.body);

    if (!url && !text) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'URL or text content is required' }),
      };
    }

    let articleContent = '';
    let articleTitle = '';
    let articleUrl = url || '';

    // If text is provided directly, use it
    if (text) {
      articleContent = text;
      articleTitle = 'Article Analysis';
    } else {
      // Scrape article from URL
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        const dom = new JSDOM(html);
        const reader = new Readability(dom.window.document);
        const article = reader.parse();

        if (!article) {
          throw new Error('Could not parse article content');
        }

        articleContent = article.textContent;
        articleTitle = article.title || 'Article Analysis';
      } catch (scrapeError) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Failed to scrape article. Please try pasting the text directly.',
            details: scrapeError.message 
          }),
        };
      }
    }

    if (!articleContent || articleContent.length < 100) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Article content is too short or empty' }),
      };
    }

    // Process with OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert business analyst and content strategist. Your task is to analyze articles and create executive-level infographic content and social media posts.

You must respond with a valid JSON object containing:
1. slides: Array of 3-7 infographic slides
2. socialPosts: Object with platform-specific posts

Each slide should have:
- headline: Executive-level title (max 60 chars)
- subtitle: Supporting context
- keyPoints: Array of 3-5 bullet points (max 80 chars each)
- statistics: Array of key metrics with value and label
- chartData: Object with type ('bar', 'pie', 'line'), title, and data array

Social posts should include twitter, linkedin, instagram, youtube, facebook with platform-optimized content.

Focus on business insights, strategic implications, and actionable takeaways.`
          },
          {
            role: 'user',
            content: `Analyze this article and create professional infographics and social media content:

Title: ${articleTitle}
URL: ${articleUrl}

Content:
${articleContent.substring(0, 8000)}...`
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      throw new Error(`OpenAI API error: ${openaiResponse.status} - ${errorData}`);
    }

    const openaiData = await openaiResponse.json();
    const aiContent = openaiData.choices[0].message.content;

    // Parse AI response
    let processedContent;
    try {
      processedContent = JSON.parse(aiContent);
    } catch (parseError) {
      // If JSON parsing fails, create a basic structure
      processedContent = createFallbackContent(articleTitle, articleContent);
    }

    // Ensure proper structure
    if (!processedContent.slides || !Array.isArray(processedContent.slides)) {
      processedContent = createFallbackContent(articleTitle, articleContent);
    }

    // Add metadata
    processedContent.metadata = {
      originalUrl: articleUrl,
      title: articleTitle,
      processedAt: new Date().toISOString(),
      wordCount: articleContent.split(' ').length,
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(processedContent),
    };

  } catch (error) {
    console.error('Processing error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to process article',
        details: error.message 
      }),
    };
  }
};

function createFallbackContent(title, content) {
  const words = content.split(' ');
  const sentences = content.split('.').filter(s => s.trim().length > 20);
  
  return {
    slides: [
      {
        headline: title.substring(0, 60),
        subtitle: "Executive Summary",
        keyPoints: sentences.slice(0, 4).map(s => s.trim().substring(0, 80)),
        statistics: [
          { value: words.length.toString(), label: "Words" },
          { value: Math.ceil(words.length / 200).toString(), label: "Min Read" }
        ],
        chartData: {
          type: 'bar',
          title: 'Content Analysis',
          data: [
            { name: 'Word Count', value: Math.min(words.length, 2000) },
            { name: 'Sentences', value: sentences.length },
            { name: 'Paragraphs', value: content.split('\n\n').length }
          ]
        }
      }
    ],
    socialPosts: {
      twitter: `📊 Just analyzed: ${title}\n\nKey insights from this ${Math.ceil(words.length / 200)}-minute read.\n\n#BusinessIntelligence #DataAnalysis`,
      linkedin: {
        hook: `💡 Insights from: ${title}`,
        content: `${sentences[0]}...`,
        callToAction: "What are your thoughts on this analysis?",
        hashtags: ["#BusinessStrategy", "#ExecutiveInsights", "#ProfessionalDevelopment"]
      },
      instagram: {
        hook: "📈 Business insights drop:",
        content: `${title} - Key takeaways in our latest analysis`,
        hashtags: ["#business", "#insights", "#strategy", "#consulting"]
      },
      youtube: `Video script: Analyzing ${title}\n\nIntro: Today we're breaking down...\nMain points: ${sentences.slice(0, 3).join(' ')}\nConclusion: These insights show...`,
      facebook: `${title}\n\n${sentences[0]}\n\nRead our full analysis and share your thoughts!`
    }
  };
} 