const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');

function authMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if(err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = decoded;
        next();
    })
}

module.exports = authMiddleware;