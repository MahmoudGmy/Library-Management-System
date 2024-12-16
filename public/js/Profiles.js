document.getElementById('logout').addEventListener('click', function(event) {

  event.preventDefault();

  localStorage.removeItem('token');
  localStorage.removeItem('user');

  window.location.href = 'login.html'; 
});

document.addEventListener('DOMContentLoaded', async function () {

  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    alert("User not found. Please log in.");
    window.location.href = 'login.html'; 
    return;
  }


  if (!user) {
    alert("User not found. Please log in.");
    window.location.href = 'login.html';
    return;
  }


  document.querySelector(".profile-card .avatar").src = user.avatar || 'https://via.placeholder.com/150';
  const userInfoDiv = document.querySelector(".profile-card .info");

  try {

    const response = await fetch(`http://localhost:8080/api/auth/${user.id}/borrowedBooks`, {
      headers: {
        'Authentication': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch borrowed books count.");
    }

    const data = await response.json();
    console.log(data)
    const borrowedCount = data.data.count || 0;
    console.log(borrowedCount)
    const title = data.data.title || "";


    userInfoDiv.innerHTML = `
          <p><strong>Name:</strong> ${user.name}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Borrowed Books:</strong> ${borrowedCount}</p>

      `;
  } catch (error) {
    console.error("Error fetching borrowed books count:", error);
    userInfoDiv.innerHTML = `
          <p><strong>Name:</strong> ${user.name}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Borrowed Books:</strong> Error fetching data</p>
      `;
  }
});
