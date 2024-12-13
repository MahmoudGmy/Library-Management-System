// Sample books data
let books = [
    {
        id: 1,
        title: "OOP",
        count: "70",
        author: "Elzeroo",
        category: "Learning",
        description_of_book: "study object oriantle programming with eazy",
        image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3"
    }, 
];

// Display books
function displayBooks() {
    const booksGrid = document.getElementById('booksGrid');
    if (!booksGrid) return;

    booksGrid.innerHTML = books.map(book => `
        <div class="book-card">
            <img src="${book.image}" alt="${book.title}" class="book-image">
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">By ${book.author}</p>
                <p class="book-category">Category: ${book.category}</p>
                <p class="book-description">${book.description_of_book}</p>
                <div class="book-footer">
                    <span>Available: ${book.count}</span>
                    <button class="btn btn-primary" onclick="borrowBook(${book.id})">Borrow</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Handle add book modal
function setupAddBookModal() {
    const modal = document.getElementById('addBookModal');
    const addBtn = document.getElementById('addBookBtn');
    const cancelBtn = document.getElementById('cancelAddBook');
    const form = document.getElementById('addBookForm');

    if (!modal || !addBtn || !cancelBtn || !form) return;

    addBtn.onclick = () => modal.style.display = "flex";
    cancelBtn.onclick = () => modal.style.display = "none";

    form.onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const newBook = {
            id: books.length + 1,
            title: formData.get('title'),
            count: formData.get('count'),
            author: formData.get('author'),
            category: formData.get('category'),
            description_of_book: formData.get('description'),
            image: formData.get('image')
        };

        books.push(newBook);
        displayBooks();
        modal.style.display = "none";
        form.reset();
    };
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayBooks();
    setupAddBookModal();
});