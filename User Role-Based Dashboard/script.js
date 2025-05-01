document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginScreen = document.getElementById('login-screen');
    const dashboard = document.getElementById('dashboard');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const dashboardTitle = document.getElementById('dashboard-title');
    const userRoleBadge = document.getElementById('user-role-badge');
    
    // Content sections
    const adminContent = document.getElementById('admin-content');
    const managerContent = document.getElementById('manager-content');
    const userContent = document.getElementById('user-content');

    // Check if user is already logged in
    checkLoginStatus();

    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const role = document.getElementById('role').value;
        
        // In a real app, you would validate credentials with a server
        loginUser(username, role);
    });

    // Logout button
    logoutBtn.addEventListener('click', function() {
        logoutUser();
    });

    function checkLoginStatus() {
        const user = JSON.parse(localStorage.getItem('dashboardUser'));
        
        if (user) {
            // User is logged in, show dashboard
            showDashboard(user);
        } else {
            // User is not logged in, show login screen
            showLoginScreen();
        }
    }

    function loginUser(username, role) {
        // Save user data to localStorage
        const user = {
            username: username,
            role: role,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('dashboardUser', JSON.stringify(user));
        
        // Show dashboard
        showDashboard(user);
    }

    function logoutUser() {
        // Remove user data from localStorage
        localStorage.removeItem('dashboardUser');
        
        // Show login screen
        showLoginScreen();
        
        // Reset form
        loginForm.reset();
    }

    function showDashboard(user) {
        // Hide login screen, show dashboard
        loginScreen.classList.add('hidden');
        dashboard.classList.remove('hidden');
        
        // Update dashboard title
        dashboardTitle.textContent = `Welcome, ${user.username}`;
        
        // Update role badge
        updateRoleBadge(user.role);
        
        // Show appropriate content based on role
        showRoleContent(user.role);
    }

    function showLoginScreen() {
        // Hide dashboard, show login screen
        dashboard.classList.add('hidden');
        loginScreen.classList.remove('hidden');
    }

    function updateRoleBadge(role) {
        // Clear any existing classes
        userRoleBadge.className = 'px-2 py-1 text-xs rounded-full';
        
        // Add base classes
        userRoleBadge.classList.add('px-2', 'py-1', 'text-xs', 'rounded-full');
        
        // Set text and styling based on role
        switch(role) {
            case 'admin':
                userRoleBadge.textContent = 'Administrator';
                userRoleBadge.classList.add('bg-purple-100', 'text-purple-800');
                break;
            case 'manager':
                userRoleBadge.textContent = 'Manager';
                userRoleBadge.classList.add('bg-blue-100', 'text-blue-800');
                break;
            case 'user':
                userRoleBadge.textContent = 'User';
                userRoleBadge.classList.add('bg-green-100', 'text-green-800');
                break;
        }
    }

    function showRoleContent(role) {
        // Hide all content sections first
        adminContent.classList.add('hidden');
        managerContent.classList.add('hidden');
        userContent.classList.add('hidden');
        
        // Show the appropriate content
        switch(role) {
            case 'admin':
                adminContent.classList.remove('hidden');
                break;
            case 'manager':
                managerContent.classList.remove('hidden');
                break;
            case 'user':
                userContent.classList.remove('hidden');
                break;
        }
    }
});