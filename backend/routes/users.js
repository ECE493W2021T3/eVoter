const router = require("express").Router();
const { User, validateUser } = require('../models/user');
const { verifySession } = require("../middleware/verifySession");
let network = require('../services/network');

/**
 * POST /users
 * Purpose: Sign up
 */
router.post('/', (req, res) => {

    let body = req.body;

    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let newUser = new User(body);

    newUser
        .save()
        .then(() => { return newUser.createSession(); })
        .then((refreshToken) => {
            // Session created successfully - refreshToken returned.
            // now we geneate an access auth token for the user
            return newUser.generateAccessAuthToken().then((accessToken) => {
                // access auth token generated successfully, now we return an object containing the auth tokens
                return { accessToken, refreshToken }
            });
        })
        .then(async (authTokens) => {
            // Sign up user in Blockchain and add to wallet
            await network.registerUser(newUser._id.toString());

            // Set JWT tokens
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(newUser);
            })
        .catch((e) => { res.status(400).send(e); })
})


/**
 * POST /users/login
 * Purpose: Login
 */
router.post('/login', (req, res) => {

    User.findByCredentials(req.body.email, req.body.password).then((user) => {
        return user.createSession().then((refreshToken) => {
            // Session created successfully - refreshToken returned.
            // now we geneate an access auth token for the user

            return user.generateAccessAuthToken().then((accessToken) => {
                // access auth token generated successfully, now we return an object containing the auth tokens
                return { accessToken, refreshToken }
            });
        }).then(async (authTokens) => {
            // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body

            // This is how to connect to Blockchain network with userID
            let connection = await network.connectToNetwork(user._id.toString());

            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
        })
    }).catch((e) => {
        res.status(400).send(e);
    });
})

/**
 * GET /users/me/access-token
 * Purpose: generates and returns an access token
 */
router.get('/me/access-token', verifySession, (req, res) => {
    // we know that the user/caller is authenticated and we have the userID and user object available to us
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    });
})

module.exports = router;
