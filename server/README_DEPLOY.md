# 🚀 Hướng dẫn Deploy - 1 Source

## ✨ Phương án đơn giản

**Build Frontend → Copy vào Backend → Deploy Backend (1 nơi duy nhất)**

---

## 📋 Các bước thực hiện

### 1️⃣ Build Frontend

```bash
cd client
npm install
npm run build
```

Build sẽ tạo folder `client/dist/`

### 2️⃣ Copy Build vào Backend

```bash
# Từ root project
cd server
npm run build:copy
```

Script sẽ copy `client/dist/` → `server/client/dist/`

### 3️⃣ Test Local

```bash
cd server
npm start
```

Sau đó mở:
- Frontend: `http://localhost:3001`
- API: `http://localhost:3001/api/user/getAll`

### 4️⃣ Deploy lên Render.com (Khuyến nghị)

1. Đăng ký tại [render.com](https://render.com)
2. **New Web Service** → Connect GitHub repo
3. Cấu hình:
   - **Root Directory**: `server`
   - **Build Command**: 
     ```bash
     cd ../client && npm install && npm run build && cd ../server && npm run build:copy
     ```
   - **Start Command**: `npm start`
4. Click **Deploy** 🚀

---

## ✅ Checklist

- [ ] Frontend build thành công (`client/dist/` tồn tại)
- [ ] Build đã copy vào `server/client/dist/`
- [ ] Test local: `http://localhost:3001` hoạt động
- [ ] API test: `http://localhost:3001/api/user/getAll`
- [ ] Deploy lên Render.com

---

**Lưu ý**: Backend sẽ serve cả API và Frontend từ 1 port duy nhất!

