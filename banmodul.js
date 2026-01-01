// Lista autorizovanih korisnika koji mogu banovati
const authorizedUsers = new Set([
    'Radio Galaksija','ZI ZU','*___F117___*','*__X__*',
    '𝕯𝖔𝖈𝖙𝖔𝖗 𝕷𝖔𝖛𝖊','-𝔸𝕣𝕝𝕚𝕛𝕒-',
    'Najlepsa Ciganka','Dia💎','Dia'
]);

module.exports = function softGuestBan(io, guests) {

    io.on('connection', (socket) => {

        // ================== CLIENT SENDS BAN STATUS ==================
        socket.on('checkBanStatus', ({ nickname }) => {
            io.emit('markGuestAsBanned', nickname);
        });

        // ================== DOUBLE CLICK BAN / UNBAN ==================
        socket.on('toggleSoftGuestBan', ({ guestId }) => {
            const requesterName = guests[socket.id];
            if (!authorizedUsers.has(requesterName)) return;

            // Emitujemo ban/unban svima
            io.emit('userBanned', guestId);
        });

    });
};
