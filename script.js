const API_URL = "https://www.googleapis.com/books/v1/volumes?q=YOUR_QUERY&key=AIzaSyCL0MN49y_P_4_avMw2ueRDsByUrfGPQSc";
// Removed the extra quotes around the key
// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resultsContainer = document.getElementById('results-container');
const savedContainer = document.getElementById('saved-container');

// Fetch books from API
async function fetchBooks(query) {
    try {
        const response = await fetch(`${API_URL}${query}`);
        const data = await response.json();
        displayResults(data.items);
    } catch (error) {
        console.error("Error fetching books:", error);
    }
}

// Display results
function displayResults(books) {
    resultsContainer.innerHTML = '';
    
    books.forEach(book => {
        const { title, authors, description, imageLinks } = book.volumeInfo;
        
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <h3>${title}</h3>
            ${authors ? `<p>By: ${authors.join(', ')}</p>` : ''}
            ${imageLinks ? `<img src="${imageLinks.thumbnail}" alt="${title}">` : ''}
            <p>${description ? description.substring(0, 100) + '...' : 'No description available'}</p>
            <button onclick="saveBook('${book.id}')">Save to Reading List</button>
        `;
        resultsContainer.appendChild(bookCard);
    });
}

// Save book to localStorage
function saveBook(bookId) {
    let savedBooks = JSON.parse(localStorage.getItem('savedBooks')) || [];
    if (!savedBooks.includes(bookId)) {
        savedBooks.push(bookId);
        localStorage.setItem('savedBooks', JSON.stringify(savedBooks));
        displaySavedBooks();
    }
}

// Display saved books
function displaySavedBooks() {
    const savedBooks = JSON.parse(localStorage.getItem('savedBooks')) || [];
    savedContainer.innerHTML = savedBooks.length ? '' : '<p>No books saved yet.</p>';
    
    savedBooks.forEach(bookId => {
        // In a real app, you'd fetch book details again or store them
        savedContainer.innerHTML += `<div class="saved-book">Book ID: ${bookId}</div>`;
    });
}

// Event listeners
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) fetchBooks(query);
});

// Initialize
displaySavedBooks();