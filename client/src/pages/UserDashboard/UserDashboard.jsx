import React, { useState, useEffect } from "react";
import "./UserDashboard.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Card, Table, Modal, Form, Input, Select, message, Tabs, Row, Col, Badge, Space, Tag, Tooltip, Popover } from "antd";
import {
  PlusOutlined,
  CarOutlined,
  ToolOutlined,
  HistoryOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import * as VehicleService from "../../services/VehicleService";
import * as MaintenanceService from "../../services/MaintenanceService";
import * as RecordsService from "../../services/RecordsService";
import Loading from "../../components/LoadingComponent/Loading";

const { TabPane } = Tabs;
const { Option } = Select;

const UserDashboard = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [maintenanceRegs, setMaintenanceRegs] = useState([]);
  const [serviceRecords, setServiceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isVehicleModalVisible, setIsVehicleModalVisible] = useState(false);
  const [isMaintenanceModalVisible, setIsMaintenanceModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleForm] = Form.useForm();
  const [maintenanceForm] = Form.useForm();

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
      // Lấy xe của user qua API (user chỉ xem được xe của mình)
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
      // Lấy service records của user (backend sẽ filter theo user)
      const res = await RecordsService.listServiceRecords();
      if (res?.status === "OK") {
        const allRecords = res.data || [];
        setServiceRecords(allRecords);
        // Lấy pending records để hiển thị trong tab "Đăng ký bảo trì"
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

      // Thêm email và các trường cần thiết từ user
      const vehicleData = {
        ...values,
        email: user?.email || "",
        image: values.image || ["https://via.placeholder.com/300"],
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
        // Update existing vehicle
        res = await VehicleService.updateVehicle(selectedVehicle._id, accessToken, vehicleData);
        if (res?.status === "OK") {
          message.success("Cập nhật thông tin xe thành công!");
        }
      } else {
        // Create new vehicle
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
      // Tìm vehicle để lấy vehicleKey
      const selectedVehicle = vehicles.find(v => v._id === values.vehicleId);
      if (!selectedVehicle) {
        message.error("Không tìm thấy xe");
        return;
      }

      const maintenanceType = values.maintenanceType || "routine";
      
      // Xử lý garage: nếu là mảng (từ tags mode), lấy phần tử đầu tiên
      let garageValue = values.garage || "Chưa xác định";
      if (Array.isArray(garageValue)) {
        garageValue = garageValue.length > 0 ? garageValue[0] : "Chưa xác định";
      }
      
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
      };

      const res = await RecordsService.createServiceRecord(payload);
      
      if (res?.status === "OK") {
        message.success("Tạo lệnh đăng ký bảo trì thành công! Đang chờ admin duyệt.");
        setIsMaintenanceModalVisible(false);
        maintenanceForm.resetFields();
        fetchServiceRecords(); // Fetch lại service records
      } else {
        message.error(res?.message || "Lỗi khi tạo lệnh đăng ký bảo trì");
      }
    } catch (error) {
      console.error("Error creating maintenance registration:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Lỗi khi tạo lệnh đăng ký bảo trì";
      
      // Nếu lỗi token, yêu cầu đăng nhập lại
      if (errorMessage.includes("token") || errorMessage.includes("Token") || error?.response?.status === 401) {
        message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        // Đợi 2 giây rồi redirect đến trang đăng nhập
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

  const vehicleColumns = [
    {
      title: "Tên xe",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Biển số",
      dataIndex: "plates",
      key: "plates",
    },
    {
      title: "Hãng",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Ngày đăng ký",
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
            size="small"
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/detail/${record.plates}`)}
            style={{
              backgroundColor: "#2563eb",
              borderColor: "#2563eb",
              color: "#fff"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#1e40af";
              e.currentTarget.style.borderColor = "#1e40af";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#2563eb";
              e.currentTarget.style.borderColor = "#2563eb";
            }}
          >
            Xem chi tiết
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedVehicle(record);
              vehicleForm.setFieldsValue(record);
              setIsVehicleModalVisible(true);
              setIsEditMode(true);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            Sửa
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteVehicle(record._id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

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
    <div className="user-dashboard" style={{ padding: "24px", minHeight: "100vh", background: "#f0f2f5" }}>
      <div className="dashboard-header" style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>
          <CarOutlined /> Dashboard Người Dùng
        </h1>
      </div>

      <Tabs defaultActiveKey="vehicles" size="large">
        <TabPane
          tab={
            <span>
              <CarOutlined /> Xe của tôi
            </span>
          }
          key="vehicles"
        >
          <Card 
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
                onClick={() => setIsVehicleModalVisible(true)}
                size="large"
                style={{ 
                    fontSize: "16px",
                    fontWeight: "600",
                    backgroundColor: "#2563eb",
                    borderColor: "#2563eb",
                    color: "#fff"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1e40af";
                  e.currentTarget.style.borderColor = "#1e40af";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#2563eb";
                  e.currentTarget.style.borderColor = "#2563eb";
                }}
              >
                Đăng ký xe mới
              </Button>
            }
          >
            <Loading isLoading={loading}>
              <Table
                dataSource={vehicles}
                columns={vehicleColumns}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
                size="small"
              />
            </Loading>
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <ToolOutlined /> Đăng ký bảo trì
            </span>
          }
          key="maintenance"
        >
          <Card
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  Làm mới
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsMaintenanceModalVisible(true)}
                  disabled={vehicles.length === 0}
                  style={{ 
                    fontSize: "16px",
                    fontWeight: "600",
                    backgroundColor: "#2563eb",
                    borderColor: "#2563eb",
                    color: "#fff"
                  }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.backgroundColor = "#1e40af";
                      e.currentTarget.style.borderColor = "#1e40af";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.backgroundColor = "#2563eb";
                      e.currentTarget.style.borderColor = "#2563eb";
                    }
                  }}
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
        </TabPane>

        <TabPane
          tab={
            <span>
              <HistoryOutlined /> Lịch sử bảo trì{" "}
              <Badge count={serviceRecords.filter(r => r.status === "anchored" || r.anchored).length} showZero style={{ backgroundColor: "#52c41a" }} />
            </span>
          }
          key="history"
        >
          <Card 
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
                        <Tag color={info.color} icon={info.icon}>
                          {info.text}
                        </Tag>
                      );
                    },
                  },
                  {
                    title: "Hành động",
                    key: "action",
                    render: (_, record) => (
                      <Space>
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
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.opacity = "0.9";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.opacity = "1";
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
                              onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = "0.9";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = "1";
                              }}
                            >
                              Xem
                            </Button>
                          </Popover>
                        )}
                      </Space>
                    ),
                  },
                ]}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
                size="small"
              />
            </Loading>
          </Card>
        </TabPane>
      </Tabs>

      {/* Modal đăng ký/sửa xe */}
      <Modal
        title={isEditMode ? "Cập nhật thông tin xe" : "Đăng ký xe mới"}
        visible={isVehicleModalVisible}
        onCancel={() => {
          setIsVehicleModalVisible(false);
          setIsEditMode(false);
          setSelectedVehicle(null);
          vehicleForm.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={vehicleForm}
          layout="vertical"
          onFinish={handleCreateVehicle}
          initialValues={{
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
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên xe"
                rules={[{ required: true, message: "Vui lòng nhập tên xe" }]}
              >
                <Input placeholder="VD: Xe Toyota Camry" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="plates"
                label="Biển số"
                rules={[{ required: true, message: "Vui lòng nhập biển số" }]}
              >
                <Input placeholder="VD: 30A-12345" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="brand"
                label="Hãng"
                rules={[{ required: true, message: "Vui lòng nhập hãng" }]}
              >
                <Input placeholder="VD: Toyota" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="type"
                label="Loại xe"
                rules={[{ required: true, message: "Vui lòng chọn loại xe" }]}
              >
                <Select placeholder="Chọn loại xe">
                  <Option value="sedan">Sedan</Option>
                  <Option value="suv">SUV</Option>
                  <Option value="hatchback">Hatchback</Option>
                  <Option value="coupe">Coupe</Option>
                  <Option value="truck">Truck</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="color"
                label="Màu sắc"
                rules={[{ required: true, message: "Vui lòng nhập màu sắc" }]}
              >
                <Input placeholder="VD: Đen" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="fuel"
                label="Nhiên liệu"
                rules={[{ required: true, message: "Vui lòng chọn nhiên liệu" }]}
              >
                <Select placeholder="Chọn nhiên liệu">
                  <Option value="gasoline">Xăng</Option>
                  <Option value="diesel">Diesel</Option>
                  <Option value="electric">Điện</Option>
                  <Option value="hybrid">Hybrid</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="gear"
                label="Hộp số"
                rules={[{ required: true, message: "Vui lòng chọn hộp số" }]}
              >
                <Select placeholder="Chọn hộp số">
                  <Option value="manual">Số sàn</Option>
                  <Option value="automatic">Số tự động</Option>
                  <Option value="cvt">CVT</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="rolling"
                label="Số bánh"
                rules={[{ required: true, message: "Vui lòng nhập số bánh" }]}
              >
                <Input placeholder="VD: 4" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="engine"
                label="Số máy"
                rules={[{ required: true, message: "Vui lòng nhập số máy" }]}
              >
                <Input placeholder="Số máy" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="frame"
                label="Số khung"
                rules={[{ required: true, message: "Vui lòng nhập số khung" }]}
              >
                <Input placeholder="Số khung" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="identifynumber"
                label="Số CMT/CCCD"
                rules={[{ required: true, message: "Vui lòng nhập số CMT/CCCD" }]}
              >
                <Input placeholder="Số CMT/CCCD" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
              >
                <Input placeholder="Số điện thoại" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
              >
                <Input.TextArea rows={2} placeholder="Địa chỉ" />
              </Form.Item>
            </Col>
          </Row>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  style={{
                    height: "45px",
                    fontSize: "16px",
                    fontWeight: "600"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  {isEditMode ? "Cập nhật thông tin xe" : "Đăng ký xe mới"}
                </Button>
              </Form.Item>
        </Form>
      </Modal>

      {/* Modal tạo lệnh đăng ký bảo trì */}
      <Modal
        title="Tạo lệnh đăng ký bảo trì"
        visible={isMaintenanceModalVisible}
        onCancel={() => {
          setIsMaintenanceModalVisible(false);
          maintenanceForm.resetFields();
        }}
        footer={null}
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
            <Select placeholder="Chọn xe">
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
            <Select placeholder="Chọn loại bảo trì">
              <Option value="routine">Bảo dưỡng định kỳ</Option>
              <Option value="repair">Sửa chữa</Option>
              <Option value="inspection">Kiểm tra</Option>
              <Option value="emergency">Bảo trì khẩn cấp</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="expectedDate"
            label="Ngày dự kiến"
            rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
          >
            <Input type="date" />
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
            <Input type="number" placeholder="Nhập số km hiện tại" min={0} />
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
              style={{ 
                height: "45px",
                fontSize: "16px",
                fontWeight: "600"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              Tạo lệnh đăng ký
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserDashboard;

