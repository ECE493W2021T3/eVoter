const express = require("express");
const router = express.Router();
const { auth } = require('../middleware/auth');

const path = require('path');
const fs = require('fs');
const util = require('util');

// Blockchain Network
let network = require('../services/network');
const configPath = path.join(process.cwd(), './config/config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
const appAdmin = config.appAdmin;

/**
 * GET /blockchain/queryAll
 * Purpose: query all assets in world state
 */
router.get('/queryAll', async (req, res) => {
    let connection = await network.connectToNetwork(appAdmin);
    let response = await network.invoke(connection, true, 'queryAll', '');
    let parsedResponse = await JSON.parse(response);
    res.send(parsedResponse);
});

module.exports = router;