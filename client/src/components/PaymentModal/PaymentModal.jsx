import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, message, Space, Typography, Alert, Spin } from "antd";
import { WalletOutlined, CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import PaymentService from "../../services/PaymentService";

const { Text, Title } = Typography;

const PaymentModal = ({ visible, onCancel, onSuccess, amount, recipientAddress, transactionId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const [checkingWallet, setCheckingWallet] = useState(true);

  useEffect(() => {
    if (visible) {
      checkWalletConnection();
    }
  }, [visible]);

  const checkWalletConnection = async () => {
    setCheckingWallet(true);
    try {
      // Kiểm tra kết nối trực tiếp từ MetaMask
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          const account = accounts[0];
          console.log("Connected account from MetaMask:", account);
          setWalletConnected(true);
          setWalletAddress(account);
          
          // Lấy số dư với retry
          const balanceResult = await PaymentService.getBalance();
          if (balanceResult.success) {
            console.log("Balance retrieved:", balanceResult.balance);
            setBalance(balanceResult.balance);
          } else {
            console.error("Failed to get balance:", balanceResult.error);
            // Thử lại sau 1 giây
            setTimeout(async () => {
              const retryBalance = await PaymentService.getBalance();
              if (retryBalance.success) {
                setBalance(retryBalance.balance);
              }
            }, 1000);
          }
        } else {
          setWalletConnected(false);
        }
      } else {
        setWalletConnected(false);
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
      setWalletConnected(false);
    } finally {
      setCheckingWallet(false);
    }
  };

  const handleConnectWallet = async () => {
    setLoading(true);
    try {
      const result = await PaymentService.connectWallet();
      if (result.success) {
        setWalletConnected(true);
        setWalletAddress(result.account);
        
        // Đợi một chút để MetaMask hoàn tất kết nối
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Lấy số dư với retry
        let balanceResult = await PaymentService.getBalance();
        if (!balanceResult.success) {
          // Thử lại sau 1 giây
          await new Promise(resolve => setTimeout(resolve, 1000));
          balanceResult = await PaymentService.getBalance();
        }
        
        if (balanceResult.success) {
          console.log("Balance after connect:", balanceResult.balance);
          setBalance(balanceResult.balance);
          message.success(`Đã kết nối MetaMask thành công! Số dư: ${PaymentService.formatEth(balanceResult.balance)} Sepolia ETH`);
        } else {
          console.error("Failed to get balance:", balanceResult.error);
          message.warning("Đã kết nối nhưng không thể lấy số dư. Vui lòng thử lại.");
        }
      } else {
        message.error(result.error || "Không thể kết nối wallet");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      message.error("Lỗi khi kết nối wallet: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      if (!walletConnected) {
        message.warning("Vui lòng kết nối MetaMask trước");
        return;
      }

      const values = await form.validateFields();
      const paymentAmount = values.amount || amount;

      if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
        message.error("Số tiền không hợp lệ");
        return;
      }

      if (!recipientAddress) {
        message.error("Thiếu địa chỉ nhận tiền");
        return;
      }

      // Check balance
      const balanceCheck = await PaymentService.getBalance();
      if (!balanceCheck.success) {
        message.error("Không thể kiểm tra số dư");
        return;
      }

      if (parseFloat(balanceCheck.balance) < parseFloat(paymentAmount)) {
        message.error(
          `Số dư không đủ. Cần: ${paymentAmount} Sepolia ETH, Hiện có: ${balanceCheck.balance} Sepolia ETH`
        );
        return;
      }

      setLoading(true);

      // Show confirmation
      Modal.confirm({
        title: "Xác nhận thanh toán",
        content: `Bạn có chắc chắn muốn thanh toán ${paymentAmount} Sepolia ETH?`,
        okText: "Xác nhận",
        cancelText: "Hủy",
        onOk: async () => {
          try {
            const result = await PaymentService.sendPayment(recipientAddress, paymentAmount);

            if (result.success) {
              message.success(
                `Thanh toán thành công! Transaction Hash: ${result.transactionHash.substring(0, 10)}...`
              );
              form.resetFields();
              onSuccess({
                transactionHash: result.transactionHash,
                blockNumber: result.blockNumber,
                amount: paymentAmount,
                transactionId: transactionId,
              });
            } else {
              message.error(result.error || "Thanh toán thất bại");
            }
          } catch (error) {
            message.error("Lỗi khi thanh toán: " + error.message);
          } finally {
            setLoading(false);
          }
        },
        onCancel: () => {
          setLoading(false);
        },
      });
    } catch (error) {
      console.error("Payment error:", error);
      message.error("Lỗi: " + error.message);
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <WalletOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
          <Title level={4} style={{ margin: 0 }}>
            Thanh toán bằng Sepolia ETH
          </Title>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Spin spinning={checkingWallet} tip="Đang kiểm tra kết nối...">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {!walletConnected ? (
            <Alert
              message="Chưa kết nối MetaMask"
              description="Vui lòng kết nối MetaMask để tiếp tục thanh toán"
              type="warning"
              showIcon
              action={
                <Button
                  type="primary"
                  icon={<WalletOutlined />}
                  onClick={handleConnectWallet}
                  loading={loading}
                >
                  Kết nối MetaMask
                </Button>
              }
            />
          ) : (
            <>
                    <Alert
                      message="Đã kết nối MetaMask"
                      description={
                        <div>
                          <Text strong>Địa chỉ:</Text> {walletAddress.substring(0, 6)}...
                          {walletAddress.substring(walletAddress.length - 4)}
                          <br />
                          <Text strong>Số dư:</Text> {PaymentService.formatEth(balance)} Sepolia ETH
                        </div>
                      }
                      type="success"
                      showIcon
                      action={
                        <Button
                          size="small"
                          danger
                          onClick={async () => {
                            try {
                              // Reset wallet connection state
                              setWalletConnected(false);
                              setWalletAddress("");
                              setBalance("0");
                              // Clear provider and signer
                              PaymentService.provider = null;
                              PaymentService.signer = null;
                              message.success("Đã ngắt kết nối ví");
                            } catch (error) {
                              console.error("Error disconnecting wallet:", error);
                              message.error("Lỗi khi ngắt kết nối ví");
                            }
                          }}
                        >
                          Ngắt kết nối
                        </Button>
                      }
                    />

              <Form form={form} layout="vertical" initialValues={{ amount: amount || "0.001" }}>
                <Form.Item
                  label="Số tiền (Sepolia ETH)"
                  name="amount"
                  rules={[
                    { required: true, message: "Vui lòng nhập số tiền" },
                    {
                      pattern: /^\d+(\.\d{1,18})?$/,
                      message: "Số tiền không hợp lệ",
                    },
                  ]}
                >
                  <Input
                    placeholder="0.01"
                    suffix="Sepolia ETH"
                    disabled={loading}
                    style={{ fontSize: "16px" }}
                  />
                </Form.Item>

                <Form.Item label="Địa chỉ nhận tiền">
                  <Input
                    value={recipientAddress || "Chưa có địa chỉ"}
                    disabled
                    style={{ fontFamily: "monospace" }}
                  />
                </Form.Item>

                {amount && (
                  <div style={{ padding: "12px", background: "#f0f0f0", borderRadius: "8px" }}>
                    <Text type="secondary">
                      Số tiền cần thanh toán: <Text strong>{amount} Sepolia ETH</Text>
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      (Ước tính: ~{PaymentService.ethToVnd(amount)} VND - chỉ để tham khảo)
                    </Text>
                  </div>
                )}

                <Form.Item>
                  <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                    <Button onClick={onCancel} disabled={loading}>
                      Hủy
                    </Button>
                    <Button
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      onClick={handlePayment}
                      loading={loading}
                      style={{ minWidth: "120px" }}
                    >
                      Thanh toán
                    </Button>
                  </Space>
                </Form.Item>
              </Form>

                    <Alert
                      message="Lưu ý"
                      description={
                        <div>
                          <div>• Đây là giao dịch trên <strong>Sepolia Testnet</strong> (testnet, không phải mainnet)</div>
                          <div>• Bạn có thể dùng <strong>bất kỳ ví MetaMask nào</strong> để test</div>
                          <div>• Cần có <strong>Sepolia ETH</strong> trong ví để thanh toán</div>
                          <div>• Vui lòng đảm bảo đã chuyển sang <strong>Sepolia Testnet</strong> trong MetaMask</div>
                          <div style={{ marginTop: "8px", fontSize: "12px", color: "#999" }}>
                            💡 Lấy Sepolia ETH miễn phí từ: <a href="https://sepoliafaucet.com" target="_blank" rel="noopener noreferrer">sepoliafaucet.com</a>
                          </div>
                        </div>
                      }
                      type="info"
                      showIcon
                    />
            </>
          )}
        </Space>
      </Spin>
    </Modal>
  );
};

export default PaymentModal;

