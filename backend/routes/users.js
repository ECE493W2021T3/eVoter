const router = require("express").Router();
const config = require('config');
const jwt = require('jsonwebtoken');
const { User, validateUser } = require('../models/user');
const { verifySession } = require("../middleware/verifySession");
const { auth } = require("../middleware/auth");
let network = require('../services/network');
let { sendRegistrationConfirmationEmail, 
    sendRegistrationInvitationEmail } =require("../services/mailer");

/**
 * POST /users
 * Purpose: Sign up
 */
router.post('/', (req, res) => {
    const confirmationCode = jwt.sign({email: req.body.email}, config.get('jwtPrivateKey'));

    let body = req.body;
    body.confirmed = false; // user is not confirmed, until click link in email.
    body.confirmationCode = confirmationCode;

    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let newUser = new User(body);

    // Send Registration Confirmation Email
    let isSuccessful = sendRegistrationConfirmationEmail(req.get('host'), newUser.email, newUser.name, newUser.confirmationCode);
    if (isSuccessful) {
        newUser
            .save()
            .then(async () => {
                await network.registerUser(newUser._id.toString());
                res.send({}); 
            })
            .catch((e) => { res.status(400).send(e); })
    } else {
        res.status(400).send("Confirmation email sending failed.");
    }
});

/**
 * PATCH /users/:id/change-password
 * Purpose: Updates the user's password
 */
router.get('/confirm/:confirmationCode', async (req, res) => {
    const user = await User.findOne({ confirmationCode: req.params.confirmationCode }).select("-__v");
    if (!user)
        return res.status(404).send("The user with the given ConfirmationCode was not found.");

    user.confirmed = true;
    user.save()
        .then(() => {
            res.send({ 'message' : 'User is confirmed successfully, please go login.' });
        })
        .catch((e) => { res.status(400).send(e); });
});

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

            if (user.confirmed === true) {
                res
                    .header('x-refresh-token', authTokens.refreshToken)
                    .header('x-access-token', authTokens.accessToken)
                    .send(user);
            } else {
                res.status(400).send("User not confirmed.");
            }
        })
    }).catch((e) => {
        res.status(400).send(e);
    });
})

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
    // Send invitation to register email
    const emails = req.body.emails;
    let failed_emails = [];
    if (Array.isArray(emails)) {
        emails.forEach(email => {
            let isSuccessful = sendRegistrationInvitationEmail(email);
            if (!isSuccessful) {
                failed_emails.push(email);
            }
        });
        if (failed_emails.length === 0){
            res.send({ 'message': 'All emails sent successfully' });
        } else {
            res.send({ 'message': 'Some emails failed to send',
                        'failedEmails': failed_emails });
        }
    } else {
        res.status(400).send("Incorrect emails format.");
    }
});

module.exports = router;
