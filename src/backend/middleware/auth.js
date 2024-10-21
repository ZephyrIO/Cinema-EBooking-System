require('dotenv').config();
const jwt = require('jsonwebtoken');

JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const auth = async (req, res, next) => {
    try {

        const token = req.header('Authorization');
        if (!token) return res.status(401).json({ msg: 'No authentication token, authorization denied.' });

        const token2 = token.split(' ')[1];
        if (!token2) return res.status(401).json({ msg: 'No token after Bearer, authorization denied.' });

        const verified = jwt.verify(token2, JWT_SECRET);
        if (!verified) return res.status(401).json({ msg: 'Token verification failed, authorization denied.' });

        req.user = verified.id;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = auth;