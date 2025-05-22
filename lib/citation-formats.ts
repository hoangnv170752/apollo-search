interface Paper {
  title: string;
  authors: string[];
  year: string;
  journal?: string;
  url?: string;
  doi?: string;
}

/**
 * Format a paper citation in APA style (7th edition)
 * 
 * APA Format:
 * Author, A. A., Author, B. B., & Author, C. C. (Year). Title of article. Journal Title, Volume(Issue), Page-range. https://doi.org/xxxx
 */
export function formatAPACitation(paper: Paper): string {
  // Format authors (Last, F. M., Last, F. M., & Last, F. M.)
  const formattedAuthors = paper.authors.map(formatAuthorName).join(', ');
  
  // Format the rest according to APA style
  let citation = `${formattedAuthors} (${paper.year}). ${paper.title}`;
  
  // Add journal if available
  if (paper.journal) {
    citation += `. ${paper.journal}`;
  }
  
  // Add DOI if available
  if (paper.doi) {
    const doiUrl = paper.doi.startsWith('http') 
      ? paper.doi 
      : `https://doi.org/${paper.doi.replace(/^doi:/, '')}`;
    citation += `. ${doiUrl}`;
  }
  // If no DOI but URL is available
  else if (paper.url) {
    citation += `. ${paper.url}`;
  }
  
  return citation;
}

/**
 * Format author name to APA style
 * Assumes input could be in various formats, attempts to convert to Last, F. M.
 */
function formatAuthorName(authorName: string): string {
  // Handle empty names
  if (!authorName || authorName.trim() === '') {
    return '';
  }
  
  // If name already has a comma, assume it's already in Last, First format
  if (authorName.includes(',')) {
    const parts = authorName.split(',').map(part => part.trim());
    const lastName = parts[0];
    // Format first name/initials if present
    if (parts.length > 1 && parts[1]) {
      const firstNameParts = parts[1].split(' ').filter(Boolean);
      const initials = firstNameParts
        .map(name => `${name.charAt(0)}.`)
        .join(' ');
      return `${lastName}, ${initials}`;
    }
    return lastName;
  }
  
  // Otherwise assume First Last format
  const nameParts = authorName.split(' ').filter(Boolean);
  if (nameParts.length === 1) {
    return nameParts[0]; // Just return the name if only one part
  }
  
  // Get last name (last part)
  const lastName = nameParts.pop() || '';
  
  // Format initials from remaining parts
  const initials = nameParts
    .map(name => `${name.charAt(0)}.`)
    .join(' ');
  
  return `${lastName}, ${initials}`;
}
