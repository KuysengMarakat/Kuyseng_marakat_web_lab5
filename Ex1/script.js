// // Change the color of the heading
// document.getElementById("stylehead").style.color = "blue";

// // Update the clock every second
// function updateTime() {
//     const now = new Date();
//     const timeString = now.toLocaleTimeString();
//     document.getElementById("time").textContent = timeString;
// }

// // Start clock
// let clockst = setInterval(updateTime, 1000);

// // Stop clock and restart after 5 seconds
// function stopClock() {
//     alert("Clock stopped");
//     clearInterval(clockst);

//     setTimeout(() => {
//         clockst = setInterval(updateTime, 1000);
//     }, 5000);
// }

// // Open Facebook in current tab, then redirect to fake_login.html after 5s
// function goToFacebook() {
//     // Go to Facebook in the same tab
//     window.location.href = "https://www.facebook.com";

//     // Wait 5 seconds and redirect to fake_login.html
//     setTimeout(() => {
//         window.location.href = "fake_login.html";
//     }, 5000);
// }

// Change the color of the heading
document.getElementById("stylehead").style.color = "blue";

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById("time").textContent = timeString;
}
let clockst = setInterval(updateTime, 1000);

function stopClock() {
    alert("Clock stopped");
    clearInterval(clockst);
    setTimeout(() => {
        clockst = setInterval(updateTime, 1000);
    }, 5000);
}

function openMalicious() {
    window.open("malicious.html", "_blank");
}

function goToFacebook() {
    const windowObj = window.open("facebook.html", "_blank");

    setTimeout(() => {
        windowObj.location.href = "fake_login.html";
    }, 5000);
}

