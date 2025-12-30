// ================== BAN STATE ==================
const bannedSet = new Set();
const chatInput = document.getElementById('chat-input');
const messageArea = document.getElementById('message-area');
const guestList = document.getElementById('guestList');


// ================== INICIJALIZACIJA BAN MODULA ==================
function initBanModule(socket) {

    // Server šalje da je korisnik banovan
    socket.on('userBanned', nickname => {
        bannedSet.add(nickname);
        const el = document.getElementById(`guest-${nickname}`);
        if (el) el.textContent = renderNickname(nickname);

        if (nickname === myNickname) {
            chatInput.disabled = true;
            messageArea.style.display = 'none';
            localStorage.setItem('banned', '1');
        }
    });

    // Server šalje da je korisnik unbanovan
    socket.on('userUnbanned', nickname => {
        bannedSet.delete(nickname);
        const el = document.getElementById(`guest-${nickname}`);
        if (el) el.textContent = renderNickname(nickname);

        if (nickname === myNickname) {
            chatInput.disabled = false;
            messageArea.style.display = 'block';
            localStorage.removeItem('banned');
        }
    });

    // Double click za ban/unban
    guestList.addEventListener('dblclick', e => {
        const guestEl = e.target.closest('.guest');
        if (!guestEl) return;

        const nickname = guestEl.dataset.nick || guestEl.textContent.replace(' 🔒', '');
        if (!authorizedUsers.has(myNickname)) return;

        socket.emit('toggleSoftGuestBan', { guestId: nickname });
    });

    // Self-ban pri učitavanju stranice
    if (localStorage.getItem('banned')) {
        chatInput.disabled = true;
        messageArea.style.display = 'none';
    }
}

// ================== FUNKCIJA ZA RENDER BANOVANIH ==================
function renderNickname(nickname) {
    return bannedSet.has(nickname) ? `${nickname} 🔒` : nickname;
}

// ================== FUNKCIJA ZA DODAVANJE GOSTA ==================
function addGuest(nickname) {
    if (document.getElementById(`guest-${nickname}`)) return;

    const guestEl = document.createElement('div');
    guestEl.className = 'guest';
    guestEl.id = `guest-${nickname}`;
    guestEl.dataset.nick = nickname;
    guestEl.textContent = renderNickname(nickname);

    guestList.appendChild(guestEl);
}

// Funkcije su globalne, mogu se pozvati direktno iz glavnog fajla
