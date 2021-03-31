# Hyperledger Fabric and IBM Blockchain Platform (Local)

> Reference: This Setup Guide is originally created by <https://github.com/IBM/evote/blob/master/docs/run-local.md>, we only added few modifications and updates.

# Steps (Local Deployment)

- [Hyperledger Fabric and IBM Blockchain Platform (Local)](#hyperledger-fabric-and-ibm-blockchain-platform-local)
- [Steps (Local Deployment)](#steps-local-deployment)
  - [Step 1. Clone the Repo](#step-1-clone-the-repo)
  - [Step 2. Start the Fabric Runtime](#step-2-start-the-fabric-runtime)
  - [Step 3. Import Install and Instantiate Contract](#step-3-import-install-and-instantiate-contract)
  - [Step 4. Export Connection Details](#step-4-export-connection-details)
  - [Step 5. Export Local Wallet](#step-5-export-local-wallet)
      - [Update Config](#update-config)
      - [Enroll Admin (Blockchain)](#enroll-admin-blockchain)
  - [Step 6. Run the App](#step-6-run-the-app)
      - [Install nvm](#install-nvm)
      - [Server](#server)
      - [Client](#client)

Note: This repo assumes you have [VSCode](https://code.visualstudio.com/download) 
and [IBM Blockchain VSCode extension](https://marketplace.visualstudio.com/items?itemName=IBMBlockchain.ibm-blockchain-platform) installed. If you don't, first install the 
latest version of VSCode, and then install the IBM Blockchain VSCode extension ensuring you 
have the correct [system requirements](https://marketplace.visualstudio.com/items?itemName=IBMBlockchain.ibm-blockchain-platform) to run the extension. You will need Docker as this is how the extension builds a development Hyperledger Fabric network with a click of a button.

## Step 1. Clone the Repo

Git clone this repo onto your computer in the destination of your choice, then go into the web-app folder:

```
git clone https://github.com/ECE493W2021T3/eVoter.git
```

## Step 2. Start the Fabric Runtime

- First, we need to go to our IBM Blockchain Extension. Click on the IBM Blockchain icon
  in the left side of VSCode (It looks like a square).
- Next, in the **FABRIC ENVIRONMENTS** pane, use the **plus icon button**, select **"Create new from template"**, select **"1 Org template (1 CA, 1 peer, 1 channel)"**, name it **"1 Org Local Fabric"**, select **"V1_4_2"** channel capability.
- Next, start your local fabric by clicking on
  *1 Org Local Fabric* in the **FABRIC ENVIRONMENTS** pane.
- Once it shows Connected to environment: 1 Org Local Fabric, and mychannel, Nodes, Organzations, in the fabric environments tab.

## Step 3. Import Install and Instantiate Contract

- Next, we have to import our contract before we can install it. Click on 
**View -> Command Palette... -> >IBM Blockchain Platform: Import a Package**. Next, click 
on Browse and then select the `evoterContract@x.x.x.cds` file that is in the `evoter\contract` folder.
- (Optionally) You can also get the `cds` package by packaging the code in `evoter\contract` folder. First, open the `evoter\contract` folder in vscode, and Click on
**View -> Command Palette... -> >IBM Blockchain Platform: Package Open Project**, select output format to be cds **(V1 channel capabilities)**, and import it by just following the previous bullet point.
- Under **FABRIC ENVIRONMENTS** let's click on **mychannel**, then select **"Deploy smart contract"** in the dropdown
- In the **Deploy Smart Contract** Page that opened up, for dropdown of **Choose a smart contract to deploy**, select **evoterContract@x.x.x.cds**

- Now, for any additional information asked, just select the default value by click **"Next"**, and finally **"Deploy"**.

## Step 4. Export Connection Details

- Click on `1 Org Local Fabric- Org1 Gateway` in the **FABRIC GATEWAYS** pane
- Right click on the 3 dot menu on the **FABRIC GATEWAYS** pane and `Export Connection Profile`. Save this file to `<git_tree>/evoter/backend/config/fabric_connection.json`

## Step 5. Export Local Wallet

- Under the `FABRIC WALLETS` pane, right click on `1 Org Local Fabric - Org1`, select `Export Wallet`
- Export Wallet and save it as `wallet` folder at `<git_tree>/evoter/backend/assets/wallet/`

#### Update Config

Next, update the `<git_tree>/evoter/backend/config/config.json` file so it looks like this

```json
{
    "connection_file": "config/fabric_connection.json",
    "appAdmin": "admin",
    "appAdminSecret": "adminpw",
    "orgMSPID": "Org1MSP",
    "caName": "http://org1ca-api.127-0-0-1.nip.io:8080",
    "gatewayDiscovery": { "enabled": true, "asLocalhost": true },
    "channel_name": "mychannel",
    "contract_name": "evoterContract"
}
```

- Your caName (URL) might be different, go into `<git_tree>/evoter/backend/config/fabric_connection.json` and look for the `url` field at `certificateAuthorities.<caName>.url`
- This will ensure we use the admin identity that is stored in our wallet to sign transactions, and let the network know that the transactions that are coming from this certain identity were first signed off by the certificate authority with the name `http://org1ca-api.127-0-0-1.nip.io:8080`.

#### Enroll Admin (Blockchain)
```
cd backend
node services/enrollAdmin.js
```
You should see the following in the terminal:
msg: Successfully enrolled admin user admin and imported it into the wallet

## Step 6. Run the App
To run the app, we will need to install dependencies for both our front-end and our back-end. 

#### Install nvm

- We need nvm for multiple version of node
- To install NVM follow: https://github.com/nvm-sh/nvm#install--update-script
- Server is compatible with node v8.9.0
- Client is compatible with node v12.21.0

#### Server
```
nvm install 8.9.0
nvm use 8.9.0
cd backend/
npm install     ** can be ran once on initial clone (unless dependencies have been updated)
npm start
```

#### Client
```
nvm install 12.21.0
nvm use 12.21.0
cd frontend/
npm install     ** can be ran once on initial clone (unless dependencies have been updated)
ng serve
```