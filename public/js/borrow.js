document.addEventListener('DOMContentLoaded', async function () {
    const borrowedBooksList = document.getElementById('borrowedBooksList');

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        borrowedBooksList.innerHTML = '<p>User not logged in or userId not found.</p>';
        return;
    }

    try {

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
                console.log(books)

                books.forEach(book => {
                    console.log(book)
                    const bookItem = document.createElement('div');
                    bookItem.classList.add('book-item');
                    bookItem.innerHTML = `
                        <h3>${book.title}</h3>
                        
                        <img src="../imag/database.png">
                        <p><strong>Author:</strong> ${book.author}</p>
                        <p><strong>Borrowed On:</strong> ${book.borrow_date}</p>
                        <p><strong>Due Date:</strong> ${book.return_date}</p>
                    `;
                    borrowedBooksList.appendChild(bookItem);
                });
            } else {

                borrowedBooksList.innerHTML = '<p>You have not borrowed any books yet.</p>';
            }
        } else {

            console.error('Failed to fetch data from backend');
            borrowedBooksList.innerHTML = '<p>Error fetching borrowed books. Please try again later.</p>';
        }
    } catch (error) {
        console.error('Error:', error);
        borrowedBooksList.innerHTML = '<p>Error fetching borrowed books. Please try again later.</p>';
    }
});
