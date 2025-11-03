import React from "react";
import { Card, Typography, Divider, Steps, Tag, Alert, Space } from "antd";
import { FileTextOutlined, RocketOutlined, DatabaseOutlined, ApiOutlined, CodeOutlined, InfoCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import "./Documentation.css";

const { Title, Paragraph, Text, Link } = Typography;
const { Step } = Steps;

const Documentation = () => {
  return (
    <div className="documentation-container">
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <Title level={1}>
            <FileTextOutlined /> Tài liệu dự án: Hệ Thống Quản Lý Giao Dịch Bất Động Sản (Blockchain)
          </Title>
          <Paragraph style={{ fontSize: "18px", color: "#666" }}>
            Tài liệu này mô tả đầy đủ nền tảng, kiến trúc, luồng nghiệp vụ, API, triển khai và bảo mật của hệ thống bất động sản chạy trên React + Node.js + MongoDB + Ethereum (Sepolia Testnet).
          </Paragraph>
        </div>

        <Alert
          message="Tổng quan nhanh"
          description="Hệ thống gồm 3 phần: Frontend (React/Vite), Backend (Express/MongoDB), Smart Contract (Solidity/Hardhat). Blockchain dùng để 'anchor' giao dịch – lưu vết hash bất biến, đối chiếu với dữ liệu trên MongoDB."
          type="info"
          showIcon
          style={{ marginBottom: "24px" }}
        />

        {/* Blockchain là gì */}
        <Card title={<><CodeOutlined /> Blockchain là gì? Tại sao dùng?</>} style={{ marginBottom: "24px" }}>
          <Paragraph>
            Blockchain là sổ cái phân tán, dữ liệu được ghi thành các khối (block) liên kết bằng hàm băm (hash) và được xác thực bởi mạng lưới.
            Điểm mạnh: tính bất biến, minh bạch, truy vết. Trong dự án này, mỗi giao dịch bất động sản sau khi được admin duyệt sẽ tạo một <Text code>contentHash</Text> (băm dữ liệu giao dịch) và ghi lên chuỗi ("anchor").
          </Paragraph>
          <ul>
            <li><Text strong>Minh bạch:</Text> Ai cũng kiểm chứng được giao dịch đã được ghi (txHash trên Etherscan).</li>
            <li><Text strong>Không sửa được:</Text> Nếu dữ liệu ở DB bị thay đổi, băm lại sẽ khác hash trên chuỗi.</li>
            <li><Text strong>Chi phí thấp:</Text> Chỉ lưu hash (bytes32) nên gas fee rẻ, không cần đưa toàn bộ nội dung lên chain.</li>
          </ul>
        </Card>

        {/* Kiến trúc */}
        <Card title={<><CodeOutlined /> Kiến trúc hệ thống</>} style={{ marginBottom: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
            <Card size="small" bordered style={{ backgroundColor: "#e6f7ff" }}>
              <Title level={4}>🎨 Frontend (React/Vite)</Title>
              <Text>Port: 5173</Text>
              <br />
              <Text>UI: Ant Design + Glassmorphism</Text>
            </Card>
            <Card size="small" bordered style={{ backgroundColor: "#f6ffed" }}>
              <Title level={4}>⚙️ Backend (Node.js)</Title>
              <Text>Port: 3001</Text>
              <br />
              <Text>Database: MongoDB (Atlas)</Text>
            </Card>
            <Card size="small" bordered style={{ backgroundColor: "#fff7e6" }}>
              <Title level={4}>⛓️ Smart Contract</Title>
              <Text>Network: Sepolia Testnet</Text>
              <br />
              <Text>Framework: Hardhat</Text>
            </Card>
          </div>
          <Divider />
          <Paragraph>
            Mô hình phân lớp: Client → REST API → MongoDB. Giao dịch khi được duyệt sẽ được <Text strong>anchor</Text> lên blockchain bằng contract (emit event & lưu mapping). Hệ thống chỉ lưu <Text code>bytes32 contentHash</Text> để tiết kiệm phí.
          </Paragraph>
        </Card>

        {/* Luồng nghiệp vụ */}
        <Card title={<><RocketOutlined /> Luồng nghiệp vụ (User và Admin)</>} style={{ marginBottom: "24px" }}>
          <Steps direction="vertical" size="small" current={-1}>
            <Step title="1. User đăng nhập" description={<div><Paragraph>Đăng nhập qua API <Text code>POST /api/user/sign-in</Text>. Hệ thống trả về <Text code>access_token</Text> (JWT) lưu trong localStorage. Interceptor tự refresh khi gần hết hạn.</Paragraph></div>} />
            <Step title="2. User tạo Bất động sản / Giao dịch" description={<div><Paragraph>User đăng ký tài sản (mã, địa chỉ, diện tích, giá...) hoặc tạo lệnh giao dịch (mua bán/cho thuê/chuyển nhượng...). Dữ liệu lưu MongoDB.</Paragraph></div>} />
            <Step title="3. Admin duyệt giao dịch" description={<div><Paragraph>Admin xem danh sách giao dịch "Chờ duyệt" → đồng ý hoặc từ chối. Nếu duyệt, trạng thái chuyển <Text code>approved</Text>.</Paragraph></div>} />
            <Step title="4. Anchor lên Blockchain" description={<div><Paragraph>Admin bấm "Anchor" → Backend băm nội dung giao dịch thành <Text code>contentHash</Text> và gọi contract <Text code>anchorTransaction(bytes32)</Text>. Kết quả trả về <Text code>txHash</Text> được lưu vào MongoDB.</Paragraph></div>} />
            <Step title="5. Xác thực & tra cứu" description={<div><Paragraph>Ở mọi thời điểm có thể kiểm tra giao dịch trên <Text strong>Etherscan</Text> bằng <Text code>txHash</Text>. So sánh băm dữ liệu hiện tại với <Text code>contentHash</Text> trên chuỗi để phát hiện thay đổi.</Paragraph></div>} />
          </Steps>
        </Card>

        {/* Hướng dẫn cài đặt */}
        <Card title={<><CheckCircleOutlined /> Hướng dẫn cài đặt từng bước</>} style={{ marginBottom: "24px" }}>
          <Steps direction="vertical" size="small">
            <Step
              title="Bước 1: Clone Repository"
              description={
                <pre style={{ backgroundColor: "#f5f5f5", padding: "12px", borderRadius: "4px" }}>
{`git clone <repository-url>
cd Quan-ly-Bao-Tri-Xe-BlockChain`}
                </pre>
              }
            />
            <Step
              title="Bước 2: Cài đặt và Deploy Smart Contract"
              description={
                <div>
                  <Paragraph><Text strong>Folder:</Text> <Text code>smart_contract/</Text></Paragraph>
                  <pre style={{ backgroundColor: "#f5f5f5", padding: "12px", borderRadius: "4px" }}>
{`cd smart_contract
npm install

# Compile contract:
npx hardhat compile

# Deploy lên Sepolia Testnet:
npx hardhat run scripts/deploy.js --network sepolia

# Kết quả sẽ tự động lưu vào deploy-addresses.txt`}
                  </pre>
                  <Alert
                    message="Yêu cầu"
                    description="Đảm bảo account trong hardhat.config.js có đủ Sepolia ETH để pay gas fee (ít nhất 0.01 ETH)"
                    type="warning"
                    showIcon
                    style={{ marginTop: "12px" }}
                  />
                  <Paragraph style={{ marginTop: "12px" }}>
                    <Text strong>Thiết lập roles sau khi deploy:</Text>
                  </Paragraph>
                  <ul>
                    <li>Set Admin: <Text code>npx hardhat run scripts/setAdminRole.js --network sepolia</Text></li>
                    <li>Set User: <Text code>npx hardhat run scripts/setUserRole.js --network sepolia [ADDRESS]</Text></li>
                  </ul>
                </div>
              }
            />
            <Step
              title="Bước 3: Cấu hình Frontend"
              description={
                <div>
                  <Paragraph><Text strong>Folder:</Text> <Text code>client/</Text></Paragraph>
                  <pre style={{ backgroundColor: "#f5f5f5", padding: "12px", borderRadius: "4px" }}>
{`cd client
npm install

# Frontend sẽ tự động kết nối với Backend
# Backend sẽ tự động đọc contract address từ deploy-addresses.txt
# Không cần cấu hình thủ công!`}
                  </pre>
                </div>
              }
            />
            <Step
              title="Bước 4: Cài đặt Backend"
              description={
                <div>
                  <Paragraph><Text strong>Folder:</Text> <Text code>server/</Text></Paragraph>
                  <pre style={{ backgroundColor: "#f5f5f5", padding: "12px", borderRadius: "4px" }}>
{`cd server
npm install

# MongoDB connection đã được config sẵn trong index.js
# Nếu muốn thay đổi, sửa biến MONGO_DB trong server/src/index.js`}
                  </pre>
                </div>
              }
            />
          </Steps>
        </Card>

        {/* Các lệnh chạy */}
        <Card title={<><RocketOutlined /> Các lệnh cần chạy để khởi động hệ thống</>} style={{ marginBottom: "24px" }}>
          <Alert
            message="Thứ tự quan trọng"
            description="Chạy các lệnh theo thứ tự: Smart Contract → Backend → Frontend"
            type="warning"
            showIcon
            style={{ marginBottom: "16px" }}
          />

          <div style={{ marginBottom: "24px" }}>
            <Title level={4}>
              <Tag color="orange" style={{ fontSize: "14px", padding: "4px 12px" }}>1. Smart Contract</Tag>
            </Title>
            <Text strong>Terminal 1:</Text>
            <pre style={{ backgroundColor: "#fff7e6", padding: "12px", borderRadius: "4px", marginTop: "8px" }}>
{`cd smart_contract
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia`}
            </pre>
            <Paragraph type="secondary">
              ⚠️ Chỉ cần chạy 1 lần để deploy contracts. Sau khi deploy xong, bạn có thể đóng terminal này.
              <br />
              ✅ Contract address tự động lưu vào <Text code>deploy-addresses.txt</Text>
            </Paragraph>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <Title level={4}>
              <Tag color="green" style={{ fontSize: "14px", padding: "4px 12px" }}>2. Backend Server</Tag>
            </Title>
            <Text strong>Terminal 2:</Text>
            <pre style={{ backgroundColor: "#f6ffed", padding: "12px", borderRadius: "4px", marginTop: "8px" }}>
{`cd server
npm start`}
            </pre>
            <Paragraph type="secondary">
              ✅ Server sẽ chạy ở <Text code>http://localhost:3001</Text>
              <br />
              ✅ Kết nối MongoDB tự động khi khởi động
            </Paragraph>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <Title level={4}>
              <Tag color="blue" style={{ fontSize: "14px", padding: "4px 12px" }}>3. Frontend Client</Tag>
            </Title>
            <Text strong>Terminal 3:</Text>
            <pre style={{ backgroundColor: "#e6f7ff", padding: "12px", borderRadius: "4px", marginTop: "8px" }}>
{`cd client
npm start`}
            </pre>
            <Paragraph type="secondary">
              ✅ Client sẽ tự động mở ở <Text code>http://localhost:5173</Text>
              <br />
              ✅ Hot reload tự động khi có thay đổi code
            </Paragraph>
          </div>
        </Card>

        {/* Cấu hình MetaMask */}
        <Card title={<><InfoCircleOutlined /> Cấu hình MetaMask</>} style={{ marginBottom: "24px" }}>
          <Steps direction="vertical" size="small">
            <Step
              title="Cài đặt MetaMask Extension"
              description="Cài đặt MetaMask từ Chrome Web Store và tạo tài khoản"
            />
            <Step
              title="Thêm Sepolia Testnet"
              description={
                <div>
                  <Paragraph>Vào MetaMask → Settings → Networks → Add Network:</Paragraph>
                  <ul>
                    <li><Text strong>Network Name:</Text> Sepolia Test Network</li>
                    <li><Text strong>RPC URL:</Text> https://rpc.sepolia.org/</li>
                    <li><Text strong>Chain ID:</Text> 11155111</li>
                    <li><Text strong>Currency Symbol:</Text> ETH</li>
                  </ul>
                </div>
              }
            />
            <Step
              title="Lấy Sepolia ETH"
              description={
                <div>
                  <Paragraph>Để có Sepolia ETH (miễn phí cho testnet):</Paragraph>
                  <ul>
                    <li>Truy cập <Link href="https://sepoliafaucet.com/" target="_blank">Sepolia Faucet</Link></li>
                    <li>Hoặc <Link href="https://faucet.quicknode.com/ethereum/sepolia" target="_blank">QuickNode Faucet</Link></li>
                    <li>Paste địa chỉ MetaMask và nhận test ETH</li>
                  </ul>
                </div>
              }
            />
            <Step
              title="Kết nối với ứng dụng"
              description="Khi vào trang web, click 'Connect Wallet' và chọn MetaMask. Chuyển sang Sepolia network khi được yêu cầu."
            />
          </Steps>
        </Card>

        {/* Cấu trúc thư mục */}
        <Card title={<><DatabaseOutlined /> Cấu trúc thư mục quan trọng</>} style={{ marginBottom: "24px" }}>
          <div style={{ display: "grid", gap: "16px" }}>
            <Card size="small" bordered>
              <Title level={5}>📁 client/</Title>
              <ul>
                <li><Text code>src/pages/</Text> - Các trang chính (Home, Detail, Admin, UserDashboard...)</li>
                <li><Text code>src/components/</Text> - Các component tái sử dụng</li>
                <li><Text code>src/services/</Text> - API services (VehicleService, RecordsService, MaintenanceService)</li>
                <li><Text code>src/routers/</Text> - Routing và Protected Routes</li>
              </ul>
            </Card>
            <Card size="small" bordered>
              <Title level={5}>📁 server/</Title>
              <ul>
                <li><Text code>src/index.js</Text> - ⚠️ Entry point, có MongoDB connection string</li>
                <li><Text code>src/controllers/</Text> - Business logic (VehicleController, MaintenanceController...)</li>
                <li><Text code>src/models/</Text> - MongoDB schemas (Vehicle, MaintenanceRegistration...)</li>
                <li><Text code>src/services/BlockchainService.js</Text> - Tương tác với smart contracts</li>
                <li><Text code>src/config/blockchain.js</Text> - ⚠️ Tự động đọc contract address từ deploy-addresses.txt</li>
                <li><Text code>src/middleware/authMiddleware.js</Text> - JWT authentication</li>
              </ul>
            </Card>
            <Card size="small" bordered>
              <Title level={5}>📁 smart_contract/</Title>
              <ul>
                <li><Text code>contracts/VehicleWarrantyRegistry.sol</Text> - Smart contract chính (có phân quyền admin/user)</li>
                <li><Text code>scripts/deploy.js</Text> - ⚠️ Script deploy contract lên Sepolia</li>
                <li><Text code>scripts/setAdminRole.js</Text> - Script thiết lập admin role</li>
                <li><Text code>scripts/setUserRole.js</Text> - Script thiết lập user role</li>
                <li><Text code>hardhat.config.js</Text> - ⚠️ Cấu hình network và private key</li>
                <li><Text code>deploy-addresses.txt</Text> - ⚠️ File tự động tạo sau khi deploy, chứa contract address</li>
              </ul>
            </Card>
          </div>
        </Card>

        {/* Troubleshooting */}
        <Card title={<><InfoCircleOutlined /> Xử lý lỗi thường gặp</>} style={{ marginBottom: "24px" }}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Alert
              message="Lỗi: Cannot connect to MongoDB"
              description={
                <div>
                  <Paragraph>Kiểm tra:</Paragraph>
                  <ul>
                    <li>Connection string trong <Text code>server/src/index.js</Text></li>
                    <li>Internet connection</li>
                    <li>MongoDB Atlas whitelist IP (nếu có)</li>
                  </ul>
                </div>
              }
              type="error"
              showIcon
            />
            <Alert
              message="Lỗi: Contract address not found"
              description={
                <div>
                  <Paragraph>Kiểm tra:</Paragraph>
                  <ul>
                    <li>Đã deploy contracts chưa? Chạy <Text code>npx hardhat run scripts/deploy.js --network sepolia</Text></li>
                    <li>File <Text code>smart_contract/deploy-addresses.txt</Text> có tồn tại không?</li>
                    <li>Backend có đọc được address từ file deploy-addresses.txt không?</li>
                  </ul>
                </div>
              }
              type="error"
              showIcon
            />
            <Alert
              message="Lỗi: MetaMask transaction failed"
              description={
                <div>
                  <Paragraph>Kiểm tra:</Paragraph>
                  <ul>
                    <li>Đã chuyển sang Sepolia network chưa?</li>
                    <li>Có đủ Sepolia ETH trong wallet không?</li>
                    <li>Contract address có đúng không?</li>
                  </ul>
                </div>
              }
              type="error"
              showIcon
            />
            <Alert
              message="Lỗi: Port already in use"
              description={
                <div>
                  <Paragraph>Giải pháp:</Paragraph>
                  <ul>
                    <li>Frontend (5173): Kiểm tra process nào đang dùng port, kill process đó</li>
                    <li>Backend (3001): Tương tự, hoặc đổi port trong <Text code>server/src/index.js</Text></li>
                  </ul>
                </div>
              }
              type="error"
              showIcon
            />
          </Space>
        </Card>

        {/* API Endpoints */}
        <Card title={<><ApiOutlined /> API Endpoints (chính)</>} style={{ marginBottom: "24px" }}>
          <div style={{ display: "grid", gap: "12px" }}>
            <div>
              <Text strong>Real Estate:</Text>
              <ul>
                <li><Text code>GET /api/realestate</Text> - Danh sách BĐS</li>
                <li><Text code>POST /api/realestate/create</Text> - Tạo BĐS</li>
                <li><Text code>PUT /api/realestate/:id</Text> - Cập nhật</li>
                <li><Text code>DELETE /api/realestate/:id</Text> - Xóa</li>
              </ul>
            </div>
            <div>
              <Text strong>Transactions:</Text>
              <ul>
                <li><Text code>POST /api/transaction/create</Text> - Tạo giao dịch</li>
                <li><Text code>GET /api/transaction/user</Text> - Giao dịch của user</li>
                <li><Text code>GET /api/transaction/admin/pending</Text> - Admin xem chờ duyệt</li>
                <li><Text code>PUT /api/transaction/admin/approve/:id</Text> - Duyệt</li>
                <li><Text code>PUT /api/transaction/admin/reject/:id</Text> - Từ chối</li>
                <li><Text code>PUT /api/transaction/admin/anchor/:id</Text> - Anchor blockchain (trả về txHash)</li>
              </ul>
            </div>
            <div>
              <Text strong>Users:</Text>
              <ul>
                <li><Text code>POST /api/user/sign-in</Text> - Đăng nhập</li>
                <li><Text code>POST /api/user/sign-up</Text> - Đăng ký</li>
                <li><Text code>POST /api/user/forgot-password</Text> - Quên mật khẩu (gửi email)</li>
                <li><Text code>POST /api/user/change-password</Text> - Đổi mật khẩu</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Tài khoản test */}
        <Card title={<><InfoCircleOutlined /> Tài khoản mặc định</>}>
          <Alert
            message="Thông tin đăng nhập Admin"
            description={
              <div>
                <Paragraph><Text strong>Email:</Text> <Text code>admin@gmail.com</Text></Paragraph>
                <Paragraph><Text strong>Password:</Text> <Text code>admin@123</Text></Paragraph>
                <Paragraph type="secondary" style={{ marginTop: "12px" }}>
                  Tài khoản này có quyền admin để quản lý toàn bộ hệ thống.
                </Paragraph>
                <Alert
                  message="Tạo tài khoản admin"
                  description={
                    <div>
                      <Paragraph>Chạy script để tạo admin account mặc định:</Paragraph>
                      <pre style={{ backgroundColor: "#f5f5f5", padding: "12px", borderRadius: "4px", marginTop: "8px" }}>
{`cd server
node src/scripts/seedAdmin.js`}
                      </pre>
                      <Paragraph type="secondary" style={{ marginTop: "8px" }}>
                        Script sẽ tự động tạo admin nếu chưa tồn tại. Nếu đã có, sẽ bỏ qua.
                      </Paragraph>
                    </div>
                  }
                  type="warning"
                  showIcon
                  style={{ marginTop: "12px" }}
                />
              </div>
            }
            type="info"
            showIcon
          />
        </Card>

        <div style={{ textAlign: "center", marginTop: "40px", padding: "24px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
          <Title level={4}>🚀 Chúc bạn thành công!</Title>
          <Paragraph>
            Nếu có thắc mắc, hãy kiểm tra lại các bước trên hoặc xem code comments trong source code.
          </Paragraph>
        </div>
      </div>
    </div>
  );
};

export default Documentation;

