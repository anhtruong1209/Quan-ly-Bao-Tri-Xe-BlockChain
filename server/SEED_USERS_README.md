# Seed Users - Hướng dẫn tạo tài khoản mặc định

Script này sẽ tạo 2 tài khoản mặc định trong database `giaodich-bds`:

## Tài khoản được tạo:

- **User**: 
  - Email: `user@gmail.com`
  - Password: `user@123`
  - Role: User (không phải admin)

- **Admin**: 
  - Email: `admin@gmail.com`
  - Password: `admin@123`
  - Role: Admin

## Cách chạy:

```bash
cd server
node src/scripts/seedUsers.js
```

## Lưu ý:

- Script sẽ kiểm tra xem tài khoản đã tồn tại chưa trước khi tạo mới
- Nếu tài khoản đã tồn tại, script sẽ bỏ qua và hiển thị thông báo
- Script tự động đóng kết nối MongoDB sau khi hoàn thành

## Cấu trúc:

- Database: `giaodich-bds` (real estate database)
- Connection: Sử dụng `REAL_ESTATE_MONGO_URI` từ `config/database.js`

