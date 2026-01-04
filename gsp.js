const mongoose = require('mongoose');

// Šema za GPS podatke
const gpsSchema = new mongoose.Schema({
    ipAddress: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    accuracy: { type: Number },
    timestamp: { type: Number, required: true },
    userAgent: { type: String }
}, { timestamps: true });

const GPSData = mongoose.model('GPSData', gpsSchema);

module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('userConsent', async (data) => {
            try {
                let ipAddress = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
                if (ipAddress.includes(',')) ipAddress = ipAddress.split(',')[0].trim();

                const record = new GPSData({
                    ipAddress,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    accuracy: data.accuracy,
                    timestamp: data.timestamp,
                    userAgent: data.userAgent
                });

                await record.save();
                console.log(`GPS podatak sačuvan za IP: ${ipAddress}`);
            } catch (err) {
                console.error('Greška pri čuvanju GPS podataka:', err);
            }
        });
    });

    console.log('GPS modul inicijalizovan.');
};
