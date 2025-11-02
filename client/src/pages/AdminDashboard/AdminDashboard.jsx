import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import { useSelector } from "react-redux";
import {
  Card,
  Table,
  Button,
  Tag,
  Modal,
  Descriptions,
  message,
  Space,
  Badge,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  ReloadOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import * as MaintenanceService from "../../services/MaintenanceService";
import * as VehicleService from "../../services/VehicleService";
import * as RecordsService from "../../services/RecordsService";
import Loading from "../../components/LoadingComponent/Loading";
import { Tabs } from "antd";
import { FundOutlined, HistoryOutlined, CopyOutlined, LinkOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

const AdminDashboard = () => {
  const user = useSelector((state) => state.user);
  const [pendingRegs, setPendingRegs] = useState([]);
  const [allRegs, setAllRegs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedReg, setSelectedReg] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [allMaintenanceRegs, setAllMaintenanceRegs] = useState([]);
  const [serviceRecords, setServiceRecords] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchPendingRegistrations();
    fetchAllVehicles();
    fetchAllMaintenanceRegistrations();
    fetchAllServiceRecords();
  }, []);

  const fetchPendingRegistrations = async () => {
    setLoading(true);
    try {
      const res = await MaintenanceService.getPendingMaintenanceRegistrations();
      setPendingRegs(res?.data || []);
    } catch (error) {
      message.error("Lỗi khi tải danh sách đăng ký bảo trì");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllVehicles = async () => {
    try {
      // Admin xem được tất cả vehicles
      const token = localStorage.getItem("access_token");
      const accessToken = token ? JSON.parse(token) : user?.access_token;
      
      if (accessToken) {
        const res = await VehicleService.getUserVehicles(accessToken);
        if (res?.status === "OK") {
          setVehicles(res.data || []);
        }
      } else {
        // Fallback: lấy tất cả nếu không có token
        const res = await VehicleService.getAllVehicle();
        setVehicles(res?.data || []);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const fetchAllMaintenanceRegistrations = async () => {
    try {
      // Lấy tất cả maintenance registrations (không chỉ pending)
      const res = await MaintenanceService.getPendingMaintenanceRegistrations();
      setAllMaintenanceRegs(res?.data || []);
    } catch (error) {
      console.error("Error fetching maintenance registrations:", error);
    }
  };

  const fetchAllServiceRecords = async () => {
    try {
      const res = await RecordsService.listServiceRecords();
      if (res?.status === "OK") {
        const allRecords = res.data || [];
        setServiceRecords(allRecords);
        // Lọc ra các records có txHash (transactions)
        const txRecords = allRecords.filter(r => r.txHash);
        setTransactions(txRecords);
      }
    } catch (error) {
      console.error("Error fetching service records:", error);
    }
  };

  const handleApprove = async (id) => {
    setLoading(true);
    try {
      await MaintenanceService.approveMaintenanceRegistration(id);
      message.success("Đã duyệt lệnh đăng ký bảo trì!");
      fetchPendingRegistrations();
      setDetailModalVisible(false);
    } catch (error) {
      message.error("Lỗi khi duyệt lệnh đăng ký bảo trì");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    setLoading(true);
    try {
      await MaintenanceService.rejectMaintenanceRegistration(id);
      message.success("Đã từ chối lệnh đăng ký bảo trì!");
      fetchPendingRegistrations();
      setDetailModalVisible(false);
    } catch (error) {
      message.error("Lỗi khi từ chối lệnh đăng ký bảo trì");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const res = await MaintenanceService.getMaintenanceRegistrationDetails(id);
      setSelectedReg(res?.data);
      setDetailModalVisible(true);
    } catch (error) {
      message.error("Lỗi khi tải chi tiết");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "green";
      case "rejected":
        return "red";
      case "pending":
        return "orange";
      default:
        return "gray";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Đã duyệt";
      case "rejected":
        return "Đã từ chối";
      case "pending":
        return "Chờ duyệt";
      default:
        return "Không xác định";
    }
  };

  const pendingColumns = [
    {
      title: "Biển số xe",
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
          <div style={{ fontSize: "12px", color: "#999" }}>
            {record.user?.phone}
          </div>
        </div>
      ),
    },
    {
      title: "Loại bảo trì",
      dataIndex: ["content", "maintenanceType"],
      key: "maintenanceType",
    },
    {
      title: "Mô tả",
      dataIndex: ["content", "description"],
      key: "description",
      ellipsis: true,
    },
    {
      title: "Ngày yêu cầu",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? new Date(date).toLocaleDateString("vi-VN") : ""),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record._id)}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>
          <DashboardOutlined /> Dashboard Quản Trị
        </h1>
      </div>

      <Tabs defaultActiveKey="pending" size="large">
        <TabPane
          tab={
            <span>
              Lệnh chờ duyệt{" "}
              <Badge count={pendingRegs.length} style={{ backgroundColor: "#ff4d4f" }} />
            </span>
          }
          key="pending"
        >
          <Card
            extra={
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchPendingRegistrations}
              >
                Làm mới
              </Button>
            }
          >
            <Loading isLoading={loading}>
              <Table
                dataSource={pendingRegs}
                columns={pendingColumns}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
              />
            </Loading>
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <HistoryOutlined /> Lịch sử bảo trì
            </span>
          }
          key="maintenance"
        >
          <Card
            title="Tất cả lịch sử bảo trì"
            extra={
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchAllServiceRecords}
              >
                Làm mới
              </Button>
            }
          >
            <Table
              dataSource={serviceRecords}
              columns={[
                {
                  title: "Ngày",
                  dataIndex: "createdAt",
                  key: "createdAt",
                  render: (date) => date ? new Date(date).toLocaleString("vi-VN") : "",
                },
                {
                  title: "Biển số",
                  dataIndex: "vehicleKey",
                  key: "vehicleKey",
                },
                {
                  title: "Công việc",
                  dataIndex: ["content", "job"],
                  key: "job",
                },
                {
                  title: "Garage",
                  dataIndex: ["content", "garage"],
                  key: "garage",
                },
                {
                  title: "Trạng thái",
                  key: "status",
                  render: (_, record) => (
                    <Tag color={record.anchored ? "green" : "orange"}>
                      {record.anchored ? "✅ Đã xác thực" : "🔄 Chưa xác thực"}
                    </Tag>
                  ),
                },
              ]}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <FundOutlined /> Transactions
            </span>
          }
          key="transactions"
        >
          <Card
            title="Lịch sử Transactions"
            extra={
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchAllServiceRecords}
              >
                Làm mới
              </Button>
            }
          >
            <Table
              dataSource={transactions}
              columns={[
                {
                  title: "Ngày",
                  dataIndex: "createdAt",
                  key: "createdAt",
                  render: (date) => (
                    <div>
                      <div>{date ? new Date(date).toLocaleDateString("vi-VN") : ""}</div>
                      <div style={{ fontSize: "11px", color: "#999" }}>
                        {date ? new Date(date).toLocaleTimeString("vi-VN") : ""}
                      </div>
                    </div>
                  ),
                },
                {
                  title: "Biển số",
                  dataIndex: "vehicleKey",
                  key: "vehicleKey",
                },
                {
                  title: "Công việc",
                  dataIndex: ["content", "job"],
                  key: "job",
                },
                {
                  title: "Transaction Hash",
                  dataIndex: "txHash",
                  key: "txHash",
                  render: (text) => (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <code style={{ 
                        fontSize: "11px", 
                        fontFamily: "monospace", 
                        color: "#1890ff",
                        backgroundColor: "#e6f7ff",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}>
                        {text ? `${text.slice(0, 20)}...` : "N/A"}
                      </code>
                      {text && (
                        <>
                          <Button
                            type="link"
                            size="small"
                            icon={<LinkOutlined />}
                            onClick={() => {
                              window.open(`https://sepolia.etherscan.io/tx/${text}`, '_blank');
                            }}
                          >
                            Etherscan
                          </Button>
                          <Button
                            type="link"
                            size="small"
                            icon={<CopyOutlined />}
                            onClick={() => {
                              navigator.clipboard.writeText(text);
                              message.success("Đã sao chép transaction hash!");
                            }}
                          >
                            Copy
                          </Button>
                        </>
                      )}
                    </div>
                  ),
                },
                {
                  title: "Block Number",
                  dataIndex: "blockNumber",
                  key: "blockNumber",
                  render: (num) => num ? num.toString() : "N/A",
                },
                {
                  title: "Trạng thái",
                  key: "status",
                  render: (_, record) => (
                    <Tag color={record.anchored ? "green" : "orange"}>
                      {record.anchored ? "✅ Đã xác thực" : "🔄 Chưa xác thực"}
                    </Tag>
                  ),
                },
              ]}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Modal chi tiết */}
      <Modal
        title="Chi tiết lệnh đăng ký bảo trì"
        visible={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedReg(null);
        }}
        footer={
          selectedReg?.status === "pending" ? (
            <Space>
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleReject(selectedReg._id)}
                loading={loading}
              >
                Từ chối
              </Button>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleApprove(selectedReg._id)}
                loading={loading}
              >
                Duyệt
              </Button>
            </Space>
          ) : null
        }
        width={800}
      >
        {selectedReg && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Trạng thái">
              <Tag color={getStatusColor(selectedReg.status)}>
                {getStatusText(selectedReg.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Biển số xe">
              {selectedReg.vehicle?.plates}
            </Descriptions.Item>
            <Descriptions.Item label="Tên xe">
              {selectedReg.vehicle?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Người yêu cầu">
              {selectedReg.user?.name || selectedReg.user?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {selectedReg.user?.phone || "Chưa cập nhật"}
            </Descriptions.Item>
            <Descriptions.Item label="Loại bảo trì">
              {selectedReg.content?.maintenanceType || "Chưa xác định"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày dự kiến">
              {selectedReg.content?.expectedDate || "Chưa có"}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả">
              {selectedReg.content?.description || "Không có mô tả"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {selectedReg.createdAt
                ? new Date(selectedReg.createdAt).toLocaleString("vi-VN")
                : ""}
            </Descriptions.Item>
            {selectedReg.approver && (
              <Descriptions.Item label="Người duyệt">
                {selectedReg.approver?.name || selectedReg.approver?.email}
              </Descriptions.Item>
            )}
            {selectedReg.txHash && (
              <Descriptions.Item label="Transaction Hash">
                <a
                  href={`https://sepolia.etherscan.io/tx/${selectedReg.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selectedReg.txHash.slice(0, 20)}...
                </a>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;

