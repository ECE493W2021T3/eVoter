# Group 3:

### Blockchain Setup
- For Local Setup, See [Blockchain Setup (Local)](docs/blockchain_local.md)
- For Cloud Setup, See [Blockchain Setup (Cloud)](docs/blockchain_cloud.md)

### Install nvm

- We need nvm for multiple version of node
- To install NVM follow: https://github.com/nvm-sh/nvm#install--update-script
- Server is compatible with node v8.9.0
- Client is compatible with node v12.21.0

### Server
```
nvm install 8.9.0
nvm use 8.9.0
cd backend/
npm install     ** can be ran once on initial clone (unless dependencies have been updated)
npm start
```

### Client
```
nvm install 12.21.0
nvm use 12.21.0
cd frontend/
npm install     ** can be ran once on initial clone (unless dependencies have been updated)
ng serve
```
