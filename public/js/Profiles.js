// Profile Edit Functionality
document.getElementById("edit-profile-form").addEventListener("submit", function (e) {
  e.preventDefault();

  // Get input values
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const avatar = document.getElementById("avatar").value;

  // Update profile display
  document.querySelector(".profile-card .info").innerHTML = `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Borrowed Books:</strong> 5</p>
  `;
  document.querySelector(".profile-card .avatar").src = avatar;

  // Simulate saving changes
  alert("Profile updated successfully!");
});
