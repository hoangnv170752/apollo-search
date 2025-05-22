export interface SavedPaper {
  title: string;
  authors: string[];
  year: string;
  journal?: string;
  url?: string;
  doi?: string;
  savedAt: number; // timestamp when saved
}

// Get all saved papers from localStorage
export function getSavedPapers(): SavedPaper[] {
  if (typeof window === 'undefined') {
    return []; // Return empty array if running on server
  }
  
  try {
    const savedPapers = localStorage.getItem('apollo-saved-papers');
    return savedPapers ? JSON.parse(savedPapers) : [];
  } catch (error) {
    console.error('Error retrieving saved papers:', error);
    return [];
  }
}

// Save a paper to localStorage
export function savePaper(paper: Omit<SavedPaper, 'savedAt'>): boolean {
  if (typeof window === 'undefined') {
    return false; // Cannot save if running on server
  }
  
  try {
    const savedPapers = getSavedPapers();
    
    // Check if paper already exists by title and authors
    const paperExists = savedPapers.some(
      (saved) => 
        saved.title === paper.title && 
        JSON.stringify(saved.authors) === JSON.stringify(paper.authors)
    );
    
    if (!paperExists) {
      const paperToSave: SavedPaper = {
        ...paper,
        savedAt: Date.now()
      };
      
      savedPapers.push(paperToSave);
      localStorage.setItem('apollo-saved-papers', JSON.stringify(savedPapers));
      return true;
    }
    
    return false; // Paper already exists
  } catch (error) {
    console.error('Error saving paper:', error);
    return false;
  }
}

// Remove a paper from localStorage
export function removePaper(paper: Pick<SavedPaper, 'title' | 'authors'>): boolean {
  if (typeof window === 'undefined') {
    return false; // Cannot remove if running on server
  }
  
  try {
    let savedPapers = getSavedPapers();
    const initialLength = savedPapers.length;
    
    // Remove paper by title and authors
    savedPapers = savedPapers.filter(
      (saved) => 
        saved.title !== paper.title || 
        JSON.stringify(saved.authors) !== JSON.stringify(paper.authors)
    );
    
    if (savedPapers.length !== initialLength) {
      localStorage.setItem('apollo-saved-papers', JSON.stringify(savedPapers));
      return true;
    }
    
    return false; // Paper not found
  } catch (error) {
    console.error('Error removing paper:', error);
    return false;
  }
}

// Check if a paper is saved
export function isPaperSaved(paper: Pick<SavedPaper, 'title' | 'authors'>): boolean {
  if (typeof window === 'undefined') {
    return false; // Return false if running on server
  }
  
  try {
    const savedPapers = getSavedPapers();
    
    return savedPapers.some(
      (saved) => 
        saved.title === paper.title && 
        JSON.stringify(saved.authors) === JSON.stringify(paper.authors)
    );
  } catch (error) {
    console.error('Error checking if paper is saved:', error);
    return false;
  }
}
