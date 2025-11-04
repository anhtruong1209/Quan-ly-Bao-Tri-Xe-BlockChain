import React, { useState } from "react";
import { Button, Space } from "antd";
import { WalletOutlined } from "@ant-design/icons";
import PaymentModal from "../PaymentModal/PaymentModal";

/**
 * PaymentButton - Component để trigger thanh toán Sepolia ETH
 * 
 * @param {Object} props
 * @param {string} props.amount - Số tiền Sepolia ETH cần thanh toán (ví dụ: "0.001")
 * @param {string} props.recipientAddress - Địa chỉ ví nhận tiền (admin address)
 * @param {string} props.transactionId - ID của transaction cần thanh toán
 * @param {Function} props.onPaymentSuccess - Callback khi thanh toán thành công
 * @param {string} props.buttonText - Text hiển thị trên button
 * @param {boolean} props.disabled - Disable button
 */
const PaymentButton = ({
  amount,
  recipientAddress,
  transactionId,
  onPaymentSuccess,
  buttonText = "Thanh toán Sepolia ETH",
  disabled = false,
  type = "primary",
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePaymentSuccess = (paymentData) => {
    // Callback với thông tin thanh toán
    if (onPaymentSuccess) {
      onPaymentSuccess({
        ...paymentData,
        transactionId: transactionId,
      });
    }
    setModalVisible(false);
  };

  return (
    <>
      <Button
        type={type}
        icon={<WalletOutlined />}
        onClick={() => setModalVisible(true)}
        disabled={disabled}
        style={type === "primary" ? {
          backgroundColor: "#1890ff",
          borderColor: "#1890ff"
        } : {}}
      >
        {buttonText}
      </Button>

      <PaymentModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSuccess={handlePaymentSuccess}
        amount={amount}
        recipientAddress={recipientAddress}
        transactionId={transactionId}
      />
    </>
  );
};

export default PaymentButton;

