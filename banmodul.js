const authorizedUsers = new Set([
  'Radio Galaksija','ZI ZU','*___F117___*','*__X__*',
  '𝕯𝖔𝖈𝖙𝖔𝖗 𝕷𝖔𝖛𝖊','-𝔸𝕣𝕝𝕚𝕒-',
  'Najlepsa Ciganka','Dia💎','Dia'
]);

const groupA = new Set([
  'ZI ZU','*___F117___*','*__X__*','𝕯𝖔𝖈𝖙𝖔𝖗 𝕷𝖔𝖛𝖊','-𝔸𝕣𝕝𝕚𝕒-'
]);

const groupB = new Set([
  'Najlepsa Ciganka','Dia💎','Dia'
]);

module.exports = function softGuestBan(io, guests) {

    const bannedSet = new Set();

    io.on('connection', socket => {

        socket.on('checkBanStatus', ({ nickname }) => {
            if (bannedSet.has(nickname)) socket.emit('userBanned', nickname);
        });

        socket.on('toggleSoftGuestBan', ({ guestId }) => {
            const requester = guests[socket.id];
            if (!authorizedUsers.has(requester)) return;

            // GRUPA A NIKAD ne može biti banirana
            if (groupA.has(guestId)) return;

            // GRUPU B može banirati samo GRUPA A
            if (groupB.has(guestId) && !groupA.has(requester)) return;

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
