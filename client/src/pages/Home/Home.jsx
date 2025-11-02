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
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import * as VehicleServices from "../../services/VehicleService.js";
import * as RecordsService from "../../services/RecordsService.js";
import * as UserService from "../../services/UserService.js";
import Loading from "../../components/LoadingComponent/Loading.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { useSelector } from "react-redux";
import "./Home.css";

const { Search } = Input;
const { Option } = Select;

const Home = (props) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    recentMaintenance: 0,
    pendingWarranty: 0,
    inProgress: 0,
    completed: 0,
    verified: 0,
    pendingMaintenance: 0,
    totalUsers: 0,
  });
  const [recentVehicles, setRecentVehicles] = useState([]);
  const [recentRecords, setRecentRecords] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [pendingMaintenanceRegs, setPendingMaintenanceRegs] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateVehicleModalOpen, setIsCreateVehicleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [selectedRecordForApprove, setSelectedRecordForApprove] = useState(null);
  const [form] = Form.useForm();
  const [approveForm] = Form.useForm();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const accessToken = token ? JSON.parse(token) : null;

      // Lấy vehicles
      const vehiclesRes = await VehicleServices.getAllVehicle("", 100);
      if (vehiclesRes?.status === "OK") {
        const vehicles = vehiclesRes.data || [];
        setStats((prev) => ({ ...prev, totalVehicles: vehiclesRes.total || vehicles.length }));
        setRecentVehicles(vehicles.slice(0, 100));
      }

      // Lấy service records
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

      // Lấy pending service records (thay thế maintenance registrations)
      if (accessToken) {
        try {
          const pendingRes = await RecordsService.getPendingServiceRecords();
          if (pendingRes?.status === "OK") {
            setPendingMaintenanceRegs(pendingRes.data || []);
            setStats((prev) => ({ ...prev, pendingMaintenance: pendingRes.data?.length || 0 }));
          }
        } catch (error) {
          console.error("Error fetching pending service records:", error);
        }

        // Lấy danh sách users
        try {
          const usersRes = await UserService.getAllUser(accessToken);
          if (usersRes?.status === "OK") {
            setAllUsers(usersRes.data || []);
            setStats((prev) => ({ ...prev, totalUsers: usersRes.data?.length || 0 }));
          }
        } catch (error) {
          console.error("Error fetching users:", error);
        }
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
          {/* Chỉ hiển thị nút "Xác thực" khi record đã được approve nhưng chưa anchored */}
          {!record.anchored && record.status !== "pending" && (
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
            {user?.isAdmin && (
              <>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Lệnh chờ duyệt"
                      value={stats.pendingMaintenance}
                      prefix={<ClockCircleOutlined />}
                      valueStyle={{ color: "#ff4d4f" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Tổng User"
                      value={stats.totalUsers}
                      prefix={<TeamOutlined />}
                      valueStyle={{ color: "#1890ff" }}
                    />
                  </Card>
                </Col>
              </>
            )}
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

          {/* Admin sections: Pending Maintenance & User Management */}
          {user?.isAdmin && (
            <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
              {/* Pending Maintenance Registrations */}
              <Col xs={24} lg={12}>
                <Card
                  title={
                    <Space>
                      <ClockCircleOutlined />
                      <span>Lệnh bảo trì chờ duyệt</span>
                      <Badge count={pendingMaintenanceRegs.length} showZero style={{ backgroundColor: "#ff4d4f" }} />
                    </Space>
                  }
                  extra={
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={fetchDashboardData}
                      size="small"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "0.9";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "1";
                      }}
                    >
                      Làm mới
                    </Button>
                  }
                >
                  <Table
                    columns={[
                      {
                        title: "Biển số",
                        dataIndex: ["vehicle", "plates"],
                        key: "plates",
                      },
                      {
                        title: "Người yêu cầu",
                        dataIndex: ["user", "name"],
                        key: "userName",
                        render: (name, record) => (
                          <div>
                            <div>{name || record.user?.email}</div>
                            <div style={{ fontSize: "11px", color: "#999" }}>
                              {record.user?.phone}
                            </div>
                          </div>
                        ),
                      },
                      {
                        title: "Loại bảo trì",
                        dataIndex: ["content", "maintenanceType"],
                        key: "maintenanceType",
                        render: (type) => {
                          const typeMap = {
                            routine: "Bảo dưỡng định kỳ",
                            repair: "Sửa chữa",
                            inspection: "Kiểm tra",
                            emergency: "Bảo trì khẩn cấp",
                          };
                          return typeMap[type] || type;
                        },
                      },
                      {
                        title: "Ngày",
                        dataIndex: "createdAt",
                        key: "createdAt",
                        render: (date) => date ? new Date(date).toLocaleDateString("vi-VN") : "",
                      },
                      {
                        title: "Hành động",
                        key: "action",
                        render: (_, record) => (
                          <Space>
                            <Button
                              size="small"
                              type="primary"
                              icon={<CheckCircleOutlined />}
                              onClick={() => {
                                setSelectedRecordForApprove(record);
                                approveForm.setFieldsValue({
                                  garage: record.content?.garage || "",
                                });
                                setIsApproveModalOpen(true);
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = "0.9";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = "1";
                              }}
                            >
                              Duyệt
                            </Button>
                            <Button
                              size="small"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={async () => {
                                try {
                                  setLoading(true);
                                  await RecordsService.rejectServiceRecord(record._id);
                                  message.success("Đã từ chối lệnh bảo trì!");
                                  fetchDashboardData();
                                } catch (error) {
                                  message.error("Lỗi khi từ chối lệnh bảo trì");
                                  console.error(error);
                                } finally {
                                  setLoading(false);
                                }
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = "0.9";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = "1";
                              }}
                            >
                              Từ chối
                            </Button>
                          </Space>
                        ),
                      },
                    ]}
                    dataSource={pendingMaintenanceRegs}
                    rowKey="_id"
                    pagination={{ pageSize: 5 }}
                    size="small"
                  />
                </Card>
              </Col>

              {/* User Management */}
              <Col xs={24} lg={12}>
                <Card
                  title={
                    <Space>
                      <TeamOutlined />
                      <span>Quản lý User</span>
                      <Badge count={allUsers.length} showZero style={{ backgroundColor: "#1890ff" }} />
                    </Space>
                  }
                  extra={
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={fetchDashboardData}
                      size="small"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "0.9";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "1";
                      }}
                    >
                      Làm mới
                    </Button>
                  }
                >
                  <Table
                    columns={[
                      {
                        title: "Tên",
                        dataIndex: "name",
                        key: "name",
                        render: (name, record) => name || record.email || "N/A",
                      },
                      {
                        title: "Email",
                        dataIndex: "email",
                        key: "email",
                      },
                      {
                        title: "Số điện thoại",
                        dataIndex: "phone",
                        key: "phone",
                        render: (phone) => phone || "N/A",
                      },
                      {
                        title: "Vai trò",
                        dataIndex: "isAdmin",
                        key: "isAdmin",
                        render: (isAdmin) => (
                          <Tag color={isAdmin ? "red" : "blue"}>
                            {isAdmin ? "Admin" : "User"}
                          </Tag>
                        ),
                      },
                      {
                        title: "Ngày đăng ký",
                        dataIndex: "createdAt",
                        key: "createdAt",
                        render: (date) => date ? new Date(date).toLocaleDateString("vi-VN") : "",
                      },
                    ]}
                    dataSource={allUsers}
                    rowKey="_id"
                    pagination={{ pageSize: 5 }}
                    size="small"
                  />
                </Card>
              </Col>
            </Row>
          )}

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
                        const displayText = showFull ? text : (text ? `${text}` : "N/A");
                        
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
                
                // Tạo các giá trị mặc định cho các trường bắt buộc
                const timestamp = Date.now();
                const randomSuffix = String(timestamp).slice(-6);
                const plateClean = values.plates?.replace(/[^0-9A-Z]/g, "") || "PLATE";
                
                const vehicleData = {
                  // Trường user nhập
                  name: values.owner || values.name || `Owner ${randomSuffix}`,
                  plates: values.plates,
                  brand: values.brand,
                  type: values.type,
                  address: values.address || "Hà Nội, Việt Nam",
                  
                  // Các trường bắt buộc - tự động generate (unique)
                  image: [`https://picsum.photos/id/${200 + (timestamp % 50)}/800/600`], // Có ít nhất 1 ảnh
                  identifynumber: `VIN-${plateClean}-${randomSuffix}`, // Unique
                  dated: new Date(), // Date object
                  email: `vehicle${timestamp}@transport.vn`, // Unique email
                  phone: `09${randomSuffix.padStart(8, '0')}`, // Phone số (backend sẽ convert)
                  bill: `HD-${new Date().getFullYear()}-${randomSuffix}`,
                  tax: `TAX-${new Date().getFullYear()}-${randomSuffix}`,
                  seri: `SERI-${plateClean}-${randomSuffix}`,
                  license: `LIC-${plateClean}-${randomSuffix}`,
                  engine: `ENG-${randomSuffix}`,
                  frame: `FRM-${randomSuffix}`,
                  
                  // Các trường bắt buộc - có giá trị mặc định
                  fuel: values.fuel || "Dầu Diesel",
                  gear: values.gear || "Số Sàn",
                  color: values.color || "Trắng",
                  rolling: values.rolling || "Cầu Sau",
                  description: values.description || "Xe vận tải mới được thêm vào hệ thống",
                };
                
                const res = await VehicleServices.createVehicle(vehicleData);
                if (res?.status === "OK") {
                  message.success("Tạo xe thành công!");
                  setIsCreateVehicleModalOpen(false);
                  form.resetFields();
                  fetchDashboardData();
                } else {
                  message.error(res?.message || res?.errors || "Tạo xe thất bại!");
                }
              } catch (error) {
                console.error("Error creating vehicle:", error);
                message.error(error?.response?.data?.message || error?.message || "Có lỗi xảy ra khi tạo xe!");
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
                  <Select placeholder="Chọn nhiên liệu" allowClear>
                    <Select.Option value="Dầu Diesel">Dầu Diesel</Select.Option>
                    <Select.Option value="Xăng">Xăng</Select.Option>
                    <Select.Option value="Gas">Gas</Select.Option>
                    <Select.Option value="Hybrid">Hybrid</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Hộp số"
                  name="gear"
                >
                  <Select placeholder="Chọn hộp số" allowClear>
                    <Select.Option value="Số Sàn">Số Sàn</Select.Option>
                    <Select.Option value="Số Tự Động">Số Tự Động</Select.Option>
                    <Select.Option value="Số Tự Động 8 Cấp">Số Tự Động 8 Cấp</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Màu sắc"
                  name="color"
                >
                  <Select placeholder="Chọn màu" allowClear>
                    <Select.Option value="Trắng">Trắng</Select.Option>
                    <Select.Option value="Đỏ">Đỏ</Select.Option>
                    <Select.Option value="Xanh Dương">Xanh Dương</Select.Option>
                    <Select.Option value="Vàng Cam">Vàng Cam</Select.Option>
                    <Select.Option value="Xám">Xám</Select.Option>
                    <Select.Option value="Đen">Đen</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Dẫn động"
                  name="rolling"
                >
                  <Select placeholder="Chọn loại dẫn động" allowClear>
                    <Select.Option value="Cầu Sau">Cầu Sau</Select.Option>
                    <Select.Option value="4 Bánh">4 Bánh</Select.Option>
                    <Select.Option value="6 Bánh">6 Bánh</Select.Option>
                    <Select.Option value="8 Bánh">8 Bánh</Select.Option>
                    <Select.Option value="10 Bánh">10 Bánh</Select.Option>
                  </Select>
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

        {/* Modal chọn Garage khi duyệt */}
        <Modal
          title={
            <Space>
              <CheckCircleOutlined />
              <span>Duyệt lệnh bảo trì</span>
            </Space>
          }
          open={isApproveModalOpen}
          onCancel={() => {
            setIsApproveModalOpen(false);
            setSelectedRecordForApprove(null);
            approveForm.resetFields();
          }}
          footer={null}
          width={600}
        >
          {selectedRecordForApprove && (
            <div style={{ marginBottom: "16px" }}>
              <p><strong>Biển số:</strong> {selectedRecordForApprove.vehicle?.plates || selectedRecordForApprove.vehicleKey}</p>
              <p><strong>Người yêu cầu:</strong> {selectedRecordForApprove.user?.name || selectedRecordForApprove.user?.email}</p>
              <p><strong>Loại bảo trì:</strong> {
                selectedRecordForApprove.content?.maintenanceType === "routine" ? "Bảo dưỡng định kỳ" :
                selectedRecordForApprove.content?.maintenanceType === "repair" ? "Sửa chữa" :
                selectedRecordForApprove.content?.maintenanceType === "inspection" ? "Kiểm tra" :
                selectedRecordForApprove.content?.maintenanceType === "emergency" ? "Bảo trì khẩn cấp" :
                selectedRecordForApprove.content?.maintenanceType
              }</p>
              {selectedRecordForApprove.content?.description && (
                <p><strong>Mô tả:</strong> {selectedRecordForApprove.content.description}</p>
              )}
              {selectedRecordForApprove.content?.odo && (
                <p><strong>Odometer:</strong> {selectedRecordForApprove.content.odo.toLocaleString()} km</p>
              )}
            </div>
          )}
          <Form
            form={approveForm}
            layout="vertical"
            onFinish={async (values) => {
              try {
                setLoading(true);
                await RecordsService.approveServiceRecord(selectedRecordForApprove._id, values.garage);
                message.success("Đã duyệt lệnh bảo trì!");
                setIsApproveModalOpen(false);
                setSelectedRecordForApprove(null);
                approveForm.resetFields();
                fetchDashboardData();
              } catch (error) {
                message.error("Lỗi khi duyệt lệnh bảo trì");
                console.error(error);
              } finally {
                setLoading(false);
              }
            }}
          >
            <Form.Item
              name="garage"
              label="Chọn Garage"
              rules={[{ required: true, message: "Vui lòng chọn hoặc nhập tên Garage" }]}
            >
              <Select
                placeholder="Chọn Garage hoặc nhập tên mới"
                mode="tags"
                style={{ width: "100%" }}
                tokenSeparators={[","]}
                options={[
                  { value: "Garage Container Hải An", label: "Garage Container Hải An" },
                  { value: "Garage Trung tâm", label: "Garage Trung tâm" },
                  { value: "Garage Miền Bắc", label: "Garage Miền Bắc" },
                  { value: "Garage Miền Nam", label: "Garage Miền Nam" },
                  { value: "Garage Đại lý chính hãng", label: "Garage Đại lý chính hãng" },
                ]}
              />
            </Form.Item>
            <Form.Item>
              <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                <Button onClick={() => {
                  setIsApproveModalOpen(false);
                  setSelectedRecordForApprove(null);
                  approveForm.resetFields();
                }}>
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{
                    backgroundColor: "#52c41a",
                    borderColor: "#52c41a"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  Xác nhận duyệt
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Loading>
  );
};

export default Home;
