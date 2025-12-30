const mongoose = require('mongoose');

// ================== MODEL ==================
const SoftGuestSchema = new mongoose.Schema({
    guestId: { type: String, unique: true, index: true },
    banned: { type: Boolean, default: false }
});

const SoftGuest = mongoose.model('SoftGuest', SoftGuestSchema);

// ================== AUTH ==================
const authorizedUsers = new Set([
    'Radio Galaksija','ZI ZU','*___F117___*','*__X__*',
    '𝕯𝖔𝖈𝖙𝖔𝖗 𝕷𝖔𝖛𝖊','-𝔸𝕣𝕝𝕚𝕛𝕒-',
    'Najlepsa Ciganka','Dia💎','Dia'
]);

// ================== MODULE ==================
module.exports = function softGuestBan(io, guests) {

    io.on('connection', async (socket) => {
        console.log('[SOCKET] connected:', socket.id);

        // Pošalji listu banovanih samo ovom klijentu
        const bannedGuests = await SoftGuest.find({ banned: true }).lean();
        const bannedIds = bannedGuests.map(g => g.guestId);

        socket.emit('bannedList', bannedIds);
        console.log('[INIT] bannedList sent:', bannedIds.length);

        // ================== REGISTER ==================
        socket.on('registerGuestIdentity', async ({ guestId }) => {
            if (!guestId) return;

            console.log('[REGISTER] socket:', socket.id, 'guestId:', guestId);

            let guest = await SoftGuest.findOne({ guestId });

            if (!guest) {
                guest = await SoftGuest.create({ guestId, banned: false });
                console.log('[DB] new guest created:', guestId);
            }

            if (guest.banned) {
                console.warn('[BAN] guest already banned:', guestId);
                socket.emit('userBanned', guestId);
            }
        });

        // ================== TOGGLE BAN ==================
        socket.on('toggleSoftGuestBan', async ({ guestId }) => {
            const requester = guests[socket.id]?.nickname;

            if (!authorizedUsers.has(requester)) {
                console.warn('[BAN] unauthorized attempt by', requester);
                return;
            }

            if (!guestId) return;

            let guest = await SoftGuest.findOne({ guestId });

            if (!guest) {
                guest = await SoftGuest.create({ guestId, banned: true });
                console.log('[BAN] new guest banned:', guestId);
            } else {
                guest.banned = !guest.banned;
                await guest.save();
                console.log('[BAN] toggled:', guestId, '=>', guest.banned);
            }

            if (guest.banned) {
                io.emit('userBanned', guestId);
            } else {
                io.emit('userUnbanned', guestId);
            }
        });
    });
};
