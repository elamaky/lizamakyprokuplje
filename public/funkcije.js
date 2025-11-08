// --- Dinamički CSS za crvenu traku ---
(function insertBanCss() {
    if (!document.getElementById('ban-css-marker')) {
        const style = document.createElement('style');
        style.id = 'ban-css-marker';
        style.textContent = `
            .guest.banned { position: relative; opacity: 0.6; }
            .guest.banned::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                width: 100%;
                height: 3px;
                background-color: red;
                transform: translateY(-50%);
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
    }
})();

// --- Ban/unban eventi sa servera ---
socket.on('userBanned', nickname => {
    const guestEl = document.getElementById(`guest-${nickname}`);
    if (guestEl) guestEl.classList.add('banned');
});

socket.on('userUnbanned', nickname => {
    const guestEl = document.getElementById(`guest-${nickname}`);
    if (guestEl) guestEl.classList.remove('banned');
});

// --- Event za lokalnog korisnika ---
socket.on('youAreBanned', () => {
    localStorage.setItem('banned', '1'); // samo za identifikaciju
    chatInput.disabled = true;
    messageArea.style.display = 'none';
});

// --- Dvoklik na korisnike za ban/unban ---
guestList.addEventListener("dblclick", event => {
    const guestEl = event.target.closest('.guest');
    if (!guestEl) return;

    const nickname = guestEl.textContent.trim();
    if (!authorizedUsers.has(myNickname)) return;

    if (myNickname === '*__X__*' || !authorizedUsers.has(nickname)) {
        socket.emit('banUser', nickname);
    }
});

// --- Dodavanje ili ažuriranje gostiju ---
function addGuestIfNotExist(nickname) {
    if (!document.getElementById(`guest-${nickname}`)) {
        const guestEl = document.createElement('div');
        guestEl.id = `guest-${nickname}`;
        guestEl.className = 'guest';
        guestEl.textContent = nickname;
        guestList.appendChild(guestEl);

        // Ako je trenutno banovan lokalno (samo za identifikaciju)
        if (localStorage.getItem('banned') && nickname === myNickname) {
            guestEl.classList.add('banned');
            socket.emit('userStillBanned', myNickname);
        }
    }
}

// --- Server šalje listu gostiju ---
socket.on('updateGuestList', (users) => {
    guestList.innerHTML = '';
    users.forEach(nick => addGuestIfNotExist(nick));
});

// --- Slanje poruka ---
chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && chatInput.value.trim()) {
        const msg = chatInput.value.trim();
        socket.emit('chatMessage', msg);
        chatInput.value = '';
    }
});
