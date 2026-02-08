const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    // Header se token nikalna
    const token = req.header('x-auth-token');

    // Check agar token nahi hai
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Token ko verify karna (Wahi secret use karein jo auth.js mein kiya tha)
        const decoded = jwt.verify(token, 'SASTA_SCOUT_SECRET');
        
        // User ko request object mein add karna
        req.user = decoded;
        next(); // Agle step (Route) par bhejna
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = auth;