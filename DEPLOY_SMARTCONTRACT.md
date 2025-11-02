# 📋 Hướng Dẫn Deploy Smart Contract Chi Tiết

## 🎯 Tổng Quan

File này hướng dẫn từng bước để deploy Smart Contract `VehicleWarrantyRegistry.sol` lên Sepolia Testnet.

---

## 📦 Bước 1: Chuẩn Bị Môi Trường

### 1.1. Di chuyển vào thư mục smart_contract
```bash
cd smart_contract
```

### 1.2. Cài đặt dependencies (nếu chưa có)
```bash
npm install
# hoặc
yarn install
```

### 1.3. Kiểm tra các packages đã cài đặt
Cần có các packages sau:
- `hardhat`
- `@nomiclabs/hardhat-ethers`
- `ethers`

---

## ⚙️ Bước 2: Kiểm Tra Cấu Hình

### 2.1. Mở file `hardhat.config.js`
Đảm bảo file có cấu hình như sau:
```javascript
module.exports = {
  solidity: "0.8.11",
  defaultNetwork: "sepolia",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/REg8LG5XyLCRieKeksDks",
      accounts: [`0x85a675c6eb2fb511e0bf8b42b2b0941ce45526d6dfc125e07cd54a11b90ebd89`],
    },
  },
};
```

### 2.2. Kiểm tra Private Key
- **⚠️ QUAN TRỌNG:** Private key trong config chỉ dùng cho testnet
- Đảm bảo account này có đủ ETH để pay gas fee (cần ít nhất 0.01 ETH)

---

## 🔨 Bước 3: Compile Smart Contract

### 3.1. Chạy lệnh compile
```bash
npx hardhat compile
```

### 3.2. Kết quả mong đợi
```
Compiling 1 file with 0.8.11
Compilation finished successfully
```

### 3.3. Kiểm tra artifacts
Sau khi compile, kiểm tra:
- `artifacts/contracts/VehicleWarrantyRegistry.sol/VehicleWarrantyRegistry.json` - ABI và bytecode
- `artifacts/build-info/` - Build info files

---

## 🚀 Bước 4: Deploy Smart Contract

### 4.1. Kiểm tra script deploy
File `scripts/deploy.js` đã được cấu hình sẵn để deploy `VehicleWarrantyRegistry`.

### 4.2. Chạy lệnh deploy
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### 4.3. Quá trình deploy
- Script sẽ deploy contract lên Sepolia
- Sẽ mất vài phút để transaction được confirm
- Bạn sẽ thấy output như sau:

```
Deploying contracts to Sepolia...
VehicleWarrantyRegistry deployed to: 0x...
Deploying contracts with the account: 0x...
Account balance: 0.XX ETH
```

### 4.4. Lưu Contract Address
Contract address sẽ tự động được lưu vào file `deploy-addresses.txt`:
```
VehicleWarrantyRegistry address: 0x26A5e5be297b0E6598a821fdf58467e9345De39d
```

---

## ✅ Bước 5: Xác Minh Deployment

### 5.1. Kiểm tra file deploy-addresses.txt
```bash
cat deploy-addresses.txt
```

### 5.2. Kiểm tra trên Etherscan
1. Mở trình duyệt: `https://sepolia.etherscan.io/`
2. Paste contract address vào ô tìm kiếm
3. Xem thông tin contract:
   - Transaction hash
   - Block number
   - Contract creator
   - Balance

### 5.3. Xem Transaction
Click vào transaction hash để xem chi tiết:
- Gas used
- Gas price
- Status (Success/Failed)

---

## 🔐 Bước 6: Verify Contract (Tùy Chọn)

### 6.1. Install plugin (nếu chưa có)
```bash
npm install --save-dev @nomicfoundation/hardhat-verify
```

### 6.2. Thêm vào hardhat.config.js
```javascript
require("@nomicfoundation/hardhat-verify");

module.exports = {
  // ... existing config ...
  etherscan: {
    apiKey: "YOUR_ETHERSCAN_API_KEY", // Lấy từ etherscan.io
  },
};
```

### 6.3. Verify contract
```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

---

## 👥 Bước 7: Thiết Lập Roles (Sau Khi Deploy)

### 7.1. Set Admin Role
Tạo file `scripts/setAdminRole.js`:

```javascript
const hre = require("hardhat");

async function main() {
  // Thay YOUR_CONTRACT_ADDRESS bằng address từ deploy-addresses.txt
  const contractAddress = "YOUR_CONTRACT_ADDRESS";
  // Thay ADMIN_ADDRESS bằng địa chỉ muốn set làm admin
  const adminAddress = "0x...";
  
  const VehicleWarrantyRegistry = await hre.ethers.getContractAt(
    "VehicleWarrantyRegistry",
    contractAddress
  );
  
  console.log("Setting admin role for:", adminAddress);
  const tx = await VehicleWarrantyRegistry.setAdmin(adminAddress, true);
  await tx.wait();
  
  console.log(`✅ Admin role set successfully!`);
  console.log(`Transaction hash: ${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

Chạy script:
```bash
npx hardhat run scripts/setAdminRole.js --network sepolia
```

### 7.2. Set User Role
Tương tự, tạo file `scripts/setUserRole.js`:

```javascript
const hre = require("hardhat");

async function main() {
  const contractAddress = "YOUR_CONTRACT_ADDRESS";
  const userAddress = "0x..."; // Address muốn set làm user
  
  const VehicleWarrantyRegistry = await hre.ethers.getContractAt(
    "VehicleWarrantyRegistry",
    contractAddress
  );
  
  console.log("Setting user role for:", userAddress);
  const tx = await VehicleWarrantyRegistry.setUser(userAddress, true);
  await tx.wait();
  
  console.log(`✅ User role set successfully!`);
  console.log(`Transaction hash: ${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

Chạy:
```bash
npx hardhat run scripts/setUserRole.js --network sepolia
```

---

## 🔄 Bước 8: Cập Nhật Backend

### 8.1. Contract Address tự động
Backend sẽ tự động đọc contract address từ `deploy-addresses.txt` qua file `server/src/config/blockchain.js`.

### 8.2. Kiểm tra lại
Mở file `server/src/config/blockchain.js` và xác nhận:
- `ETH_RPC_URL` đúng
- `WARRANTY_CONTRACT_ADDRESS` được đọc từ deploy file

---

## 📝 Tóm Tắt Các Lệnh

```bash
# 1. Di chuyển vào thư mục
cd smart_contract

# 2. Compile contract
npx hardhat compile

# 3. Deploy contract
npx hardhat run scripts/deploy.js --network sepolia

# 4. Verify contract (optional)
npx hardhat verify --network sepolia CONTRACT_ADDRESS

# 5. Set roles (sau khi deploy)
npx hardhat run scripts/setAdminRole.js --network sepolia
npx hardhat run scripts/setUserRole.js --network sepolia
```

---

## ⚠️ Troubleshooting

### Lỗi: "insufficient funds for gas"
**Giải pháp:**
- Kiểm tra balance của account trên Sepolia
- Lấy ETH testnet từ faucet: https://sepoliafaucet.com/

### Lỗi: "nonce too high"
**Giải pháp:**
- Đợi vài phút rồi thử lại
- Hoặc reset nonce

### Lỗi: "contract verification failed"
**Giải pháp:**
- Đảm bảo source code khớp với code đã deploy
- Kiểm tra constructor arguments

### Lỗi: "invalid network"
**Giải pháp:**
- Kiểm tra lại network trong hardhat.config.js
- Đảm bảo RPC URL còn hoạt động

---

## 📚 Tài Liệu Tham Khảo

- Hardhat Docs: https://hardhat.org/docs
- Sepolia Testnet: https://sepolia.etherscan.io/
- Ethers.js Docs: https://docs.ethers.io/

---

## 🎉 Hoàn Thành!

Sau khi deploy thành công:
- ✅ Contract đã được deploy lên Sepolia
- ✅ Address đã được lưu vào `deploy-addresses.txt`
- ✅ Backend sẽ tự động đọc address
- ✅ Có thể bắt đầu test các chức năng

**Lưu ý:** Backup private key và contract address cẩn thận!
