module.exports = function (io, guests, sviAvatari, allGlitters) {
    // Privatna poruka
    let isPrivateChatEnabled = false; // Status privatnog chata

    io.on('connection', (socket) => {
        // Pošaljite trenutni status privatnog chata
        socket.emit('private_chat_status', isPrivateChatEnabled);

        // Ako je privatni chat uključen, svi korisnici mogu slati privatne poruke
        socket.on('private_message', (data) => {
            if (isPrivateChatEnabled) {
                // Ovaj deo šalje privatnu poruku određenom korisniku
                io.to(data.to).emit('private_message', data); // Pod pretpostavkom da koristite socket id kao "to"
            } else {
                console.log("Privatni chat nije uključen.");
            }
        });

        // Kada korisnik uključi ili isključi privatni chat
        socket.on('toggle_private_chat', (status) => {
            isPrivateChatEnabled = status; // Ažuriraj status privatnog chata
            io.emit('private_chat_status', isPrivateChatEnabled);
        });

        // Kada server primi zahtev za resetovanje
        socket.on('resetSelectedGuest', () => {
            // Emituj ovaj događaj svim povezanim korisnicima
            socket.broadcast.emit('resetSelectedGuest');  // Ovaj događaj se šalje svim ostalim klijentima
        });

        // Privatna poruka sa avatarom i glitterom
        socket.on('private_message', ({ to, message, time, bold, italic, color, gradient, underline, overline }) => {
            if (!isPrivateChatEnabled) {
                return console.log('Privatni chat nije uključen');
            }

            // Pronalazi socket.id primaoca na osnovu imena
            const recipientSocketId = Object.keys(guests).find(id => guests[id] === to);
            const senderNickname = guests[socket.id];

            // --- DODATO: Avatar i glitter ---
            const senderAvatar = sviAvatari[senderNickname] || null;
            const senderGlitter = allGlitters[senderNickname] || null;

            if (recipientSocketId) {
                // Slanje privatne poruke primaocu
                io.to(recipientSocketId).emit('private_message', {
                    from: senderNickname,
                    message,
                    time,
                    bold,
                    italic,
                    color,
                    gradient,
                    glitter: senderGlitter,  // <-- dodat
                    avatar: senderAvatar,    // <-- dodat
                    underline,
                    overline
                });

                // Slanje privatne poruke pošiljaocu
                socket.emit('private_message', {
                    from: senderNickname,
                    message,
                    time,
                    bold,
                    italic,
                    color,
                    gradient,
                    glitter: senderGlitter,  // <-- dodat
                    avatar: senderAvatar,    // <-- dodat
                    underline,
                    overline
                });
            }
        });
    });
};
