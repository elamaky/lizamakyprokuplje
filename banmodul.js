let privilegedUsers = new Set(['Radio Galaksija','R-Galaksija', 'ZI ZU', '*___F117___*',-𝔸𝕣𝕝𝕚𝕛𝕒-, '*__X__*', '𝕯𝖔𝖈𝖙𝖔𝖗 𝕷𝖔𝖛𝖊','Najlepsa Ciganka', 'Dia']);
const userSockets = new Map(); // Mapa koja čuva socket.id → username

function setupSocketEvents(io, guests, bannedUsers) {
    io.on('connection', (socket) => {
        // Provera da li je korisnik banovan
        if (bannedUsers.has(socket.id)) {
            socket.emit('banned', 'Banovani ste sa servera.');
            socket.disconnect(true);
            return;
        }

        // Kada se korisnik prijavi
        socket.on('userLoggedIn', (username) => {
            userSockets.set(socket.id, username); // Sačuvaj socket ID i username

            if (privilegedUsers.has(username)) {
                socket.emit('adminAccess', "Pristup odobren.");
            }
        });

        // Banovanje korisnika
        socket.on('banUser', (nickname) => {
            const username = userSockets.get(socket.id);

            if (!privilegedUsers.has(username)) {
                socket.emit('error', "Nemate prava za banovanje.");
                return;
            }

            const targetSocketId = Object.keys(guests).find(id => guests[id] === nickname);

            if (!targetSocketId) {
                socket.emit('error', "Korisnik nije pronađen.");
                return;
            }

            bannedUsers.add(targetSocketId);
            io.to(targetSocketId).emit('banned', "Banovani ste sa servera.");
            const targetSocket = io.sockets.sockets.get(targetSocketId);
            if (targetSocket) targetSocket.disconnect(true);

            io.emit('userBanned', nickname);
        });

        // Odbanovanje korisnika
        socket.on('unbanUser', (nickname) => {
            const username = userSockets.get(socket.id);

            if (!privilegedUsers.has(username)) {
                socket.emit('error', "Nemate prava za odbanovanje.");
                return;
            }

            const targetSocketId = Object.keys(guests).find(id => guests[id] === nickname);

            if (targetSocketId) {
                bannedUsers.delete(targetSocketId);
                io.emit('userUnbanned', nickname);
            }
        });
    });
}

module.exports = { setupSocketEvents };

