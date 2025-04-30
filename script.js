// script.js
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resultsContainer = document.getElementById('results-container');
const loadingSpinner = document.getElementById('loading-spinner');
const savedContainer = document.getElementById('saved-container');
const emptySaved = document.getElementById('empty-saved');

// Google Books API key (🔥 Restrict this key in production!)
const API_KEY = 'AIzaSyCL0MN49y_P_4_avMw2ueRDsByUrfGPQSc'; // Replace with your restricted key
const API_BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

// Load saved books from localStorage
let savedBooks = JSON.parse(localStorage.getItem('savedBooks')) || [];

// Initialize: Render saved books on page load
document.addEventListener('DOMContentLoaded', () => {
    renderSavedBooks();
});

// Event listeners for search
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

// Handle book search
async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) {
        resultsContainer.innerHTML = '<p class="empty-state">Please enter a search term</p>';
        return;
    }

    // Show loading spinner
    loadingSpinner.classList.remove('hidden');
    resultsContainer.innerHTML = '';

    try {
        const response = await fetch(`${API_BASE_URL}?q=${encodeURIComponent(query)}&key=${API_KEY}`);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        
        loadingSpinner.classList.add('hidden');
        
        if (data.items && data.items.length > 0) {
            renderBooks(data.items);
        } else {
            resultsContainer.innerHTML = '<p class="empty-state">No books found. Try "Harry Potter" or "JavaScript"</p>';
        }
    } catch (error) {
        console.error('Fetch failed:', error);
        loadingSpinner.classList.add('hidden');
        resultsContainer.innerHTML = `<p class="empty-state">⚠️ Failed to load books. ${error.message}</p>`;
    }
}

// Render search results
function renderBooks(books) {
    resultsContainer.innerHTML = '';
    books.forEach(book => {
        const bookInfo = book.volumeInfo;
        const bookId = book.id;
        const title = bookInfo.title || 'Untitled';
        const authors = bookInfo.authors ? bookInfo.authors.join(', ') : 'Unknown Author';
        const thumbnail = bookInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150';
        const description = bookInfo.description ? bookInfo.description.substring(0, 100) + '...' : 'No description available';
        const infoLink = bookInfo.infoLink || '#';

        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        bookCard.innerHTML = `
            <img src="${thumbnail}" alt="${title} cover">
            <div class="book-info">
                <h3>${title}</h3>
                <p><strong>Author:</strong> ${authors}</p>
                <p>${description}</p>
            </div>
            <div class="book-actions">
                <a href="${infoLink}" target="_blank" class="btn btn-primary">More Info</a>
                <button class="btn btn-primary" onclick="saveBook('${bookId}', '${title.replace(/'/g, "\\'")}', '${authors.replace(/'/g, "\\'")}', '${thumbnail}')">
                    ${isBookSaved(bookId) ? 'Remove' : 'Save'}
                </button>
            </div>
        `;
        resultsContainer.appendChild(bookCard);
    });
}

// Check if book is already saved
function isBookSaved(bookId) {
    return savedBooks.some(book => book.id === bookId);
}

// Save or remove book from reading list
function saveBook(bookId, title, authors, thumbnail) {
    if (isBookSaved(bookId)) {
        // Remove book
        savedBooks = savedBooks.filter(book => book.id !== bookId);
    } else {
        // Add book
        savedBooks.push({ id: bookId, title, authors, thumbnail });
    }

    // Update localStorage
    localStorage.setItem('savedBooks', JSON.stringify(savedBooks));
    
    // Re-render saved books
    renderSavedBooks();
    
    // Re-render search results to update button text
    handleSearch();
}

// Render saved books
function renderSavedBooks() {
    savedContainer.innerHTML = '';
    
    if (savedBooks.length === 0) {
        emptySaved.classList.remove('hidden');
    } else {
        emptySaved.classList.add('hidden');
        savedBooks.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.classList.add('book-card');
            bookCard.innerHTML = `
                <img src="${book.thumbnail}" alt="${book.title} cover">
                <div class="book-info">
                    <h3>${book.title}</h3>
                    <p><strong>Author:</strong> ${book.authors}</p>
                </div>
                <div class="book-actions">
                    <button class="btn btn-primary" onclick="saveBook('${book.id}', '${book.title.replace(/'/g, "\\'")}', '${book.authors.replace(/'/g, "\\'")}', '${book.thumbnail}')">
                        Remove
                    </button>
                </div>
            `;
            savedContainer.appendChild(bookCard);
        });
    }
}
