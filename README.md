# InfographAI

AI-Powered Executive Infographic & Social Media Generator

Transform any article into professional, McKinsey-style infographics and optimized social media content with the power of GPT-4.

## Features

🔗 **Smart Article Processing**
- URL-based article scraping with Readability.js
- Fallback text input option
- Supports McKinsey, BCG, Bain, HBR, and any web article

🧠 **AI-Driven Content Generation**
- GPT-4 powered analysis and insight extraction
- 3-7 professional infographic slides per article
- Platform-optimized social media posts

📊 **Professional Infographics**
- McKinsey/BCG/Bain inspired design
- Interactive charts with Recharts
- Executive-level visual hierarchy
- Data-first layouts

🧵 **Multi-Platform Social Content**
- X (Twitter): Concise threads
- LinkedIn: Executive summaries + carousels
- Instagram: Visual hooks + hashtags
- YouTube: Script outlines
- Facebook: Balanced summaries

📤 **Export & Sharing**
- PNG exports (individual or batch)
- PDF presentations
- Carousel-ready ZIP packages
- Copy-to-clipboard functionality

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key
- Netlify account (for deployment)

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd infographai
npm install
```

2. **Set up environment variables**
Create a `.env` file in the root directory:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

3. **Install Netlify CLI** (for local development)
```bash
npm install -g netlify-cli
```

4. **Start development server**
```bash
netlify dev
```

This will start both the React app and Netlify Functions locally.

### Alternative: Frontend Only

If you want to run just the frontend without backend functions:
```bash
npm run dev
```

## Deployment

### Deploy to Netlify

1. **Connect to Netlify**
```bash
netlify login
netlify init
```

2. **Set environment variables**
```bash
netlify env:set OPENAI_API_KEY your_openai_api_key_here
```

3. **Deploy**
```bash
netlify deploy --prod
```

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Upload the `dist` folder to any static hosting service
3. Configure serverless functions with your hosting provider
4. Set the `OPENAI_API_KEY` environment variable

## Project Structure

```
infographai/
├── src/
│   ├── components/          # React components
│   │   ├── Header.jsx       # App header
│   │   ├── URLInput.jsx     # Article URL input
│   │   ├── InfographicGenerator.jsx  # Slide generator
│   │   ├── SocialMediaGenerator.jsx # Social posts
│   │   └── ExportSection.jsx         # Export functionality
│   ├── App.jsx              # Main application
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles
├── netlify/
│   └── functions/           # Serverless functions
│       ├── process-article.js        # Main processing function
│       └── package.json              # Function dependencies
├── public/                  # Static assets
├── netlify.toml            # Netlify configuration
└── package.json            # Project dependencies
```

## API Reference

### Process Article Function

**Endpoint:** `/.netlify/functions/process-article`

**Method:** POST

**Request Body:**
```json
{
  "url": "https://example.com/article",  // Optional
  "text": "Article content..."           // Optional fallback
}
```

**Response:**
```json
{
  "slides": [
    {
      "headline": "Executive Summary",
      "subtitle": "Key insights",
      "keyPoints": ["Point 1", "Point 2"],
      "statistics": [{"value": "42%", "label": "Growth"}],
      "chartData": {
        "type": "bar",
        "title": "Performance",
        "data": [{"name": "Q1", "value": 100}]
      }
    }
  ],
  "socialPosts": {
    "twitter": "Thread content...",
    "linkedin": {
      "hook": "Attention-grabbing opener",
      "content": "Main content",
      "callToAction": "Engagement question",
      "hashtags": ["#BusinessStrategy"]
    }
  },
  "metadata": {
    "originalUrl": "...",
    "title": "...",
    "processedAt": "...",
    "wordCount": 1500
  }
}
```

## Configuration

### Tailwind CSS

The project uses a custom Tailwind configuration with consulting-inspired colors:

- `consulting-navy`: #1e293b
- `consulting-blue`: #3b82f6
- `consulting-gray`: #64748b
- `consulting-lightgray`: #f1f5f9
- `consulting-green`: #10b981

### Export Options

- **PNG**: High-resolution images (2x scale)
- **PDF**: A4 landscape, multiple slides
- **ZIP**: Organized packages for carousel posts
- **Text**: Platform-specific social media content

## Customization

### Adding New Chart Types

Edit `src/components/InfographicGenerator.jsx`:

```javascript
const renderChart = (slide) => {
  switch (type) {
    case 'your-chart-type':
      return <YourCustomChart data={data} />
    // ... existing cases
  }
}
```

### Customizing Social Platforms

Edit `src/components/SocialMediaGenerator.jsx`:

```javascript
const platforms = [
  { id: 'new-platform', name: 'New Platform', icon: Icon, color: 'bg-color' },
  // ... existing platforms
]
```

### Styling Modifications

All styles are in Tailwind CSS classes. Key files:
- `src/index.css`: Global styles and components
- `tailwind.config.js`: Theme customization

## Troubleshooting

### Common Issues

1. **OpenAI API Errors**
   - Verify API key is set correctly
   - Check account has sufficient credits
   - Ensure rate limits aren't exceeded

2. **Article Scraping Fails**
   - Use the text input fallback
   - Check if the URL is accessible
   - Some sites block automated scraping

3. **Export Issues**
   - Ensure browser supports html2canvas
   - Check for popup blockers
   - Verify sufficient browser memory

### Development Tips

- Use Netlify Dev for full-stack development
- Check browser console for detailed error messages
- Test with various article sources
- Monitor OpenAI usage in API dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- GitHub Issues: Technical problems and feature requests
- Documentation: This README and inline code comments
- OpenAI API: [OpenAI Documentation](https://platform.openai.com/docs)

---

Built with ❤️ using React, Tailwind CSS, and OpenAI GPT-4 