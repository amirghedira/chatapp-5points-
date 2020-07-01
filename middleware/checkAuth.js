const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization
        req.user = jwt.verify(token, process.env.JWT_SECRET_KEY)
        next();

    } catch (error) {
        console.log('failed')
        res.status(401).json('Auth failed')
    }
}