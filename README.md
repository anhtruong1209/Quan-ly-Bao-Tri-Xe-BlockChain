# 🚗 Smart-Car-Chain: Hệ Thống Quản Lý Bảo Trì Xe với Blockchain

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-Solidity-yellow.svg)](https://hardhat.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)

> Hệ thống quản lý bảo trì và bảo hành xe sử dụng công nghệ Blockchain để đảm bảo tính minh bạch và không thể thay đổi dữ liệu.

<p align="center">
  <img src="https://raw.githubusercontent.com/MITOViXu/vehicle-warranty-website/main/client/src/assets/website_img.jpg" alt="project-image" width="800">
</p>

## 📋 Mục lục

- [Tổng quan](#-tổng-quan)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Cài đặt nhanh](#-cài-đặt-nhanh)
- [Hướng dẫn chi tiết](#-hướng-dẫn-chi-tiết)
- [Luồng hoạt động](#-luồng-hoạt-động)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Troubleshooting](#-troubleshooting)

## 🎯 Tổng quan

Dự án này là một ứng dụng full-stack quản lý bảo trì và bảo hành xe với các tính năng:

- ✅ **Blockchain Integration**: Lưu trữ dữ liệu bảo trì trên Ethereum (Sepolia Testnet) để đảm bảo tính bất biến
- ✅ **Real-time Management**: Dashboard quản lý xe và lịch sử bảo trì theo thời gian thực
- ✅ **Secure Authentication**: Hệ thống đăng nhập/đăng ký với JWT
- ✅ **Transaction Hash Tracking**: Theo dõi và quản lý các transaction hash trên blockchain

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────┐
│   Frontend      │  React + Vite (Port: 5173)
│   (Client)      │
└────────┬────────┘
         │ HTTP/REST API
         │
┌────────▼────────┐
│   Backend       │  Node.js + Express (Port: 3001)
│   (Server)      │  MongoDB Database
└────────┬────────┘
         │ Web3/Ethers.js
         │
┌────────▼────────┐
│ Smart Contracts │  Hardhat + Solidity
│ (Blockchain)    │  Sepolia Testnet
└─────────────────┘
```

### Các thành phần chính:

- **Frontend**: React 18, Vite, Ant Design, Ethers.js
- **Backend**: Node.js, Express, MongoDB, JWT
- **Blockchain**: Hardhat, Solidity, Sepolia Testnet

## 🚀 Cài đặt nhanh

### Yêu cầu hệ thống

- Node.js >= 16.x
- npm hoặc yarn
- MetaMask extension
- Git

### 1. Clone Repository

```bash
git clone <repository-url>
cd Quan-ly-Bao-Tri-Xe-BlockChain
```

### 2. Cài đặt Dependencies

```bash
# Cài đặt Smart Contract
cd smart_contract
npm install

# Cài đặt Backend
cd ../server
npm install

# Cài đặt Frontend
cd ../client
npm install
```

### 3. Cấu hình Smart Contracts

```bash
# Trong folder smart_contract
# 1. Mở hardhat.config.js và thêm private key của MetaMask account vào accounts
# 2. Deploy contracts:
npx hardhat run scripts/deploy.js

# 3. Lưu lại các contract addresses nhận được:
# CarTransactionHistory address: 0x...
# Carmaintenance address: 0x...
# Caraccident address: 0x...
```

### 4. Cấu hình Frontend

```bash
# Mở file client/Constant/constant.js
# Paste các contract addresses từ bước 3 vào:
const carTransactionHistoryAdress = "0x...";
const carmaintenanceAdress = "0x...";
const caraccidentAdress = "0x...";
```

### 5. Khởi động hệ thống

Mở **3 terminal** và chạy:

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

**Terminal 3 - Smart Contract (chỉ cần chạy 1 lần khi deploy):**
```bash
cd smart_contract
npx hardhat run scripts/deploy.js
```

### 6. Truy cập ứng dụng

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- **Documentation**: http://localhost:5173/documentation

### 7. Đăng nhập

- **Email**: admin@gmail.com
- **Password**: 123

## 📚 Hướng dẫn chi tiết

> 💡 **Xem hướng dẫn chi tiết và đầy đủ tại**: http://localhost:5173/documentation

Trang Documentation bao gồm:
- ✅ Luồng hoạt động chi tiết của hệ thống
- ✅ Hướng dẫn từng bước cài đặt
- ✅ Cấu hình MetaMask
- ✅ API Endpoints
- ✅ Troubleshooting các lỗi thường gặp
- ✅ Cấu trúc thư mục quan trọng

## 🔄 Luồng hoạt động

### 1. Quy trình tạo bản bảo trì mới

```
User → Frontend → Backend → MongoDB
                          ↓
                    Blockchain (Ethers.js)
                          ↓
                    MetaMask (User xác nhận)
                          ↓
                    Transaction Hash
                          ↓
                    Cập nhật MongoDB (anchored: true)
```

### 2. Luồng xác thực blockchain

1. Người dùng tạo bản bảo trì trên Frontend
2. Frontend gửi request đến Backend API
3. Backend lưu dữ liệu vào MongoDB (tạm thời `anchored: false`)
4. Backend tạo transaction trên blockchain
5. Người dùng xác nhận transaction trên MetaMask
6. Sau khi transaction thành công, Backend cập nhật `txHash` và `anchored: true`
7. Dữ liệu được xác thực và không thể thay đổi

### 3. Luồng hiển thị dữ liệu

```
Frontend → API Request → Backend → MongoDB Query
                                     ↓
                            Trả về dữ liệu + txHash
                                     ↓
                            Frontend hiển thị với status badge
```

## 📁 Cấu trúc dự án

```
Quan-ly-Bao-Tri-Xe-BlockChain/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── pages/         # Các trang chính
│   │   │   ├── Home/      # Dashboard chính
│   │   │   ├── Detail/    # Chi tiết xe và bảo trì
│   │   │   └── Documentation/ # 📄 Trang hướng dẫn
│   │   ├── components/    # Components tái sử dụng
│   │   ├── services/      # API Services
│   │   └── routers/       # React Router config
│   └── Constant/
│       └── constant.js    # ⚠️ Contract addresses (cần cấu hình)
│
├── server/                # Backend Node.js
│   ├── src/
│   │   ├── index.js       # ⚠️ Entry point, MongoDB config
│   │   ├── controllers/   # Business logic
│   │   ├── models/        # MongoDB schemas
│   │   ├── services/      # Blockchain service
│   │   └── routes/        # API routes
│
└── smart_contract/       # Smart Contracts
    ├── contracts/         # Solidity files
    ├── scripts/
    │   └── deploy.js      # ⚠️ Script deploy
    └── hardhat.config.js  # ⚠️ Network config
```

## 🔧 Cấu hình quan trọng

### 1. Smart Contract (hardhat.config.js)

```javascript
module.exports = {
  solidity: "0.8.11",
  defaultNetwork: "sepolia",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY",
      accounts: [`YOUR_PRIVATE_KEY`], // ⚠️ Private key của MetaMask
    },
  },
};
```

### 2. Frontend (client/Constant/constant.js)

```javascript
const carTransactionHistoryAdress = "0x..."; // ⚠️ Từ deploy
const carmaintenanceAdress = "0x...";         // ⚠️ Từ deploy
const caraccidentAdress = "0x...";           // ⚠️ Từ deploy
```

### 3. Backend (server/src/index.js)

```javascript
const MONGO_DB = "mongodb+srv://..."; // ⚠️ MongoDB connection string
const port = 3001;
```

## ⚙️ MetaMask Setup

### 1. Cài đặt MetaMask
- Cài từ Chrome Web Store
- Tạo tài khoản mới

### 2. Thêm Sepolia Testnet
- Settings → Networks → Add Network
- **Network Name**: Sepolia Test Network
- **RPC URL**: https://rpc.sepolia.org/
- **Chain ID**: 11155111
- **Currency Symbol**: ETH

### 3. Lấy Sepolia ETH (miễn phí)
- Truy cập: https://sepoliafaucet.com/
- Paste địa chỉ MetaMask
- Nhận test ETH

### 4. Kết nối với ứng dụng
- Click "Connect Wallet" trên trang web
- Chọn MetaMask
- Chuyển sang Sepolia network

## 🐛 Troubleshooting

### Lỗi: Cannot connect to MongoDB
- ✅ Kiểm tra connection string trong `server/src/index.js`
- ✅ Kiểm tra internet connection
- ✅ Kiểm tra MongoDB Atlas IP whitelist

### Lỗi: Contract address not found
- ✅ Đã deploy contracts chưa? `npx hardhat run scripts/deploy.js`
- ✅ Đã cập nhật addresses trong `client/Constant/constant.js`?

### Lỗi: MetaMask transaction failed
- ✅ Đã chuyển sang Sepolia network?
- ✅ Có đủ Sepolia ETH?
- ✅ Contract address đúng?

### Lỗi: Port already in use
- ✅ Frontend (5173): Kiểm tra process, kill nếu cần
- ✅ Backend (3001): Tương tự hoặc đổi port

## 📡 API Endpoints

### Vehicles
- `GET /api/vehicle` - Lấy danh sách xe
- `GET /api/vehicle/:plate` - Chi tiết xe
- `POST /api/vehicle` - Tạo xe mới

### Service Records
- `GET /api/record` - Lấy danh sách bảo trì
- `POST /api/record` - Tạo bản bảo trì mới
- `GET /api/record/:vehicleId` - Lịch sử bảo trì của xe

### Users
- `POST /api/user/sign-in` - Đăng nhập
- `POST /api/user/sign-up` - Đăng ký

## 🔐 Thông tin đăng nhập mặc định

- **Email**: admin@gmail.com
- **Password**: 123

## 📝 Scripts có sẵn

### Smart Contract
```bash
cd smart_contract
npx hardhat run scripts/deploy.js  # Deploy contracts
```

### Backend
```bash
cd server
npm start  # Khởi động server (nodemon)
```

### Frontend
```bash
cd client
npm start    # Development server (port 5173)
npm run build # Build production
```

## 🌐 Networks & Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend | 3001 | http://localhost:3001 |
| Blockchain | - | Sepolia Testnet |

## 📖 Tài liệu tham khảo

- [React Documentation](https://react.dev/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Ant Design](https://ant.design/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 📄 License

ISC

## 👥 Contributors

- Team development

---

**💡 Lưu ý**: Dự án này chỉ dùng cho mục đích học tập và demo. Không sử dụng private key thật trên mainnet.

**📞 Hỗ trợ**: Nếu có vấn đề, xem trang Documentation tại http://localhost:5173/documentation sau khi khởi động ứng dụng.
