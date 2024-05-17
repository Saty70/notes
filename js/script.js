function openTab(tabName) {
    const tabs = document.querySelectorAll('.tab');
    const forms = document.querySelectorAll('.form-container form');
    
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    forms.forEach(form => {
        form.classList.remove('active');
    });
    
    document.querySelector(`.tab[onclick="openTab('${tabName}')"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// function login(event) {
//     event.preventDefault();
//     const username = document.getElementById('login-username').value;
//     const password = document.getElementById('login-password').value;

//     const storedUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
//     const foundUser = storedUsers.find(user => user.username === username && user.password === password);
    
//     if (foundUser) {
//         alert('Login successful!');
//         window.location.href = '/writ.html';
//     } else {
//         alert('Invalid username or password');
//     }
// }

// function register(event) {
//     event.preventDefault();
//     const username = document.getElementById('register-username').value;
//     const email = document.getElementById('register-email').value;
//     const password = document.getElementById('register-password').value;
    
//     if (username && email && password) {
//         const newUser = { username, email, password };
//         const storedUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
//         storedUsers.push(newUser);
//         localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));
        
//         alert('Registration successful!');
//         openTab('login');
//     } else {
//         alert('Please fill in all fields');
//     }
// }
