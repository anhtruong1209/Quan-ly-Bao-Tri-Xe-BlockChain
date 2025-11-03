# Hướng dẫn cấu hình Email Service

## Giải thích

### 1. Email Hệ thống vs Email Khách hàng

- **EMAIL_USER** và **EMAIL_PASSWORD** trong code là:
  - **Email CỦA HỆ THỐNG** (service email) để **GỬI email**
  - Ví dụ: `sdlta0911114819@gmail.com` (email hệ thống của bạn)
  - Đây là email bạn dùng để gửi email đi cho khách hàng

- **Email khách hàng** là email **NHẬN** email
  - Ví dụ: `abc@gmail.com` (email khách hàng nhập vào form)
  - Email này được truyền vào qua API

### 2. Flow hoạt động

```
1. Khách hàng nhập email: abc@gmail.com
2. Hệ thống reset password về: 123456789
3. Hệ thống dùng email service (sdlta0911114819@gmail.com) 
   để GỬI email đến abc@gmail.com
4. Khách hàng nhận email tại abc@gmail.com với password mặc định
```

## Cấu hình Email Service

### Bước 1: Tạo App Password cho Gmail

1. Đăng nhập vào Google Account: https://myaccount.google.com/
2. Vào **Security** → **2-Step Verification** (bật nếu chưa có)
3. Vào **App passwords** → Tạo app password mới
4. Chọn app: **Mail**, Device: **Other** → Nhập tên: "VehicleWarranty"
5. Copy app password (16 ký tự, định dạng: xxxx xxxx xxxx xxxx)

### Bước 2: Cấu hình trong EmailService.js

Mở file `server/src/services/EmailService.js` và cập nhật:

```javascript
// Cấu hình email HỆ THỐNG (dùng để GỬI email)
const EMAIL_USER = "sdlta0911114819@gmail.com"; // Email hệ thống
const EMAIL_PASSWORD = "xxxx xxxx xxxx xxxx"; // App Password từ Google (thay bằng app password thực tế)
```

**Lưu ý:** Thay `"xxxx xxxx xxxx xxxx"` bằng App Password thực tế bạn đã tạo ở Bước 1.

### Bước 3: Test

Sau khi cấu hình, khi khách hàng quên mật khẩu:
- Hệ thống sẽ GỬI email từ `sdlta0911114819@gmail.com`
- Email được gửi ĐẾN email khách hàng nhập vào (ví dụ: `abc@gmail.com`)
- Khách hàng nhận email tại email của họ với password mặc định: `123456789`

## Lưu ý

- Nếu chưa cấu hình EMAIL_PASSWORD (vẫn là `"your-app-password"`):
  - Hệ thống sẽ chạy ở **testing mode**
  - Thông tin email sẽ được log ra console
  - Password vẫn được reset, nhưng không gửi email thực sự

- Để test, bạn có thể check console log để xem nội dung email

- **Bảo mật:** Vì email và password được hardcode trong code, hãy cẩn thận khi public repository
