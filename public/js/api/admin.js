// Example: API interaction to fetch or add books, etc.
const API_URL = 'https://your-backend-api.com';

function addBook(bookData) {
  fetch(`${API_URL}/admin/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookData),
  })
    .then(response => response.json())
    .then(data => console.log('Book added:', data))
    .catch(error => console.error('Error:', error));
}

function getBooks() {
  fetch(`${API_URL}/books`)
    .then(response => response.json())
    .then(data => console.log('Books:', data))
    .catch(error => console.error('Error:', error));
}
