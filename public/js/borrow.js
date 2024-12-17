document.addEventListener('DOMContentLoaded', async function () {
    const borrowedBooksList = document.getElementById('borrowedBooksList');

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        borrowedBooksList.innerHTML = '<p>User not logged in or userId not found.</p>';
        return;
    }

    try {
        // Fetch borrowed books
        const response = await fetch(`/api/auth/${user.id}/getAllborrowedBooks`, {
            headers: {
                'Authentication': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();

            if (data.status === 'success') {
                const books = Array.isArray(data.data) ? data.data : [data.data];
                console.log(books);

                books.forEach(book => {
                    console.log(book);

                    // Create book item HTML
                    const bookItem = document.createElement('div');
                    bookItem.classList.add('book-item');
                    bookItem.innerHTML = `
                        <h3>${book.title}</h3>
                        <img src="../imag/database.png">
                        <p><strong>Author:</strong> ${book.author}</p>
                        <p><strong>Borrowed On:</strong> ${book.borrow_date}</p>
                        <p><strong>Due Date:</strong> ${book.return_date}</p>
                        <button class="return-btn" data-bookid="${book.book_id}" data-memberid="${user.id}">Return</button>
                    `;

                    borrowedBooksList.appendChild(bookItem);
                });

                // Add click event listener to all "Return" buttons
                document.querySelectorAll('.return-btn').forEach(button => {
                    button.addEventListener('click', async (e) => {
                        const bookId = button.getAttribute('data-bookid');
                        const memberId = button.getAttribute('data-memberid');
                        await returnBook(bookId, memberId, button.parentElement);
                    });
                });
            } else {
                borrowedBooksList.innerHTML = '<p>You have not borrowed any books yet.</p>';
            }
        } else {
            borrowedBooksList.innerHTML = '<p>Error fetching borrowed books. Please try again later.</p>';
        }
    } catch (error) {
        console.error('Error:', error);
        borrowedBooksList.innerHTML = '<p>Error fetching borrowed books. Please try again later.</p>';
    }

    // Function to return a book
    async function returnBook(bookId, memberId, bookElement) {
        try {
            const response = await fetch(`/api/return/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Authentication': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ memberId: memberId }),
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message || "Book returned successfully!");

                // Remove the book from the DOM
                bookElement.remove();
            } else {
                const error = await response.json();
                alert(error.message || "Failed to return the book.");
            }
        } catch (error) {
            console.error("Error returning book:", error);
            alert("An error occurred while returning the book. Please try again.");
        }
    }
});
