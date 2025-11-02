# Hướng Dẫn Setup Hoàn Chỉnh - Hệ Thống Quản Lý Giao Dịch Bất Động Sản

## ✅ Đã Hoàn Thành

### 1. Smart Contract
- ✅ **File**: `smart_contract/contracts/RealEstateRegistry.sol`
- ✅ **Deploy Script**: `smart_contract/scripts/deployRealEstate.js`
- ✅ **Tính năng**: Đăng ký BĐS, Tạo giao dịch, Duyệt giao dịch, Anchor blockchain

### 2. Backend (Hoàn chỉnh)

#### Models:
- ✅ `server/src/model/RealEstateModel.js` - Model bất động sản
- ✅ `server/src/model/TransactionModel.js` - Model giao dịch

#### Services:
- ✅ `server/src/services/RealEstateService.js` - Business logic cho BĐS
- ✅ `server/src/services/TransactionService.js` - Business logic cho giao dịch
- ✅ `server/src/services/RealEstateBlockchainService.js` - Tương tác với blockchain

#### Controllers:
- ✅ `server/src/controllers/RealEstateController.js` - API controllers cho BĐS
- ✅ `server/src/controllers/TransactionController.js` - API controllers cho giao dịch

#### Routes:
- ✅ `server/src/routes/RealEstateRouter.js` - Routes cho BĐS
- ✅ `server/src/routes/TransactionRouter.js` - Routes cho giao dịch

#### Config:
- ✅ `server/src/config/database.js` - Cấu hình MongoDB (database: `giaodich-bds`)
- ✅ `server/src/config/blockchain.js` - Cấu hình blockchain
- ✅ `server/src/index-realestate.js` - Server chính (port 3001)

### 3. Frontend (Hoàn chỉnh)

#### Services:
- ✅ `client/src/services/RealEstateService.js` - API calls cho BĐS
- ✅ `client/src/services/TransactionService.js` - API calls cho giao dịch

#### Pages:
- ✅ `client/src/pages/RealEstateDashboard/RealEstateDashboard.jsx` - User Dashboard
- ✅ `client/src/pages/RealEstateAdminDashboard/RealEstateAdminDashboard.jsx` - Admin Dashboard

#### Routes:
- ✅ Cập nhật `client/src/routers/index.js` với routes mới
- ✅ Redirect sau đăng nhập: User → `/realestate/dashboard`, Admin → `/realestate/admin/dashboard`

## 🚀 Cách Chạy

### Bước 1: Deploy Smart Contract

```bash
cd smart_contract
yarn hardhat run scripts/deployRealEstate.js --network sepolia
```

Sau khi deploy, contract address sẽ được lưu vào `deploy-addresses-realestate.txt` và tự động được đọc bởi backend.

### Bước 2: Chạy Backend

```bash
cd server
node src/index-realestate.js
```

Server sẽ chạy trên port **3001** và kết nối với MongoDB database `giaodich-bds` trong cluster `warrantly-verhical`.

### Bước 3: Chạy Frontend

```bash
cd client
npm start
```

Frontend sẽ chạy trên port **3000** (mặc định).

## 📋 Cấu Trúc Database

### MongoDB Cluster: `warrantly-verhical`
### Database: `giaodich-bds`

**Collections:**
- `realestates` - Danh sách bất động sản
- `transactions` - Danh sách giao dịch
- `users` - Người dùng (dùng chung)

## 🔑 API Endpoints

### Real Estate
- `POST /api/realestate/create` - Tạo BĐS mới
- `GET /api/realestate/get-all` - Lấy tất cả BĐS
- `GET /api/realestate/get-details/:id` - Chi tiết BĐS
- `PUT /api/realestate/update/:id` - Cập nhật BĐS (cần auth)
- `DELETE /api/realestate/delete/:id` - Xóa BĐS (cần auth)
- `GET /api/realestate/user/properties` - BĐS của user (cần auth)

### Transaction
- `POST /api/transaction/create` - Tạo giao dịch (cần auth)
- `GET /api/transaction/list` - Danh sách giao dịch (cần auth)
- `GET /api/transaction/details/:id` - Chi tiết giao dịch (cần auth)
- `GET /api/transaction/user/transactions` - Giao dịch của user (cần auth)
- `GET /api/transaction/pending` - Giao dịch chờ duyệt (cần auth, admin)
- `PUT /api/transaction/approve/:id` - Duyệt giao dịch (cần auth, admin)
- `PUT /api/transaction/reject/:id` - Từ chối giao dịch (cần auth, admin)
- `POST /api/transaction/anchor/:id` - Anchor lên blockchain (cần auth, admin)

## 📝 Các Trường Dữ Liệu

### RealEstate (Bất động sản)
- **Thông tin cơ bản**: propertyCode, address, ward, district, city, area, price, type, status
- **Thông tin chủ sở hữu**: ownerName, ownerEmail, ownerPhone, ownerIdCard, ownerAddress
- **Giấy tờ**: redBook, buildingPermit, landUseRight
- **Pháp lý**: legalStatus (clean/pending/dispute)
- **Chi tiết**: direction, floor, roomNumber, utilities, images, description

### Transaction (Giao dịch)
- **Thông tin giao dịch**: transactionType (sale/rent/transfer/lease), transactionPrice, deposit
- **Thông tin bên mua**: buyerName, buyerEmail, buyerPhone, buyerIdCard, buyerAddress
- **Thông tin bên bán**: sellerName, sellerEmail, sellerPhone, sellerIdCard, sellerAddress
- **Ngày tháng**: contractDate, transferDate
- **Trạng thái**: status (pending/approved/rejected/completed/anchored/cancelled)
- **Blockchain**: txHash, blockNumber, anchored

## 🔐 Phân Quyền

- **User**: Tạo BĐS, Tạo giao dịch, Xem BĐS/giao dịch của mình
- **Admin**: Tất cả quyền User + Duyệt/từ chối giao dịch, Anchor lên blockchain, Xem tất cả

## 📦 Dependencies Cần Thiết

### Backend:
- express
- mongoose
- jsonwebtoken
- ethers
- crypto (built-in)

### Frontend:
- react
- antd
- react-redux
- axios

## ⚠️ Lưu Ý

1. **MongoDB URI**: Cần cập nhật URI thực tế trong `server/src/config/database.js` nếu khác
2. **Smart Contract**: Sau khi deploy, address sẽ tự động được đọc từ file
3. **Token**: Access token hết hạn sau 30 ngày, tự động refresh khi hết hạn
4. **Port**: Backend chạy port 3001, Frontend port 3000

## 🎯 Tính Năng Chính

1. ✅ Đăng ký bất động sản
2. ✅ Tạo giao dịch (mua bán, cho thuê, chuyển nhượng)
3. ✅ Admin duyệt/từ chối giao dịch
4. ✅ Anchor giao dịch lên blockchain
5. ✅ Xem lịch sử giao dịch
6. ✅ Quản lý BĐS (CRUD)
7. ✅ Xem thông tin blockchain (txHash, blockNumber)

Hệ thống đã sẵn sàng để sử dụng!

