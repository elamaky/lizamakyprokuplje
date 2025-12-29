const mongoose = require('mongoose');

const SoftGuestSchema = new mongoose.Schema({
    guestId: { type: String, unique: true }, // nickname
    banned: { type: Boolean, default: false }
});

const SoftGuest = mongoose.model('SoftGuest', SoftGuestSchema);

// Ko sme da ban-uje
const authorizedUsers = new Set([
    'Radio Galaksija','ZI ZU','*___F117___*','*__X__*',
    '𝕯𝖔𝖈𝖙𝖔𝖗 𝕷𝖔𝖛𝖊','-𝔸𝕣𝕝𝕚𝕛𝕒-',
    'Najlepsa Ciganka','Dia💎','Dia'
]);

module.exports = function softGuestBan(io, guests) {

    io.on('connection', async (socket) => {

        // 🔒 Pošalji novom klijentu kompletnu listu banovanih
        const bannedGuests = await SoftGuest.find({ banned: true });
        socket.emit('bannedList', bannedGuests.map(g => g.guestId));

        // Klijent se predstavi (nickname)
        socket.on('registerGuestIdentity', async ({ guestId }) => {
            if (!guestId) return;

            let guest = await SoftGuest.findOne({ guestId });
            if (!guest) {
                guest = await SoftGuest.create({ guestId, banned: false });
            }

            // Ako je banovan – javi NJEMU (self lock)
            if (guest.banned) {
                socket.emit('userBanned', guestId);
            }
        });

        // Toggle ban
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

            // Broadcast svima
            if (guest.banned) {
                io.emit('userBanned', guestId);
            } else {
                io.emit('userUnbanned', guestId);
            }
        });

    });
};
