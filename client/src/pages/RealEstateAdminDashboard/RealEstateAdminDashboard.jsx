import React, { useState, useEffect } from "react";
import "./RealEstateAdminDashboard.css";
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
  Form,
  Input,
  Select,
  Popover,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  ReloadOutlined,
  DashboardOutlined,
  HomeOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import * as TransactionService from "../../services/TransactionService";
import * as RealEstateService from "../../services/RealEstateService";
import Loading from "../../components/LoadingComponent/Loading";
import { Tabs } from "antd";

const { TabPane } = Tabs;
const { Option } = Select;

const RealEstateAdminDashboard = () => {
  const user = useSelector((state) => state.user);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [approveForm] = Form.useForm();

  useEffect(() => {
    fetchPendingTransactions();
    fetchAllTransactions();
    fetchAllProperties();
  }, []);

  const fetchPendingTransactions = async () => {
    setLoading(true);
    try {
      const res = await TransactionService.getPendingTransactions();
      if (res?.status === "OK") {
        setPendingTransactions(res.data || []);
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách giao dịch chờ duyệt");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTransactions = async () => {
    try {
      const res = await TransactionService.listTransactions();
      if (res?.status === "OK") {
        setAllTransactions(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchAllProperties = async () => {
    try {
      const res = await RealEstateService.getAllRealEstate();
      if (res?.status === "OK") {
        setProperties(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const handleApprove = async (transactionId, values) => {
    setLoading(true);
    try {
      const res = await TransactionService.approveTransaction(transactionId);
      if (res?.status === "OK") {
        message.success("Duyệt giao dịch thành công!");
        setApproveModalVisible(false);
        approveForm.resetFields();
        fetchPendingTransactions();
        fetchAllTransactions();
      } else {
        message.error(res?.message || "Lỗi khi duyệt giao dịch");
      }
    } catch (error) {
      console.error("Error approving transaction:", error);
      message.error(error?.response?.data?.message || "Lỗi khi duyệt giao dịch");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (transactionId) => {
    Modal.confirm({
      title: "Xác nhận từ chối",
      content: "Bạn có chắc chắn muốn từ chối giao dịch này?",
      okText: "Từ chối",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        setLoading(true);
        try {
          const res = await TransactionService.rejectTransaction(transactionId);
          if (res?.status === "OK") {
            message.success("Từ chối giao dịch thành công!");
            fetchPendingTransactions();
            fetchAllTransactions();
          } else {
            message.error(res?.message || "Lỗi khi từ chối giao dịch");
          }
        } catch (error) {
          console.error("Error rejecting transaction:", error);
          message.error(error?.response?.data?.message || "Lỗi khi từ chối giao dịch");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleAnchor = async (transactionId) => {
    Modal.confirm({
      title: "Xác nhận anchor",
      content: "Bạn có chắc chắn muốn anchor giao dịch này lên blockchain?",
      okText: "Anchor",
      okType: "primary",
      cancelText: "Hủy",
      onOk: async () => {
        setLoading(true);
        try {
          const res = await TransactionService.anchorTransaction(transactionId);
          if (res?.status === "OK") {
            message.success("Anchor giao dịch thành công!");
            fetchPendingTransactions();
            fetchAllTransactions();
          } else {
            message.error(res?.message || "Lỗi khi anchor giao dịch");
          }
        } catch (error) {
          console.error("Error anchoring transaction:", error);
          message.error(error?.response?.data?.message || "Lỗi khi anchor giao dịch");
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
      title: "Bên bán",
      dataIndex: "sellerName",
      key: "sellerName",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
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
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedTransaction(record);
              setDetailModalVisible(true);
            }}
          >
            Xem
          </Button>
          {record.status === "pending" && (
            <>
              <Button
                size="small"
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => {
                  setSelectedTransaction(record);
                  setApproveModalVisible(true);
                }}
              >
                Duyệt
              </Button>
              <Button
                size="small"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleReject(record._id)}
              >
                Từ chối
              </Button>
            </>
          )}
          {record.status === "approved" && !record.anchored && (
            <Button
              size="small"
              type="default"
              onClick={() => handleAnchor(record._id)}
            >
              Anchor
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="realestate-admin-dashboard" style={{ padding: "24px", minHeight: "100vh", background: "#f0f2f5" }}>
      <div className="dashboard-header" style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>
          <DashboardOutlined /> Admin Dashboard - Quản Lý Giao Dịch BĐS
        </h1>
      </div>

      <Tabs defaultActiveKey="pending" size="large">
        <TabPane
          tab={
            <span>
              <FileTextOutlined /> Giao dịch chờ duyệt{" "}
              <Badge count={pendingTransactions.length} showZero style={{ backgroundColor: "#ff4d4f" }} />
            </span>
          }
          key="pending"
        >
          <Card
            title={
              <Space>
                <FileTextOutlined />
                <span>Danh sách giao dịch chờ duyệt</span>
              </Space>
            }
            extra={
              <Button icon={<ReloadOutlined />} onClick={fetchPendingTransactions}>
                Làm mới
              </Button>
            }
          >
            <Loading isLoading={loading}>
              <Table
                dataSource={pendingTransactions}
                columns={transactionColumns}
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
              <HomeOutlined /> Tất cả giao dịch
            </span>
          }
          key="all"
        >
          <Card
            title={
              <Space>
                <HistoryOutlined />
                <span>Tất cả giao dịch</span>
              </Space>
            }
            extra={
              <Button icon={<ReloadOutlined />} onClick={fetchAllTransactions}>
                Làm mới
              </Button>
            }
          >
            <Loading isLoading={loading}>
              <Table
                dataSource={allTransactions}
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
                pagination={{ pageSize: 10 }}
                size="small"
              />
            </Loading>
          </Card>
        </TabPane>
      </Tabs>

      {/* Modal chi tiết giao dịch */}
      <Modal
        title="Chi tiết giao dịch"
        visible={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedTransaction(null);
        }}
        footer={null}
        width={800}
      >
        {selectedTransaction && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Mã tài sản" span={2}>
              {selectedTransaction.propertyCode}
            </Descriptions.Item>
            <Descriptions.Item label="Loại giao dịch">
              {selectedTransaction.transactionType === "sale" ? "Mua bán" :
               selectedTransaction.transactionType === "rent" ? "Cho thuê" :
               selectedTransaction.transactionType === "transfer" ? "Chuyển nhượng" :
               "Thuê"}
            </Descriptions.Item>
            <Descriptions.Item label="Giá giao dịch">
              {selectedTransaction.transactionPrice?.toLocaleString()} VNĐ
            </Descriptions.Item>
            <Descriptions.Item label="Bên mua" span={2}>
              <div>
                <p><strong>Tên:</strong> {selectedTransaction.buyerName || "-"}</p>
                <p><strong>Email:</strong> {selectedTransaction.buyerEmail || "-"}</p>
                <p><strong>Điện thoại:</strong> {selectedTransaction.buyerPhone || "-"}</p>
                <p><strong>CMND/CCCD:</strong> {selectedTransaction.buyerIdCard || "-"}</p>
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Bên bán" span={2}>
              <div>
                <p><strong>Tên:</strong> {selectedTransaction.sellerName || "-"}</p>
                <p><strong>Email:</strong> {selectedTransaction.sellerEmail || "-"}</p>
                <p><strong>Điện thoại:</strong> {selectedTransaction.sellerPhone || "-"}</p>
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={getStatusColor(selectedTransaction.status)}>
                {getStatusText(selectedTransaction.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {selectedTransaction.createdAt ? new Date(selectedTransaction.createdAt).toLocaleString("vi-VN") : "-"}
            </Descriptions.Item>
            {selectedTransaction.txHash && (
              <Descriptions.Item label="Blockchain Hash" span={2}>
                <code style={{ fontSize: "12px", wordBreak: "break-all" }}>{selectedTransaction.txHash}</code>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Modal duyệt giao dịch */}
      <Modal
        title="Duyệt giao dịch"
        visible={approveModalVisible}
        onCancel={() => {
          setApproveModalVisible(false);
          approveForm.resetFields();
        }}
        onOk={() => {
          approveForm.submit();
        }}
        okText="Duyệt"
        cancelText="Hủy"
      >
        <Form
          form={approveForm}
          layout="vertical"
          onFinish={(values) => {
            if (selectedTransaction) {
              handleApprove(selectedTransaction._id, values);
            }
          }}
        >
          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <Input.TextArea rows={4} placeholder="Ghi chú khi duyệt..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RealEstateAdminDashboard;

