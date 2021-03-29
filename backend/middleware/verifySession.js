const { User } = require('../models/user');

/**
 * Middleware
 * Validate Refresh Token
 * Used in GET /users/me/access-token
 */
function verifySession (req, res, next) {

    let refreshToken = req.header('x-refresh-token');

    User.findSessionToken(req.header('_id'), refreshToken)
        .then((user) => {
            if (!user) {
                return Promise.reject({
                    'error': 'User not found. Either user_id or session token is invalid'
                });
            }

            // update refresh token
            req.userID = user._id;
            req.userObject = user;
            req.refreshToken = refreshToken;

            // check expire time
            let isSessionValid = false;
            user.sessions.forEach((session) => {
                if (session.token === refreshToken) {
                    if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                        isSessionValid = true;
                    }
                }
            });

            if (isSessionValid) { return next(); } 
            return reject({'error': 'Refresh token has expired or the session is invalid'});
        })
        .catch((e) => {
            res.status(401).send(e);
        })
}

module.exports = {verifySession}
