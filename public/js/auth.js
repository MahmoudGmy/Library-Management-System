const API_BASE_URL = window.location.origin.includes('localhost')
    ? 'http://localhost:8080'
    : 'https://your-production-backend.com';


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


async function login(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Please enter email and password');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();

        if (data.status === 'success') {
            const member = data.data.member;
            console.log(member);
            const user = {
                id:member.member_id,
                name: member.name_member,
                email: member.email,
                role: member.role_user
            };
            console.log(user)
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', data.data.token);

            if (user.role === "Admin") {
                alert('Login successful! Redirecting to Admin panel...');
                window.location.href = 'admin.html';
                return; 
            }

            alert('Login successful! Redirecting...');
            window.location.href = 'index.html';
            // const deleteIcone = document.getElementById('')
        } else {
            alert(data.message || 'Invalid credentials');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Unable to connect to the server.');
    }
}

async function register(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        phone: document.getElementById('phone').value,
        gender: document.getElementById('gender').value,
        address: document.getElementById('address').value,
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        console.log("data=> ", data);
        if (data.status === 'SUCCESS' && data.data.newMember) {
            const user = {
                id:data.data.newMember.id,
                name: data.data.newMember.name,
                email: data.data.newMember.email,
                role: data.data.newMember.role,
            };
            console.log("user=> ", user);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', data.data.token);
            alert('Registration successful! Redirecting...');
            window.location.href = 'index.html';
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('Unable to connect to the server.');
    }
}

// Handle logout
function logout() {
    try {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout failed:', error);
        alert('An error occurred while logging out.');
    }
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', login);

    const registerForm = document.getElementById('registerForm');
    if (registerForm) registerForm.addEventListener('submit', register);
});
