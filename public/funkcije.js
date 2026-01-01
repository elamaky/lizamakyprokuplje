// ================== SOCKET EVENTS ==================
socket.on('userBanned', nickname => {
    // Dodaj u globalni set
    window.bannedSet.add(nickname);

    // Pronađi element i rerenderuj nickname sa katancem
    const guestElement = document.getElementById(`guest-${nickname}`);
    if (guestElement) guestElement.textContent = renderNickname(nickname);

    // Ako je banovan current user, disable chat i sacuvaj u storage
    if (nickname === myNickname) {
        chatInput.disabled = true;
        messageArea.style.display = 'none';
        localStorage.setItem('banned', '1');

        // Popuni guestsData sa ban statusom
        const guestId = `guest-${myNickname}`;
        guestsData[guestId] = guestsData[guestId] || {};
        guestsData[guestId].banned = true;
    }
});

socket.on('userUnbanned', nickname => {
    // Ukloni iz globalnog seta
    window.bannedSet.delete(nickname);

    const guestElement = document.getElementById(`guest-${nickname}`);
    if (guestElement) guestElement.textContent = renderNickname(nickname);

    if (nickname === myNickname) {
        chatInput.disabled = false;
        messageArea.style.display = 'block';
        localStorage.removeItem('banned');

        // Ažuriraj guestsData
        const guestId = `guest-${myNickname}`;
        if (guestsData[guestId]) guestsData[guestId].banned = false;
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

    // Popuni guestsData sa ban statusom prilikom inicijalizacije
    const guestId = `guest-${myNickname}`;
    guestsData[guestId] = guestsData[guestId] || {};
    guestsData[guestId].banned = true;
}
