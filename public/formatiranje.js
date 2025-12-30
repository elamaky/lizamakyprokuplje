// ================== GUEST ID (PERSISTENT) ==================
let guestId = localStorage.getItem('guestId');
if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem('guestId', guestId);
    console.log('[INIT] New guestId generated:', guestId);
} else {
    console.log('[INIT] Existing guestId loaded:', guestId);
}

// ================== BAN STATE ==================
const bannedSet = new Set();
let selfBanned = localStorage.getItem('banned') === '1';
console.log('[STATE] Initial selfBanned:', selfBanned);

// ================== SOCKET EVENTS ==================

// Register guest ID with server
socket.emit('registerGuestIdentity', { guestId });
console.log('[SOCKET] registerGuestIdentity sent:', guestId);

// Receive full banned list from server
socket.on('bannedList', list => {
    console.log('[SOCKET] bannedList received:', list);
    bannedSet.clear();
    list.forEach(id => bannedSet.add(id));

    if (bannedSet.has(guestId)) {
        applySelfBan();
    } else {
        removeSelfBan();
    }
});

// Someone got banned
socket.on('userBanned', id => {
    console.log('[SOCKET] userBanned:', id);
    bannedSet.add(id);
    updateGuestUI(id);

    if (id === guestId) {
        applySelfBan();
    }
});

// Someone got unbanned
socket.on('userUnbanned', id => {
    console.log('[SOCKET] userUnbanned:', id);
    bannedSet.delete(id);
    updateGuestUI(id);

    if (id === guestId) {
        removeSelfBan();
    }
});

// ================== DOUBLE CLICK BAN / UNBAN ==================
guestList.addEventListener('dblclick', e => {
    const guestEl = e.target.closest('.guest');
    if (!guestEl) return;

    const targetGuestId = guestEl.dataset.guestid;
    if (!authorizedUsers.has(myNickname)) {
        console.warn('[BAN] Unauthorized ban attempt by', myNickname);
        return;
    }

    console.log('[BAN] toggleSoftGuestBan:', targetGuestId);
    socket.emit('toggleSoftGuestBan', { guestId: targetGuestId });
});

// ================== UI HELPERS ==================
function applySelfBan() {
    if (selfBanned) return;

    console.warn('[BAN] SELF BAN APPLIED');
    selfBanned = true;
    chatInput.disabled = true;
    messageArea.style.display = 'none';
    localStorage.setItem('banned', '1');
}

function removeSelfBan() {
    if (!selfBanned) return;

    console.log('[BAN] SELF BAN REMOVED');
    selfBanned = false;
    chatInput.disabled = false;
    messageArea.style.display = 'block';
    localStorage.removeItem('banned');
}

function updateGuestUI(id) {
    const el = document.querySelector(`.guest[data-guestid="${id}"]`);
    if (!el) {
        console.log('[UI] Guest element not found for', id);
        return;
    }

    const nick = el.dataset.nick;
    el.textContent = renderNickname(nick);
    console.log('[UI] Guest UI updated:', id);
}

// ================== INIT SELF BAN ON LOAD ==================
if (selfBanned) {
    console.warn('[INIT] Restoring self ban from localStorage');
    chatInput.disabled = true;
    messageArea.style.display = 'none';
}
