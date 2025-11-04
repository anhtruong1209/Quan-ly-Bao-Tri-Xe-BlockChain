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
  Popover,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  ReloadOutlined,
  DashboardOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Typography } from "antd";

const { Text } = Typography;
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
  // Không cần form price nữa vì admin chỉ cần duyệt

  // Hàm tính giá dựa vào loại bảo trì (0.001 - 0.004 Sepolia ETH)
  const getPriceByMaintenanceType = (maintenanceType) => {
    if (!maintenanceType) {
      // Nếu không có loại, random trong khoảng 0.001 - 0.004
      const min = 0.001;
      const max = 0.004;
      const randomPrice = (Math.random() * (max - min) + min).toFixed(3);
      return randomPrice;
    }

    const typeMap = {
      // Bảo dưỡng định kỳ - giá thấp
      "routine": "0.001",
      "bảo dưỡng định kỳ": "0.001",
      "bảo dưỡng": "0.001",
      
      // Kiểm tra - giá trung bình thấp
      "inspection": "0.002",
      "kiểm tra": "0.002",
      "kiểm tra định kỳ": "0.002",
      
      // Sửa chữa nhỏ - giá trung bình
      "repair": "0.003",
      "sửa chữa": "0.003",
      "sửa chữa nhỏ": "0.003",
      
      // Sửa chữa lớn/Động cơ - giá cao
      "engine": "0.004",
      "động cơ": "0.004",
      "sửa chữa động cơ": "0.004",
      "sửa chữa lớn": "0.004",
    };

    const typeLower = maintenanceType.toLowerCase().trim();
    
    // Tìm giá tương ứng
    for (const [key, price] of Object.entries(typeMap)) {
      if (typeLower.includes(key)) {
        return price;
      }
    }

    // Nếu không tìm thấy, random trong khoảng
    const min = 0.001;
    const max = 0.004;
    const randomPrice = (Math.random() * (max - min) + min).toFixed(3);
    return randomPrice;
  };

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

  const handleApprove = async (id, price = null, recipientAddress = null) => {
    setLoading(true);
    try {
      await MaintenanceService.approveMaintenanceRegistration(id);
      
      const adminWalletAddress = recipientAddress || "0xbb2c9c2beaed565ac4db0d51c4eed1db35fda0d0";
      
      message.success("Đã duyệt! Client cần thanh toán Sepolia ETH để hoàn tất.");
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
      const record = res?.data;
      setSelectedReg(record);
      
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
      title: "Giá tiền (Sepolia ETH)",
      dataIndex: "price",
      key: "price",
      render: (price, record) => {
        // Nếu không có price, tính dựa vào loại bảo trì
        if (!price) {
          const maintenanceType = record?.content?.maintenanceType || "";
          const calculatedPrice = getPriceByMaintenanceType(maintenanceType);
          return (
            <Text strong style={{ color: "#1890ff" }}>
              {calculatedPrice} Sepolia ETH
            </Text>
          );
        }
        return (
          <Text strong style={{ color: "#1890ff" }}>
            {price} Sepolia ETH
          </Text>
        );
      },
    },
    {
      title: "Đã thanh toán",
      key: "paymentStatus",
      render: (_, record) => {
        const isPaid = record.paymentHash || record.paymentStatus === "paid";
        return (
          <Tag color={isPaid ? "green" : "red"} icon={isPaid ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
            {isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
          </Tag>
        );
      },
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
                  title: "Giá tiền (Sepolia ETH)",
                  dataIndex: "price",
                  key: "price",
                  render: (price, record) => {
                    // Nếu có price trong record, dùng luôn
                    if (price) {
                      return (
                        <Text strong style={{ color: "#1890ff" }}>
                          {price} Sepolia ETH
                        </Text>
                      );
                    }
                    
                    // Nếu không có, tính dựa vào loại bảo trì
                    const maintenanceType = record?.content?.maintenanceType || "";
                    if (maintenanceType) {
                      const calculatedPrice = getPriceByMaintenanceType(maintenanceType);
                      return (
                        <Text strong style={{ color: "#1890ff" }}>
                          {calculatedPrice} Sepolia ETH
                        </Text>
                      );
                    }
                    
                    return (
                      <Text type="secondary">N/A</Text>
                    );
                  },
                },
                {
                  title: "Trạng thái thanh toán",
                  key: "paymentStatus",
                  render: (_, record) => {
                    const isPaid = record.paymentHash || record.paymentStatus === "paid";
                    console.log("Admin - Payment status check:", {
                      id: record._id,
                      paymentHash: record.paymentHash,
                      paymentStatus: record.paymentStatus,
                      isPaid: isPaid
                    });
                    return (
                      <Tag color={isPaid ? "green" : "orange"} icon={isPaid ? <CheckCircleOutlined /> : <ClockCircleOutlined />}>
                        {isPaid ? "✅ Đã thanh toán" : "⏳ Chưa thanh toán"}
                      </Tag>
                    );
                  },
                },
                {
                  title: "Trạng thái",
                  key: "status",
                  render: (_, record) => (
                    <Tag color={record.anchored ? "green" : record.status === "approved" ? "blue" : "orange"}>
                      {record.anchored ? "✅ Đã xác thực" : record.status === "approved" ? "✅ Đã duyệt" : "🔄 Chưa xác thực"}
                    </Tag>
                  ),
                },
                {
                  title: "Hành động",
                  key: "action",
                  render: (_, record) => {
                    const isPaid = record.paymentHash || record.paymentStatus === "paid";
                    const canAnchor = record.status === "approved" && isPaid && !record.anchored;
                    
                    // Debug log
                    console.log("Admin - Record payment status:", {
                      id: record._id,
                      status: record.status,
                      paymentHash: record.paymentHash,
                      paymentStatus: record.paymentStatus,
                      isPaid: isPaid,
                      canAnchor: canAnchor,
                      anchored: record.anchored
                    });
                    
                    return (
                      <Space>
                        {canAnchor ? (
                          <Button
                            type="primary"
                            icon={<CheckCircleOutlined />}
                            onClick={async () => {
                              try {
                                setLoading(true);
                                await RecordsService.acceptServiceRecord(record._id);
                                message.success("Đã anchor lên blockchain thành công!");
                                fetchAllServiceRecords();
                              } catch (error) {
                                console.error("Error anchoring record:", error);
                                message.error("Lỗi khi anchor: " + (error?.response?.data?.message || error.message));
                              } finally {
                                setLoading(false);
                              }
                            }}
                            loading={loading}
                            style={{ 
                              backgroundColor: "#1890ff",
                              borderColor: "#1890ff"
                            }}
                          >
                            Xác nhận & Anchor
                          </Button>
                        ) : record.anchored ? (
                          <Tag color="green">Đã xác thực</Tag>
                        ) : !isPaid ? (
                          <Tag color="orange">Chờ thanh toán</Tag>
                        ) : null}
                        
                        {/* Hiển thị payment hash nếu đã thanh toán */}
                        {record.paymentHash && !record.anchored && (
                          <Popover
                            content={
                              <div>
                                <p><strong>Payment Hash:</strong></p>
                                <code style={{ fontSize: "12px", wordBreak: "break-all" }}>{record.paymentHash}</code>
                                <br />
                                <Button
                                  type="link"
                                  size="small"
                                  icon={<LinkOutlined />}
                                  onClick={() => {
                                    window.open(`https://sepolia.etherscan.io/tx/${record.paymentHash}`, '_blank');
                                  }}
                                >
                                  Xem trên Etherscan
                                </Button>
                              </div>
                            }
                            title="Payment Info"
                          >
                            <Button size="small" type="default">
                              Payment Hash
                            </Button>
                          </Popover>
                        )}
                        
                        {record.txHash && (
                          <Button
                            type="link"
                            size="small"
                            icon={<LinkOutlined />}
                            onClick={() => {
                              window.open(`https://sepolia.etherscan.io/tx/${record.txHash}`, '_blank');
                            }}
                          >
                            Xem TX
                          </Button>
                        )}
                      </Space>
                    );
                  },
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
        open={detailModalVisible}
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
                style={{ 
                  backgroundColor: "#1890ff",
                  borderColor: "#1890ff"
                }}
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
            <Descriptions.Item label="Giá (Sepolia ETH)">
              {(() => {
                // Nếu có price trong record, dùng luôn
                if (selectedReg.price) {
                  return (
                    <Text strong style={{ color: "#1890ff", fontSize: "16px" }}>
                      {selectedReg.price} Sepolia ETH
                    </Text>
                  );
                }
                
                // Nếu không có, tính dựa vào loại bảo trì
                const maintenanceType = selectedReg?.content?.maintenanceType || "";
                if (maintenanceType) {
                  const calculatedPrice = getPriceByMaintenanceType(maintenanceType);
                  return (
                    <Text strong style={{ color: "#1890ff", fontSize: "16px" }}>
                      {calculatedPrice} Sepolia ETH <Text type="secondary" style={{ fontSize: "12px" }}>(dự kiến)</Text>
                    </Text>
                  );
                }
                
                return (
                  <Text type="secondary">Chưa xác định</Text>
                );
              })()}
            </Descriptions.Item>
            {selectedReg.paymentHash && (
              <Descriptions.Item label="Payment Hash">
                <Space>
                  <Text code style={{ fontSize: "12px" }}>
                    {selectedReg.paymentHash}
                  </Text>
                  <Button
                    type="link"
                    size="small"
                    icon={<LinkOutlined />}
                    onClick={() => {
                      window.open(`https://sepolia.etherscan.io/tx/${selectedReg.paymentHash}`, '_blank');
                    }}
                  >
                    Xem trên Etherscan
                  </Button>
                </Space>
              </Descriptions.Item>
            )}
            {selectedReg.paymentStatus && (
              <Descriptions.Item label="Trạng thái thanh toán">
                <Tag color={selectedReg.paymentStatus === "paid" ? "green" : "red"}>
                  {selectedReg.paymentStatus === "paid" ? "✅ Đã thanh toán" : "❌ Chưa thanh toán"}
                </Tag>
              </Descriptions.Item>
            )}
            {selectedReg.txHash && (
              <Descriptions.Item label="Blockchain Transaction Hash">
                <Space>
                  <Text code style={{ fontSize: "12px" }}>
                    {selectedReg.txHash}
                  </Text>
                  <Button
                    type="link"
                    size="small"
                    icon={<LinkOutlined />}
                    onClick={() => {
                      window.open(`https://sepolia.etherscan.io/tx/${selectedReg.txHash}`, '_blank');
                    }}
                  >
                    Xem trên Etherscan
                  </Button>
                </Space>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;

