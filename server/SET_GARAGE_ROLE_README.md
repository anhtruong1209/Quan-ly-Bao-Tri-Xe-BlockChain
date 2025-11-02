# Hướng dẫn Set Garage Role cho Wallet

## Vấn đề
Khi anchor service record lên blockchain, bạn có thể gặp lỗi `"not garage"`. Điều này có nghĩa là wallet trong config (`server/src/config/blockchain.js`) chưa có quyền garage trong smart contract.

## Giải pháp

### Bước 1: Lấy Owner Private Key
Bạn cần có private key của owner wallet (wallet đã deploy contract hoặc được set làm owner).

### Bước 2: Chạy script set garage role

```bash
cd server
node src/scripts/setGarageRole.js <OWNER_PRIVATE_KEY>
```

Ví dụ:
```bash
node src/scripts/setGarageRole.js 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

### Bước 3: Xác nhận
Script sẽ:
- Kiểm tra xem wallet đã có quyền garage chưa
- Nếu chưa, sẽ gọi `setGarage()` để cấp quyền
- Hiển thị transaction hash và link Etherscan

### Thông tin cần biết
- **Contract Address**: Được đọc tự động từ `smart_contract/deploy-addresses.txt`
- **Garage Address**: Là địa chỉ wallet được derive từ `WALLET_PRIVATE_KEY` trong config
- **Owner Address**: Là địa chỉ wallet từ owner private key bạn cung cấp

## Lưu ý
- Chỉ owner của contract mới có thể set garage role
- Đảm bảo owner wallet có đủ ETH để trả gas fee
- Sau khi set xong, các lần anchor service record sẽ hoạt động bình thường

## Troubleshooting

### Lỗi: "execution reverted: not owner"
→ Bạn đang dùng sai owner private key. Cần dùng private key của wallet đã deploy contract hoặc được set làm owner.

### Lỗi: "insufficient funds"
→ Owner wallet không đủ ETH để trả gas fee. Cần nạp thêm ETH.

### Lỗi: "contract not found"
→ Kiểm tra lại `WARRANTY_CONTRACT_ADDRESS` trong config hoặc file `deploy-addresses.txt`.

