const authorizedUsers = new Set([
    'Radio Galaksija','ZI ZU','*___F117___*','*__X__*',
    '𝕯𝖔𝖈𝖙𝖔𝖗 𝕷𝖔𝖛𝖊','-𝔸𝕣𝕝𝕚𝕛𝕒-',
    'Najlepsa Ciganka','Dia💎','Dia'
]);

module.exports = function softGuestBan(io, guests) {

    const bannedSet = new Set();

    io.on('connection', (socket) => {

        socket.on('checkBanStatus', ({ nickname }) => {
            if (bannedSet.has(nickname)) io.emit('userBanned', nickname);
        });

        socket.on('toggleSoftGuestBan', ({ guestId }) => {
            const requesterName = guests[socket.id];
            if (!authorizedUsers.has(requesterName)) return;

            if (bannedSet.has(guestId)) {
                bannedSet.delete(guestId);
                io.emit('userUnbanned', guestId);
            } else {
                bannedSet.add(guestId);
                io.emit('userBanned', guestId);
            }
        });

    });
};
