/*
 * Code Pattern From: IBM fabcar example:
 *     https://github.com/hyperledger/fabric-samples/blob/main/fabcar/javascript
 * 
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const util = require('util');

//connect to the config file
const configPath = path.join(process.cwd(), './configs/config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);

let channel_name = config.channel_name;
let contract_name = config.contract_name;
let connection_file = config.connection_file;
let gatewayDiscovery = config.gatewayDiscovery;
let appAdmin = config.appAdmin;
let orgMSPID = config.orgMSPID;

// connect to the connection file
const ccpPath = path.join(process.cwd(), connection_file);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

/* 
 * Create connection to blockchain network
 * input: userName
 * return: connection object consists of {contract, network, gateway}
 */
exports.connectToNetwork = async function (userName) {

    const gateway = new Gateway();

    try {
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        console.log('userName: ');
        console.log(userName);

        console.log('wallet: ');
        console.log(util.inspect(wallet));
        console.log('ccp: ');
        console.log(util.inspect(ccp));

        const userExists = await wallet.exists(userName);
        if (!userExists) {
            console.log('An identity for the user ' + userName + ' does not exist in the wallet');
            let response = {};
            response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first';
            return response;
        }

        await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });

        // connect to channel
        const network = await gateway.getNetwork(channel_name);

        // get the smart contract installed on channel
        const contract = await network.getContract(contract_name);

        const connection = {
            contract: contract,
            network: network,
            gateway: gateway
        };

        return connection;

    } catch (error) {
        console.log(`Failed processing transaction. ${error}`);
        console.log(error.stack);
        let response = {};
        response.error = error;
        return response;
    }
};

/* 
 * Either Evaluate Query or Submits Transaction to Blockchain Network
 * input: connection, isQuery, func, args
 * return: response
 */
exports.invoke = async function (connection, isQuery, func, args) {
    try {
        console.log(`isQuery: ${isQuery}, func: ${func}, args: ${args}`);
        console.log(util.inspect(connection));
        if (isQuery === true) {
            if (args) {
                let response = await connection.contract.evaluateTransaction(func, args);
                console.log(response);
                console.log(`Transaction ${func} with args ${args} has been evaluated`);

                await connection.gateway.disconnect();
                return response;
            } else {
                let response = await connection.contract.evaluateTransaction(func);
                console.log(response);
                console.log(`Transaction ${func} without args has been evaluated`);

                await connection.gateway.disconnect();
                return response;
            }
        } else {
            if (args) {
                args = JSON.parse(args[0]);
                args = JSON.stringify(args);
                let response = await connection.contract.submitTransaction(func, args);
                console.log(response);
                console.log(`Transaction ${func} with args ${args} has been submitted`);

                await connection.gateway.disconnect();
                return response;
            } else {
                let response = await connection.contract.submitTransaction(func);
                console.log(response);
                console.log(`Transaction ${func} without args has been submitted`);

                await connection.gateway.disconnect();
                return response;
            }
        }

    } catch (error) {
        console.error(`Failed processing transaction: ${error}`);
        return error;
    }
};

/* 
 * Register User Identity on Blockchain Network, import identity to wallet
 * input: userId
 * return: response
 */
exports.registerUser = async function (userId) {
    try {
        if (!userId) {
            let response = {};
            response.error = 'userId is required';
            return response;
        }

        // create wallet
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        console.log(wallet);

        // check if userId is unique
        const userExists = await wallet.exists(userId);
        if (userExists) {
            let response = {};
            console.log(`userId ${userId} already taken`);
            response.error = `userId ${userId} already taken`;
            return response;
        }

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists(appAdmin);
        if (!adminExists) {
            console.log(`An identity for the admin user ${appAdmin} does not exist in the wallet`);
            console.log('Run the enrollAdmin.js application before retrying');
            let response = {};
            response.error = `An identity for the admin user ${appAdmin} does not exist in the wallet. Run the enrollAdmin.js application before retrying`;
            return response;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: appAdmin, discovery: gatewayDiscovery });

        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();
        console.log(`AdminIdentity: + ${adminIdentity}`);

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({ affiliation: '', enrollmentID: userId, role: 'client' }, adminIdentity);

        const enrollment = await ca.enroll({ enrollmentID: userId, enrollmentSecret: secret });
        const userIdentity = await X509WalletMixin.createIdentity(orgMSPID, enrollment.certificate, enrollment.key.toBytes());
        await wallet.import(userId, userIdentity);
        console.log(`Successfully user with userId: ${userId}`);
        let response = `Successfully user with userId: ${userId}`;
        return response;

    } catch (error) {
        console.error(`Failed to register user + ${userId} + : ${error}`);
        let response = {};
        response.error = error;
        return response;
    }
};
