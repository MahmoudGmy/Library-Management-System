// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('user');
    const authLinks = document.getElementById('authLinks');
    
    if (user) {
        const userData = JSON.parse(user);
        if (authLinks) {
            authLinks.innerHTML = `
                <span>Welcome, ${userData.name}</span>
                <a href="#" onclick="logout()" class="auth-link">Logout</a>
            `;
        }
    }
}

// Handle login
function login(event) {
    if (event) event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // In a real application, you would make an API call here
    // For demo purposes, we'll use hardcoded values
    if (email === "mahmoud@gmail.com" && password === "password") {
        const user = {
            name: "mahmoud",
            email: email,
            role: "Admin"
        };
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = 'index.html';
    } else {
        alert('Invalid credentials');
    }
}

// Handle registration
function register(event) {
    if (event) event.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        phone: document.getElementById('phone').value,
        gender: document.getElementById('gender').value,
        address: document.getElementById('address').value
    };

    // In a real application, you would make an API call here
    // For demo purposes, we'll just store in localStorage
    localStorage.setItem('user', JSON.stringify(formData));
    window.location.href = 'index.html';
}

// Handle logout
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', login);
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', register);
    }
});