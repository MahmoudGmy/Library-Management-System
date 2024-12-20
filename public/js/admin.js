let users = [];
let books = [];

// Fetch users from API
async function fetchUsers() {
  try {
    if (!localStorage.getItem("token")) {
      alert("You are not logged in. Please log in first.");
      return;
    }

    const response = await fetch(`http://localhost:8080/api/auth/Users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authentication: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();

    if (response.ok && data.status === "success") {
      users = data.data;
      console.log(users);
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

// Render the user table
// function renderUserTable() {
//   const userTable = document.getElementById("userTable");
//   if (!userTable) return;

//   userTable.innerHTML = ""; // Clear the table before rendering

//   users.forEach((user, index) => {
//     const row = document.createElement("tr");
//     console.log(user);

//     row.innerHTML = `
//       <td>${user.member_id}</td>
//       <td>${user.name_member}</td>


//       <td>$${user.fine || 0}</td>
//       <td>
//         <input type="number" class="addfines" id="fineAmount-${index}" placeholder="Add fines">
//         <button type="button" class="addfines"  onclick="calculateFines(${index})">Add Fines</button>
//         <button class="delete" onclick="deleteUser(${index})">Delete</button>
//       </td>
//     `;

//     userTable.appendChild(row); // Add the row to the table
//   });
// }
async function renderUserTable() {
  const userTable = document.getElementById("userTable");
  if (!userTable) return;

  userTable.innerHTML = ""; // Clear the table before rendering

  for (let index = 0; index < users.length; index++) {
    const user = users[index];
    const borrowedBooks = await fetchBorrowedBooks(user.member_id);

    const row = document.createElement("tr");
    console.log(user);

    // Create a select element for borrowed books
    const selectElement = document.createElement("select");
    selectElement.className = "borrowed-books-select";
    borrowedBooks.forEach((book) => {
      const option = document.createElement("option");
      option.value = book.book_id; // Use a unique identifier for the value
      option.text = book.title; // Display the book title
      selectElement.appendChild(option);
    });
    const fines = localStorage.getItem(`fines_val${user.member_id}`);
    console.log("fines_val", fines);
    

    row.innerHTML = `
      <td>${user.member_id}</td>
      <td>${user.name_member}</td>
      <td></td> <!-- Placeholder for select element -->
      <td>$${
        fines || 0
      }</td> <!-- Display the fine amount from borrowed books -->
      <td>
        <input type="number" class="addfines" id="fineAmount-${index}" placeholder="Add fines">
        <button type="button" class="addfines" onclick="calculateFines(${index})">Add Fines</button>
        <button class="delete" onclick="deleteUser(${index})">Delete</button>
      </td>
    `;

    // Insert the select element into the appropriate cell
    row.cells[2].appendChild(selectElement);

    userTable.appendChild(row); // Add the row to the table
  }
}

async function fetchBorrowedBooks(userId) {
  try {
    const response = await fetch(`/api/auth/${userId}/borrowedBooks`, {
      method: "GET",
      headers: {
        Authentication: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.status === "SUCCESS") {
      return data.data;
    } else {
      console.error("Failed to fetch borrowed books:", data.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching borrowed books:", error);
    return [];
  }
}

async function fetchBorrowedBooks(userId) {
    
 try {
   const response = await fetch(`/api/auth/${userId}/getAllborrowedBooks`, {
     method: "GET",
     headers: {
       Authentication: `Bearer ${localStorage.getItem("token")}`,
       "Content-Type": "application/json",
     },
   });

   const data = await response.json();
   console.log(data);

   if (data.status == "success") {
     return data.data;
   } else {
     console.error("Failed to fetch borrowed books:", data.message);
     return [];
   }
 } catch (error) {
   console.error("Error fetching borrowed books:", error);
   return [];
 }
}


// -----------------------------------------------------------------------------=================================================================================

// Extend the return date
function extendReturn(index) {
  const newReturnTime = new Date(users[index].returnTime);
  newReturnTime.setDate(newReturnTime.getDate() + 7);
  users[index].returnTime = newReturnTime;

  alert(
    `${
      users[index].name_member
    }'s return time extended to ${newReturnTime.toLocaleString()}`
  );
  renderUserTable();
}

// Delete a user
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
        Authentication: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ email: user.email }),
    });

    const data = await response.json();

    if (response.ok && data.status === "success") {
      alert(`${user.name_member} has been deleted.`);
      users.splice(index, 1); // Remove the user from the array
      renderUserTable(); // Re-render the table
    } else {
      alert(data.message || "Failed to delete user.");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    alert("An error occurred while deleting the user.");
  }
}

// Calculate fines for a user
// async function calculateFines(index) {
//   const user = users[index]; // Get the selected user
//   // console.log(user);

//   const fineAmount = document.querySelector(`#fineAmount-${index}`).value; // Get the fine amount from the input
//   //  console.log(fineAmount);
//   if (!fineAmount || isNaN(fineAmount) || fineAmount <= 0) {
//     alert("Please enter a valid fine amount.");
//     return;
//   }

//   try {
//     // Make a POST request to add the fine
//     const response = await fetch(
//       `http://localhost:8080/api/auth/user/${user.id}/book/${user.book_id}/addFines`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authentication: `Bearer ${localStorage.getItem("token")}`, // Authorization header
//         },
//         body: JSON.stringify({ fine_amount: fineAmount }), // Send fine amount as body
//       }
//     );


//     const data = await response.json(); // Parse the response

//     if (response.ok && data.status === "SUCCESS") {
//       console.log("Fines updated:", data);
//       alert(`Fines for ${user.name_member} have been updated.`);
//       fetchUsers(); // Re-fetch the users to update the table
//     } else {
//       console.error("Failed to update fines:", data.message);
//       alert("Failed to update fines.");
//     }
//   } catch (error) {
//     console.error("Error calculating fines:", error);
//     alert("An error occurred while calculating fines.");
//   }
// }
async function calculateFines(index) {
  const user = users[index]; // Get the selected user
  const { member_id } = user;
  console.log(member_id);
  
  const selectElement = document.getElementsByClassName("borrowed-books-select")[index];
  
  const book_id = selectElement.value;
  console.log(book_id);
  
  
  
  

  if (!book_id) {
    alert("User does not have a valid book_id.");
    return;
  }

  const fineAmount = document.querySelector(`#fineAmount-${index}`).value; // Get the fine amount from the input
  if (!fineAmount || isNaN(fineAmount) || fineAmount <= 0) {
    alert("Please enter a valid fine amount.");
    return;
  }

  try {
    // Make a POST request to add the fine
    const response = await fetch(
      `http://localhost:8080/api/auth/user/${member_id}/book/${book_id}/addFines`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authentication: `Bearer ${localStorage.getItem("token")}`, // Authorization header
        },
        body: JSON.stringify({ fine_amount: fineAmount }), // Send fine amount as body
      }
    );
console.log(response);

    if (response.ok) {
      const updatedFine = await response.json();
      console.log("Fines updated:", updatedFine);
      localStorage.setItem(`fines_val${member_id}`, updatedFine.fines_value);
      
      users[index].fineAmount = updatedFine.fines_value; // Update the fine amount in the user object
      alert("Fine added successfully!");

      renderUserTable();
    } else {
      alert("Failed to add fine.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while adding the fine.");
  }
}
//===============================================================================================================

// Setup Add Book Modal
async function setupAddBookModal() {
  const modal = document.getElementById("addBookModal");
  const addBtn = document.getElementById("addBookBtn");
  const cancelBtn = document.getElementById("cancelAddBook");
  const form = document.getElementById("addBookForm");

  if (!modal || !addBtn || !cancelBtn || !form) return;

  addBtn.onclick = () => (modal.style.display = "flex");
  cancelBtn.onclick = () => (modal.style.display = "none");

  form.onsubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const newBook = {
      title: formData.get("title"),
      count: parseInt(formData.get("count"), 10),
      author: formData.get("author"),
      category: formData.get("category"),
      description_of_book: formData.get("description"),
      image: formData.get("image"),
    };

    try {
      const response = await fetch(`http://localhost:8080/api/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authentication: `Bearer ${localStorage.getItem("token")}`, // Include token for authentication
        },
        body: JSON.stringify(newBook),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        books.push(newBook);
        displayBooks(); // Display the newly added book
        modal.style.display = "none";
        form.reset(); // Reset the form
        alert("Book added successfully.");
      } else {
        alert(data.message || "Failed to add book.");
      }
    } catch (error) {
      console.error("Error adding book:", error);
      alert("An error occurred while adding the book.");
    }
  };
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  fetchUsers(); // Fetch and render users
  setupAddBookModal(); // Setup the modal for adding books
});
