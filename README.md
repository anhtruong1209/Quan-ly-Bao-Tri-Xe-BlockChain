<h1 align="left" id="title">Smart-Car-Chain:Automatic car pricing system uses Blockchain technology and Machine Learning 👋</h1>
<p align="center"><img src="https://raw.githubusercontent.com/MITOViXu/vehicle-warranty-website/main/client/src/assets/website_img.jpg" alt="project-image"></p>

<p id="description">A full-stack web application that uses the MERN stack for the backend and frontend smart contracts for blockchain integration and Jupyter Notebooks for AI functionalities. The project focuses on managing car-related data and predicting car prices.</p>

This project leverages modern web technologies to create a comprehensive system for managing vehicle histories and predicting vehicle prices. The application includes the following key features:

- Smart Contract Integration: Uses Ethereum smart contracts to securely store and manage the history of vehicle maintenance and accidents on the blockchain. This ensures the data is tamper-proof and transparently accessible.
- AI for Price Prediction: Implements AI models to predict vehicle prices based on historical data and various vehicle attributes.

<h2>⚙ Project Structure</h2>

- server/: Contains the server-side code using Node.js, Express, MongoDB and AI for car price prediction using Python & Jupyter Notebook.
- client/: Contains the client-side code using React.js.
- smart_contract/: Contains the smart contract code for blockchain integration.

<h2>🛠️ Installation Steps:</h2>

<h3>Clone the Repository</h3>

```bash
  git clone -b main https://github.com/MITOViXu/vehicle-warranty-website.git
```

<h3>Install Dependencies</h3>

```bash
  cd .\vehicle-warranty-website\
  cd server
  npm install
  cd ../client
  npm install
  cd ../smart_contract
  npm install
``` 
<h3>Install Meta mask in browser</h3>

Go to Chorme Store and find Metamask and create account

<h3> Run smart contract</h3>

```bash
cd \smartcontract\
```

In this hardhat.config.js file paste your private account key in account section
```bash
cd ..\scripts\
```
In this deploy.js file run 
```bash
npx hardhat run scripts/deploy.js
```
You will recive 3 result like this 
</br>
CarTransactionHistory address:0x8DD592A57B885E66b6bAB874751e2722285cb0AB
Carmaintenance address:0xf6568AF39811345ab12301d6b929D7B3cC36c704
Caraccident address:0xe0336F57A310C11d916e17b2868b18895766997e

```bash
cd ..\client\Constant
```
In constant.js file  paste the contract address you received previously

<h3>Start the Server and Client</h3>

Start the server:

```bash
  cd server
  npm start
```

Start the client in a separate terminal:

```bash
  cd client
  npm start
```

<h3>Start the Server and Client</h3>

** Note that this blockchain feature is only used for our or your self-created metamask account 
Open your web browser and go to [http://localhost/](http://localhost/) to access the frontend of the application.

- username: admin@gmail.com
- password: 123
- Log in with metamask account,switch to Sepolia network
- confirm the transaction and wait to finshed the transaction

[Link to DEMO of this project](https://drive.google.com/file/d/1VOyDNEY2DhmZyKcFNrcY-gBIkN0dhWCw/view)
