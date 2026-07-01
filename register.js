const API = "http://localhost:5000/api";

function saveToken(token) {
    localStorage.setItem("token", token);
}

function getToken() {
    return localStorage.getItem("token");
}

function isAuthenticated() {
    return Boolean(getToken());
}

function updateAuthUI() {
    const authLink = document.getElementById("authLink");
    if (!authLink) return;
    if (isAuthenticated()) {
        authLink.href = "profile.html";
        authLink.innerText = "Profile";
    } else {
        authLink.href = "login.html";
        authLink.innerText = "Login";
    }
}

function logoutUser() {
    localStorage.removeItem("token");
    updateAuthUI();
    window.location.href = "login.html";
}

async function register() {
    const name = document.getElementById("name")?.value || "";
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${API}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    document.getElementById("msg").innerHTML = data.message;

    if (data.message === "Registration Successful") {
        window.location.href = "login.html";
    }
}

async function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    document.getElementById("msg").innerHTML = data.message;

    if (data.token) {
        saveToken(data.token);
        updateAuthUI();
        window.location.href = "index.html";
    }
}

if (typeof window !== "undefined") {
    window.addEventListener("DOMContentLoaded", updateAuthUI);
}
