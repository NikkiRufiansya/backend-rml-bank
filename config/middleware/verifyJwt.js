const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({ message: "No token provided" });
    }

    const token = authHeader.split(' ')[1];

    console.log(`Token received: ${token}`); // Debugging line

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error(`Token verification error: ${err.message}`); // Log the exact error
            return res.status(500).json({ message: "Failed to authenticate token" });
        }

        req.userId = decoded.id;
        next();
    });
};

module.exports = verifyToken;
