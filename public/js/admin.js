function initAdmin() {
  if (!isAdmin()) {
    window.location.href = 'login.html';
  }

  document.getElementById('addBookForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const bookData = {
      title: document.getElementById('title').value,
      author: document.getElementById('author').value,
      category: document.getElementById('category').value,
      count: document.getElementById('count').value,
    };
    addBook(bookData);
  });
}

function isAdmin() {
  const user = JSON.parse(localStorage.getItem('user'));
  return user && user.role === 'admin';
}
