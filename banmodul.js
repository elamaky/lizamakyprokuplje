
const mongoose = require('mongoose');

const SoftGuestSchema = new mongoose.Schema({
    guestId: { type: String, unique: true }, // nickname
    banned: { type: Boolean, default: false }
});

const SoftGuest = mongoose.model('SoftGuest', SoftGuestSchema);

// Lista autorizovanih korisnika koji mogu banovati
const authorizedUsers = new Set([
    'Radio Galaksija','ZI ZU','*___F117___*','*__X__*',
    '𝕯𝖔𝖈𝖙𝖔𝖗 𝕷𝖔𝖛𝖊','-𝔸𝕣𝕝𝕚𝕛𝕒-',
    'Najlepsa Ciganka','Dia💎','Dia'
]);

module.exports = function softGuestBan(io, guests) {

    io.on('connection', (socket) => {

        socket.on('registerGuestIdentity', async ({ guestId }) => {
            if (!guestId) return;

            let guest = await SoftGuest.findOne({ guestId });
            if (!guest) {
                guest = await SoftGuest.create({ guestId, banned: false });
            }

            if (guest.banned) {
                socket.emit('userBanned', guestId);
            }
        });

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
