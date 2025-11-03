import React, { useState, useEffect } from "react";
import "./RealEstateDashboard.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Card, Table, Modal, Form, Input, Select, message, Tabs, Row, Col, Badge, Space, Tag, Tooltip, Popover, InputNumber } from "antd";
import {
  PlusOutlined,
  HomeOutlined,
  FileTextOutlined,
  HistoryOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import * as RealEstateService from "../../services/RealEstateService";
import * as TransactionService from "../../services/TransactionService";
import Loading from "../../components/LoadingComponent/Loading";
import heroImg from "../../assets/phu-long-1-162.jpg";

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const RealEstateDashboard = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPropertyModalVisible, setIsPropertyModalVisible] = useState(false);
  const [isTransactionModalVisible, setIsTransactionModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [viewPropertyVisible, setViewPropertyVisible] = useState(false);
  const [propertyForm] = Form.useForm();
  const [transactionForm] = Form.useForm();

  useEffect(() => {
    if (user?.email) {
      fetchUserProperties();
      fetchTransactions();
    }
  }, [user]);

  const fetchUserProperties = async () => {
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

      const res = await RealEstateService.getUserRealEstates(accessToken);
      if (res?.status === "OK") {
        setProperties(res.data || []);
      } else if (res?.message?.includes("token") || res?.status === "ERR") {
        throw new Error("Token không hợp lệ");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      if (error?.response?.status === 401 || error?.message?.includes("token")) {
        message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        setTimeout(() => {
          localStorage.removeItem("access_token");
          navigate("/sign-in");
        }, 2000);
      } else {
        message.error("Lỗi khi tải danh sách bất động sản");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await TransactionService.getUserTransactions();
      if (res?.status === "OK") {
        const allTransactions = res.data || [];
        setTransactions(allTransactions);
        const pending = allTransactions.filter(t => t.status === "pending");
        setPendingTransactions(pending);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
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

  const handleCreateProperty = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const accessToken = token ? JSON.parse(token) : user?.access_token;
      
      if (!accessToken) {
        message.error("Bạn cần đăng nhập");
        return;
      }

      const propertyData = {
        ...values,
        email: user?.email || "",
        images: values.images || ["https://via.placeholder.com/300"],
        pricePerM2: values.price / values.area,
        user: user?.id,
      };

      let res;
      if (isEditMode && selectedProperty) {
        res = await RealEstateService.updateRealEstate(selectedProperty._id, accessToken, propertyData);
        if (res?.status === "OK") {
          message.success("Cập nhật thông tin bất động sản thành công!");
        }
      } else {
        res = await RealEstateService.createRealEstate(propertyData);
        if (res?.status === "OK") {
          message.success("Đăng ký bất động sản thành công!");
        }
      }

      if (res?.status === "OK") {
        setIsPropertyModalVisible(false);
        setIsEditMode(false);
        setSelectedProperty(null);
        propertyForm.resetFields();
        fetchUserProperties();
      } else {
        message.error(res?.message || (isEditMode ? "Lỗi khi cập nhật" : "Lỗi khi đăng ký"));
      }
    } catch (error) {
      console.error("Error saving property:", error);
      message.error(error?.response?.data?.message || (isEditMode ? "Lỗi khi cập nhật" : "Lỗi khi đăng ký"));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTransaction = async (values) => {
    setLoading(true);
    try {
      const selectedProperty = properties.find(p => p._id === values.propertyId);
      if (!selectedProperty) {
        message.error("Không tìm thấy bất động sản");
        return;
      }

      // Xử lý dates
      const contractDate = values.contractDate ? (values.contractDate.format ? values.contractDate.format("YYYY-MM-DD") : values.contractDate) : null;
      const transferDate = values.transferDate ? (values.transferDate.format ? values.transferDate.format("YYYY-MM-DD") : values.transferDate) : null;

      const payload = {
        realEstateId: values.propertyId,
        propertyCode: selectedProperty.propertyCode,
        transactionType: values.transactionType || "sale",
        transactionPrice: values.transactionPrice,
        deposit: values.deposit || 0,
        contractDate,
        transferDate,
        buyerName: values.buyerName || "",
        buyerEmail: values.buyerEmail || "",
        buyerPhone: values.buyerPhone || "",
        buyerIdCard: values.buyerIdCard || "",
        buyerAddress: values.buyerAddress || "",
        sellerName: values.sellerName || selectedProperty.ownerName,
        sellerEmail: values.sellerEmail || selectedProperty.ownerEmail,
        sellerPhone: values.sellerPhone || selectedProperty.ownerPhone,
        sellerIdCard: values.sellerIdCard || selectedProperty.ownerIdCard,
        sellerAddress: values.sellerAddress || selectedProperty.ownerAddress,
        notes: values.notes || "",
        content: {
          description: values.description || "",
          transactionType: values.transactionType || "sale",
          propertyCode: selectedProperty.propertyCode,
          propertyAddress: selectedProperty.address,
        },
      };

      const res = await TransactionService.createTransaction(payload);
      
      if (res?.status === "OK") {
        message.success("Tạo giao dịch thành công! Đang chờ admin duyệt.");
        setIsTransactionModalVisible(false);
        transactionForm.resetFields();
        fetchTransactions();
      } else {
        message.error(res?.message || "Lỗi khi tạo giao dịch");
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Lỗi khi tạo giao dịch";
      
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

  const handleDeleteProperty = async (propertyId) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa bất động sản này? Hành động này không thể hoàn tác.",
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

          const res = await RealEstateService.deleteRealEstate(propertyId, accessToken);
          if (res?.status === "OK") {
            message.success("Xóa bất động sản thành công!");
            fetchUserProperties();
          } else {
            message.error(res?.message || "Lỗi khi xóa");
          }
        } catch (error) {
          console.error("Error deleting property:", error);
          message.error(error?.response?.data?.message || "Lỗi khi xóa");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
      case "completed":
        return "green";
      case "rejected":
      case "cancelled":
        return "red";
      case "pending":
        return "orange";
      case "anchored":
        return "blue";
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
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getPropertyTypeText = (type) => {
    const typeMap = {
      apartment: "Chung cư",
      house: "Nhà phố",
      land: "Đất",
      villa: "Biệt thự",
      office: "Văn phòng",
      warehouse: "Kho bãi",
      other: "Khác",
    };
    return typeMap[type] || type;
  };

  const propertyColumns = [
    {
      title: "Mã tài sản",
      dataIndex: "propertyCode",
      key: "propertyCode",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <div style={{ fontSize: "12px", color: "#999" }}>
            {record.ward && `${record.ward}, `}
            {record.district && `${record.district}, `}
            {record.city}
          </div>
        </div>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type) => getPropertyTypeText(type),
    },
    {
      title: "Diện tích (m²)",
      dataIndex: "area",
      key: "area",
      render: (area) => area?.toLocaleString() || "-",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => price ? `${price.toLocaleString()} VNĐ` : "-",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusMap = {
          available: { color: "green", text: "Có sẵn" },
          sold: { color: "red", text: "Đã bán" },
          rented: { color: "blue", text: "Đã cho thuê" },
          pending: { color: "orange", text: "Chờ xử lý" },
        };
        const info = statusMap[status] || { color: "gray", text: status };
        return <Tag color={info.color}>{info.text}</Tag>;
      },
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
            onClick={() => {
              setSelectedProperty(record);
              setViewPropertyVisible(true);
            }}
          >
            Xem
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedProperty(record);
              propertyForm.setFieldsValue(record);
              setIsPropertyModalVisible(true);
              setIsEditMode(true);
            }}
          >
            Sửa
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteProperty(record._id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const transactionColumns = [
    {
      title: "Mã tài sản",
      dataIndex: "propertyCode",
      key: "propertyCode",
    },
    {
      title: "Loại giao dịch",
      dataIndex: "transactionType",
      key: "transactionType",
      render: (type) => {
        const typeMap = {
          sale: "Mua bán",
          rent: "Cho thuê",
          transfer: "Chuyển nhượng",
          lease: "Thuê",
        };
        return typeMap[type] || type;
      },
    },
    {
      title: "Giá giao dịch",
      dataIndex: "transactionPrice",
      key: "transactionPrice",
      render: (price) => price ? `${price.toLocaleString()} VNĐ` : "-",
    },
    {
      title: "Bên mua",
      dataIndex: "buyerName",
      key: "buyerName",
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
    <div className="realestate-dashboard" style={{ padding: "24px 0", minHeight: "100vh" }}>
      <div style={{ width: "80%", margin: "100px auto" }}>
        <div className="dashboard-header" style={{ marginBottom: "16px", width: "80%", marginLeft: "170px", marginRight: "170px" }}>
          <div style={{
            padding: "22px",
            borderRadius: 16,
            background: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(0,0,0,0.06)",
            backdropFilter: "blur(14px) saturate(140%)",
            WebkitBackdropFilter: "blur(14px) saturate(140%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24
          }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1f2937" }}>
                <HomeOutlined /> Bảng điều khiển Bất Động Sản
              </h1>
              <p style={{ margin: 0, color: "#475569" }}>Quản lý tài sản, tạo giao dịch và theo dõi lịch sử nhanh chóng.</p>
            </div>
            <img src={heroImg} alt="dashboard-hero" style={{ height: 120, borderRadius: 12, objectFit: "cover", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }} />
          </div>
        </div>

      <Tabs defaultActiveKey="properties" size="large" tabPosition="left" style={{ background: "transparent", width: "80%", margin: "0 auto" }}>
        <TabPane
          tab={
            <span>
              <HomeOutlined /> Bất động sản của tôi
            </span>
          }
          key="properties"
        >
          <Card
            title={
              <Space>
                <HomeOutlined />
                <span>Danh sách bất động sản</span>
                <Badge count={properties.length} showZero style={{ backgroundColor: "#1890ff" }} />
              </Space>
            }
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setIsPropertyModalVisible(true);
                  setIsEditMode(false);
                  propertyForm.resetFields();
                }}
                size="large"
                style={{ height: 40, fontSize: 16, fontWeight: 700, background: "#0ea5e9", borderColor: "#0ea5e9" }}
              >
                Đăng ký BĐS mới
              </Button>
            }
          >
            <Loading isLoading={loading}>
              <Table
                dataSource={properties}
                columns={propertyColumns}
                rowKey="_id"
                pagination={{ pageSize: 8 }}
                size="middle"
                bordered
              />
            </Loading>
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <FileTextOutlined /> Tạo giao dịch
            </span>
          }
          key="transactions"
        >
          <Card
            title={
              <Space>
                <FileTextOutlined />
                <span>Lệnh giao dịch</span>
              </Space>
            }
            extra={
              <Space>
                <Button icon={<ReloadOutlined />} onClick={fetchTransactions} style={{ background: "#38bdf8", borderColor: "#38bdf8", color: "#fff" }}>
                  Làm mới
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setIsTransactionModalVisible(true);
                    transactionForm.resetFields();
                  }}
                  disabled={properties.length === 0}
                  size="large"
                  style={{ height: 40, fontSize: 16, fontWeight: 700, background: "#0ea5e9", borderColor: "#0ea5e9" }}
                >
                  Tạo giao dịch mới
                </Button>
              </Space>
            }
          >
            <Loading isLoading={loading}>
              <Table
                dataSource={pendingTransactions}
                columns={transactionColumns}
                rowKey="_id"
                pagination={{ pageSize: 8 }}
                size="middle"
                bordered
              />
            </Loading>
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <HistoryOutlined /> Lịch sử giao dịch{" "}
              <Badge
                count={transactions.filter(t => t.status === "anchored" || t.anchored).length}
                showZero
                style={{ backgroundColor: "#52c41a" }}
              />
            </span>
          }
          key="history"
        >
          <Card
            title={
              <Space>
                <HistoryOutlined />
                <span>Lịch sử giao dịch</span>
              </Space>
            }
            extra={
              <Button icon={<ReloadOutlined />} onClick={fetchTransactions} style={{ background: "#38bdf8", borderColor: "#38bdf8", color: "#fff" }}>
                Làm mới
              </Button>
            }
          >
            <Loading isLoading={loading}>
              <Table
                dataSource={transactions.filter(t => t.status !== "pending")}
                columns={[
                  ...transactionColumns,
                  {
                    title: "Blockchain",
                    key: "blockchain",
                    render: (_, record) => {
                      if (record.txHash) {
                        return (
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
                            <Button size="small" icon={<EyeOutlined />}>
                              Xem
                            </Button>
                          </Popover>
                        );
                      }
                      return "-";
                    },
                  },
                ]}
                rowKey="_id"
                pagination={{ pageSize: 8 }}
                size="middle"
                bordered
              />
            </Loading>
          </Card>
        </TabPane>
      </Tabs>

      {/* Modal đăng ký/sửa BĐS */}
      <Modal
        title={isEditMode ? "Cập nhật thông tin BĐS" : "Đăng ký BĐS mới"}
        visible={isPropertyModalVisible}
        onCancel={() => {
          setIsPropertyModalVisible(false);
          setIsEditMode(false);
          setSelectedProperty(null);
          propertyForm.resetFields();
        }}
        footer={null}
        width={900}
      >
        <Form
          form={propertyForm}
          layout="vertical"
          onFinish={handleCreateProperty}
          initialValues={{
            type: "apartment",
            status: "available",
            legalStatus: "clean",
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="propertyCode"
                label="Mã tài sản"
                rules={[{ required: true, message: "Vui lòng nhập mã tài sản" }]}
              >
                <Input placeholder="VD: BD001" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Loại BĐS"
                rules={[{ required: true, message: "Vui lòng chọn loại BĐS" }]}
              >
                <Select placeholder="Chọn loại BĐS">
                  <Option value="apartment">Chung cư</Option>
                  <Option value="house">Nhà phố</Option>
                  <Option value="land">Đất</Option>
                  <Option value="villa">Biệt thự</Option>
                  <Option value="office">Văn phòng</Option>
                  <Option value="warehouse">Kho bãi</Option>
                  <Option value="other">Khác</Option>
                </Select>
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
                <Input placeholder="Số nhà, đường" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="ward" label="Phường/Xã">
                <Input placeholder="Phường/Xã" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="district" label="Quận/Huyện">
                <Input placeholder="Quận/Huyện" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="city"
                label="Tỉnh/Thành phố"
                rules={[{ required: true, message: "Vui lòng nhập tỉnh/thành phố" }]}
              >
                <Input placeholder="Tỉnh/Thành phố" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="area"
                label="Diện tích (m²)"
                rules={[{ required: true, message: "Vui lòng nhập diện tích" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} placeholder="m²" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="price"
                label="Giá (VNĐ)"
                rules={[{ required: true, message: "Vui lòng nhập giá" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} placeholder="VNĐ" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="Trạng thái">
                <Select>
                  <Option value="available">Có sẵn</Option>
                  <Option value="sold">Đã bán</Option>
                  <Option value="rented">Đã cho thuê</Option>
                  <Option value="pending">Chờ xử lý</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="ownerName"
                label="Tên chủ sở hữu"
                rules={[{ required: true, message: "Vui lòng nhập tên chủ sở hữu" }]}
              >
                <Input placeholder="Họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="ownerIdCard"
                label="CMND/CCCD"
                rules={[{ required: true, message: "Vui lòng nhập CMND/CCCD" }]}
              >
                <Input placeholder="CMND/CCCD" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="ownerEmail"
                label="Email chủ sở hữu"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input placeholder="email@example.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="ownerPhone"
                label="Số điện thoại"
                rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
              >
                <Input placeholder="Số điện thoại" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="ownerAddress" label="Địa chỉ chủ sở hữu">
            <Input.TextArea rows={2} placeholder="Địa chỉ" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="redBook" label="Sổ đỏ/Sổ hồng">
                <Input placeholder="Số sổ đỏ" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="direction" label="Hướng">
                <Select placeholder="Chọn hướng">
                  <Option value="north">Bắc</Option>
                  <Option value="south">Nam</Option>
                  <Option value="east">Đông</Option>
                  <Option value="west">Tây</Option>
                  <Option value="northeast">Đông Bắc</Option>
                  <Option value="northwest">Tây Bắc</Option>
                  <Option value="southeast">Đông Nam</Option>
                  <Option value="southwest">Tây Nam</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="legalStatus" label="Tình trạng pháp lý">
                <Select>
                  <Option value="clean">Sạch</Option>
                  <Option value="pending">Chờ xử lý</Option>
                  <Option value="dispute">Tranh chấp</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Mô tả">
            <TextArea rows={4} placeholder="Mô tả chi tiết về bất động sản..." />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{ height: "45px", fontSize: "16px", fontWeight: "600" }}
            >
              {isEditMode ? "Cập nhật" : "Đăng ký"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal tạo giao dịch */}
      <Modal
        title="Tạo giao dịch mới"
        visible={isTransactionModalVisible}
        onCancel={() => {
          setIsTransactionModalVisible(false);
          transactionForm.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={transactionForm}
          layout="vertical"
          onFinish={handleCreateTransaction}
          initialValues={{
            transactionType: "sale",
          }}
        >
          <Form.Item
            name="propertyId"
            label="Chọn bất động sản"
            rules={[{ required: true, message: "Vui lòng chọn bất động sản" }]}
          >
            <Select placeholder="Chọn bất động sản">
              {properties.map((property) => (
                <Option key={property._id} value={property._id}>
                  {property.propertyCode} - {property.address}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="transactionType"
            label="Loại giao dịch"
            rules={[{ required: true, message: "Vui lòng chọn loại giao dịch" }]}
          >
            <Select placeholder="Chọn loại giao dịch">
              <Option value="sale">Mua bán</Option>
              <Option value="rent">Cho thuê</Option>
              <Option value="transfer">Chuyển nhượng</Option>
              <Option value="lease">Thuê</Option>
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="transactionPrice"
                label="Giá giao dịch (VNĐ)"
                rules={[{ required: true, message: "Vui lòng nhập giá giao dịch" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} placeholder="VNĐ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="deposit" label="Tiền đặt cọc (VNĐ)">
                <InputNumber min={0} style={{ width: "100%" }} placeholder="VNĐ" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="contractDate" label="Ngày ký hợp đồng">
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="transferDate" label="Ngày bàn giao">
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Thông tin bên mua/bên thuê">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="buyerName" label="Họ tên">
                  <Input placeholder="Họ và tên" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="buyerIdCard" label="CMND/CCCD">
                  <Input placeholder="CMND/CCCD" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="buyerEmail" label="Email">
                  <Input placeholder="email@example.com" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="buyerPhone" label="Số điện thoại">
                  <Input placeholder="Số điện thoại" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="buyerAddress" label="Địa chỉ">
              <Input placeholder="Địa chỉ" />
            </Form.Item>
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <TextArea rows={4} placeholder="Mô tả chi tiết về giao dịch..." />
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú">
            <TextArea rows={2} placeholder="Ghi chú thêm..." />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{ height: "45px", fontSize: "16px", fontWeight: "600" }}
            >
              Tạo giao dịch
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết BĐS */}
      <Modal
        title="Chi tiết bất động sản"
        open={viewPropertyVisible}
        onCancel={() => {
          setViewPropertyVisible(false);
          setSelectedProperty(null);
        }}
        footer={null}
        width={800}
      >
        {selectedProperty && (
          <div>
            <Row gutter={16}>
              <Col span={14}>
                <Descriptions bordered size="small" column={1}>
                  <Descriptions.Item label="Mã tài sản">{selectedProperty.propertyCode}</Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ">{selectedProperty.address}</Descriptions.Item>
                  <Descriptions.Item label="Loại">{getPropertyTypeText(selectedProperty.type)}</Descriptions.Item>
                  <Descriptions.Item label="Diện tích">{selectedProperty.area} m²</Descriptions.Item>
                  <Descriptions.Item label="Giá">{selectedProperty.price?.toLocaleString()} VNĐ</Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">{selectedProperty.status}</Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={10}>
                <img
                  src={(selectedProperty.images && selectedProperty.images[0]) || heroImg}
                  alt="property"
                  style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 12 }}
                />
              </Col>
            </Row>
            {selectedProperty.description && (
              <div style={{ marginTop: 12, color: '#475569' }}>{selectedProperty.description}</div>
            )}
          </div>
        )}
      </Modal>
    </div>
    </div>
  );
};

export default RealEstateDashboard;

