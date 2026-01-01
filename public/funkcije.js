// ================== SOCKET EVENTS ==================
// ================== SOCKET EVENTS ==================
socket.on('userBanned', nickname => {
    // Ban stanje odmah
    window.bannedSet.add(nickname);

    // Delay za prikaz katanaca
    setTimeout(() => {
        const guestElement = document.getElementById(`guest-${nickname}`);
        if (guestElement) guestElement.textContent = renderNickname(nickname);
    }, 3000); // 3000ms = 3 sekunde

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
// Event delegation za dvoklik
guestList.addEventListener('dblclick', e => {
    const guestEl = e.target.closest('.guest');
    if (!guestEl) return;

    const nickname = guestEl.dataset.nick; // mora biti setovan kod svakog gosta
    if (!nickname) return;

    if (!authorizedUsers.has(myNickname)) return;

    socket.emit('toggleSoftGuestBan', { guestId: nickname });
});


// ================== SELF BAN STATE ==================
if (localStorage.getItem('banned')) {
    chatInput.disabled = true;
    messageArea.style.display = 'none';
}




