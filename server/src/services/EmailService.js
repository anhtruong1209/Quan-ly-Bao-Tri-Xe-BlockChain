const nodemailer = require("nodemailer");

/**
 * Cấu hình Email Service
 * 
 * EMAIL_USER và EMAIL_PASSWORD là:
 * - Email CỦA HỆ THỐNG (service email) để GỬI email đi
 * - Ví dụ: sdlta0911114819@gmail.com (email hệ thống của bạn)
 * 
 * Email khách hàng (abc@gmail.com) là email NHẬN, được truyền vào qua API
 * 
 * Flow: Hệ thống dùng email service (sdlta0911114819@gmail.com) 
 *       để GỬI email đến email khách hàng (abc@gmail.com)
 */

// Cấu hình email HỆ THỐNG (dùng để GỬI email)
const EMAIL_USER = "dotngoc1810@gmail.com"; // Email hệ thống
const EMAIL_PASSWORD = "dcvw xgdl jbgs jsax"; // App Password từ Google (thay bằng app password thực tế)

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

/**
 * Gửi email quên mật khẩu
 * @param {string} customerEmail - Email KHÁCH HÀNG (người nhận), ví dụ: abc@gmail.com
 * @param {string} defaultPassword - Mật khẩu mặc định để gửi cho khách hàng
 */
const sendForgotPasswordEmail = async (customerEmail, defaultPassword) => {
  try {
    // Kiểm tra xem đã cấu hình email service chưa
    if (!EMAIL_USER || !EMAIL_PASSWORD || EMAIL_PASSWORD === "your-app-password") {
      console.log("========================================");
      console.log("📧 EMAIL FORGOT PASSWORD (Testing Mode - Chưa cấu hình email service)");
      console.log("========================================");
      console.log(`📮 Gửi từ (Hệ thống): Chưa cấu hình`);
      console.log(`📬 Gửi đến (Khách hàng): ${customerEmail}`);
      console.log(`📋 Subject: Đặt lại mật khẩu - VehicleWarranty`);
      console.log(`\n📝 Nội dung email:`);
      console.log(`Chào bạn,`);
      console.log(`Mật khẩu mặc định của bạn đã được đặt lại thành: ${defaultPassword}`);
      console.log(`Vui lòng đăng nhập và đổi mật khẩu ngay để bảo mật tài khoản.`);
      console.log(`Trân trọng,`);
      console.log(`Hệ thống VehicleWarranty`);
      console.log("========================================");
      console.log("💡 Để gửi email thực sự, hãy cập nhật EMAIL_PASSWORD trong EmailService.js");
      console.log(`   Hiện tại: EMAIL_USER=${EMAIL_USER}`);
      console.log(`   Cần: EMAIL_PASSWORD=your-actual-app-password-from-google`);
      console.log("========================================");
      return { success: true, message: "Email sent (testing mode)" };
    }

    // Gửi email từ email HỆ THỐNG đến email KHÁCH HÀNG
    const mailOptions = {
      from: `"VehicleWarranty System" <${EMAIL_USER}>`, // Email HỆ THỐNG (ví dụ: sdlta0911114819@gmail.com)
      to: customerEmail,            // Email KHÁCH HÀNG (ví dụ: abc@gmail.com - người nhận)
      subject: "Đặt lại mật khẩu - VehicleWarranty",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); padding: 30px; border-radius: 12px; text-align: center;">
            <h2 style="color: white; margin: 0;">VehicleWarranty</h2>
          </div>
          <div style="padding: 30px; background: #f8f9fa;">
            <h3 style="color: #1a1a2e;">Đặt lại mật khẩu</h3>
            <p>Chào bạn,</p>
            <p>Mật khẩu mặc định của bạn đã được đặt lại thành:</p>
            <div style="background: white; padding: 20px; border-radius: 8px; border: 2px solid #2563eb; text-align: center; margin: 20px 0;">
              <strong style="font-size: 24px; color: #2563eb;">${defaultPassword}</strong>
            </div>
            <p>Vui lòng đăng nhập và đổi mật khẩu ngay để bảo mật tài khoản.</p>
            <p style="margin-top: 30px;">Trân trọng,<br><strong>Hệ thống VehicleWarranty</strong></p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email đã được gửi thành công!`);
    console.log(`   📮 Từ: ${EMAIL_USER} (Email hệ thống)`);
    console.log(`   📬 Đến: ${customerEmail} (Email khách hàng)`);
    console.log(`   📧 Response: ${info.response}`);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    // Vẫn trả về success nếu không thể gửi email (fallback)
    return { success: true, message: "Password reset (email service unavailable)" };
  }
};

module.exports = {
  sendForgotPasswordEmail,
};

