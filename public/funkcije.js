// ================== BAN SYSTEM ==================

// Koristi globalni set da oba fajla dele stanje
window.bannedSet = window.bannedSet || new Set();

// Render funkcija za prikaz ban statusa
function renderNickname(nickname) {
    return window.bannedSet.has(nickname)
        ? `${nickname} 🔒`
        : nickname;
}

// ================== SOCKET EVENTS ==================
socket.on('userBanned', nickname => {
    window.bannedSet.add(nickname);

    const guestElement = document.getElementById(`guest-${nickname}`);
    if (guestElement) guestElement.textContent = renderNickname(nickname);

    if (nickname === myNickname) {
        chatInput.disabled = true;
        messageArea.style.display = 'none';
        localStorage.setItem('banned', '1');
    }
});

socket.on('userUnbanned', nickname => {
    window.bannedSet.delete(nickname);

    const guestElement = document.getElementById(`guest-${nickname}`);
    if (guestElement) guestElement.textContent = renderNickname(nickname);

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

    const nickname = guestEl.dataset.nick;
    if (!authorizedUsers.has(myNickname)) return;

    socket.emit('toggleSoftGuestBan', { guestId: nickname });
});

// ================== SELF BAN STATE ==================
if (localStorage.getItem('banned')) {
    chatInput.disabled = true;
    messageArea.style.display = 'none';
}
