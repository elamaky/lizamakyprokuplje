const bcrypt = require('bcrypt');
const { User } = require('./mongo');  // Tvoj User model

// Čuva trenutno prijavljene korisnike
const activeUsers = new Set();

// Funkcija za registraciju
async function register(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    const role = username === 'Radio Galaksija' ? 'admin' : 'guest';
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });

    try {
        await user.save();
        res.status(201).send('User registered');
    } catch (err) {
        console.error('Greška prilikom registracije:', err);
        res.status(400).send('Error registering user');
    }
}

// Funkcija za prijavu
async function login(req, res, io) {
    const { username, password } = req.body;
    const socketId = req.headers['x-socket-id']; // Socket ID od klijenta

    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    // Sprečava login ako je username već aktivan
    if (activeUsers.has(username)) {
        return res.status(400).send('User already logged in');
    }

    try {
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            activeUsers.add(username); // Dodaj u trenutno aktivne
            const role = user.role;
            const socket = io.sockets.sockets.get(socketId);

            if (socket) {
                socket.emit('userLoggedIn', { username, role });

                // Kada korisnik diskonektuje, ukloni ga iz activeUsers
                socket.on('disconnect', () => activeUsers.delete(username));
            }

            res.send(role === 'admin' ? 'Logged in as admin' : 'Logged in as guest');
        } else {
            res.status(400).send('Invalid credentials');
        }
    } catch (err) {
        console.error('Greška prilikom logovanja:', err);
        res.status(500).send('Server error');
    }
}

module.exports = { register, login };

