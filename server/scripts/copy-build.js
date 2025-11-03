const fs = require('fs');
const path = require('path');

// Đường dẫn
const clientDistPath = path.join(__dirname, '../../client/dist');
const serverPublicPath = path.join(__dirname, '../client/dist');

// Tạo thư mục nếu chưa có
if (!fs.existsSync(path.join(__dirname, '../client'))) {
  fs.mkdirSync(path.join(__dirname, '../client'), { recursive: true });
}

// Copy build files
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

try {
  if (!fs.existsSync(clientDistPath)) {
    console.error('❌ Frontend build không tồn tại! Vui lòng chạy: cd client && npm run build');
    process.exit(1);
  }

  console.log('📦 Đang copy build files từ client/dist...');
  
  // Xóa thư mục cũ nếu có
  if (fs.existsSync(serverPublicPath)) {
    fs.rmSync(serverPublicPath, { recursive: true, force: true });
  }

  // Copy files
  copyRecursiveSync(clientDistPath, serverPublicPath);
  
  console.log('✅ Copy build files thành công!');
  console.log(`   From: ${clientDistPath}`);
  console.log(`   To: ${serverPublicPath}`);
} catch (error) {
  console.error('❌ Lỗi khi copy build files:', error);
  process.exit(1);
}

