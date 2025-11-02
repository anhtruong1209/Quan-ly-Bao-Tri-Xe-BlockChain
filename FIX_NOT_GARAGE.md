# Cách Fix Lỗi "not garage"

## Vấn đề
Khi anchor service record, lỗi `"not garage"` xảy ra vì smart contract yêu cầu caller phải có quyền garage hoặc admin.

## Giải pháp

### **Cách 1: Deploy lại Contract (KHUYẾN NGHỊ) ✅**

Contract đã được sửa để cho phép **admin cũng có thể anchor** (không cần garage role).

1. Deploy lại contract:
```bash
cd smart_contract
yarn hardhat run scripts/deploy.js --network sepolia
```

2. Cập nhật contract address trong `server/src/config/blockchain.js` hoặc file `deploy-addresses.txt` sẽ được tự động đọc.

**Ưu điểm:**
- Không cần set garage role
- Logic rõ ràng hơn (admin có thể anchor)
- Owner (đã là admin) có thể anchor ngay

### **Cách 2: Set Garage Role (Nếu không muốn deploy lại)**

Nếu contract cũ đã deploy và không muốn deploy lại:

```bash
cd smart_contract
yarn hardhat run scripts/setGarageQuick.js --network sepolia
```

Script này sẽ:
- Set garage role cho wallet `0xbB2c9c2beaeD565aC4dB0d51C4eED1DB35FDA0d0` (wallet trong config)
- Sử dụng hardhat nên tránh được lỗi RPC timeout

**Lưu ý:**
- Cần owner wallet có đủ ETH
- Cần có private key trong hardhat.config.js

## Tóm tắt

**Không bắt buộc phải set garage** nếu:
- Deploy lại contract mới (đã sửa để admin có thể anchor)
- Owner đã là admin (tự động trong constructor)

**Cần set garage** nếu:
- Giữ contract cũ
- Không muốn deploy lại

## Kiểm tra

Sau khi fix, kiểm tra bằng cách:
1. Tạo service record
2. Approve service record
3. Anchor service record → Không còn lỗi "not garage"

