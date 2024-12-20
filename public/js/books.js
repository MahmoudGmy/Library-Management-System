let Books = [];
const token = localStorage.getItem('token');
const User = JSON.parse(localStorage.getItem('user')); 
const isAdmin = User && User.role === "Admin";

async function fetchBooks() {
    try {
        const response = await fetch(`http://localhost:8080/api/books`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

        if (response.ok && data.status === "success") {
            Books = Array.isArray(data.data) ? data.data : []; 
            displayBooks();
        } else {
            console.error("Failed to fetch books:", data.message);
            alert("Unable to load books. Please try again.");
        }
    } catch (error) {
        console.error("Error fetching books:", error);
        alert("An error occurred while loading books.");
    }
}

function displayBooks() {
    const booksGrid = document.getElementById('booksGrid');
    if (!booksGrid) return;

 
    if (!Array.isArray(Books)) {
        console.error("Books is not an array:", Books);
        return;
    }

    booksGrid.innerHTML = Books.map(book => `
        <div class="book-card">
    
            <img src="../imag/${book.image}" alt="${book.title}" class="book-image">
            <div class="book-info">

                <h3 class="book-title">${book.title}</h3>
               
                <p class="book-author">By ${book.author}</p>
                <p class="book-category">Category: ${book.category}</p>
                <p class="book-description">${book.description_of_book}</p>
                <div class="book-footer">
                    <button class="borrow-btn" onclick="borrowBook('${book.book_id}')">Borrow</button>
                      ${isAdmin ? `<button class="delete-btn" onclick="deleteBook('${book.book_id}')">Delete</button>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

async function borrowBook(bookId) {
  const token = localStorage.getItem("token"); // Ensure token is correctly fetched

  if (!token) {
    alert("You need to be logged in to borrow a book.");
    return;
  }

  const user = JSON.parse(localStorage.getItem("user"));
  const memberId = user ? user.id : null;

  if (!memberId) {
    alert("User ID not found.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/books/borrowBook/${bookId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authentication: `Bearer ${token}`,
        },
        body: JSON.stringify({
          member_id: memberId,
          book_id: bookId,
        }),
      }
    );

    const data = await response.json();
    console.log(data);

    if (response.ok && data.status === "success") {
      alert(`Successfully borrowed the book: ${data.book_title}`);
    } else {
      alert(data.message || "Failed to borrow the book.");
    }
  } catch (error) {
    console.error("Error borrowing book:", error);
    alert("An error occurred while borrowing the book.");
  }
}


document.addEventListener("DOMContentLoaded", fetchBooks);
