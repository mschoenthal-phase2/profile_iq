# Publications Management System

This module provides a comprehensive publications management system for healthcare providers, integrating with PubMed API to discover and manage research publications.

## Features

### 1. Publication Discovery

- **PubMed Integration**: Search PubMed by author name and affiliation
- **Automatic Matching**: Intelligent matching of publications to user profiles
- **Bulk Selection**: Select multiple publications at once for adding to profile

### 2. Manual Publication Entry

- **PMID Lookup**: Add publications by entering PubMed ID (PMID)
- **Validation**: Automatic validation of PMID format and existence
- **Rich Metadata**: Automatically pulls title, authors, journal, abstract, and citation details

### 3. Publication Management

- **Visibility Control**: Toggle publication visibility on public profile
- **Status Tracking**: Track publication status (pending, approved, rejected, manual, hidden)
- **Citation Formatting**: Automatic citation formatting in standard academic style
- **Detailed View**: Display abstracts, keywords, DOI links, and full citation information

### 4. Statistics & Analytics

- **Publication Metrics**: Total, visible, and hidden publication counts
- **Review Status**: Track publications pending review
- **Last Updated**: Monitor when publications were last modified

## Components

### Core Components

#### `Publications.tsx`

Main page component that orchestrates the entire publications workflow. Handles:

- Tab navigation between manage, discovery, and manual entry
- State management for publications and discovery results
- Integration with PubMed service
- Save/cancel functionality with unsaved changes detection

#### `PublicationDiscovery.tsx`

Handles the PubMed search and discovery process:

- Search form with author name and affiliation
- Results display with publication previews
- Bulk selection interface
- Integration with PubMed API service

#### `PublicationList.tsx`

Displays and manages the user's publications:

- Separate sections for visible and hidden publications
- Publication cards with full details
- Visibility toggle controls
- Delete confirmation dialogs
- Citation formatting

#### `ManualPMIDEntry.tsx`

Provides manual publication entry via PMID:

- PMID input validation
- Step-by-step instructions
- Example PMIDs for testing
- Integration help and guidelines

#### `PublicationStats.tsx`

Dashboard-style statistics component:

- Publication count metrics
- Visibility breakdown
- Pending review indicators
- Last updated timestamps

## Services

### `pubmed-service.ts`

Comprehensive PubMed API integration:

- Search by author name and affiliation
- Fetch publication details by PMID
- XML response parsing
- Fallback to ESummary API for basic information
- Error handling and rate limiting considerations

## Data Types

### Core Types

```typescript
interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  publicationDate: Date;
  pmid?: string;
  doi?: string;
  abstract?: string;
  keywords: string[];
  publicationType: PublicationType;
  isVisible: boolean;
  status: PublicationStatus;
}
```

### Integration

The publications system integrates seamlessly with:

- **Dashboard**: Publications card appears after biography section
- **Profile Layout**: Uses common profile section layout
- **Supabase**: Ready for database integration with publications table
- **UI Components**: Leverages existing design system components

## Usage

### For Developers

1. **Adding Publications Route**: Already integrated in `App.tsx`
2. **Dashboard Integration**: Publications card automatically appears in dashboard
3. **Database Setup**: Publications table schema included in `schema.sql`

### For Users

1. **Discovery**: Use "Publication Discovery" tab to search PubMed
2. **Manual Entry**: Use "Add by PMID" tab for specific publications
3. **Management**: Use "Manage Publications" tab to control visibility and review details

## Configuration

### Environment Variables

- No additional environment variables required
- Uses public PubMed API endpoints

### API Endpoints

- **PubMed ESearch**: `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi`
- **PubMed EFetch**: `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi`
- **PubMed ESummary**: `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi`

## Future Enhancements

1. **Advanced Filtering**: Filter by publication type, date range, journal
2. **Citation Export**: Export citations in various formats (BibTeX, RIS, etc.)
3. **Impact Metrics**: Integration with citation metrics services
4. **Collaboration**: Co-author identification and networking
5. **Auto-Discovery**: Periodic automatic discovery of new publications
