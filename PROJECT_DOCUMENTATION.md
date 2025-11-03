# 📚 Tài liệu Hệ thống Quản lý Bảo trì Xe - VehicleWarranty System

## 📑 Mục lục

1. [Tổng quan dự án](#1-tổng-quan-dự-án)
2. [Kiến trúc hệ thống](#2-kiến-trúc-hệ-thống)
3. [Smart Contract](#3-smart-contract)
4. [Backend API](#4-backend-api)
5. [Frontend](#5-frontend)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [Luồng hoạt động chính](#7-luồng-hoạt-động-chính)
8. [Database Schema](#8-database-schema)
9. [Deployment](#9-deployment)

---

## 1. Tổng quan dự án

### 1.1. Mục đích
Hệ thống quản lý bảo trì xe vận tải sử dụng Blockchain để:
- Đăng ký và quản lý thông tin xe
- Tạo và xử lý lệnh đăng ký bảo trì
- Lưu trữ hồ sơ dịch vụ bảo trì trên Blockchain (immutable)
- Phân quyền: Admin, User
- Quản lý bảo hành và khiếu nại

### 1.2. Công nghệ sử dụng
- **Frontend**: React.js, Ant Design, Redux, React Router
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Blockchain**: Ethereum, Solidity, Hardhat, ethers.js
- **Authentication**: JWT (Access Token + Refresh Token)
- **Email**: Nodemailer (Gmail)

---

## 2. Kiến trúc hệ thống

### 2.1. Sơ đồ tổng quan
```
┌─────────────────┐
│   Frontend      │  React + Redux + Ant Design
│   (Port 5173)   │
└────────┬────────┘
         │ HTTP/HTTPS
         │ REST API
┌────────▼────────┐
│   Backend       │  Node.js + Express
│   (Port 3001)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼──────┐
│MongoDB│ │Blockchain│
│ Atlas │ │ Ethereum │
│       │ │ (Sepolia)│
└───────┘ └─────────┘
```

### 2.2. Cấu trúc thư mục

#### Frontend (`client/src/`)
```
src/
├── components/          # Components tái sử dụng
│   ├── NavBar/        # Navigation bar
│   ├── VehicleCard/   # Card hiển thị xe
│   ├── StatsSection/  # Thống kê
│   ├── AuthLayout/    # Layout chung cho auth
│   └── ...
├── pages/              # Các trang chính
│   ├── SignIn/        # Đăng nhập
│   ├── SignUp/        # Đăng ký
│   ├── UserDashboard/ # Dashboard người dùng
│   ├── AdminDashboard/# Dashboard admin
│   └── ...
├── services/           # API services
│   ├── UserService.js
│   ├── VehicleService.js
│   └── ...
├── redux/              # State management
│   └── slides/
│       └── userSlide.js
└── routers/            # Routing config
```

#### Backend (`server/src/`)
```
src/
├── controllers/        # Request handlers
│   ├── UserController.js
│   ├── VehicleController.js
│   ├── MaintenanceController.js
│   └── RecordController.js
├── services/          # Business logic
│   ├── UserService.js
│   ├── VehicleService.js
│   ├── BlockchainService.js
│   ├── JwtService.js
│   └── EmailService.js
├── models/            # MongoDB schemas
│   ├── UserModel.js
│   ├── VehicleModel.js
│   ├── MaintenanceRegistration.js
│   └── ServiceRecord.js
├── routes/            # API routes
│   ├── UserRouter.js
│   ├── VehicleRouter.js
│   └── ...
├── middleware/         # Middleware
│   └── authMiddleware.js
└── config/            # Configuration
    └── blockchain.js
```

#### Smart Contract (`smart_contract/`)
```
contracts/
└── VehicleWarrantyRegistry.sol
scripts/
├── deploy.js
├── setAdminRole.js
└── ...
```

---

## 3. Smart Contract

### 3.1. Contract: VehicleWarrantyRegistry

**Network**: Sepolia Testnet  
**Contract Address**: Xem trong `deploy-addresses.txt`

### 3.2. Các Struct chính

#### Vehicle
```solidity
struct Vehicle {
    bytes32 vehicleId;      // hash của plate/VIN
    address owner;          // chủ sở hữu
    bytes32 contentHash;   // hash thông tin xe
    bool registered;
    uint256 registeredAt;
}
```

#### MaintenanceRegistration
```solidity
struct MaintenanceRegistration {
    bytes32 vehicleId;
    bytes32 contentHash;
    address requester;
    bool approved;
    bool processed;
    address approver;
    uint256 requestedAt;
    uint256 approvedAt;
}
```

#### ServiceRecord (Event)
```solidity
event ServiceRecordAnchored(
    bytes32 indexed vehicleId,
    bytes32 indexed contentHash,
    address indexed garage,
    uint256 timestamp
);
```

### 3.3. Phân quyền

```solidity
mapping(address => bool) public isAdmin;    // Admin
mapping(address => bool) public isUser;     // User
mapping(address => bool) public isGarage;  // Garage (để anchor)
```

### 3.4. Các hàm chính

#### Cho User
- `registerVehicle(bytes32 vehicleId, bytes32 contentHash)`: Đăng ký xe mới
- `createMaintenanceRegistration(bytes32 vehicleId, bytes32 contentHash)`: Tạo lệnh bảo trì
- `getUserVehicles(address userAddress)`: Lấy danh sách xe

#### Cho Admin
- `approveMaintenanceRegistration(uint256 regId)`: Duyệt lệnh bảo trì
- `rejectMaintenanceRegistration(uint256 regId)`: Từ chối lệnh
- `setUser(address account, bool enabled)`: Quản lý user

#### Cho Garage/Admin
- `anchorServiceRecord(bytes32 vehicleId, bytes32 contentHash)`: Lưu hồ sơ bảo trì lên blockchain

### 3.5. Events
- `VehicleRegistered`: Khi đăng ký xe mới
- `MaintenanceRegistrationCreated`: Khi tạo lệnh bảo trì
- `MaintenanceRegistrationApproved`: Khi admin duyệt
- `ServiceRecordAnchored`: Khi anchor hồ sơ lên blockchain

---

## 4. Backend API

### 4.1. Base URL
```
http://localhost:3001/api
```

### 4.2. API Routes

#### 4.2.1. User APIs (`/api/user`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/sign-in` | Đăng nhập | ❌ |
| POST | `/sign-up` | Đăng ký | ❌ |
| POST | `/forgot-password` | Quên mật khẩu | ❌ |
| POST | `/log-out` | Đăng xuất | ❌ |
| POST | `/refresh-token` | Refresh token | ❌ |
| GET | `/get-details/:id` | Lấy thông tin user | ✅ |
| PUT | `/update-user/:id` | Cập nhật user | ✅ Admin |
| POST | `/change-password/:id` | Đổi mật khẩu | ✅ |
| DELETE | `/delete-user/:id` | Xóa user | ✅ Admin |
| GET | `/getAll` | Lấy tất cả user | ✅ Admin |

**Ví dụ Request/Response:**

**Sign In:**
```json
POST /api/user/sign-in
{
  "email": "user@example.com",
  "password": "123456"
}

Response:
{
  "status": "OK",
  "message": "SUCCESS",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 4.2.2. Vehicle APIs (`/api/vehicle`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/create` | Đăng ký xe mới | ✅ User |
| GET | `/get-all` | Lấy tất cả xe (Admin) | ✅ Admin |
| GET | `/get-user-vehicles` | Lấy xe của user | ✅ User |
| GET | `/get-details/:id` | Lấy chi tiết xe | ✅ |
| PUT | `/update/:id` | Cập nhật xe | ✅ User |
| DELETE | `/delete/:id` | Xóa xe | ✅ User |
| POST | `/register-on-blockchain/:id` | Đăng ký xe lên blockchain | ✅ User |

**Ví dụ:**

**Create Vehicle:**
```json
POST /api/vehicle/create
{
  "name": "Toyota Camry",
  "plates": "30A-12345",
  "email": "user@example.com",
  "phone": "0901234567",
  "image": ["https://example.com/image.jpg"],
  // ... các trường khác
}

Response:
{
  "status": "OK",
  "message": "Vehicle created successfully",
  "data": { /* vehicle object */ }
}
```

#### 4.2.3. Maintenance APIs (`/api/maintenance`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/create` | Tạo lệnh đăng ký bảo trì | ✅ User |
| GET | `/get-all` | Lấy tất cả lệnh (Admin) | ✅ Admin |
| GET | `/get-user-maintenance` | Lấy lệnh của user | ✅ User |
| GET | `/get-details/:id` | Chi tiết lệnh | ✅ |
| PUT | `/approve/:id` | Admin duyệt | ✅ Admin |
| PUT | `/reject/:id` | Admin từ chối | ✅ Admin |
| POST | `/register-on-blockchain/:id` | Đăng ký lên blockchain | ✅ User |

**Ví dụ:**

**Create Maintenance:**
```json
POST /api/maintenance/create
{
  "vehicle": "vehicle_id",
  "odo": 50000,
  "description": "Bảo trì định kỳ 50k km",
  "garage": "Garage A"
}

Response:
{
  "status": "OK",
  "message": "Maintenance registration created",
  "data": { /* maintenance object */ }
}
```

#### 4.2.4. Service Records APIs (`/api/records`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/create` | Tạo hồ sơ dịch vụ | ✅ User |
| GET | `/get-all` | Lấy tất cả (Admin) | ✅ Admin |
| GET | `/get-user-records` | Lấy hồ sơ của user | ✅ User |
| GET | `/get-details/:id` | Chi tiết hồ sơ | ✅ |
| PUT | `/approve/:id` | Admin duyệt | ✅ Admin |
| POST | `/anchor/:id` | Anchor lên blockchain | ✅ Admin/Garage |

---

## 5. Frontend

### 5.1. Routing

**Public Routes:**
- `/sign-in` - Đăng nhập
- `/sign-up` - Đăng ký
- `/forgot-password` - Quên mật khẩu

**Protected Routes (User):**
- `/user/dashboard` - Dashboard người dùng

**Protected Routes (Admin):**
- `/` hoặc `/home` - Trang chủ admin
- `/vehicles` - Danh sách xe
- `/admin/dashboard` - Dashboard admin
- `/detail/:plate` - Chi tiết xe

### 5.2. Các trang chính

#### 5.2.1. SignIn (`/sign-in`)
- Form đăng nhập (email, password)
- Link đến SignUp và ForgotPassword
- Xử lý JWT token (access + refresh)

#### 5.2.2. UserDashboard (`/user/dashboard`)
- **Tabs:**
  - Xe của tôi: Danh sách xe (VehicleCard)
  - Đăng ký bảo trì: Form tạo lệnh bảo trì
  - Lịch sử: Lịch sử bảo trì
- **Stats Section**: Thống kê tổng quan
- **Advertisement Section**: Quảng cáo/dịch vụ
- **Nút "Đổi mật khẩu"** ở header

#### 5.2.3. AdminDashboard (`/admin/dashboard`)
- Quản lý users
- Quản lý vehicles
- Duyệt/từ chối maintenance registrations
- Anchor service records lên blockchain

### 5.3. Components chính

#### NavBar
- Hiển thị user info (email, avatar)
- Dropdown menu:
  - Dashboard (tùy admin/user)
  - **Đổi mật khẩu** (mới)
  - Đăng xuất
- Search bar

#### VehicleCard
- Hiển thị thông tin xe (image, plates, brand, model)
- Button "Chi tiết" → navigate `/detail/:plate`

#### VehicleForm
- Form đăng ký/cập nhật xe
- Các trường: plates, brand, model, image URLs, ODO, etc.

#### StatsSection
- Card thống kê: Tổng xe, Tổng bảo trì, Hồ sơ dịch vụ

#### AuthLayout
- Layout chung cho SignIn, SignUp, ForgotPassword
- Left: Visual/Image
- Right: Form

### 5.4. State Management (Redux)

**User Slice:**
```javascript
{
  id: string,
  name: string,
  email: string,
  isAdmin: boolean,
  access_token: string,
  // ...
}
```

### 5.5. Services (API Clients)

- `UserService.js`: API calls cho user
- `VehicleService.js`: API calls cho vehicle
- `RecordsService.js`: API calls cho service records
- `MaintenanceService.js`: API calls cho maintenance

Tất cả sử dụng `axiosJWT` với interceptor tự động refresh token.

---

## 6. Authentication & Authorization

### 6.1. JWT Token System

#### Access Token
- **Expiry**: 30 ngày
- **Payload**: `{ id, isAdmin }`
- **Storage**: `localStorage` (key: `access_token`)

#### Refresh Token
- **Expiry**: 30 ngày
- **Storage**: `localStorage` (key: `refresh_token`)
- **Usage**: Dùng để refresh access token khi hết hạn

### 6.2. Token Refresh Flow

```
1. Request với access_token
   ↓
2. Nếu 401 → Gọi /refresh-token với refresh_token
   ↓
3. Nhận access_token mới
   ↓
4. Retry request với token mới
   ↓
5. Nếu refresh_token hết hạn → Logout
```

**Implementation** (`App.jsx`):
- Axios interceptor tự động xử lý refresh
- Queue các request failed trong lúc refresh

### 6.3. Middleware

**Backend** (`authMiddleware.js`):
- `authMiddleWare`: Yêu cầu token hợp lệ
- `authUserMiddleWare`: Yêu cầu token + đúng user hoặc admin

### 6.4. Route Protection

**Frontend** (`App.jsx`):
- Check `requireAuth`: Redirect nếu không có token
- Check `requireAdmin`: Redirect nếu không phải admin

### 6.5. Quên mật khẩu

**Flow:**
```
1. User nhập email → POST /api/user/forgot-password
   ↓
2. Backend reset password về "123456789"
   ↓
3. Gửi email (hoặc log console) password mặc định
   ↓
4. User đăng nhập và đổi mật khẩu
```

**Email Service** (`EmailService.js`):
- Gửi từ: `dotngoc1810@gmail.com` (hardcoded)
- Gửi đến: Email user nhập vào
- Nội dung: Password mặc định `123456789`

### 6.6. Đổi mật khẩu

**Flow:**
```
1. User click "Đổi mật khẩu" (NavBar hoặc UserDashboard)
   ↓
2. Nhập: Mật khẩu cũ, Mật khẩu mới, Xác nhận
   ↓
3. POST /api/user/change-password/:id
   ↓
4. Validate mật khẩu cũ
   ↓
5. Update mật khẩu mới (hashed)
   ↓
6. Logout và redirect đến /sign-in
```

---

## 7. Luồng hoạt động chính

### 7.1. Đăng ký User mới

```
Frontend: SignUp
    ↓
POST /api/user/sign-up
    ↓
Backend: UserService.createUser()
    - Hash password (bcrypt)
    - Lưu vào MongoDB
    ↓
Response: Success
    ↓
User đăng nhập → Nhận JWT tokens
```

### 7.2. Đăng ký Xe mới

```
Frontend: UserDashboard → Tab "Xe của tôi" → Button "Đăng ký xe mới"
    ↓
Form: Nhập thông tin xe (plates, brand, model, image URLs, etc.)
    ↓
POST /api/vehicle/create
    ↓
Backend: VehicleService.createVehicle()
    - Validate dữ liệu
    - Lưu vào MongoDB
    ↓
Response: Vehicle object
    ↓
Frontend: Hiển thị trong danh sách xe
```

**Optional: Đăng ký lên Blockchain**
```
User chọn xe → Button "Đăng ký lên Blockchain"
    ↓
POST /api/vehicle/register-on-blockchain/:id
    ↓
Backend: BlockchainService.registerVehicle()
    - Hash vehicle data → contentHash
    - Hash plates → vehicleId
    - Gọi smart contract: registerVehicle(vehicleId, contentHash)
    ↓
Response: Transaction hash
```

### 7.3. Tạo lệnh đăng ký bảo trì

```
Frontend: UserDashboard → Tab "Đăng ký bảo trì"
    ↓
Form: Chọn xe, nhập ODO, mô tả, chọn garage
    ↓
POST /api/maintenance/create
    ↓
Backend: MaintenanceService.createMaintenance()
    - Lưu vào MongoDB (status: "pending")
    ↓
Response: MaintenanceRegistration object
    ↓
Frontend: Hiển thị trong tab "Lịch sử" (status: "Chờ duyệt")
```

**Optional: Đăng ký lên Blockchain ngay**
```
POST /api/maintenance/register-on-blockchain/:id
    ↓
Backend: Gọi smart contract createMaintenanceRegistration()
    ↓
Response: Transaction hash + regId
```

### 7.4. Admin duyệt lệnh bảo trì

```
Admin: AdminDashboard → Tab "Đăng ký bảo trì"
    ↓
Xem danh sách lệnh (status: "pending")
    ↓
Click "Duyệt" hoặc "Từ chối"
    ↓
PUT /api/maintenance/approve/:id hoặc /reject/:id
    ↓
Backend: MaintenanceService.approveMaintenance()
    - Update status: "approved" hoặc "rejected"
    - (Optional) Gọi smart contract approveMaintenanceRegistration()
    ↓
Response: Success
    ↓
Frontend: Update UI
```

### 7.5. Tạo và Anchor Service Record

```
User: UserDashboard → Tab "Đăng ký bảo trì" hoặc "Lịch sử"
    ↓
Sau khi bảo trì xong → Tạo Service Record
    ↓
POST /api/records/create
    ↓
Backend: RecordService.createRecord()
    - Lưu vào MongoDB (status: "pending")
    ↓
Admin: AdminDashboard → Duyệt Service Record
    ↓
PUT /api/records/approve/:id
    ↓
Admin: Anchor lên Blockchain
    ↓
POST /api/records/anchor/:id
    ↓
Backend: BlockchainService.anchorServiceRecord()
    - Hash service data → contentHash
    - Gọi smart contract: anchorServiceRecord(vehicleId, contentHash)
    - Update MongoDB: anchored = true, txHash, blockNumber
    ↓
Response: Transaction hash
```

**Flow hoàn chỉnh:**
```
User tạo lệnh bảo trì
    ↓
Admin duyệt
    ↓
User/Garage thực hiện bảo trì
    ↓
Tạo Service Record
    ↓
Admin duyệt Service Record
    ↓
Anchor lên Blockchain (Immutable)
```

---

## 8. Database Schema

### 8.1. User Model
```javascript
{
  name: String,
  email: String (unique, required),
  password: String (hashed, required),
  isAdmin: Boolean (default: false),
  phone: Number,
  address: String,
  avatar: String,
  city: String,
  timestamps: true
}
```

### 8.2. Vehicle Model
```javascript
{
  name: String,
  image: [String],           // Array of image URLs
  identifynumber: String (unique),
  dated: Date,
  email: String (unique, required),
  phone: String (required),
  address: String (required),
  plates: String (unique, required),
  bill: String,
  tax: String,
  seri: String,
  license: String,
  engine: String,
  frame: String,
  fuel: String,
  type: String,
  color: String,
  brand: String,
  rolling: String,
  gear: String,
  description: String,
  timestamps: true
}
```

### 8.3. MaintenanceRegistration Model
```javascript
{
  vehicle: ObjectId (ref: Vehicle),
  vehicleId: String,          // hash của plate/VIN
  vehicleKey: String,          // plate hoặc VIN gốc
  user: ObjectId (ref: User),
  content: Object,            // Thông tin bảo trì (ODO, description, garage)
  contentHash: String,        // hash của content
  status: String,             // "pending" | "approved" | "rejected"
  approved: Boolean,
  processed: Boolean,
  approver: ObjectId (ref: User),
  txHash: String,             // Transaction hash trên blockchain
  blockNumber: Number,
  regId: Number,              // ID từ smart contract
  timestamps: true
}
```

### 8.4. ServiceRecord Model
```javascript
{
  vehicle: ObjectId (ref: Vehicle),
  vehicleKey: String,
  user: ObjectId (ref: User),
  content: Object,            // Thông tin dịch vụ bảo trì
  contentHash: String,
  status: String,             // "pending" | "approved" | "rejected" | "anchored"
  approved: Boolean,
  processed: Boolean,
  approver: ObjectId (ref: User),
  anchored: Boolean,           // Đã lên blockchain chưa
  txHash: String,
  blockNumber: Number,
  timestamps: true
}
```

### 8.5. Relationships
```
User 1:N Vehicle (một user có nhiều xe)
User 1:N MaintenanceRegistration (một user tạo nhiều lệnh)
User 1:N ServiceRecord (một user có nhiều hồ sơ)
Vehicle 1:N MaintenanceRegistration (một xe có nhiều lệnh bảo trì)
Vehicle 1:N ServiceRecord (một xe có nhiều hồ sơ dịch vụ)
```

---

## 9. Deployment

### 9.1. Smart Contract Deployment

**Network**: Sepolia Testnet

**Steps:**
```bash
cd smart_contract
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

**Output**: Contract address → lưu vào `server/src/config/blockchain.js`

**Set Roles:**
```bash
# Set admin role
npx hardhat run scripts/setAdminRole.js --network sepolia

# Set garage role (nếu cần)
npx hardhat run scripts/setGarageQuick.js --network sepolia
```

### 9.2. Backend Deployment

**Environment Variables** (hoặc hardcode trong code):
- MongoDB URI
- Blockchain RPC URL
- Contract Address
- Private Key (cho blockchain transactions)
- Email config (EMAIL_USER, EMAIL_PASSWORD)

**Run:**
```bash
cd server
npm install
npm start
```

### 9.3. Frontend Deployment

**Build:**
```bash
cd client
npm install
npm run build
```

**Run dev:**
```bash
npm run dev
```

### 9.4. Cấu hình

#### Backend (`server/src/config/blockchain.js`)
```javascript
module.exports = {
  RPC_URL: "https://sepolia.infura.io/v3/YOUR_PROJECT_ID",
  PRIVATE_KEY: "YOUR_PRIVATE_KEY",
  CONTRACT_ADDRESS: "0x...",
  CHAIN_ID: 11155111 // Sepolia
};
```

#### Email Service (`server/src/services/EmailService.js`)
```javascript
const EMAIL_USER = "dotngoc1810@gmail.com";
const EMAIL_PASSWORD = "your-app-password";
```

---

## 10. Lưu ý quan trọng

### 10.1. Security
- ⚠️ Private keys và passwords được hardcode → **KHÔNG nên public**
- ✅ Sử dụng HTTPS trong production
- ✅ Validate tất cả inputs
- ✅ Hash passwords (bcrypt)

### 10.2. Blockchain
- Gas fees: Mỗi transaction tốn gas (testnet dùng Sepolia ETH)
- Transaction time: ~15-30 giây (Sepolia)
- Events: Lắng nghe events từ contract để sync data

### 10.3. Token Management
- Access token: 30 ngày
- Refresh token: 30 ngày
- Tự động refresh khi 401
- Logout khi refresh token hết hạn

### 10.4. Error Handling
- Frontend: Hiển thị message.error (Ant Design)
- Backend: Trả về `{ status: "ERR", message: "..." }`
- Network errors: Retry với exponential backoff

---

## 11. Hướng dẫn sử dụng

### 11.1. Cho User
1. **Đăng ký tài khoản**: `/sign-up`
2. **Đăng nhập**: `/sign-in`
3. **Dashboard**: `/user/dashboard`
   - Đăng ký xe mới
   - Tạo lệnh đăng ký bảo trì
   - Xem lịch sử bảo trì
4. **Đổi mật khẩu**: Dropdown menu → "Đổi mật khẩu"

### 11.2. Cho Admin
1. **Đăng nhập**: Với tài khoản admin
2. **Dashboard**: `/admin/dashboard`
   - Quản lý users
   - Quản lý vehicles
   - Duyệt/từ chối maintenance registrations
   - Anchor service records lên blockchain

### 11.3. Quên mật khẩu
1. Vào `/forgot-password`
2. Nhập email
3. Nhận email với password mặc định: `123456789`
4. Đăng nhập và đổi mật khẩu ngay

---

## 12. Troubleshooting

### 12.1. Token hết hạn thường xuyên
- **Nguyên nhân**: Token expiry quá ngắn
- **Giải pháp**: Đã set 30 ngày, kiểm tra refresh token mechanism

### 12.2. Blockchain transaction failed
- **Nguyên nhân**: Không đủ gas, sai private key, contract không deploy
- **Giải pháp**: Check RPC URL, private key, contract address

### 12.3. Email không gửi được
- **Nguyên nhân**: Chưa cấu hình EMAIL_PASSWORD hoặc sai App Password
- **Giải pháp**: Tạo App Password từ Google Account, cập nhật `EmailService.js`

### 12.4. "not garage" error
- **Nguyên nhân**: Wallet không có garage role
- **Giải pháp**: Admin có thể anchor (vì có isAdmin role), hoặc set garage role

---

## Kết luận

Hệ thống VehicleWarranty là một ứng dụng quản lý bảo trì xe tích hợp Blockchain, cho phép:
- ✅ Quản lý thông tin xe
- ✅ Tạo và xử lý lệnh bảo trì
- ✅ Lưu trữ hồ sơ bảo trì trên Blockchain (immutable)
- ✅ Phân quyền Admin/User
- ✅ Authentication với JWT

**Tech Stack**: React + Node.js + MongoDB + Ethereum (Sepolia)

---

**Document Version**: 1.0  
**Last Updated**: 2024

