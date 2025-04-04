// Mobile Menu Toggle
const menuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        }
    });
});
// Animate stats counter - FIXED VERSION
const statItems = document.querySelectorAll('.stat-item h3');
const statsSection = document.querySelector('.stats-section');

const animateStats = () => {
    statItems.forEach(item => {
        // Extract the numeric value safely
        const text = item.innerText;
        let target, suffix = '';

        // Handle cases with '+' or '%' suffixes
        if (text.includes('+')) {
            target = parseInt(text.replace('+', '')) || 0;
            suffix = '+';
        } else if (text.includes('%')) {
            target = parseInt(text.replace('%', '')) || 0;
            suffix = '%';
        } else if (text === 'NaN') {
            target = 0; // Fallback for any NaN cases
        } else {
            target = parseInt(text) || 0;
        }

        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        const updateNumber = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime > duration) {
                item.innerText = target + suffix;
                return;
            }

            const progress = elapsedTime / duration;
            const currentNumber = Math.floor(progress * target);
            item.innerText = currentNumber + suffix;

            requestAnimationFrame(updateNumber);
        };

        requestAnimationFrame(updateNumber);
    });
};

// Intersection Observer for stats animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });





// Login& Register

document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const toast = document.getElementById('toast');
    const closeToast = document.querySelector('.close');

    // Event Listeners
    signUpButton.addEventListener('click', () => {
        container.classList.add('right-panel-active');
    });

    signInButton.addEventListener('click', () => {
        container.classList.remove('right-panel-active');
    });

    closeToast.addEventListener('click', () => {
        toast.classList.remove('active');
    });

    // Register Form Submission
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            showToast('Error', 'All fields are required!', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showToast('Error', 'Passwords do not match!', 'error');
            return;
        }

        if (password.length < 8) {
            showToast('Error', 'Password must be at least 8 characters!', 'error');
            return;
        }

        if (!validateEmail(email)) {
            showToast('Error', 'Please enter a valid email address!', 'error');
            return;
        }

        // Simulate API call
        simulateRegister({ name, email, password })
            .then(response => {
                showToast('Success', 'Registration successful!', 'success');
                registerForm.reset();
                container.classList.remove('right-panel-active');
            })
            .catch(error => {
                showToast('Error', error.message, 'error');
            });
    });

    // Login Form Submission
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        // Validation
        if (!email || !password) {
            showToast('Error', 'Email and password are required!', 'error');
            return;
        }

        if (!validateEmail(email)) {
            showToast('Error', 'Please enter a valid email address!', 'error');
            return;
        }

        // Simulate API call
        simulateLogin({ email, password })
            .then(response => {
                showToast('Success', 'Login successful! Redirecting...', 'success');
                loginForm.reset();
                // In a real app, you would redirect or set a session
                setTimeout(() => {
                    window.location.href = 'dashboard.html'; // Example redirect
                }, 2000);
            })
            .catch(error => {
                showToast('Error', error.message, 'error');
            });
    });

    // Helper Functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showToast(title, message, type) {
        const toastTitle = document.querySelector('.text-1');
        const toastMessage = document.querySelector('.text-2');
        const toastIcon = document.querySelector('.check');
        const progress = document.querySelector('.progress');

        toastTitle.textContent = title;
        toastMessage.textContent = message;

        // Change icon and border color based on type
        if (type === 'error') {
            toastIcon.className = 'fas fa-exclamation-circle check';
            toast.style.borderLeft = '6px solid #ff3333';
            toastIcon.style.backgroundColor = '#ff3333';
        } else {
            toastIcon.className = 'fas fa-check-circle check';
            toast.style.borderLeft = '6px solid #4BB543';
            toastIcon.style.backgroundColor = '#4BB543';
        }

        toast.classList.add('active');
        progress.classList.add('active');

        setTimeout(() => {
            toast.classList.remove('active');
        }, 5000);

        setTimeout(() => {
            progress.classList.remove('active');
        }, 5300);
    }

    // Mock API Functions
    function simulateRegister(userData) {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                // Check if user already exists in localStorage
                const users = JSON.parse(localStorage.getItem('users')) || {};

                if (users[userData.email]) {
                    reject(new Error('Email already registered!'));
                    return;
                }

                // In a real app, you would hash the password before storing
                users[userData.email] = {
                    name: userData.name,
                    password: userData.password, // Note: In production, never store plain text passwords
                    createdAt: new Date().toISOString()
                };

                localStorage.setItem('users', JSON.stringify(users));
                resolve({ success: true, message: 'User registered successfully' });
            }, 1000);
        });
    }

    function simulateLogin(credentials) {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('users')) || {};

                if (!users[credentials.email]) {
                    reject(new Error('User not found!'));
                    return;
                }

                // In a real app, you would compare hashed passwords
                if (users[credentials.email].password !== credentials.password) {
                    reject(new Error('Invalid password!'));
                    return;
                }

                // In a real app, you would get a token from the server
                const user = {
                    email: credentials.email,
                    name: users[credentials.email].name,
                    token: 'mock-jwt-token-' + Math.random().toString(36).substring(2)
                };

                // Store user session (in a real app, use proper session management)
                localStorage.setItem('currentUser', JSON.stringify(user));
                resolve({ success: true, user });
            }, 1000);
        });
    }
});