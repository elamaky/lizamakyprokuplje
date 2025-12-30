const SoftGuest = require('./models/SoftGuest'); // pretpostavimo da je model u models folderu ili prilagodi
const authorizedUsers = new Set([
    'Radio Galaksija','ZI ZU','*___F117___*','*__X__*',
    '𝕯𝖔𝖈𝖙𝖔𝖗 𝕷𝖔𝖛𝖊','-𝔸𝕣𝕝𝕚𝕛𝕒-',
    'Najlepsa Ciganka','Dia💎','Dia'
]);

module.exports = function initBanModule(io, guests) {

    io.on('connection', async socket => {

        // Pošalji novom klijentu listu banovanih
        const bannedGuests = await SoftGuest.find({ banned: true });
        socket.emit('bannedList', bannedGuests.map(g => g.guestId));

        // Toggle ban/unban
        socket.on('toggleSoftGuestBan', async ({ guestId }) => {
            const requesterName = guests[socket.id];
            if (!authorizedUsers.has(requesterName)) return;

            let guest = await SoftGuest.findOne({ guestId });
            if (!guest) {
                guest = await SoftGuest.create({ guestId, banned: true });
            } else {
                guest.banned = !guest.banned;
                await guest.save();
            }

            // Emit svima
            if (guest.banned) {
                io.emit('userBanned', guestId);
            } else {
                io.emit('userUnbanned', guestId);
            }
        });

        // Opcionalno: registracija/postaavljanje guestId
        socket.on('registerGuestIdentity', async ({ guestId }) => {
            if (!guestId) return;
            guests[socket.id] = guestId;

            let guest = await SoftGuest.findOne({ guestId });
            if (!guest) {
                guest = await SoftGuest.create({ guestId, banned: false });
            }

            if (guest.banned) {
                socket.emit('userBanned', guestId);
            }
        });

    });
};
