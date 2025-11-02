import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  Statistic, 
  Table, 
  Tag, 
  Button, 
  Row, 
  Col, 
  Space, 
  Input, 
  Select, 
  Alert,
  Badge,
  Tooltip,
  Popover,
  message,
  Modal,
  Form,
  InputNumber,
} from "antd";
import {
  CarOutlined,
  ToolOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  EyeOutlined,
  FileTextOutlined,
  SearchOutlined,
  ReloadOutlined,
  QuestionCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  SafetyOutlined,
  CopyOutlined,
  LinkOutlined,
  FundOutlined,
  DeleteOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import * as VehicleServices from "../../services/VehicleService.js";
import * as RecordsService from "../../services/RecordsService.js";
import Loading from "../../components/LoadingComponent/Loading.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./Home.css";

const { Search } = Input;
const { Option } = Select;

const Home = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    recentMaintenance: 0,
    pendingWarranty: 0,
    inProgress: 0,
    completed: 0,
    verified: 0,
  });
  const [recentVehicles, setRecentVehicles] = useState([]);
  const [recentRecords, setRecentRecords] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateVehicleModalOpen, setIsCreateVehicleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [form] = Form.useForm();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const vehiclesRes = await VehicleServices.getAllVehicle("", 100);
      if (vehiclesRes?.status === "OK") {
        const vehicles = vehiclesRes.data || [];
        setStats((prev) => ({ ...prev, totalVehicles: vehiclesRes.total || vehicles.length }));
        setRecentVehicles(vehicles.slice(0, 100));
      }
      const allRecords = await RecordsService.listServiceRecords();
      if (allRecords?.status === "OK") {
        const records = allRecords.data || [];
        const filtered = statusFilter === "all" 
          ? records 
          : statusFilter === "verified" 
            ? records.filter(r => r.anchored)
            : records.filter(r => !r.anchored);
        setRecentRecords(filtered.slice(0, 100));
        
        // Lấy tất cả records có txHash để hiển thị trong bảng Transaction
        const transactions = records.filter(r => r.txHash).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAllTransactions(transactions);
        
        setStats((prev) => ({
          ...prev,
          recentMaintenance: records.length,
          verified: records.filter(r => r.anchored).length,
          completed: records.length,
          inProgress: records.filter(r => !r.anchored).length,
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [statusFilter]);

  const getStatusInfo = (record) => {
    if (record.anchored) {
      return {
        color: "success",
        text: "✅ Đã hoàn thành & Xác thực Blockchain",
        icon: <CheckCircleOutlined />,
        description: "Bản bảo trì đã được ghi nhận và xác thực trên blockchain. Dữ liệu không thể thay đổi."
      };
    }
    return {
      color: "processing",
      text: "🔄 Đang bảo trì (Chưa xác thực)",
      icon: <ClockCircleOutlined />,
      description: "Bản bảo trì đã được ghi nhưng chưa xác thực trên blockchain. Cần hoàn tất quy trình để đảm bảo tính toàn vẹn dữ liệu."
    };
  };

  const vehicleColumns = [
    {
      title: "Biển số",
      dataIndex: "plates",
      key: "plates",
      render: (text) => (
        <a onClick={() => navigate(`/detail/${text}`)} style={{ fontWeight: 600 }}>
          {text}
        </a>
      ),
    },
    {
      title: "Chủ xe",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hãng",
      dataIndex: "brand",
      key: "brand",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: 180,
      render: (text) => (
        <Tooltip title={text} placement="topLeft">
          <span style={{ whiteSpace: "normal", wordBreak: "break-word" }}>{text || "N/A"}</span>
        </Tooltip>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            style={{ 
              backgroundColor: "#1890ff", 
              borderColor: "#1890ff",
              color: "#fff"
            }}
            icon={<EyeOutlined />}
            onClick={() => navigate(`/detail/${record.plates}`)}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  const recordColumns = [
    {
      title: "Ngày",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 60,
      render: (text) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: "11px" }}>{new Date(text).toLocaleDateString("vi-VN")}</div>
          <div style={{ fontSize: "10px", color: "#999" }}>{new Date(text).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</div>
        </div>
      ),
    },
    {
      title: "Biển số",
      dataIndex: "vehicleKey",
      key: "vehicleKey",
      width: 100,
    },
    {
      title: "Công việc",
      dataIndex: ["content", "job"],
      key: "job",
      width: 80,
      render: (text) => (
        <Tooltip title={text} placement="topLeft">
          <span style={{ whiteSpace: "normal", wordBreak: "break-word" }}>{text || "N/A"}</span>
        </Tooltip>
      ),
    },
    {
      title: "Garage",
      dataIndex: ["content", "garage"],
      key: "garage",
      width: 80,
      render: (text) => (
        <Tooltip title={text} placement="topLeft">
          <span style={{ whiteSpace: "normal", wordBreak: "break-word" }}>{text || "N/A"}</span>
        </Tooltip>
      ),
    },
    {
      title: "Odo (km)",
      dataIndex: ["content", "odo"],
      key: "odo",
      width: 80,
      render: (text) => text ? text.toLocaleString() : "N/A",
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 100,
      render: (_, record) => {
        const statusInfo = getStatusInfo(record);
        return (
          <Popover
            content={
              <div>
                <p style={{ margin: 0, marginBottom: 8 }}><strong>{statusInfo.text}</strong></p>
                <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>{statusInfo.description}</p>
                {record.txHash && (
                  <div style={{ marginTop: 12, padding: "12px", backgroundColor: "#e6f7ff", borderRadius: 6, border: "1px solid #91d5ff" }}>
                    <div style={{ fontSize: 10, fontWeight: 500, marginBottom: 8, color: "#666", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>Transaction Hash:</span>
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<CopyOutlined />} 
                        onClick={() => {
                          navigator.clipboard.writeText(record.txHash);
                          message.success("Đã sao chép transaction hash!");
                        }}
                        style={{ padding: "0 8px", height: "24px" }}
                      >
                        Copy
                      </Button>
                    </div>
                    <code style={{ fontSize: 14, fontFamily: "monospace", color: "#1890ff", fontWeight: 600, wordBreak: "break-all", display: "block" }}>{record.txHash}</code>
                  </div>
                )}
              </div>
            }
            title="Thông tin trạng thái"
          >
            <Tag 
              color={statusInfo.color === "success" ? "green" : "orange"} 
              icon={statusInfo.icon}
              style={{ cursor: "pointer", fontSize: "10px" }}
            >
              {statusInfo.color === "success" ? "Đã xác thực" : "Chưa xác thực"}
            </Tag>
          </Popover>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space>
          {!record.anchored && (
            <Button
              size="small"
              type="primary"
              style={{ 
                backgroundColor: "#52c41a", 
                borderColor: "#52c41a",
                color: "#fff",
                fontSize: "10px"
              }}
              icon={<CheckCircleFilled />}
              onClick={async () => {
                try {
                  setLoading(true);
                  const res = await RecordsService.acceptServiceRecord(record._id);
                  if (res?.status === "OK") {
                    message.success("Đã xác thực transaction thành công!");
                    fetchDashboardData();
                  } else {
                    message.error(res?.message || "Xác thực thất bại!");
                  }
                } catch (error) {
                  message.error("Có lỗi xảy ra khi xác thực!");
                  console.error(error);
                } finally {
                  setLoading(false);
                }
              }}
              loading={loading}
            >
              Xác thực
            </Button>
          )}
          <Button
            size="small"
            style={{ 
              backgroundColor: "#1890ff", 
              borderColor: "#1890ff",
              color: "#fff",
              fontSize: "10px"
            }}
            icon={<EyeOutlined />}
            onClick={() => navigate(`/detail/${record.vehicleKey}`)}
          >
            Xem
          </Button>
        </Space>
      ),
    },
  ];

  const guideContent = (
    <div style={{ maxWidth: 400 }}>
      <Alert
        message="Hướng dẫn sử dụng"
        description={
          <div>
            <p><strong>🔄 Đang bảo trì (Chưa xác thực):</strong></p>
            <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
              <li>Bản bảo trì đã được ghi vào hệ thống</li>
              <li>Chưa được xác thực trên blockchain</li>
              <li>Cần hoàn tất quy trình để đảm bảo tính toàn vẹn</li>
            </ul>
            <p><strong>✅ Đã hoàn thành & Xác thực:</strong></p>
            <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
              <li>Bản bảo trì đã được xác thực trên blockchain</li>
              <li>Dữ liệu không thể thay đổi (immutable)</li>
              <li>Có thể truy xuất nguồn gốc bất kỳ lúc nào</li>
            </ul>
            <p style={{ marginTop: 12, marginBottom: 0, fontSize: "12px", color: "#666" }}>
              <strong>Bước tiếp theo:</strong> Vào trang chi tiết xe để ghi bản bảo trì mới hoặc xem lịch sử đầy đủ.
            </p>
          </div>
        }
        type="info"
        showIcon
      />
    </div>
  );

  return (
    <Loading isLoading={loading}>
      <div style={{ paddingTop: "100px", minHeight: "100vh", background: "#f0f2f5" }}>
        <div className="container" style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px" }}>
          <Row justify="space-between" align="middle" style={{ marginBottom: "24px" }}>
            <Col>
              <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>
                🚛 Dashboard Quản Lý Xe & Bảo Trì
              </h1>
              <p style={{ color: "#666", marginTop: "8px", marginBottom: 0 }}>
                Hệ thống theo dõi sửa chữa, bảo hành bảo trì xe vận tải
              </p>
            </Col>
            <Col>
              <Space>
                <Popover content={guideContent} title="Hướng dẫn" trigger="click">
                  <Button 
                    style={{ 
                      backgroundColor: "#f0f0f0", 
                      borderColor: "#d9d9d9",
                      color: "#595959"
                    }}
                    icon={<QuestionCircleOutlined />}
                  >
                    Hướng dẫn nhanh
                  </Button>
                </Popover>
                <Button 
                  style={{ 
                    backgroundColor: "#1890ff", 
                    borderColor: "#1890ff",
                    color: "#fff"
                  }}
                  icon={<FileTextOutlined />} 
                  onClick={() => navigate("/documentation")}
                >
                  Xem tài liệu đầy đủ
                </Button>
                <Button 
                  style={{ 
                    backgroundColor: "#f0f0f0", 
                    borderColor: "#d9d9d9",
                    color: "#595959"
                  }}
                  icon={<ReloadOutlined />} 
                  onClick={fetchDashboardData}
                >
                  Làm mới
                </Button>
              </Space>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Tổng số xe"
                  value={stats.totalVehicles}
                  prefix={<CarOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Tổng bảo trì"
                  value={stats.recentMaintenance}
                  prefix={<ToolOutlined />}
                  valueStyle={{ color: "#722ed1" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Đã xác thực"
                  value={stats.verified}
                  prefix={<SafetyOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                  suffix={`/ ${stats.completed}`}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Đang xử lý"
                  value={stats.inProgress}
                  prefix={<SyncOutlined />}
                  valueStyle={{ color: "#faad14" }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <CarOutlined />
                    <span>Danh sách xe</span>
                    <Badge count={recentVehicles.length} showZero style={{ backgroundColor: "#1890ff" }} />
                  </Space>
                }
                extra={
                  <Space>
                    <Search
                      placeholder="Tìm xe..."
                      allowClear
                      style={{ width: 180 }}
                      onSearch={(value) => {
                        setSearchText(value);
                        if (value) {
                          const filtered = recentVehicles.filter(v => 
                            v.plates?.toLowerCase().includes(value.toLowerCase()) ||
                            v.name?.toLowerCase().includes(value.toLowerCase()) ||
                            v.brand?.toLowerCase().includes(value.toLowerCase())
                          );
                          setRecentVehicles(filtered);
                        } else {
                          fetchDashboardData();
                        }
                      }}
                    />
                    <Space>
                      <Button 
                        style={{ 
                          backgroundColor: "#52c41a", 
                          borderColor: "#52c41a",
                          color: "#fff"
                        }}
                        icon={<PlusOutlined />} 
                        onClick={() => setIsCreateVehicleModalOpen(true)}
                      >
                        Tạo xe mới
                      </Button>
                      <Button 
                        style={{ 
                          backgroundColor: "#1890ff", 
                          borderColor: "#1890ff",
                          color: "#fff"
                        }}
                        icon={<PlusOutlined />} 
                        onClick={() => navigate("/vehicles")}
                      >
                        Xem tất cả
                      </Button>
                    </Space>
                  </Space>
                }
              >
                <Table
                  columns={vehicleColumns}
                  dataSource={recentVehicles}
                  rowKey="_id"
                  pagination={{ pageSize: 5 }}
                  size="small"
                  scroll={{ x: "max-content" }}
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <FileTextOutlined />
                    <span>Lịch sử bảo trì</span>
                    <Badge count={recentRecords.length} showZero style={{ backgroundColor: "#52c41a" }} />
                  </Space>
                }
                extra={
                  <Select
                    value={statusFilter}
                    onChange={setStatusFilter}
                    style={{ width: 140 }}
                    size="small"
                  >
                    <Option value="all">Tất cả</Option>
                    <Option value="verified">Đã xác thực</Option>
                    <Option value="pending">Chưa xác thực</Option>
                  </Select>
                }
              >
                <Table
                  columns={recordColumns}
                  dataSource={recentRecords}
                  rowKey="_id"
                  pagination={false}
                  size="small"
                  scroll={{ x: "max-content", y: 400 }}
                />
              </Card>
            </Col>
          </Row>

          {/* Bảng Transaction mới */}
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Card
                title={
                  <Space>
                    <FundOutlined />
                    <span>Quản Lý Transactions</span>
                    <Badge count={allTransactions.length} showZero style={{ backgroundColor: "#722ed1" }} />
                  </Space>
                }
                extra={
                  <Button 
                    style={{ 
                      backgroundColor: "#f0f0f0", 
                      borderColor: "#d9d9d9",
                      color: "#595959"
                    }}
                    icon={<ReloadOutlined />} 
                    onClick={fetchDashboardData}
                  >
                    Làm mới
                  </Button>
                }
              >
                <Table
                  columns={[
                    {
                      title: "Ngày",
                      dataIndex: "createdAt",
                      key: "createdAt",
                      width: 120,
                      render: (text) => (
                        <div>
                          <div style={{ fontWeight: 600 }}>{new Date(text).toLocaleDateString("vi-VN")}</div>
                          <div style={{ fontSize: "11px", color: "#999" }}>
                            {new Date(text).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Biển số",
                      dataIndex: "vehicleKey",
                      key: "vehicleKey",
                      width: 120,
                    },
                    {
                      title: "Công việc",
                      dataIndex: ["content", "job"],
                      key: "job",
                      width: 180,
                      render: (text) => (
                        <Tooltip title={text} placement="topLeft">
                          <span style={{ whiteSpace: "normal", wordBreak: "break-word" }}>{text || "N/A"}</span>
                        </Tooltip>
                      ),
                    },
                    {
                      title: "Transaction Hash",
                      dataIndex: "txHash",
                      key: "txHash",
                      width: 300,
                      render: (text, record, index) => {
                        // Chỉ hiển thị đầy đủ cho 2 item đầu (index 0 và 1)
                        const showFull = index < 2;
                        const displayText = showFull ? text : (text ? `${text.slice(0, 10)}...${text.slice(-8)}` : "N/A");
                        
                        return (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <Tooltip title={text} placement="topLeft">
                              <code style={{ 
                                fontSize: showFull ? "11px" : "11px", 
                                fontFamily: "monospace", 
                                color: "#1890ff",
                                fontWeight: 600,
                                backgroundColor: "#e6f7ff",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                maxWidth: showFull ? "500px" : "250px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                wordBreak: showFull ? "break-all" : "normal"
                              }}>
                                {displayText}
                              </code>
                            </Tooltip>
                          </div>
                        );
                      },
                    },
                    {
                      title: "Trạng thái",
                      key: "status",
                      width: 120,
                      render: (_, record) => (
                        <Tag 
                          color={record.anchored ? "green" : "orange"} 
                          icon={record.anchored ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                        >
                          {record.anchored ? "Đã xác thực" : "Chưa xác thực"}
                        </Tag>
                      ),
                    },
                    {
                      title: "Hành động",
                      key: "action",
                      width: 150,
                      render: (_, record) => (
                        <Space>
                          <Button
                            size="small"
                            style={{ 
                              backgroundColor: "#722ed1", 
                              borderColor: "#722ed1",
                              color: "#fff"
                            }}
                            icon={<LinkOutlined />}
                            onClick={() => {
                              window.open(`https://sepolia.etherscan.io/tx/${record.txHash}`, '_blank');
                            }}
                          >
                            Etherscan
                          </Button>
                          <Button
                            size="small"
                            style={{ 
                              backgroundColor: "#f0f0f0", 
                              borderColor: "#d9d9d9",
                              color: "#595959"
                            }}
                            icon={<CopyOutlined />}
                            onClick={() => {
                              navigator.clipboard.writeText(record.txHash);
                              message.success("Đã sao chép transaction hash!");
                            }}
                          >
                            Copy
                          </Button>
                          <Button
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => {
                              setSelectedRecordId(record._id);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            Xóa
                          </Button>
                        </Space>
                      ),
                    },
                  ]}
                  dataSource={allTransactions}
                  rowKey="_id"
                  pagination={{ pageSize: 10 }}
                  size="small"
                  scroll={{ x: "max-content" }}
                />
              </Card>
            </Col>
          </Row>
        </div>
        <Footer />

        {/* Modal Tạo xe mới */}
        <Modal
          title={
            <Space>
              <CarOutlined />
              <span>Tạo Xe Mới</span>
            </Space>
          }
          open={isCreateVehicleModalOpen}
          onCancel={() => {
            setIsCreateVehicleModalOpen(false);
            form.resetFields();
          }}
          footer={null}
          width={700}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={async (values) => {
              try {
                setLoading(true);
                // Map owner về name nếu API yêu cầu
                const vehicleData = {
                  ...values,
                  name: values.name || values.owner || "",
                  image: [],
                };
                const res = await VehicleServices.createVehicle(vehicleData);
                if (res?.status === "OK") {
                  message.success("Tạo xe thành công!");
                  setIsCreateVehicleModalOpen(false);
                  form.resetFields();
                  fetchDashboardData();
                } else {
                  message.error(res?.message || "Tạo xe thất bại!");
                }
              } catch (error) {
                message.error("Có lỗi xảy ra!");
                console.error(error);
              } finally {
                setLoading(false);
              }
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Biển số xe"
                  name="plates"
                  rules={[{ required: true, message: "Vui lòng nhập biển số!" }]}
                >
                  <Input placeholder="VD: 30A-123.45" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Tên xe / Model"
                  name="name"
                  rules={[{ required: true, message: "Vui lòng nhập tên xe!" }]}
                >
                  <Input placeholder="VD: Honda Civic" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Hãng xe"
                  name="brand"
                  rules={[{ required: true, message: "Vui lòng nhập hãng xe!" }]}
                >
                  <Input placeholder="VD: Honda, Toyota, Ford..." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Loại xe"
                  name="type"
                  rules={[{ required: true, message: "Vui lòng nhập loại xe!" }]}
                >
                  <Input placeholder="VD: Sedan, SUV, Van..." />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Chủ xe"
                  name="owner"
                >
                  <Input placeholder="Tên chủ xe" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Địa chỉ"
                  name="address"
                >
                  <Input placeholder="VD: Hanoi, Vietnam" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Nhiên liệu"
                  name="fuel"
                >
                  <Input placeholder="VD: Xăng, Dầu..." />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Hộp số"
                  name="gear"
                >
                  <Input placeholder="VD: Số sàn, Tự động" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Màu sắc"
                  name="color"
                >
                  <Input placeholder="VD: Đỏ, Trắng..." />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label="Mô tả"
              name="description"
            >
              <Input.TextArea rows={3} placeholder="Thông tin thêm về xe..." />
            </Form.Item>
            <Form.Item>
              <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                <Button onClick={() => {
                  setIsCreateVehicleModalOpen(false);
                  form.resetFields();
                }}>
                  Hủy
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  style={{ 
                    backgroundColor: "#52c41a", 
                    borderColor: "#52c41a"
                  }}
                  loading={loading}
                >
                  Tạo xe
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal Xóa Transaction */}
        <Modal
          title="Xác nhận xóa"
          open={isDeleteModalOpen}
          onOk={async () => {
            try {
              setLoading(true);
              const res = await RecordsService.deleteServiceRecord(selectedRecordId);
              if (res?.status === "OK") {
                message.success("Đã xóa transaction thành công!");
                setIsDeleteModalOpen(false);
                setSelectedRecordId(null);
                fetchDashboardData();
              } else {
                message.error(res?.message || "Xóa thất bại!");
              }
            } catch (error) {
              message.error("Có lỗi xảy ra khi xóa!");
              console.error(error);
            } finally {
              setLoading(false);
            }
          }}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setSelectedRecordId(null);
          }}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <p>Bạn có chắc chắn muốn xóa transaction này? Hành động này không thể hoàn tác.</p>
        </Modal>
      </div>
    </Loading>
  );
};

export default Home;
