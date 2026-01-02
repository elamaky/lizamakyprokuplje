window.bannedSet = window.bannedSet || new Set();

const groupA = new Set([
  'ZI ZU','*___F117___*','*__X__*','𝕯𝖔𝖈𝖙𝖔𝖗 𝕷𝖔𝖛𝖊','-𝔸𝕣𝕝𝕚𝕒-'
]);

const groupB = new Set([
  'Najlepsa Ciganka','Dia💎','Dia'
]);

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

    const targetNick = guestEl.dataset.nick;
    if (!targetNick) return;

    // mora biti auth
    if (!authorizedUsers.has(myNickname)) return;

    // GRUPA A NIKAD ne može biti banirana
    if (groupA.has(targetNick)) return;

    // GRUPU B mogu banirati SAMO korisnici iz GRUPE A
    if (groupB.has(targetNick) && !groupA.has(myNickname)) return;

    socket.emit('toggleSoftGuestBan', { guestId: targetNick });
});

// ================== SELF-BAN STATE ==================
if (localStorage.getItem('banned')) {
    chatInput.disabled = true;
    messageArea.style.display = 'none';
}

// ================== PROVERA BAN STATUSA PRI CONNECT ==================
socket.emit('checkBanStatus', { nickname: myNickname });

