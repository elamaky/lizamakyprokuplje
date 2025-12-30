// ================== BAN STATE ==================
const bannedSet = new Set();

// ================== SOCKET EVENTS ==================
function initBanModule(socket) {
    // Server šalje da je korisnik banovan
    socket.on('userBanned', nickname => {
        bannedSet.add(nickname);
        const el = document.getElementById(`guest-${nickname}`);
        if (el) el.textContent = `${nickname} 🔒`;

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
        if (el) el.textContent = nickname;

        if (nickname === myNickname) {
            chatInput.disabled = false;
            messageArea.style.display = 'block';
            localStorage.removeItem('banned');
        }
    });

    // ================== DOUBLE CLICK BAN / UNBAN ==================
    guestList.addEventListener('dblclick', e => {
        const guestEl = e.target.closest('.guest');
        if (!guestEl) return;

        const nickname = guestEl.dataset.nick || guestEl.textContent.replace(' 🔒', '');
        if (!authorizedUsers.has(myNickname)) return;

        socket.emit('toggleSoftGuestBan', { guestId: nickname });
    });

    // ================== SELF BAN STATE ==================
    if (localStorage.getItem('banned')) {
        chatInput.disabled = true;
        messageArea.style.display = 'none';
    }
}

// ================== POMOĆNA FUNKCIJA ==================
function renderNickname(nickname) {
    return bannedSet.has(nickname) ? `${nickname} 🔒` : nickname;
}

// Export funkcije da se pozove iz glavnog fajla
export { initBanModule, renderNickname };
