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
  Popover
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
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const vehiclesRes = await VehicleServices.getAllVehicle("", 100);
      if (vehiclesRes?.status === "OK") {
        const vehicles = vehiclesRes.data || [];
        setStats((prev) => ({ ...prev, totalVehicles: vehiclesRes.total || vehicles.length }));
        setRecentVehicles(vehicles.slice(0, 10));
      }
      const allRecords = await RecordsService.listServiceRecords();
      if (allRecords?.status === "OK") {
        const records = allRecords.data || [];
        const filtered = statusFilter === "all" 
          ? records 
          : statusFilter === "verified" 
            ? records.filter(r => r.anchored)
            : records.filter(r => !r.anchored);
        setRecentRecords(filtered.slice(0, 10));
        
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
      ellipsis: true,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/detail/${record.plates}`)}
          >
            Xem chi tiết
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
      width: 100,
      render: (text) => (
        <div>
          <div style={{ fontWeight: 600 }}>{new Date(text).toLocaleDateString("vi-VN")}</div>
          <div style={{ fontSize: "11px", color: "#999" }}>{new Date(text).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</div>
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
      ellipsis: true,
    },
    {
      title: "Garage",
      dataIndex: ["content", "garage"],
      key: "garage",
      width: 120,
    },
    {
      title: "Odo (km)",
      dataIndex: ["content", "odo"],
      key: "odo",
      width: 100,
      render: (text) => text ? text.toLocaleString() : "N/A",
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 200,
      render: (_, record) => {
        const statusInfo = getStatusInfo(record);
        return (
          <Popover
            content={
              <div>
                <p style={{ margin: 0, marginBottom: 8 }}><strong>{statusInfo.text}</strong></p>
                <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>{statusInfo.description}</p>
                {record.txHash && (
                  <div style={{ marginTop: 8, fontSize: "11px", fontFamily: "monospace", wordBreak: "break-all" }}>
                    TX: {record.txHash.slice(0, 20)}...
                  </div>
                )}
              </div>
            }
            title="Thông tin trạng thái"
          >
            <Tag 
              color={statusInfo.color === "success" ? "green" : "orange"} 
              icon={statusInfo.icon}
              style={{ cursor: "pointer" }}
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
      width: 100,
      render: (_, record) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/detail/${record.vehicleKey}`)}
        >
          Xem
        </Button>
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
                  <Button icon={<QuestionCircleOutlined />}>Hướng dẫn</Button>
                </Popover>
                <Button icon={<ReloadOutlined />} onClick={fetchDashboardData}>
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

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
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
                      style={{ width: 200 }}
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
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/vehicles")}>
                      Xem tất cả
                    </Button>
                  </Space>
                }
              >
                <Table
                  columns={vehicleColumns}
                  dataSource={recentVehicles}
                  rowKey="_id"
                  pagination={{ pageSize: 5 }}
                  size="small"
                />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
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
                  scroll={{ y: 400 }}
                />
              </Card>
            </Col>
          </Row>
        </div>
        <Footer />
      </div>
    </Loading>
  );
};

export default Home;
