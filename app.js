const BASE_URL = "https://anokha.amrita.edu/api";
// const BASE_URL = "http://localhost:5000/api";
const LOGIN_URL = `${BASE_URL}/auth/loginOfficial`;
const EVENTS_URL = `${BASE_URL}/admin/getOfficialEvents`;
const ENTRY_ATTENDANCE_URL = `${BASE_URL}/admin/markEventAttendanceEntry`;
const EXIT_ATTENDANCE_URL = `${BASE_URL}/admin/markEventAttendanceExit`;
const GATE_ENTRY_URL = `${BASE_URL}/admin/markGateEntry`;
const GATE_EXIT_URL = `${BASE_URL}/admin/markGateExit`;

let isEntry = true;

function identifyPurpose() {
    const url = new URLSearchParams(window.location.search);
    const wtf = url.get('wtf') ?? '1';
    if (wtf.toString() === '0') {
        document.querySelector('#purpose').innerHTML = "Anokha 2024 | Gate Entry/Exit";
    } else {
        document.querySelector('#purpose').innerHTML = "Anokha 2024 | Event Attendance";
    }
}

async function sha256(message) {
    const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""); // convert bytes to hex string
    return hashHex;
}

async function login() {
    event.preventDefault();

    let managerEmail = document.getElementById("managerEmail").value;
    let managerPassword = document.getElementById("managerPassword").value;

    if (!(typeof managerEmail === "string" && managerEmail.length > 0)) {
        alert("Please enter a valid email");
        return;
    }

    if (
        !(typeof managerPassword === "string" && managerPassword.length > 0)
    ) {
        alert("Please enter a valid password");
        return;
    }

    const requestBody = {
        managerEmail: managerEmail,
        managerPassword: await sha256(managerPassword),
    };
    const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });

    if (response.status === 200) {
        const data = await response.json();

        localStorage.setItem("SECERT_TOKEN", data.SECRET_TOKEN);
        localStorage.setItem("MANAGER_FULL_NAME", data.managerFullName);
        localStorage.setItem("MANAGER_EMAIL", data.managerEmail);
        localStorage.setItem("MANAGER_ROLE_ID", data.managerRoleId);

        const url = new URLSearchParams(window.location.search);
        const wtf = url.get('wtf') ?? '1';

        if (wtf.toString() === '0') {
            window.location.href = "take-attendance.html?wtf=0&eventName=Gate%20Entry%2FExit";
        } else {
            window.location.href = "events.html";
        }

    } else if (response.status === 500) {
        alert("Server error");
    } else {
        alert("Something's not right bro.");
    }
};

async function getOfficialEvents() {
    const SECRET_TOKEN = localStorage.getItem("SECERT_TOKEN");

    if (SECRET_TOKEN === null) {
        logout();
    }

    const response = await fetch(EVENTS_URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SECRET_TOKEN}`,
        },
    });

    if (response.status === 200) {
        const data = await response.json();
        const eventData = data.events;

        const eventList = document.querySelector('.event-list');

        for (let i = 0; i < eventData.length; i++) {
            const eventElement = document.createElement('div');
            eventElement.classList.add('event-card');
            // replace ' with # in event name
            eventData[i].eventName = eventData[i].eventName.replace(/'/g, " ");
            eventElement.innerHTML = `
                        <img src="${eventData[i].eventImageURL}" alt="Event Image" />
                        <h2>${eventData[i].eventName}</h2>
                        <button onclick="redirectTo('take-attendance.html?eventId=${encodeURIComponent(eventData[i].eventId)}&eventName=${encodeURIComponent(eventData[i].eventName)}')" >Take Attendance</button>
            `
            eventList.appendChild(eventElement);
        }

    } else if (response.status === 401) {
        logout();
    } else {
        alert("Something's not right bro.");
    }
}

function searchEvents() {
    const input = document.querySelector('.search-bar').value;
    const filter = input.toUpperCase();
    const eventCards = document.querySelectorAll('.event-card');

    for (let i = 0; i < eventCards.length; i++) {
        const h2 = eventCards[i].getElementsByTagName('h2')[0];
        const txtValue = h2.textContent || h2.innerText;

        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            eventCards[i].style.display = "";
        } else {
            eventCards[i].style.display = "none";
        }
    }
}

function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventName = urlParams.get('eventName');
    const wtf = urlParams.get('wtf') ?? '1';

    const eventNameElement = document.querySelector('#event-name');
    eventNameElement.innerHTML = eventName;

    if (wtf.toString() !== '0') {
        eventNameElement.insertAdjacentHTML(
            'afterend', 
            `
            <a href="events.html" class="back-button">Back to Events Page</a>
            <a href="index.html" class="logout-button">Logout</a>
            `,
        );
    } else {
        const pageTitle = document.querySelector('#page-title');
        pageTitle.innerHTML = "Anokha 2024";
        eventNameElement.insertAdjacentHTML('afterend', `<a href="index.html?wtf=0" class="logout-button">Logout</a>`);
    }

    document.querySelector('#entry-button').disabled = true;
    document.querySelector('#exit-button').disabled = false;
    document.querySelector('#mode').innerHTML = "Marking Entry";
}

function getEventIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('eventId'));
}

async function markEntry(eventId, studentId) {
    const SECRET_TOKEN = localStorage.getItem("SECERT_TOKEN");
    const url = `${ENTRY_ATTENDANCE_URL}/${studentId}-${eventId}`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${SECRET_TOKEN}`,
        },
    });

    if (response.status === 200) {
        const data = await response.json();
        alert(data.MESSAGE);
    } else if (response.status === 401) {
        logout();
    } else if (response.status === 400) {
        const data = await response.json();
        alert(data.MESSAGE ?? "Something's not right bro.");
    } else {
        alert("Something's not right bro.");
    }
}

async function markExit(eventId, studentId) {
    const SECRET_TOKEN = localStorage.getItem("SECERT_TOKEN");
    const url = `${EXIT_ATTENDANCE_URL}/${studentId}-${eventId}`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${SECRET_TOKEN}`,
        },
    });

    if (response.status === 200) {
        const data = await response.json();
        alert(data.MESSAGE);
    } else if (response.status === 401) {
        logout();
    } else if (response.status === 400) {
        const data = await response.json();
        alert(data.MESSAGE ?? "Something's not right bro.");
    } else {
        alert("Something's not right bro.");
    }
}

async function markGateEntry(studentId) {
    const SECRET_TOKEN = localStorage.getItem("SECERT_TOKEN");
    const url = `${GATE_ENTRY_URL}/${studentId}`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${SECRET_TOKEN}`,
        },
    });

    if (response.status === 200) {
        const data = await response.json();
        alert(data.MESSAGE);
    } else if (response.status === 401) {
        logout();
    } else if (response.status === 400) {
        const data = await response.json();
        alert(data.MESSAGE ?? "Something's not right bro.");
    } else {
        alert("Something's not right bro.");
    }
}

async function markGateExit(studentId) {
    const SECRET_TOKEN = localStorage.getItem("SECERT_TOKEN");
    const url = `${GATE_EXIT_URL}/${studentId}`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${SECRET_TOKEN}`,
        },
    });

    if (response.status === 200) {
        const data = await response.json();
        alert(data.MESSAGE);
    } else if (response.status === 401) {
        logout();
    } else if (response.status === 400) {
        const data = await response.json();
        alert(data.MESSAGE ?? "Something's not right bro.");
    } else {
        alert("Something's not right bro.");
    }
}

function redirectTo(url) {
    window.location.href = url
}

function logout() {
    alert("Session expired. Please login again.");
    localStorage.clear();
    window.location.href = "index.html";
}

function toggleEntry() {
    isEntry = !isEntry;

    if (isEntry) {
        document.querySelector('#entry-button').disabled = true;
        document.querySelector('#exit-button').disabled = false;
        document.querySelector('#mode').innerHTML = "Marking Entry";
    } else {
        document.querySelector('#exit-button').disabled = true;
        document.querySelector('#entry-button').disabled = false;
        document.querySelector('#mode').innerHTML = "Marking Exit";
    }
}
