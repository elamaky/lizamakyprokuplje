const bcrypt = require('bcrypt');
const { User } = require('./mongo');  // Preporučujem da koristiš User model direktno

// Aktivne sesije
const activeUsers = new Set();

// Funkcija za registraciju
async function register(req, res, io) {
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
    const socketId = req.headers['x-socket-id']; // Socket ID primljen od klijenta u zaglavlju

    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    // Provera da li Radio Galaksija i R-Galaksija pokušavaju istovremeno
    if (
        (username === 'Radio Galaksija' && activeUsers.has('R-Galaksija')) ||
        (username === 'R-Galaksija' && activeUsers.has('Radio Galaksija'))
    ) {
        return res.status(403).send('Radio Galaksija i R-Galaksija ne mogu biti ulogovani istovremeno.');
    }

    try {
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            const role = user.role;
            const socket = io.sockets.sockets.get(socketId);  // Pronalaženje socket-a po ID-u

            activeUsers.add(username);

            // Emitovanje prijavljenom korisniku sa njegovim role podacima
            if (socket) {
                socket.emit('userLoggedIn', { username, role });
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
