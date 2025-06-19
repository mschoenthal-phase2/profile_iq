# Media & Press Management System

This module provides a comprehensive media and press coverage management system for healthcare providers, focusing on manual URL entry with automatic metadata extraction to showcase media appearances and coverage.

## Features

### 1. Manual URL Entry

- **Automatic Metadata Extraction**: Enter any article URL and automatically extract title, description, author, publication date, and images
- **Smart Content Detection**: Automatically detects media type (news article, interview, podcast, video, blog post, etc.)
- **Publication Recognition**: Recognizes major news sources and publications
- **Rich Preview**: Shows extracted content before adding to profile

### 2. Media Discovery Framework

- **Search Preparation**: Infrastructure ready for future automatic media discovery
- **Search Tips**: Provides guidance on finding media coverage manually
- **Publication Suggestions**: Direct links to search major news sources
- **Future Enhancement**: Placeholder for automatic media monitoring

### 3. Comprehensive Media Management

- **Visibility Control**: Toggle article visibility on public profile
- **Featured Articles**: Mark important articles as featured for prominence
- **Media Type Classification**: Categorize content (news, interview, podcast, video, etc.)
- **Status Tracking**: Track articles (pending, approved, rejected, manual, hidden)
- **Rich Metadata Display**: Show publication, author, date, word count, and excerpts

### 4. Statistics & Analytics

- **Coverage Metrics**: Total, visible, and featured article counts
- **Publication Tracking**: Monitor coverage across different media outlets
- **Engagement Insights**: Track featured content and visibility metrics

## Components

### Core Components

#### `MediaPress.tsx`

Main page component that orchestrates the entire media management workflow. Handles:

- Tab navigation between manage and discovery
- State management for articles and metadata
- Integration with URL metadata extraction service
- Save/cancel functionality with unsaved changes detection

#### `MediaDiscovery.tsx`

Provides media discovery interface and guidance:

- Search form for future automatic discovery
- Tips and guidance for finding media coverage
- Direct links to major news sources for manual searching
- Educational content about media monitoring

#### `MediaList.tsx`

Displays and manages the user's media coverage:

- Rich article cards with images, metadata, and controls
- Visibility and featured status toggles
- Media type classification dropdown
- Delete confirmation dialogs
- Comprehensive article information display

#### `ManualURLEntry.tsx`

Handles manual article entry via URL:

- URL input with validation and auto-formatting
- Real-time URL validation
- Example URLs for testing
- Support for various content types
- Integration help and guidelines

#### `MediaStats.tsx`

Dashboard-style statistics component:

- Media coverage count metrics
- Visibility and featured article breakdown
- Last updated timestamps
- Coverage performance indicators

## Services

### `url-metadata-service.ts`

Comprehensive URL metadata extraction service:

- Automatic metadata extraction from URLs
- Smart content type detection
- Publication recognition and branding
- Demo implementation with realistic sample data
- Extensible for future third-party API integration

#### Supported Metadata Fields:

- **Title**: Article headline
- **Description**: Article summary/description
- **Author**: Article author or byline
- **Publication**: News source or website name
- **Published Date**: Publication date
- **Image**: Featured image or thumbnail
- **Tags**: Content categories and keywords
- **Excerpt**: Article preview text
- **Word Count**: Article length estimation

## Data Types

### Core Types

```typescript
interface MediaArticle {
  id: string;
  url: string;
  title: string;
  description?: string;
  publishedDate?: Date;
  author?: string;
  publication: string;
  mediaType: MediaType;
  imageUrl?: string;
  tags: string[];
  excerpt?: string;
  isVisible: boolean;
  isFeatured: boolean;
  status: MediaStatus;
}
```

### Media Types

- **News Article**: Traditional news coverage
- **Interview**: Interviews and Q&A sessions
- **Podcast**: Audio content and podcast appearances
- **Video**: Video interviews and TV appearances
- **Blog Post**: Blog articles and thought leadership
- **Press Release**: Official announcements
- **Profile**: Profile features and spotlights
- **Opinion**: Editorial and opinion pieces
- **Other**: Miscellaneous media coverage

### Article Statuses

- **Pending**: Newly added, awaiting review
- **Approved**: User approved for profile display
- **Manual**: Manually added by user
- **Hidden**: Approved but not visible publicly
- **Rejected**: User rejected from profile

## Integration

The media & press system integrates seamlessly with:

- **Dashboard**: Media card appears at the end of profile sections
- **Profile Layout**: Uses common profile section layout
- **Supabase**: Ready for database integration with media_press table
- **UI Components**: Leverages existing design system components

## Usage

### For Developers

1. **Adding Media Route**: Already integrated in `App.tsx`
2. **Dashboard Integration**: Media card automatically appears in dashboard
3. **Database Setup**: Media press table schema included in `schema.sql`

### For Users

1. **Manual Entry**: Use "Add Article" button to add articles by URL
2. **Media Management**: Control visibility, featured status, and categorization
3. **Discovery**: Use search tips to find media coverage manually

## Configuration

### URL Metadata Extraction

- **Demo Mode**: Currently uses realistic demo data
- **Production Ready**: Infrastructure ready for third-party APIs
- **Supported APIs**: Designed for Mercury, Diffbot, Embedly, or custom backend

### Future Enhancements

#### Automatic Discovery Integration

```javascript
// Future API integration examples:
// - Google News API for automatic discovery
// - Social media monitoring (Twitter, LinkedIn)
// - Press release monitoring services
// - RSS feed monitoring
```

## Key Features vs Other Sections

While similar in structure to Publications and Clinical Trials, Media & Press adds:

1. **URL-Based Entry**: Primary interaction is through URL input
2. **Automatic Metadata Extraction**: Intelligent content analysis
3. **Media Type Detection**: Smart categorization of content types
4. **Featured Article System**: Highlight most important coverage
5. **Publication Recognition**: Automatic source identification
6. **Rich Visual Display**: Images, excerpts, and rich previews
7. **Manual Curation**: Focus on user-selected quality content

## Future Enhancements

1. **Automatic Media Monitoring**: Periodic scanning for mentions
2. **Social Media Integration**: Monitor Twitter, LinkedIn mentions
3. **Press Release Monitoring**: Track company/hospital press releases
4. **Analytics Dashboard**: Track coverage reach and engagement
5. **Media Kit Generation**: Export coverage for professional use
6. **Integration with PR Tools**: Connect with public relations platforms
7. **SEO Optimization**: Enhance profile SEO with media coverage
8. **Sharing Tools**: Easy sharing of media coverage highlights

## Production Implementation Notes

For production deployment, consider:

1. **Backend Metadata Service**: Implement server-side URL extraction to avoid CORS issues
2. **Rate Limiting**: Implement rate limiting for URL extraction requests
3. **Caching**: Cache extracted metadata to improve performance
4. **Error Handling**: Robust error handling for various URL formats
5. **Security**: Validate and sanitize all extracted content
6. **Performance**: Optimize image loading and metadata processing
