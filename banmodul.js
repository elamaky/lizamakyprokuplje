const mongoose = require('mongoose');

// Schema i model za soft ban
const SoftGuestSchema = new mongoose.Schema({
    guestId: { type: String, unique: true },
    banned: { type: Boolean, default: false }
});
const SoftGuest = mongoose.model('SoftGuest', SoftGuestSchema);

// Ko sme da ban-uje
const authorizedUsers = new Set([
    'Radio Galaksija','ZI ZU','*___F117___*','*__X__*',
    '𝕯𝖔𝖈𝖙𝖔𝖗 𝕷𝖔𝖛𝖊','-𝔸𝕣𝕝𝕚𝕛𝕒-',
    'Najlepsa Ciganka','Dia💎','Dia'
]);

module.exports = function initBanModule(io, guests) {

    io.on('connection', socket => {

        // Pošalji ban listu novom klijentu
        SoftGuest.find({ banned: true }).then(bannedGuests => {
            socket.emit('bannedList', bannedGuests.map(g => g.guestId));
        });

        // Registracija korisnika
        socket.on('registerGuestIdentity', async ({ guestId }) => {
            if (!guestId) return;

            guests[socket.id] = guestId;

            let guest = await SoftGuest.findOne({ guestId });
            if (!guest) guest = await SoftGuest.create({ guestId, banned: false });

            if (guest.banned) socket.emit('userBanned', guestId);
        });

        // Toggle soft ban
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

            if (guest.banned) io.emit('userBanned', guestId);
            else io.emit('userUnbanned', guestId);
        });

    });
};
