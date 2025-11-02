import React from "react";
import { Card, Typography, Divider, Steps, Tag, Alert, Space, Button } from "antd";
import {
  FileTextOutlined,
  RocketOutlined,
  DatabaseOutlined,
  ApiOutlined,
  CodeOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import "./Documentation.css";

const { Title, Paragraph, Text, Link } = Typography;
const { Step } = Steps;

const Documentation = () => {
  return (
    <div className="documentation-container">
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <Title level={1}>
            <FileTextOutlined /> Hướng Dẫn Cấu Hình & Vận Hành
          </Title>
          <Paragraph style={{ fontSize: "18px", color: "#666" }}>
            Hệ thống Quản Lý Bảo Trì Xe sử dụng Blockchain Technology
          </Paragraph>
        </div>

        <Alert
          message="Thông tin quan trọng"
          description="Dự án này sử dụng 3 thành phần chính: Frontend (React), Backend (Node.js), và Smart Contract (Hardhat). Tất cả cần được chạy đồng thời để hệ thống hoạt động."
          type="info"
          showIcon
          style={{ marginBottom: "24px" }}
        />

        {/* Tổng quan kiến trúc */}
        <Card title={<><CodeOutlined /> Kiến trúc hệ thống</>} style={{ marginBottom: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
            <Card size="small" bordered style={{ backgroundColor: "#e6f7ff" }}>
              <Title level={4}>🎨 Frontend (React)</Title>
              <Text>Port: 5173</Text>
              <br />
              <Text>Framework: React + Vite</Text>
            </Card>
            <Card size="small" bordered style={{ backgroundColor: "#f6ffed" }}>
              <Title level={4}>⚙️ Backend (Node.js)</Title>
              <Text>Port: 3001</Text>
              <br />
              <Text>Database: MongoDB</Text>
            </Card>
            <Card size="small" bordered style={{ backgroundColor: "#fff7e6" }}>
              <Title level={4}>⛓️ Smart Contract</Title>
              <Text>Network: Sepolia Testnet</Text>
              <br />
              <Text>Framework: Hardhat</Text>
            </Card>
          </div>
        </Card>

        {/* Luồng hoạt động */}
        <Card title={<><RocketOutlined /> Luồng hoạt động của hệ thống</>} style={{ marginBottom: "24px" }}>
          <Steps direction="vertical" size="small" current={-1}>
            <Step
              title="1. Khởi tạo Smart Contracts"
              description={
                <div>
                  <Paragraph>Deploy smart contract <Text code>VehicleWarrantyRegistry</Text> lên Sepolia Testnet:</Paragraph>
                  <pre style={{ backgroundColor: "#f5f5f5", padding: "12px", borderRadius: "4px", marginTop: "8px" }}>
{`cd smart_contract
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia`}
                  </pre>
                  <Alert
                    message="Lưu ý"
                    description="Contract address sẽ tự động được lưu vào file deploy-addresses.txt. Backend sẽ tự động đọc address này."
                    type="info"
                    showIcon
                    style={{ marginTop: "12px" }}
                  />
                  <Paragraph style={{ marginTop: "12px" }}>
                    <Text strong>Sau khi deploy, thiết lập roles:</Text>
                  </Paragraph>
                  <ul>
                    <li>Set Admin: <Text code>npx hardhat run scripts/setAdminRole.js --network sepolia [ADMIN_ADDRESS]</Text></li>
                    <li>Set User: <Text code>npx hardhat run scripts/setUserRole.js --network sepolia [USER_ADDRESS]</Text></li>
                  </ul>
                </div>
              }
            />
            <Step
              title="2. Cấu hình Contract Address"
              description={
                <div>
                  <Paragraph>Contract address sẽ tự động được lưu vào file <Text code>smart_contract/deploy-addresses.txt</Text></Paragraph>
                  <Paragraph>Backend tự động đọc address từ file này qua <Text code>server/src/config/blockchain.js</Text></Paragraph>
                  <Alert
                    message="Tự động cấu hình"
                    description="Không cần cấu hình thủ công! Address được đọc tự động sau khi deploy."
                    type="success"
                    showIcon
                    style={{ marginTop: "12px" }}
                  />
                </div>
              }
            />
            <Step
              title="3. Kết nối MongoDB"
              description={
                <div>
                  <Paragraph>Backend tự động kết nối MongoDB khi khởi động:</Paragraph>
                  <Text code>mongodb+srv://admin:Admin%40123@warrantly-verhical.hsdx3um.mongodb.net/</Text>
                  <Alert
                    message="Lưu ý"
                    description="Connection string được hardcode trong server/src/index.js. Nếu muốn thay đổi, cần cập nhật biến MONGO_DB."
                    type="warning"
                    showIcon
                    style={{ marginTop: "12px" }}
                  />
                </div>
              }
            />
            <Step
              title="4. Kết nối Frontend với Backend"
              description={
                <div>
                  <Paragraph>Frontend gọi API từ Backend qua các service:</Paragraph>
                  <ul>
                    <li><Text code>VehicleService.js</Text> - Quản lý xe</li>
                    <li><Text code>RecordsService.js</Text> - Quản lý bảo trì</li>
                    <li><Text code>UserService.js</Text> - Quản lý người dùng</li>
                  </ul>
                </div>
              }
            />
            <Step
              title="5. Tương tác với Blockchain"
              description={
                <div>
                  <Paragraph>Khi người dùng thực hiện bảo trì:</Paragraph>
                  <ol>
                    <li>Frontend gửi request tới Backend để lưu vào MongoDB</li>
                    <li>Backend tạo transaction trên blockchain thông qua ethers.js</li>
                    <li>Người dùng xác nhận transaction trên MetaMask</li>
                    <li>Sau khi transaction thành công, Backend cập nhật <Text code>txHash</Text> và <Text code>anchored: true</Text></li>
                  </ol>
                </div>
              }
            />
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
        <Card title={<><ApiOutlined /> API Endpoints quan trọng</>} style={{ marginBottom: "24px" }}>
          <div style={{ display: "grid", gap: "12px" }}>
            <div>
              <Text strong>Vehicles:</Text>
              <ul>
                <li><Text code>GET /api/vehicle</Text> - Lấy danh sách xe</li>
                <li><Text code>GET /api/vehicle/:plate</Text> - Lấy chi tiết xe</li>
                <li><Text code>POST /api/vehicle</Text> - Tạo xe mới</li>
              </ul>
            </div>
            <div>
              <Text strong>Service Records:</Text>
              <ul>
                <li><Text code>GET /api/records</Text> - Lấy danh sách bảo trì</li>
                <li><Text code>POST /api/records</Text> - Tạo bản bảo trì mới</li>
              </ul>
            </div>
            <div>
              <Text strong>Maintenance Registration (Yêu cầu đăng nhập):</Text>
              <ul>
                <li><Text code>POST /api/maintenance/create</Text> - User tạo lệnh đăng ký bảo trì</li>
                <li><Text code>GET /api/maintenance/user</Text> - User xem lệnh đăng ký của mình</li>
                <li><Text code>GET /api/maintenance/admin/pending</Text> - Admin xem lệnh chờ duyệt</li>
                <li><Text code>PUT /api/maintenance/admin/approve/:id</Text> - Admin duyệt lệnh</li>
                <li><Text code>PUT /api/maintenance/admin/reject/:id</Text> - Admin từ chối lệnh</li>
              </ul>
            </div>
            <div>
              <Text strong>Users:</Text>
              <ul>
                <li><Text code>POST /api/user/sign-in</Text> - Đăng nhập</li>
                <li><Text code>POST /api/user/sign-up</Text> - Đăng ký</li>
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
          <Title level={4}>🚀 Chúc bạn code vui vẻ!</Title>
          <Paragraph>
            Nếu có thắc mắc, hãy kiểm tra lại các bước trên hoặc xem code comments trong source code.
          </Paragraph>
        </div>
      </div>
    </div>
  );
};

export default Documentation;

