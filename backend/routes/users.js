const router = require("express").Router();
const { User, validateUser } = require('../models/user');
const { verifySession } = require("../middleware/verifySession");
const { auth } = require("../middleware/auth");
let network = require('../services/network');
const { sendOTPEmail } = require("../services/mailer");

var otp = generateOTP();

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
});


/**
 * POST /users/login
 * Purpose: Login
 */
router.post('/login', (req, res) => {
    User.findByCredentials(req.body.email, req.body.password).then((user) => {
        if (user.is2FAEnabled) {
            if (sendOTPEmail(user.email, user.name, otp)) {
                res.send(user);
            } else {
                return res.status(400).send("Failed to send one-time password");
            }
        } else {
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
            });
        }
    }).catch((e) => {
        res.status(400).send(e);
    });
});

router.post('/:id/verify-2FA', async (req, res) => {
    if (req.body.code == otp) {
        const user = await User.findById(req.params.id).select("-__v");
        if (!user)
            return res.status(404).send("The user with the given ID was not found.");

        user.createSession().then((refreshToken) => {
            return user.generateAccessAuthToken().then((accessToken) => {
                return { accessToken, refreshToken }
            });
        }).then(async (authTokens) => {
            let connection = await network.connectToNetwork(user._id.toString());
            otp = generateOTP(); // refresh otp

            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
        });
    } else {
        return res.status(400).send("One-time passcode is invalid");
    }
});

/**
 * GET /users/by-email/:email
 * Purpose: gets the user by email
 */
router.get('/by-email/:email', async (req, res) => {
    const user = await User.findOne({ email: req.params.email }).select("-__v");
    if (!user)
      return res.status(404).send("The user with the given email was not found.");
    res.send(user);
});

/**
 * PATCH /users/:id/change-password
 * Purpose: Updates the user's password
 */
router.patch('/:id/change-password', async (req, res) => {
    const user = await User.findById(req.params.id).select("-__v");
    if (!user)
        return res.status(404).send("The user with the given ID was not found.");

    user.password = req.body.password;
    user.save()
        .then(() => {
            res.send({ 'message' : 'Updated successfully' });
        })
        .catch((e) => { res.status(400).send(e); })
});

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

/**
 * GET /users/me/2FA
 * Purpose: Gets the Two-Factor Authentication setting
 */
router.get('/me/2FA', auth, async (req, res) => {
    const user = await User.findById(req.userID).select("is2FAEnabled -_id");
    res.send(user.is2FAEnabled);
});

/**
 * PATCH /users/me/2FA
 * Purpose: Updates the Two-Factor Authentication setting
 */
router.patch('/me/2FA', auth, async (req, res) => {
    if (typeof(req.body.is2FAEnabled) == "boolean") {
        await User.findOneAndUpdate({ _id: req.userID }, { is2FAEnabled: req.body.is2FAEnabled });
        res.send({ 'message': 'Updated successfully' });
    } else {
        return res.status(404).send("The provided field in the request is not of type boolean");
    }
});

/**
 * GET /users/voters
 * Purpose: Gets all registered voters in the system
 */
router.get('/voters', async (req, res) => {
    const voters = await User.find({ role: 'Voter' }).select("_id email");
    res.send(voters);
});

/**
 * POST /users/send-registration-email
 * Purpose: Sends a system registration email to unregistered voters
 */
router.post('/send-registration-email', (req, res) => {
    console.log(req.body);
    res.send({ 'message': 'Emails sent successfully' });
});

function generateOTP() {
    var passcode = Math.random();
    passcode = passcode * 1000000;
    passcode = parseInt(passcode);
    return passcode;
}

module.exports = router;
