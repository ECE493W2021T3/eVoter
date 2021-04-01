# Hyperledger Fabric and IBM Blockchain Platform (Cloud)

> Reference: This Setup Guide is originally created by <https://github.com/IBM/evote/blob/master/README.md>, we only added few modifications and updates.

# Steps (Cloud Deployment)
- [Hyperledger Fabric and IBM Blockchain Platform (Cloud)](#hyperledger-fabric-and-ibm-blockchain-platform-cloud)
- [Steps (Cloud Deployment)](#steps-cloud-deployment)
  - [Step 1. Clone the Repo](#step-1-clone-the-repo)
  - [Step 2. Create IBM Cloud services](#step-2-create-ibm-cloud-services)
  - [Step 3. Build a network](#step-3-build-a-network)
    - [Create your organization and your entry point to your blockchain](#create-your-organization-and-your-entry-point-to-your-blockchain)
    - [Create the node that orders transactions](#create-the-node-that-orders-transactions)
    - [Create and join channel](#create-and-join-channel)
  - [Step 4. Deploy voterContract Smart Contract on the network](#step-4-deploy-votercontract-smart-contract-on-the-network)
  - [Step 5. Connect application to the network](#step-5-connect-application-to-the-network)
      - [Enroll Admin (Blockchain)](#enroll-admin-blockchain)
      - [Troubleshooting](#troubleshooting)
  - [Step 6. Run the App](#step-6-run-the-app)
      - [Install nvm](#install-nvm)
      - [Server](#server)
      - [Client](#client)

## Step 1. Clone the Repo

Git clone this repo onto your computer in the destination of your choice, then go into the web-app folder:
```
git clone https://github.com/ECE493W2021T3/eVoter.git
```

## Step 2. Create IBM Cloud services

* Create the [IBM Cloud Kubernetes Service](https://cloud.ibm.com/catalog/infrastructure/containers-kubernetes).  You can find the service in the `Catalog`.  For this code pattern, we can use the `Free` cluster, and give it a name.  Note, that the IBM Cloud allows one instance of a free cluster and expires after 30 days. <b>The cluster takes around 20
minutes to provision, so please be patient!</b>

* Create the [IBM Blockchain Platform](https://console.bluemix.net/catalog/services/blockchain/) service on the IBM Cloud.  You can find the service in the `Catalog`, and give a name.

* After your Kubernetes cluster is up and running, you can deploy your IBM Blockchain Platform service on the cluster. The service walks through few steps and finds your cluster on the IBM Cloud to deploy the service on.

* Once the Blockchain Platform is deployed on the Kubernetes cluster (which can 
take a couple of minutes, you can launch the console to start operating on your
blockchain network by clicking on *Launch the IBM Blockchain Platform*.

## Step 3. Build a network

We will build a network as provided by the IBM Blockchain Platform [documentation](https://cloud.ibm.com/docs/services/blockchain/howto?topic=blockchain-ibp-console-build-network#ibp-console-build-network). This will include creating a channel with a single peer organization with its own MSP and CA (Certificate Authority), and an orderer organization with its own MSP and CA. We will create the respective identities to deploy peers and operate nodes.


### Create your organization and your entry point to your blockchain

* #### Create your Voter Organization CA
  - Navigate to the <b>Nodes</b> tab in the left navigation and click <b>Add Certificate Authority +</b>.
  - Click <b>Create a Certificate Authority +</b> and click <b>Next</b>.
  - Give it a <b>CA display name</b> of `Voter CA`, a <b>CA administrator enroll ID</b> of `admin` and a <b>CA administrator enroll secret</b> of `adminpw`, then click <b>Next</b>.
  - Review the summary and click <b>Add Certificate Authority</b>.

* #### Associate the voter organization CA admin identity
  - In the Nodes tab, select the <b>Voter CA</b> once it is running (indicated by the green box in the tile).
  - Click <b>Associate identity</b> on the CA overview panel.
  - On the side panel, select the <b>Enroll ID</b> tab. 
  - Provide an <b>Enroll ID</b> of `admin` and an <b>Enroll secret</b> of `adminpw`. Use the default value of `Voter CA Admin` for the <b>Identity display name</b>.
  - Click <b>Associate identity</b> to add the identity into your wallet and associate the admin identity with the <b>Voter CA</b>.

* #### Use your CA to register identities
  - Select the <b>Voter CA</b> Certificate Authority and ensure the `admin` identity that was created for the CA is visible in the table.
  - The next step is to register an admin for the organization "Voter". Click on the <b>Register User +</b> button. Give an <b>Enroll ID</b> of `voterAdmin` and an <b>Enroll secret</b> of `voterAdminpw`. Set the <b>Type</b> for this identity as `admin`. Specify to <b>Use root affiliation</b>. Leave the <b>Maximum enrollments</b> field blank. Click <b>Next</b>.
  - Skip the section to add attributes to this user and click <b>Register user</b>.
  - Repeat the process to create an identity of the peer. Click on the <b>Register User +</b> button. Give an <b>Enroll ID</b> of `peer1` and an <b>Enroll secret</b> of `peer1pw`. Set the <b>Type</b> for this identity as `peer`. Specify to <b>Use root affiliation</b>. Leave the <b>Maximum enrollments</b> field blank. Click <b>Next</b>.
  - Skip the section to add attributes to this user and click <b>Register user</b>.



* #### Create the peer organization MSP definition
  - Navigate to the <b>Organizations</b> tab in the left navigation and click <b>Create MSP definition +</b>.
  - Enter the <b>MSP display name</b> as `Voter MSP` and the <b>MSP ID</b> as `votermsp`. Click <b>Next</b>.
  - Specify `Voter CA` as the <b>Root Certificate Authority</b>. Click <b>Next</b>.
  - Select the <b>New identity</b> tab. Give the <b>Enroll ID</b> and <b>Enroll secret</b> for your organization admin, i.e. `voterAdmin` and `voterAdminpw` respectively. Then, give the <b>Identity name</b> as `Voter Admin`.
  - Click the <b>Generate</b> button to enroll this identity as the admin of your organization and add the identity to the wallet. Click <b>Export</b> to export the admin certificates to your file system. Click <b>Next</b>.
  - Review all the information and click <b>Create MSP definition</b>.

* #### Create a peer
  - Navigate to the <b>Nodes</b> tab in the left navigation and click <b>Add peer +</b>.
  - Click <b>Create a peer +</b> and then click <b>Next</b>.
  - Give the <b>Peer display name</b> as `Voter Peer` and click <b>Next</b>.
  - On the next screen, select `Voter CA` as the <b>Certificate Authority</b>. Then, give the <b>Peer enroll ID</b> and <b>Peer enroll secret</b> as `peer1` and `peer1pw` respectively. Select the <b>Organization MSP</b> as `Voter MSP`. Leave the <b>TLS CSR hostname</b> blank and select `1.4.7-0` in the drop-down for <b>Fabric version</b>. Click <b>Next</b>.
  - Provide `Voter Admin` as the <b>Peer administrator identity</b> and click <b>Next</b>.
  - Review the summary and click <b>Add peer</b>.

### Create the node that orders transactions

* #### Create your orderer organization CA
  - Navigate to the <b>Nodes</b> tab in the left navigation and click <b>Add Certificate Authority +</b>.
  - Click <b>Create a Certificate Authority +</b> and click <b>Next</b>.
  - Give it a <b>CA display name</b> of `Orderer CA`, a <b>CA administrator enroll ID</b> of `admin` and a <b>CA administrator enroll secret</b> of `adminpw`, then click <b>Next</b>.
  - Review the summary and click <b>Add Certificate Authority</b>.

* #### Associate the orderer organization CA admin identity
  - In the Nodes tab, select the <b>Orderer CA</b> once it is running (indicated by the green box in the tile).
  - Click <b>Associate identity</b> on the CA overview panel.
  - On the side panel, select the <b>Enroll ID</b> tab. 
  - Provide an <b>Enroll ID</b> of `admin` and an <b>Enroll secret</b> of `adminpw`. Use the default value of `Orderer CA Admin` for the <b>Identity display name</b>.
  - Click <b>Associate identity</b> to add the identity into your wallet and associate the admin identity with the <b>Orderer CA</b>.

* #### Use your CA to register orderer and orderer admin identities
  - Select the <b>Orderer CA</b> Certificate Authority and ensure the `admin` identity that was created for the CA is visible in the table.
  - The next step is to register an admin for the organization "Orderer". Click on the <b>Register User +</b> button. Give an <b>Enroll ID</b> of `ordererAdmin` and an <b>Enroll secret</b> of `ordererAdminpw`. Set the <b>Type</b> for this identity as `admin`. Specify to <b>Use root affiliation</b>. Leave the <b>Maximum enrollments</b> field blank. Click <b>Next</b>.
  - Skip the section to add attributes to this user and click <b>Register user</b>.
  - Repeat the process to create an identity of the orderer. Click on the <b>Register User +</b> button. Give an <b>Enroll ID</b> of `orderer1` and an <b>Enroll secret</b> of `orderer1pw`. Set the <b>Type</b> for this identity as `orderer`. Specify to <b>Use root affiliation</b>. Leave the <b>Maximum enrollments</b> field blank. Click <b>Next</b>.
  - Skip the section to add attributes to this user and click <b>Register user</b>.

* #### Create the orderer organization MSP definition
  - Navigate to the <b>Organizations</b> tab in the left navigation and click <b>Create MSP definition +</b>.
  - Enter the <b>MSP display name</b> as `Orderer MSP` and the <b>MSP ID</b> as `orderermsp`. Click <b>Next</b>.
  - Specify `Orderer CA` as the <b>Root Certificate Authority</b>. Click <b>Next</b>.
  - Select the <b>New identity</b> tab. Give the <b>Enroll ID</b> and <b>Enroll secret</b> for your organization admin, i.e. `ordererAdmin` and `ordererAdminpw` respectively. Then, give the <b>Identity name</b> as `Orderer Admin`.
  - Click the <b>Generate</b> button to enroll this identity as the admin of your organization and add the identity to the wallet. Click <b>Export</b> to export the admin certificates to your file system. Click <b>Next</b>.
  - Review all the information and click <b>Create MSP definition</b>.

* #### Create an orderer
  - Navigate to the <b>Nodes</b> tab in the left navigation and click <b>Add ordering service +</b>.
  - Click <b>Create an ordering service +</b> and then click <b>Next</b>.
  - Give the <b>Ordering service display name</b> as `Orderer` and click <b>Next</b>.
  - On the next screen, select `Orderer CA` as the <b>Certificate Authority</b>. Then, give the <b>Ordering service enroll ID</b> and <b>Ordering service enroll secret</b> as `orderer1` and `orderer1pw` respectively. Select the <b>Organization MSP</b> as `Orderer MSP`. Leave the <b>TLS CSR hostname</b> blank and select `1.4.7-0` in the drop-down for <b>Fabric version</b>. Click <b>Next</b>.
  - Provide `Orderer Admin` as the <b>Orderer administrator identity</b> and click <b>Next</b>.
  - Review the summary and click <b>Add ordering service</b>.

* #### Add organization as Consortium Member on the orderer to transact
  - Navigate to the <b>Nodes</b> tab, and click on the <b>Orderer</b> that was created.
  - Under <b>Consortium Members</b>, click <b>Add organization +</b>.
  - Select the <b>Existing MSP ID</b> tab. From the drop-down list, select `Voter MSP (votermsp)`, as this is the MSP that represents the peer's organization "Voter".
  - Click <b>Add organization</b>.

### Create and join channel

* #### Create the channel
  - Navigate to the <b>Channels</b> tab in the left navigation and click <b>Create channel +</b>.
  - Click <b>Next</b>.
  - Give the <b>Channel name</b> as `mychannel`. Select `Orderer` from the <b>Ordering service</b> drop-down list. Click <b>Next</b>.
  - Under <b>Organizations</b>, select `Voter MSP (votermsp)` from the drop-down list to add the organization "Voter" as a member of this channel. Click the <b>Add</b> button. Set the permissions for this member as <b>Operator</b>. Click <b>Next</b>.
  - Leave the <b>Policy</b> as the default value i.e. `1 out of 1`. Click <b>Next</b>.
  - Select the <b>Channel creator MSP</b> as `Voter MSP (votermsp)` and the <b>Identity</b> as `Voter Admin`. Click <b>Next</b>.
  - Review the summary and click <b>Create channel</b>.

* #### Join your peer to the channel
  - Click on the newly created channel <b>mychannel</b>.
  - In the side panel that opens, under <b>Choose from available peers</b>, select `Voter Peer`. Once the peer is selected, a check mark will be displayed next to it. Ensure that <b>Make anchor peer(s)</b> is marked as `Yes`. Click <b>Join channel</b>.

## Step 4. Deploy voterContract Smart Contract on the network

* #### Install a smart contract
  - Navigate to the <b>Smart contracts</b> tab in the left navigation and click <b>Install smart contract +</b>.
  - Click on <b>Add file</b>.
  - Browse to the location of the voterContract smart contract package file, which is in the root of the repo we cloned - the file is called `evoterContract.cds`.
  - Once the contract is uploaded, click <b>Install smart contract</b>.

* #### Instantiate smart contract
  - Under <b>Installed smart contracts</b>, find the smart contract from the list (**Note: ours is called evoterContract**) installed on our peer and click <b>Instantiate</b> from the overflow menu on the right side of the row.
  - On the side panel that opens, select the channel, `mychannel` on which to instantiate the smart contract. Click <b>Next</b>.
  - Select `Voter MSP` as the organization member to be included in the endorsement policy. Click <b>Next</b>.
  - Skip the <b>Setup private data collection</b> step and simply click <b>Next</b>.
  - Give the <b>Function name</b> as `init` and leave the <b>Arguments</b> blank. <b>Note: init is the method in the voterContract.js file that initiates the smart contracts on the peer.</b>
  - Click <b>Instantiate smart contract</b>.

## Step 5. Connect application to the network

* #### Connect with sdk through connection profile
  - Navigate to the <b>Organizations</b> tab in the left navigation, and click on <b>Voter MSP</b>.
  - Click on <b>Download Connection Profile</b>. 
  - In the side panel that opens up, select `Yes` as the response for <b>Include Voter CA for user registration and enrollment?</b>. Under <b> Select peers to include</b>, select `Voter Peer`. Then click <b>Download connection profile</b>. This will download the connection json which we will use to establish a connection between the Node.js web application and the Blockchain Network.

* #### Create an application admin
  - Navigate to the <b>Nodes</b> tab in the left navigation, and under <b>Certificate Authorities</b>, choose <b>Voter CA</b>.
  - Click on the <b>Register User +</b> button. Give an <b>Enroll ID</b> of `app-admin` and an <b>Enroll secret</b> of `app-adminpw`. Set the <b>Type</b> for this identity as `client`. Specify to <b>Use root affiliation</b>. Leave the <b>Maximum enrollments</b> field blank. Click <b>Next</b>.
  - Click on <b>Add attribute +</b>. Enter the <b>attribute name</b> as `hf.Registrar.Roles` and the <b>attribute value</b> as `*`. Click <b>Register user</b>.

* #### Update application connection
  - Copy the connection profile you downloaded to / as `<git_tree>/evoter/backend/config/ibpConnection.json`
  - Rename the connection profile you downloaded **ibpConnection.json**
  - Update the `<git_tree>/evoter/backend/config/config.json` file with:
    - `ibpConnection.json`.
    - The <b>enroll id</b> and <b>enroll secret</b> for your app admin, which we earlier provided as `app-admin` and `app-adminpw`.
    - The orgMSP ID, which we provided as `votermsp`.
    - The caName, which can be found in your connection json file under "organizations" -> "votermsp" -> certificateAuthorities". This would be like an IP address and a port. You should also use the `https` version of the certificateAuthorities line.
    - Update gateway discovery to `{ enabled: true, asLocalhost: false }` to connect to IBP.

- Once you are done, the final version of the **config.json** should look something like this:

```js
{
    "connection_file": "config/ibpConnection.json",
    "appAdmin": "app-admin",
    "appAdminSecret": "app-adminpw",
    "orgMSPID": "votermsp",
    "caName": "https://xxx.xx.xxx.xxx:xxxxx",
    "gatewayDiscovery": { "enabled": true, "asLocalhost": false },
    "channel_name": "mychannel",
    "contract_name": "evoterContract"
}
```

#### Enroll Admin (Blockchain)
```
cd backend
node services/enrollAdmin.js
```
You should see the following in the terminal:
msg: Successfully enrolled admin user app-admin and imported it into the wallet

#### Troubleshooting

* If you get an error that says `Error: Calling register endpoint failed with error [Error: self signed certificate]`, you can get past this by adding `"httpOptions": {"verify": false}` to the certificateAuthorities section of the connection profile that was downloaded from IBM Blockchain Platform.

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
