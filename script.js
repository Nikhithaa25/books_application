// Use environment variables in production (see notes below)
const API_KEY = "AIzaSyCL0MN49y_P_4_avMw2ueRDsByUrfGPQSc"; // 🔥 Replace with your key (and restrict it!)

async function fetchBooks(query) {
  const API_URL = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}`;
  
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const data = await response.json();
    displayResults(data.items || []);
  } catch (error) {
    console.error("Fetch failed:", error);
    document.getElementById("results-container").innerHTML = 
      `<p class="error">⚠️ Failed to load books. ${error.message}</p>`;
  }
}

function displayResults(books) {
  const container = document.getElementById("results-container");
  container.innerHTML = books.length === 0
    ? `<p>No books found. Try "Harry Potter" or "JavaScript".</p>`
    : books.map(book => `
        <div class="book-card">
          <h3>${book.volumeInfo?.title || "Untitled"}</h3>
          ${book.volumeInfo?.authors ? `<p>By: ${book.volumeInfo.authors.join(", ")}</p>` : ""}
          ${book.volumeInfo?.imageLinks?.thumbnail 
            ? `<img src="${book.volumeInfo.imageLinks.thumbnail}" alt="Cover">` 
            : `<div class="no-cover">No cover</div>`}
          <a href="${book.volumeInfo?.infoLink || "#"}" target="_blank">More info</a>
        </div>
      `).join("");
}

// Event listeners
document.getElementById("search-btn").addEventListener("click", () => {
  const query = document.getElementById("search-input").value.trim();
  if (query) fetchBooks(query);
});

document.getElementById("search-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const query = e.target.value.trim();
    if (query) fetchBooks(query);
  }
});
