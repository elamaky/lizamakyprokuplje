window.bannedSet = window.bannedSet || new Set();

// ================== SOCKET EVENTS ==================
socket.on('userBanned', nickname => {
    window.bannedSet.add(nickname);

    const guestElement = document.getElementById(`guest-${nickname}`);
    if (guestElement) guestElement.textContent = nickname + ' 🔒';

    if (nickname === myNickname) {
        chatInput.disabled = true;
        messageArea.style.display = 'none';
        localStorage.setItem('banned', '1');
    }
});

socket.on('userUnbanned', nickname => {
    window.bannedSet.delete(nickname);

    const guestElement = document.getElementById(`guest-${nickname}`);
    if (guestElement) guestElement.textContent = nickname;

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
    if (!nickname) return;

    if (!authorizedUsers.has(myNickname)) return;

    socket.emit('toggleSoftGuestBan', { guestId: nickname });
});

// ================== SELF-BAN STATE ==================
if (localStorage.getItem('banned')) {
    chatInput.disabled = true;
    messageArea.style.display = 'none';
}

// ================== PROVERA BAN STATUSA PRI CONNECT ==================
socket.emit('checkBanStatus', { nickname: myNickname });
