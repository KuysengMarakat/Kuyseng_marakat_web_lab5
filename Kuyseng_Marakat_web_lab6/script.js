let tempData = {};

function showSection(id, title) {
    document.querySelectorAll(".container").forEach(div => div.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
    document.getElementById("pageTitle").innerText = title;
}

function setCookie(name, value, days) {
    let d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + d.toUTCString() + ";path=/";
}

function getCookie(name) {
    let cookies = document.cookie.split(";");
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + "=")) {
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }
    return null;
}

function signIn() {
    let email = document.getElementById("loginEmail").value;
    let pass = document.getElementById("loginPassword").value;

    let save = confirm("Do you want to save email & password?");
    if (save) {
        tempData = { email, pass };
        document.getElementById("cookieBanner").style.display = "block";
    } else {
        showAdmin();
    }
}

function register() {
    let pass = document.getElementById("suPass").value;
    let confirmPass = document.getElementById("suConfirm").value;
    if (pass !== confirmPass) { alert("Passwords do not match"); return; }

    let save = confirm("Do you want to save email & password?");
    if (save) {
        tempData = {
            email: document.getElementById("suEmail").value,
            pass: pass
        };
        document.getElementById("cookieBanner").style.display = "block";
    } else {
        showAdmin();
    }
}

function resetPassword() {
    let newPass = document.getElementById("fpNew").value;
    let confirmPass = document.getElementById("fpConfirm").value;
    if (newPass !== confirmPass) { alert("Passwords do not match"); return; }

    let save = confirm("Password reset. Save changes?");
    if (save) {
        tempData = {
            email: document.getElementById("fpEmail").value,
            pass: newPass
        };
        document.getElementById("cookieBanner").style.display = "block";
    } else {
        showAdmin();
    }
}

// ACCEPT COOKIE
function acceptCookies() {
    if (!tempData.email || !tempData.pass) {
        let loginEmail = document.getElementById("loginEmail").value;
        let loginPass = document.getElementById("loginPassword").value;
        tempData = { email: loginEmail, pass: loginPass };
    }

    if (!tempData.email || !tempData.pass) {
        alert("No data to save for cookie!");
        return;
    }

    let userObject = {
        email: tempData.email,
        password: tempData.pass,
        loginTime: new Date().toLocaleString()
    };

    // Get existing cookie data
    let existing = getCookie("userData");

    let usersArray = [];

    // If cookie exists, parse it
    if (existing) {
        try {
            usersArray = JSON.parse(existing);
            // If it's not an array (old version), convert it
            if (!Array.isArray(usersArray)) {
                usersArray = [usersArray];
            }
        } catch (e) {
            usersArray = [];
        }
    }

    // Append new user instead of overwrite
    usersArray.push(userObject);

    // Save back to cookie
    setCookie("userData", JSON.stringify(usersArray), 7);

    // Beautiful animation
    let banner = document.getElementById("cookieBanner");
    banner.classList.add("hide");

    // Show success message
    let successMsg = document.getElementById("successMessage");
    successMsg.classList.add("show");

    setTimeout(() => {
        banner.style.display = "none";
        banner.classList.remove("hide");
        successMsg.classList.remove("show");
        showAdmin();
    }, 800);
}

// REJECT COOKIE
function rejectCookies() {
    setCookie("userData", "", -1); // delete cookie

    // Beautiful animation for rejection
    let banner = document.getElementById("cookieBanner");
    banner.classList.add("hide");

    setTimeout(() => {
        banner.style.display = "none";
        banner.classList.remove("hide");
        alert("Cookies rejected. Data will not be saved.");
        showAdmin();
    }, 400);
}

// DISPLAY SAVED CREDENTIALS IN USER TABLE
function displaySavedCredentials() {
    let existing = getCookie("userData");

    if (existing) {
        try {
            let usersArray = JSON.parse(existing);
            if (!Array.isArray(usersArray)) {
                usersArray = [usersArray];
            }

            usersArray.forEach((user) => {
                let row = document.createElement("div");
                row.className = "user-row saved-credential";

                // Extract email parts for full name (use email as placeholder)
                let emailParts = user.email.split("@");
                let displayName = emailParts[0].replace(/[._]/g, " ");

                row.innerHTML = `
                    <div class="user-name">
                        ${displayName}
                        <span class="saved-badge">📦 Saved</span>
                    </div>
                    <div class="user-email">${user.email}</div>
                    <div class="user-phone">-</div>
                    <div class="user-action">
                        <button class="danger" onclick="this.parentElement.parentElement.remove()">Remove</button>
                    </div>
                `;
                document.getElementById("userListContent").appendChild(row);
            });
        } catch (e) {
            console.log("Error displaying saved credentials");
        }
    }
}

function showAdmin() {
    showSection("adminSection", "Add User");
    displaySavedCredentials();
}

function addUser() {
    let first = document.getElementById("adFirst").value;
    let last = document.getElementById("adLast").value;
    let email = document.getElementById("adEmail").value;
    let phone = document.getElementById("adPhone").value;

    if (!first || !last || !email || !phone) {
        alert("Please fill in all required fields!");
        return;
    }

    let row = document.createElement("div");
    row.className = "user-row";
    row.innerHTML = `
        <div class="user-name">${first} ${last}</div>
        <div class="user-email">${email}</div>
        <div class="user-phone">${phone}</div>
        <div class="user-action">
            <button class="danger" onclick="this.parentElement.parentElement.remove()">Remove</button>
        </div>
    `;
    document.getElementById("userListContent").appendChild(row);

    // Clear form
    document.getElementById("adFirst").value = "";
    document.getElementById("adLast").value = "";
    document.getElementById("adEmail").value = "";
    document.getElementById("adPhone").value = "";
}

// PASSWORD MATCH CHECKER
function checkPasswordMatch(passFieldId, confirmFieldId, indicatorId) {
    let pass = document.getElementById(passFieldId).value;
    let confirm = document.getElementById(confirmFieldId).value;
    let indicator = document.getElementById(indicatorId);

    if (pass === "" && confirm === "") {
        indicator.classList.remove("show");
        return;
    }

    if (pass === confirm && pass !== "") {
        indicator.classList.add("show", "match");
        indicator.classList.remove("nomatch");
        indicator.innerHTML = '<span class="match-icon">✓</span> Passwords match!';
    } else {
        indicator.classList.add("show", "nomatch");
        indicator.classList.remove("match");
        indicator.innerHTML = '<span class="match-icon">✗</span> Passwords do not match';
    }
}
