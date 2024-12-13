// Sample user data
const users = [
    {
        name: "John Doe",
        book: "Object-Oriented Programming",
        borrowTime: new Date("2024-12-01T10:00:00"),
        returnTime: new Date("2024-12-10T10:00:00"),
        fine: 0
    },
    {
        name: "Jane Smith",
        book: "JavaScript Fundamentals",
        borrowTime: new Date("2024-12-05T14:30:00"),
        returnTime: new Date("2024-12-12T14:30:00"),
        fine: 10
    }
];

// Function to render user table
function renderUserTable() {
    const userTable = document.getElementById("userTable");
    userTable.innerHTML = ""; // Clear existing rows

    users.forEach((user, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.book}</td>
            <td>${user.borrowTime.toLocaleString()}</td>
            <td>${user.returnTime.toLocaleString()}</td>
            <td>$${user.fine}</td>
            <td>
                <button class="extend" onclick="extendReturn(${index})">Extend</button>
                <button class="delete" onclick="deleteUser(${index})">Delete</button>
            </td>
        `;

        userTable.appendChild(row);
    });
}

// Function to extend return time
function extendReturn(index) {
    const newReturnTime = new Date(users[index].returnTime);
    newReturnTime.setDate(newReturnTime.getDate() + 7); // Extend by 7 days
    users[index].returnTime = newReturnTime;

    alert(`${users[index].name}'s return time extended to ${newReturnTime.toLocaleString()}`);
    renderUserTable();
}

// Function to delete a user
function deleteUser(index) {
    const userName = users[index].name;
    users.splice(index, 1);
    alert(`${userName} has been deleted.`);
    renderUserTable();
}

// Function to calculate fines
function calculateFines() {
    const now = new Date();
    users.forEach((user) => {
        if (now > user.returnTime) {
            const overdueDays = Math.ceil((now - user.returnTime) / (1000 * 60 * 60 * 24));
            user.fine = overdueDays * 5; // $5 fine per day
        }
    });
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    calculateFines();
    renderUserTable();
});
