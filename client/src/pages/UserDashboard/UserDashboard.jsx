import React, { useState, useEffect } from "react";
import "./UserDashboard.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Card, Table, Modal, Form, Input, Select, message, Tabs, Row, Col, Badge, Space, Tag, Tooltip, Popover, Empty, Alert, Typography } from "antd";
import {
  PlusOutlined,
  CarOutlined,
  ToolOutlined,
  HistoryOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import * as VehicleService from "../../services/VehicleService";
import * as RecordsService from "../../services/RecordsService";
import * as UserService from "../../services/UserService";
import Loading from "../../components/LoadingComponent/Loading";
import VehicleCard from "../../components/VehicleCard/VehicleCard";
import StatsSection from "../../components/StatsSection/StatsSection";
import AdvertisementSection from "../../components/AdvertisementSection/AdvertisementSection";
import VehicleForm from "../../components/VehicleForm/VehicleForm";
import Footer from "../../components/Footer/Footer";
import PaymentButton from "../../components/PaymentButton/PaymentButton";
import PaymentService from "../../services/PaymentService";

const { Option } = Select;
const { Text } = Typography;

const UserDashboard = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [maintenanceRegs, setMaintenanceRegs] = useState([]);
  const [serviceRecords, setServiceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isVehicleModalVisible, setIsVehicleModalVisible] = useState(false);
  const [isMaintenanceModalVisible, setIsMaintenanceModalVisible] = useState(false);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleForm] = Form.useForm();
  const [maintenanceForm] = Form.useForm();
  const [changePasswordForm] = Form.useForm();
  const [selectedMaintenancePrice, setSelectedMaintenancePrice] = useState("0.001");
  
  // Hàm tính giá dựa vào loại bảo trì (giống AdminDashboard)
  const getPriceByMaintenanceType = (maintenanceType) => {
    if (!maintenanceType) return "0.001";
    
    const typeMap = {
      "routine": "0.001",
      "bảo dưỡng định kỳ": "0.001",
      "bảo dưỡng": "0.001",
      "inspection": "0.002",
      "kiểm tra": "0.002",
      "kiểm tra định kỳ": "0.002",
      "repair": "0.003",
      "sửa chữa": "0.003",
      "sửa chữa nhỏ": "0.003",
      "engine": "0.004",
      "động cơ": "0.004",
      "sửa chữa động cơ": "0.004",
      "sửa chữa lớn": "0.004",
      "emergency": "0.004",
      "bảo trì khẩn cấp": "0.004",
    };

    const typeLower = maintenanceType.toLowerCase().trim();
    for (const [key, price] of Object.entries(typeMap)) {
      if (typeLower.includes(key)) {
        return price;
      }
    }
    
    // Random nếu không tìm thấy
    const min = 0.001;
    const max = 0.004;
    return (Math.random() * (max - min) + min).toFixed(3);
  };

  useEffect(() => {
    if (user?.email) {
      fetchUserVehicles();
    }
  }, [user]);

  useEffect(() => {
    if (vehicles.length > 0) {
      fetchServiceRecords();
    }
  }, [vehicles]);

  const fetchUserVehicles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      let accessToken = null;
      
      if (token) {
        try {
          accessToken = JSON.parse(token);
        } catch (e) {
          accessToken = token;
        }
      }
      
      if (!accessToken && user?.access_token) {
        accessToken = user.access_token;
      }
      
      if (!accessToken) {
        message.error("Bạn cần đăng nhập");
        setTimeout(() => navigate("/sign-in"), 2000);
        return;
      }

      const res = await VehicleService.getUserVehicles(accessToken);
      if (res?.status === "OK") {
        setVehicles(res.data || []);
      } else if (res?.message?.includes("token") || res?.status === "ERR") {
        throw new Error("Token không hợp lệ");
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      if (error?.response?.status === 401 || error?.message?.includes("token")) {
        message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        setTimeout(() => {
          localStorage.removeItem("access_token");
          navigate("/sign-in");
        }, 2000);
      } else {
        message.error("Lỗi khi tải danh sách xe");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceRecords = async () => {
    setLoading(true);
    try {
      const res = await RecordsService.listServiceRecords();
      if (res?.status === "OK") {
        const allRecords = res.data || [];
        setServiceRecords(allRecords);
        const pendingRecords = allRecords.filter(r => r.status === "pending");
        setMaintenanceRegs(pendingRecords);
      } else if (res?.message?.includes("token") || res?.status === "ERR") {
        throw new Error("Token không hợp lệ");
      }
    } catch (error) {
      console.error("Error fetching service records:", error);
      if (error?.response?.status === 401 || error?.message?.includes("token")) {
        message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        setTimeout(() => {
          localStorage.removeItem("access_token");
          navigate("/sign-in");
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVehicle = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const accessToken = token ? JSON.parse(token) : user?.access_token;
      
      if (!accessToken) {
        message.error("Bạn cần đăng nhập");
        return;
      }

      const vehicleData = {
        ...values,
        email: user?.email || "",
        image: values.image && values.image.length > 0 ? values.image : ["https://via.placeholder.com/300"],
        bill: values.bill || "N/A",
        tax: values.tax || "N/A",
        seri: values.seri || "N/A",
        license: values.license || "N/A",
        rolling: values.rolling || "4",
        gear: values.gear || "manual",
        dated: values.dated || new Date().toISOString(),
        phone: values.phone || user?.phone || "",
        address: values.address || user?.address || "",
      };

      let res;
      if (isEditMode && selectedVehicle) {
        res = await VehicleService.updateVehicle(selectedVehicle._id, accessToken, vehicleData);
        if (res?.status === "OK") {
          message.success("Cập nhật thông tin xe thành công!");
        }
      } else {
        res = await VehicleService.createVehicle(vehicleData);
        if (res?.status === "OK") {
          message.success("Đăng ký xe thành công!");
        }
      }

      if (res?.status === "OK") {
        setIsVehicleModalVisible(false);
        setIsEditMode(false);
        setSelectedVehicle(null);
        vehicleForm.resetFields();
        fetchUserVehicles();
      } else {
        message.error(res?.message || (isEditMode ? "Lỗi khi cập nhật xe" : "Lỗi khi đăng ký xe"));
      }
    } catch (error) {
      console.error("Error saving vehicle:", error);
      message.error(error?.response?.data?.message || (isEditMode ? "Lỗi khi cập nhật xe" : "Lỗi khi đăng ký xe"));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMaintenance = async (values) => {
    setLoading(true);
    try {
      const selectedVehicle = vehicles.find(v => v._id === values.vehicleId);
      if (!selectedVehicle) {
        message.error("Không tìm thấy xe");
        return;
      }

      const maintenanceType = values.maintenanceType || "routine";
      let garageValue = values.garage || "Chưa xác định";
      if (Array.isArray(garageValue)) {
        garageValue = garageValue.length > 0 ? garageValue[0] : "Chưa xác định";
      }
      
      // Tính giá dựa vào loại bảo trì
      const price = getPriceByMaintenanceType(maintenanceType);
      
      const payload = {
        vehicleId: values.vehicleId,
        vehicleKey: selectedVehicle.plates,
        content: {
          description: values.description || "",
          maintenanceType: maintenanceType,
          expectedDate: values.expectedDate || new Date().toISOString().split("T")[0],
          job: values.description || "Bảo dưỡng",
          garage: garageValue,
          odo: values.odo ? parseInt(values.odo) : 0,
        },
        // Thêm price để admin biết cần thanh toán bao nhiêu
        price: price,
        recipientAddress: "0xbb2c9c2beaed565ac4db0d51c4eed1db35fda0d0", // Admin wallet
      };

      const res = await RecordsService.createServiceRecord(payload);
      
      if (res?.status === "OK") {
        message.success("Tạo lệnh đăng ký bảo trì thành công! Đang chờ admin duyệt.");
        setIsMaintenanceModalVisible(false);
        maintenanceForm.resetFields();
        setSelectedMaintenancePrice("0.001");
        fetchServiceRecords();
      } else {
        message.error(res?.message || "Lỗi khi tạo lệnh đăng ký bảo trì");
      }
    } catch (error) {
      console.error("Error creating maintenance registration:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Lỗi khi tạo lệnh đăng ký bảo trì";
      
      if (errorMessage.includes("token") || errorMessage.includes("Token") || error?.response?.status === 401) {
        message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        setTimeout(() => {
          localStorage.removeItem("access_token");
          navigate("/sign-in");
        }, 2000);
      } else {
        message.error(errorMessage);
      }
    } finally {
      setLoading(false);
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
      case "anchored":
        return "Đã xác thực";
      case "rejected":
        return "Đã từ chối";
      case "pending":
        return "Chờ duyệt";
      default:
        return "Không xác định";
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa xe này? Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("access_token");
          const accessToken = token ? JSON.parse(token) : user?.access_token;
          
          if (!accessToken) {
            message.error("Bạn cần đăng nhập");
            return;
          }

          const res = await VehicleService.deleteVehicle(vehicleId, accessToken);
          if (res?.status === "OK") {
            message.success("Xóa xe thành công!");
            fetchUserVehicles();
          } else {
            message.error(res?.message || "Lỗi khi xóa xe");
          }
        } catch (error) {
          console.error("Error deleting vehicle:", error);
          message.error(error?.response?.data?.message || "Lỗi khi xóa xe");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleEditVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    vehicleForm.setFieldsValue({
      ...vehicle,
      image: vehicle.image && Array.isArray(vehicle.image) ? vehicle.image : (vehicle.image ? [vehicle.image] : []),
    });
    setIsVehicleModalVisible(true);
    setIsEditMode(true);
  };

  const handleViewVehicle = (vehicle) => {
    navigate(`/detail/${vehicle.plates}`);
  };

  const handleChangePassword = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      let accessToken = null;
      
      if (token) {
        try {
          accessToken = JSON.parse(token);
        } catch (e) {
          accessToken = token;
        }
      }
      
      if (!accessToken && user?.access_token) {
        accessToken = user.access_token;
      }
      
      if (!accessToken) {
        message.error("Bạn cần đăng nhập");
        return;
      }

      if (!user?.id) {
        message.error("Không tìm thấy thông tin người dùng");
        return;
      }

      const res = await UserService.changePassword(
        user.id,
        values.oldPassword,
        values.newPassword,
        accessToken
      );

      if (res?.status === "OK") {
        message.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
        setIsChangePasswordModalVisible(false);
        changePasswordForm.resetFields();
        // Logout sau 2 giây
        setTimeout(() => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          navigate("/sign-in");
        }, 2000);
      } else {
        message.error(res?.message || "Lỗi khi đổi mật khẩu");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      message.error(error?.response?.data?.message || "Lỗi khi đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  const maintenanceColumns = [
    {
      title: "Biển số xe",
      dataIndex: ["vehicle", "plates"],
      key: "plates",
      render: (plates, record) => plates || record.vehicleKey || "N/A",
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
        return typeMap[type] || type || "N/A";
      },
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
        const maintenanceType = record?.content?.maintenanceType || record?.maintenanceType || "";
        if (maintenanceType) {
          const calculatedPrice = getPriceByMaintenanceType(maintenanceType);
          return (
            <Text strong style={{ color: "#1890ff" }}>
              {calculatedPrice} Sepolia ETH
            </Text>
          );
        }
        
        // Fallback
        return (
          <Text type="secondary">
            N/A
          </Text>
        );
      },
    },
    {
      title: "Mô tả",
      dataIndex: ["content", "description"],
      key: "description",
      render: (text) => (
        <Tooltip title={text}>
          <span style={{ whiteSpace: "normal", wordBreak: "break-word" }}>{text || "N/A"}</span>
        </Tooltip>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={status === "pending" ? <ClockCircleOutlined /> : <CheckCircleOutlined />}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <div>
          <div style={{ fontWeight: 600 }}>{date ? new Date(date).toLocaleDateString("vi-VN") : ""}</div>
          <div style={{ fontSize: "11px", color: "#999" }}>
            {date ? new Date(date).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : ""}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="user-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-actions">
            <Button
              icon={<LockOutlined />}
              onClick={() => setIsChangePasswordModalVisible(true)}
              size="large"
            >
              Đổi mật khẩu
            </Button>
          </div>
        </div>

        <StatsSection
          vehicles={vehicles}
          maintenanceRegs={maintenanceRegs}
          serviceRecords={serviceRecords}
        />

      <Tabs 
        defaultActiveKey="vehicles" 
        size="large" 
        className="dashboard-tabs"
        items={[
          {
            key: "vehicles",
            label: (
              <span>
                <CarOutlined /> Xe của tôi
              </span>
            ),
            children: (
              <Card 
                className="vehicles-card"
                title={
                  <Space>
                    <CarOutlined />
                    <span>Danh sách xe</span>
                    <Badge count={vehicles.length} showZero style={{ backgroundColor: "#1890ff" }} />
                  </Space>
                }
                extra={
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setIsVehicleModalVisible(true);
                      setIsEditMode(false);
                      setSelectedVehicle(null);
                      vehicleForm.resetFields();
                    }}
                    size="large"
                    className="add-vehicle-btn"
                  >
                    Đăng ký xe mới
                  </Button>
                }
              >
                <Loading isLoading={loading}>
                  {vehicles.length === 0 ? (
                    <Empty
                      description="Chưa có xe nào. Hãy đăng ký xe mới!"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  ) : (
                    <Row gutter={[24, 24]}>
                      {vehicles.map((vehicle) => (
                        <Col xs={24} sm={12} lg={8} xl={6} key={vehicle._id}>
                          <VehicleCard
                            vehicle={vehicle}
                            onView={handleViewVehicle}
                            onEdit={handleEditVehicle}
                            onDelete={handleDeleteVehicle}
                          />
                        </Col>
                      ))}
                    </Row>
                  )}
                </Loading>
              </Card>
            ),
          },
          {
            key: "maintenance",
            label: (
              <span>
                <ToolOutlined /> Đăng ký bảo trì
              </span>
            ),
            children: (
              <Card
                className="maintenance-card"
                title={
                  <Space>
                    <ToolOutlined />
                    <span>Lệnh đăng ký bảo trì</span>
                  </Space>
                }
                extra={
                  <Space>
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={fetchServiceRecords}
                    >
                      Làm mới
                    </Button>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => setIsMaintenanceModalVisible(true)}
                      disabled={vehicles.length === 0}
                      size="large"
                      className="add-maintenance-btn"
                    >
                      Tạo lệnh đăng ký bảo trì
                    </Button>
                  </Space>
                }
              >
                <Loading isLoading={loading}>
                  <Table
                    dataSource={maintenanceRegs}
                    columns={maintenanceColumns}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                    size="small"
                  />
                </Loading>
              </Card>
            ),
          },
          {
            key: "history",
            label: (
              <span>
                <HistoryOutlined /> Lịch sử bảo trì{" "}
                <Badge count={serviceRecords.filter(r => r.status === "anchored" || r.anchored).length} showZero style={{ backgroundColor: "#52c41a" }} />
              </span>
            ),
            children: (
              <Card 
                className="history-card"
                title={
                  <Space>
                    <HistoryOutlined />
                    <span>Lịch sử bảo trì</span>
                  </Space>
                }
                extra={
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={fetchServiceRecords}
                  >
                    Làm mới
                  </Button>
                }
              >
                <Loading isLoading={loading}>
                  <Table
                    dataSource={serviceRecords.filter(r => r.status !== "pending")}
                    columns={[
                      {
                        title: "Ngày",
                        dataIndex: "createdAt",
                        key: "createdAt",
                        render: (date) => (
                          <div>
                            <div style={{ fontWeight: 600 }}>{date ? new Date(date).toLocaleDateString("vi-VN") : ""}</div>
                            <div style={{ fontSize: "11px", color: "#999" }}>
                              {date ? new Date(date).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : ""}
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
                        render: (text) => (
                          <Tooltip title={text}>
                            <span style={{ whiteSpace: "normal", wordBreak: "break-word" }}>{text || "N/A"}</span>
                          </Tooltip>
                        ),
                      },
                      {
                        title: "Garage",
                        dataIndex: ["content", "garage"],
                        key: "garage",
                        render: (text) => (
                          <Tooltip title={text}>
                            <span style={{ whiteSpace: "normal", wordBreak: "break-word" }}>{text || "N/A"}</span>
                          </Tooltip>
                        ),
                      },
                      {
                        title: "Odo (km)",
                        dataIndex: ["content", "odo"],
                        key: "odo",
                        render: (text) => text ? text.toLocaleString() : "N/A",
                      },
                      {
                        title: "Trạng thái",
                        key: "status",
                        render: (_, record) => {
                          const statusInfo = {
                            pending: { color: "orange", text: "Chờ duyệt", icon: <ClockCircleOutlined /> },
                            approved: { color: "blue", text: "Đã duyệt", icon: <CheckCircleOutlined /> },
                            anchored: { color: "green", text: "Đã xác thực", icon: <CheckCircleOutlined /> },
                            rejected: { color: "red", text: "Đã từ chối", icon: <ClockCircleOutlined /> },
                          };
                          const info = statusInfo[record.status] || { color: "gray", text: "Không xác định", icon: null };
                          return (
                            <Space direction="vertical" size="small">
                              <Tag color={info.color} icon={info.icon}>
                                {info.text}
                              </Tag>
                              {record.status === "approved" && (
                                <Tag color={record.paymentHash || record.paymentStatus === "paid" ? "green" : "orange"}>
                                  {record.paymentHash || record.paymentStatus === "paid" ? "✅ Đã thanh toán" : "⏳ Chờ thanh toán"}
                                </Tag>
                              )}
                            </Space>
                          );
                        },
                      },
                      {
                        title: "Hành động",
                        key: "action",
                        render: (_, record) => {
                          // Nếu đã được approve nhưng chưa thanh toán
                          const isApproved = record.status === "approved";
                          const isPaid = record.paymentHash || record.paymentStatus === "paid";
                          const needsPayment = isApproved && !isPaid;
                          
                          console.log("Record payment status:", {
                            status: record.status,
                            paymentHash: record.paymentHash,
                            paymentStatus: record.paymentStatus,
                            needsPayment: needsPayment
                          });
                          
                          return (
                            <Space>
                              {/* Button thanh toán Sepolia ETH - hiển thị khi approved nhưng chưa thanh toán */}
                              {needsPayment ? (
                                <PaymentButton
                                  amount={record.price || getPriceByMaintenanceType(record?.content?.maintenanceType || "routine")}
                                  recipientAddress={record.recipientAddress || "0xbb2c9c2beaed565ac4db0d51c4eed1db35fda0d0"}
                                  transactionId={record._id}
                                  onPaymentSuccess={async (paymentData) => {
                                    try {
                                      message.success("Thanh toán thành công! Đang cập nhật...");
                                      // Gọi API để cập nhật record với paymentHash
                                      await RecordsService.updatePayment(record._id, {
                                        transactionHash: paymentData.transactionHash,
                                        blockNumber: paymentData.blockNumber,
                                      });
                                      message.success("Đã cập nhật thông tin thanh toán!");
                                      fetchServiceRecords(); // Refresh list
                                    } catch (error) {
                                      console.error("Error updating payment:", error);
                                      message.error("Lỗi khi cập nhật thông tin thanh toán: " + (error?.response?.data?.message || error.message));
                                    }
                                  }}
                                  buttonText="Thanh toán Sepolia ETH"
                                  type="primary"
                                />
                              ) : null}
                              
                              {/* Hiển thị payment hash nếu đã thanh toán */}
                              {record.paymentHash && (
                                <Popover
                                  content={
                                    <div>
                                      <p><strong>Payment Hash:</strong></p>
                                      <code style={{ fontSize: "12px", wordBreak: "break-all" }}>{record.paymentHash}</code>
                                      <Button
                                        type="link"
                                        size="small"
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
                                  <Button
                                    size="small"
                                    type="default"
                                  >
                                    Đã thanh toán
                                  </Button>
                                </Popover>
                              )}
                              
                              {/* Hiển thị blockchain tx hash nếu có */}
                              {record.txHash && (
                                <Popover
                                  content={
                                    <div>
                                      <p><strong>Transaction Hash:</strong></p>
                                      <code style={{ fontSize: "12px", wordBreak: "break-all" }}>{record.txHash}</code>
                                      <Button
                                        type="link"
                                        size="small"
                                        onClick={() => {
                                          window.open(`https://sepolia.etherscan.io/tx/${record.txHash}`, '_blank');
                                        }}
                                      >
                                        Xem trên Etherscan
                                      </Button>
                                    </div>
                                  }
                                  title="Blockchain Info"
                                >
                                  <Button
                                    size="small"
                                    icon={<EyeOutlined />}
                                  >
                                    Xem
                                  </Button>
                                </Popover>
                              )}
                            </Space>
                          );
                        },
                      },
                    ]}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                    size="small"
                  />
                </Loading>
              </Card>
            ),
          },
        ]}
      />

        <AdvertisementSection />
      </div>
      
      <Footer />

      {/* Modal đăng ký/sửa xe */}
      <Modal
        title={isEditMode ? "Cập nhật thông tin xe" : "Đăng ký xe mới"}
        open={isVehicleModalVisible}
        onCancel={() => {
          setIsVehicleModalVisible(false);
          setIsEditMode(false);
          setSelectedVehicle(null);
          vehicleForm.resetFields();
        }}
        footer={null}
        width={900}
        className="vehicle-modal"
      >
        <VehicleForm
          form={vehicleForm}
          onFinish={handleCreateVehicle}
          loading={loading}
          isEditMode={isEditMode}
          initialValues={{
            ...(selectedVehicle ? {
              ...selectedVehicle,
              image: selectedVehicle.image && Array.isArray(selectedVehicle.image) 
                ? selectedVehicle.image 
                : (selectedVehicle.image ? [selectedVehicle.image] : []),
            } : {
              type: "sedan",
              fuel: "gasoline",
              gear: "manual",
              rolling: "4",
              color: "Trắng",
              bill: "N/A",
              tax: "N/A",
              seri: "N/A",
              license: "N/A",
              dated: new Date().toISOString().split("T")[0],
              phone: user?.phone || "",
              address: user?.address || "",
              image: [],
            }),
          }}
        />
      </Modal>

      {/* Modal tạo lệnh đăng ký bảo trì */}
      <Modal
        title="Tạo lệnh đăng ký bảo trì"
        open={isMaintenanceModalVisible}
        onCancel={() => {
          setIsMaintenanceModalVisible(false);
          maintenanceForm.resetFields();
          setSelectedMaintenancePrice("0.001");
        }}
        footer={null}
        width={600}
      >
        <Form
          form={maintenanceForm}
          layout="vertical"
          onFinish={handleCreateMaintenance}
          initialValues={{
            maintenanceType: "routine",
          }}
        >
          <Form.Item
            name="vehicleId"
            label="Chọn xe"
            rules={[{ required: true, message: "Vui lòng chọn xe" }]}
          >
            <Select placeholder="Chọn xe" size="large">
              {vehicles.map((vehicle) => (
                <Option key={vehicle._id} value={vehicle._id}>
                  {vehicle.name} - {vehicle.plates}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="maintenanceType"
            label="Loại bảo trì"
            rules={[{ required: true, message: "Vui lòng chọn loại bảo trì" }]}
          >
            <Select 
              placeholder="Chọn loại bảo trì" 
              size="large"
              onChange={(value) => {
                const price = getPriceByMaintenanceType(value);
                setSelectedMaintenancePrice(price);
              }}
            >
              <Option value="routine">Bảo dưỡng định kỳ</Option>
              <Option value="repair">Sửa chữa</Option>
              <Option value="inspection">Kiểm tra</Option>
              <Option value="emergency">Bảo trì khẩn cấp</Option>
            </Select>
          </Form.Item>
          
          {/* Hiển thị giá dự kiến */}
          <Form.Item label="Giá dự kiến">
            <div style={{ 
              padding: "12px", 
              background: "#f0f2f5", 
              borderRadius: "8px",
              border: "1px solid #d9d9d9"
            }}>
              <Space>
                <Text style={{ fontSize: "18px", color: "#1890ff", fontWeight: "bold" }}>
                  {selectedMaintenancePrice} Sepolia ETH
                </Text>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  (~{PaymentService.ethToVnd(selectedMaintenancePrice)} VND - tham khảo)
                </Text>
              </Space>
              <div style={{ marginTop: "8px", fontSize: "12px", color: "#999" }}>
                * Bạn sẽ thanh toán sau khi admin duyệt yêu cầu
              </div>
            </div>
          </Form.Item>
          <Form.Item
            name="expectedDate"
            label="Ngày dự kiến"
            rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
          >
            <Input type="date" size="large" />
          </Form.Item>
          <Form.Item
            name="garage"
            label="Chọn Garage"
            rules={[{ required: true, message: "Vui lòng chọn hoặc nhập tên Garage" }]}
          >
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Chọn Garage hoặc nhập tên mới"
              size="large"
              options={[
                { value: "Garage Container Hải An", label: "Garage Container Hải An" },
                { value: "Garage Trung tâm", label: "Garage Trung tâm" },
                { value: "Garage Miền Bắc", label: "Garage Miền Bắc" },
                { value: "Garage Miền Nam", label: "Garage Miền Nam" },
                { value: "Garage Đại lý chính hãng", label: "Garage Đại lý chính hãng" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="odo"
            label="Odometer (km)"
            rules={[{ required: true, message: "Vui lòng nhập số km" }]}
          >
            <Input type="number" placeholder="Nhập số km hiện tại" min={0} size="large" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Mô tả chi tiết về việc bảo trì..."
            />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block
              size="large"
              className="submit-btn"
              style={{ 
                backgroundColor: "#1890ff",
                borderColor: "#1890ff"
              }}
            >
              Gửi yêu cầu bảo trì
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal đổi mật khẩu */}
      <Modal
        title={
          <Space>
            <LockOutlined />
            <span>Đổi mật khẩu</span>
          </Space>
        }
        open={isChangePasswordModalVisible}
        onCancel={() => {
          setIsChangePasswordModalVisible(false);
          changePasswordForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={changePasswordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            name="oldPassword"
            label="Mật khẩu cũ"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ" }]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu cũ"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Nhập lại mật khẩu mới"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              className="submit-btn"
            >
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserDashboard;
