document.addEventListener("DOMContentLoaded", async function () {
  const borrowedBooksList = document.getElementById("borrowedBooksList");

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    borrowedBooksList.innerHTML =
      "<p>User not logged in or userId not found.</p>";
    return;
  }

  try {
    const response = await fetch(`/api/auth/${user.id}/getAllborrowedBooks`, {
      method: "GET",
      headers: {
        Authentication: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.status === "success") {
        const books = Array.isArray(data.data) ? data.data : [];
        if (books.length === 0) {
          borrowedBooksList.innerHTML =
            "<p>You have not borrowed any books yet.</p>";
          return;
        }

        books.forEach((book) => {
          const bookItem = document.createElement("div");
          bookItem.classList.add("book-item");
          bookItem.innerHTML = `
                        <h3>${book.title}</h3>
                        <img src="../imag/${book.image}">
                        <p><strong>Author:</strong> ${book.author}</p>
                        <p><strong>Borrowed On:</strong> ${book.borrow_date}</p>
                        <p><strong>Due Date:</strong> ${book.return_date}</p>
                        ${
                          book.fines_value == null
                            ? ""
                            : `<p><strong>ALERT:</strong> Please return book and paid faines ${book.fines_value}`
                        }</p>

                        <button onclick="location.reload();" class="return-btn" data-bookid="${
                          book.book_id
                        }">Return</button>
                    `;

          borrowedBooksList.appendChild(bookItem);
        });

        document.querySelectorAll(".return-btn").forEach((button) => {
          button.addEventListener("click", async (e) => {
            const bookId = button.getAttribute("data-bookid");
            try {
              const returnResponse = await fetch(
                `/api/auth/${user.id}/getAllborrowedBooks`,
                {
                  method: "DELETE",
                  headers: {
                    Authentication: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ book_id: bookId }),
                }
              );

              if (returnResponse.ok) {
                const result = await returnResponse.json();
                console.log(result);
                if (result.success) {
                  button.closest(".book-item").remove();
                  console.log("Book returned successfully:", result.message);
                }
              } else {
                console.error(
                  "Failed to return book:",
                  await returnResponse.text()
                );
              }
            } catch (error) {
              console.error("Error returning book:", error);
            }
          });
        });
      } else {
        borrowedBooksList.innerHTML =
          "<p>You have not borrowed any books yet.</p>";
      }
    } else {
      borrowedBooksList.innerHTML =
        "<p>Error fetching borrowed books. Please try again later.</p>";
    }
  } catch (error) {
    console.error("Error:", error);
    borrowedBooksList.innerHTML =
      "<p>Error fetching borrowed books. Please try again later.</p>";
  }
});
