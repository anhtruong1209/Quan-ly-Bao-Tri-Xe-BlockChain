# Hướng dẫn Setup Hệ Thống Quản Lý Giao Dịch Bất Động Sản

## Tổng quan
Hệ thống quản lý giao dịch bất động sản được xây dựng tương tự như hệ thống quản lý bảo trì xe, với:
- Smart Contract trên blockchain
- Backend API (Node.js + Express + MongoDB)
- Frontend (React)

## Cấu trúc

### 1. Smart Contract
- **File**: `smart_contract/contracts/RealEstateRegistry.sol`
- **Tính năng**: Đăng ký BĐS, Tạo giao dịch, Duyệt giao dịch, Xác thực blockchain

### 2. Backend
- **Models**: 
  - `RealEstateModel.js` - Model cho bất động sản
  - `TransactionModel.js` - Model cho giao dịch
- **Services**: 
  - `RealEstateService.js`
  - `TransactionService.js`
- **Controllers**: 
  - `RealEstateController.js`
  - `TransactionController.js`
- **Routes**: 
  - `/api/realestate/*`
  - `/api/transaction/*`
- **Server**: `index-realestate.js` (chạy trên port 3002)

### 3. Frontend
- **Services**: 
  - `RealEstateService.js`
  - `TransactionService.js`
- **Pages**: (Cần tạo - xem UserDashboard để tham khảo)

## Cài đặt

### Backend

1. **Cấu hình MongoDB**:
   - File: `server/src/config/database.js`
   - URI mặc định: `mongodb+srv://admin:Admin%40123@realestate.hsdx3um.mongodb.net/`
   - **Lưu ý**: Cần tạo database mới trên MongoDB Atlas hoặc update URI

2. **Chạy server Real Estate**:
```bash
cd server
node src/index-realestate.js
```

Server sẽ chạy trên port **3002**

### Frontend

1. **Update API URL**: 
   - Các services đã được cấu hình để gọi API trên port 3002
   - File: `client/src/services/RealEstateService.js` và `TransactionService.js`

2. **Tạo Pages**: (Cần tạo tương tự UserDashboard)
   - RealEstateDashboard - Dashboard quản lý BĐS
   - RealEstateList - Danh sách BĐS
   - RealEstateDetail - Chi tiết BĐS
   - TransactionList - Danh sách giao dịch

## Deploy Smart Contract

```bash
cd smart_contract
yarn hardhat run scripts/deploy.js --network sepolia
```

**Lưu ý**: Cần tạo script deploy riêng cho RealEstateRegistry.sol

## Các trường dữ liệu chính

### RealEstate (Bất động sản)
- propertyCode: Mã tài sản
- address, ward, district, city: Địa chỉ
- area, price: Diện tích và giá
- type: Loại BĐS (apartment, house, land, villa, office, warehouse, other)
- ownerName, ownerEmail, ownerPhone, ownerIdCard: Thông tin chủ sở hữu
- redBook, buildingPermit, landUseRight: Giấy tờ
- images, description, utilities: Thông tin bổ sung

### Transaction (Giao dịch)
- transactionType: Loại giao dịch (sale, rent, transfer, lease)
- buyerName, buyerEmail, buyerPhone, buyerIdCard: Thông tin bên mua
- sellerName, sellerEmail, sellerPhone, sellerIdCard: Thông tin bên bán
- transactionPrice, deposit: Giá và tiền cọc
- contractDate, transferDate: Ngày ký hợp đồng, bàn giao
- status: Trạng thái (pending, approved, rejected, completed, anchored)

## API Endpoints

### Real Estate
- `POST /api/realestate/create` - Tạo BĐS mới
- `GET /api/realestate/get-all` - Lấy danh sách BĐS
- `GET /api/realestate/get-details/:id` - Chi tiết BĐS
- `PUT /api/realestate/update/:id` - Cập nhật BĐS
- `DELETE /api/realestate/delete/:id` - Xóa BĐS
- `GET /api/realestate/user/properties` - BĐS của user

### Transaction
- `POST /api/transaction/create` - Tạo giao dịch
- `GET /api/transaction/list` - Danh sách giao dịch
- `GET /api/transaction/details/:id` - Chi tiết giao dịch
- `GET /api/transaction/user/transactions` - Giao dịch của user
- `GET /api/transaction/pending` - Giao dịch chờ duyệt (admin)
- `PUT /api/transaction/approve/:id` - Duyệt giao dịch
- `PUT /api/transaction/reject/:id` - Từ chối giao dịch
- `POST /api/transaction/anchor/:id` - Anchor lên blockchain

## Lưu ý

1. **MongoDB URI**: Cần cập nhật URI thực tế trong `server/src/config/database.js`
2. **Smart Contract**: Cần deploy contract mới và cập nhật address trong config
3. **Frontend Pages**: Cần tạo các pages tương tự như UserDashboard
4. **Port**: Real Estate server chạy port 3002, Vehicle server chạy port 3001

