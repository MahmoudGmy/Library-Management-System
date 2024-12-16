let users = [];
let books = []; // Define books array to prevent errors when adding or deleting books
// const token = localStorage.getItem('token');

async function fetchUsers() {
    try {
        if (!localStorage.getItem('token')) {
            alert("You are not logged in. Please log in first.");
            return;
        }

        const response = await fetch(`http://localhost:8080/api/auth/Users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authentication': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();
        console.log(data);

        if (response.ok && data.status === "success") {
            users = data.data;
            calculateFines();
            renderUserTable();
        } else {
            console.error("Failed to fetch users:", data.message);
            alert("Unable to load users. Please try again.");
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        alert("An error occurred while loading users.");
    }
}

function renderUserTable() {
    const userTable = document.getElementById("userTable");
    if (!userTable) return;  // Ensure that the table exists

    userTable.innerHTML = "";

    users.forEach((user, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.name_member}</td>
            <td>${user.book || 'N/A'}</td>
            <td>${new Date(user.borrowTime).toLocaleString()}</td>
            <td>${new Date(user.returnTime).toLocaleString()}</td>
            <td>$${user.fine || 0}</td>
            <td>
                <button class="extend" onclick="extendReturn(${index})">Extend</button>
                <button class="delete" onclick="deleteUser(${index})">Delete</button>
            </td>
        `;

        userTable.appendChild(row);
    });
}

function extendReturn(index) {
    const newReturnTime = new Date(users[index].returnTime);
    newReturnTime.setDate(newReturnTime.getDate() + 7);
    users[index].returnTime = newReturnTime;

    alert(`${users[index].name_member}'s return time extended to ${newReturnTime.toLocaleString()}`);
    renderUserTable();
}

async function deleteUser(index) {
    const user = users[index];

    if (!confirm(`Are you sure you want to delete ${user.name_member}?`)) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/auth/deleteUser`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'Authentication': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ email: user.email }),
        });

        const data = await response.json();

        if (response.ok && data.status === "SUCCESS") {
            alert(`${user.name_member} has been deleted.`);
            users.splice(index, 1);
            renderUserTable();
        } else {
            alert(data.message || "Failed to delete user.");
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        alert("An error occurred while deleting the user.");
    }
}

function calculateFines() {
    const now = new Date();
    users.forEach((user) => {
        const returnTime = new Date(user.returnTime);
        if (now > returnTime) {
            const overdueDays = Math.ceil((now - returnTime) / (1000 * 60 * 60 * 24));
            user.fine = overdueDays * 5;
        } else {
            user.fine = 0;
        }
    });
}

async function deleteBook(bookId) {
    if (!localStorage.getItem('token')) {
        alert("You need to be logged in to delete a book.");
        return;
    }

    const response = await fetch(`http://localhost:8080/api/books/${bookId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authentication': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const data = await response.json();

    if (response.ok && data.status === 'success') {
        books = books.filter(book => book.id !== bookId);
        displayBooks();
        alert("Book deleted successfully.");
    } else {
        alert(data.message || "Failed to delete the book.");
    }
}

async function setupAddBookModal() {
    if (!localStorage.getItem('token')) {
        alert("You are not logged in. Please log in first.");
        return;
    }

    const modal = document.getElementById('addBookModal');
    const addBtn = document.getElementById('addBookBtn');
    const cancelBtn = document.getElementById('cancelAddBook');
    const form = document.getElementById('addBookForm');

    if (!modal || !addBtn || !cancelBtn || !form) return;

    addBtn.onclick = () => modal.style.display = "flex";
    cancelBtn.onclick = () => modal.style.display = "none";

    form.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const newBook = {
            title: formData.get('title'),
            count: parseInt(formData.get('count'), 10),
            author: formData.get('author'),
            category: formData.get('category'),
            description_of_book: formData.get('description'),
            image: formData.get('image')
        };

        const response = await fetch(`http://localhost:8080/api/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authentication': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(newBook)
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
            books.push(newBook);
            displayBooks();
            modal.style.display = "none";
            form.reset();
            
        } else {
            alert(data.message || "Failed to add book.");
        }
    };
}

document.addEventListener("DOMContentLoaded", () => {
    fetchUsers();
    setupAddBookModal();
});
