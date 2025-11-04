# Hướng dẫn tích hợp thanh toán ETH

## Tổng quan

Tính năng thanh toán ETH cho phép client thanh toán bằng ETH khi admin chấp nhận request. Hệ thống sử dụng Sepolia Testnet.

## Các component đã tạo

1. **PaymentService** (`client/src/services/PaymentService.js`)
   - Kết nối MetaMask
   - Kiểm tra số dư
   - Gửi thanh toán ETH

2. **PaymentModal** (`client/src/components/PaymentModal/PaymentModal.jsx`)
   - Modal để user thanh toán ETH
   - Tự động kiểm tra kết nối MetaMask
   - Hiển thị số dư và xác nhận thanh toán

3. **PaymentButton** (`client/src/components/PaymentButton/PaymentButton.jsx`)
   - Button trigger modal thanh toán
   - Dễ dàng tích hợp vào bất kỳ component nào

## Cách sử dụng

### 1. Trong User Dashboard (Khi admin đã accept)

```jsx
import PaymentButton from "../../components/PaymentButton/PaymentButton";

// Trong component
const handlePaymentSuccess = (paymentData) => {
  // paymentData chứa:
  // - transactionHash: Hash của transaction ETH
  // - blockNumber: Số block
  // - amount: Số tiền đã thanh toán
  // - transactionId: ID transaction của bạn
  
  console.log("Payment successful:", paymentData);
  
  // Gọi API để cập nhật transaction với payment info
  // await updateTransaction(transactionId, {
  //   paymentHash: paymentData.transactionHash,
  //   paymentStatus: "paid"
  // });
};

// Trong JSX
<PaymentButton
  amount="0.01" // Số ETH cần thanh toán
  recipientAddress="0x1234..." // Địa chỉ ví admin nhận tiền
  transactionId={transaction._id}
  onPaymentSuccess={handlePaymentSuccess}
  buttonText="Thanh toán ETH"
/>
```

### 2. Trong Admin Dashboard (Khi accept request)

```jsx
// Khi admin accept, thêm logic để:
// 1. Tạo transaction với status "pending_payment"
// 2. Thông báo cho client cần thanh toán
// 3. Client sẽ thấy button "Thanh toán ETH"

const handleApprove = async (id) => {
  setLoading(true);
  try {
    // Approve request
    await MaintenanceService.approveMaintenanceRegistration(id);
    
    // Tạo transaction với price
    const transaction = await createTransaction({
      requestId: id,
      price: "0.01", // ETH
      status: "pending_payment",
      recipientAddress: "0x1234...", // Admin wallet address
    });
    
    message.success("Đã duyệt! Client cần thanh toán ETH để hoàn tất.");
    fetchPendingRegistrations();
  } catch (error) {
    message.error("Lỗi khi duyệt");
  } finally {
    setLoading(false);
  }
};
```

### 3. Flow hoàn chỉnh

1. **Client request** → Tạo request với status "pending"
2. **Admin accept** → Tạo transaction với:
   - `price`: Số ETH (ví dụ: "0.01")
   - `status`: "pending_payment"
   - `recipientAddress`: Địa chỉ ví admin
3. **Client thanh toán** → Sử dụng PaymentButton, sau khi thanh toán thành công:
   - Cập nhật transaction với `paymentHash` và `status: "paid"`
   - Gọi API backend để lưu thông tin thanh toán
4. **Admin xác nhận** → Kiểm tra payment trên blockchain, hoàn tất transaction

## Cấu hình

### Sepolia Testnet

User cần:
1. Cài đặt MetaMask
2. Thêm Sepolia Testnet vào MetaMask:
   - Network Name: Sepolia
   - RPC URL: https://sepolia.infura.io/v3/YOUR_INFURA_KEY
   - Chain ID: 11155111
   - Currency Symbol: ETH
3. Lấy Sepolia ETH từ faucet: https://sepoliafaucet.com/

### Backend API cần thêm

```javascript
// POST /api/transactions/:id/payment
// Body: { paymentHash, blockNumber, amount }
// Response: { status: "OK", data: updatedTransaction }

// GET /api/transactions/:id
// Response: { status: "OK", data: { ...transaction, paymentHash, paymentStatus } }
```

## Lưu ý

- Đây là testnet, không có giá trị thật
- User cần có Sepolia ETH để thanh toán
- Payment hash được lưu trên blockchain, không thể thay đổi
- Có thể verify payment bằng cách check transaction hash trên Sepolia Explorer

## Ví dụ tích hợp vào Real Estate

```jsx
// Trong RealEstateDashboard.jsx
import PaymentButton from "../../components/PaymentButton/PaymentButton";

// Khi hiển thị transaction đã được admin approve
{transaction.status === "pending_payment" && (
  <PaymentButton
    amount={transaction.price} // "0.01"
    recipientAddress={transaction.recipientAddress}
    transactionId={transaction._id}
    onPaymentSuccess={async (paymentData) => {
      // Gọi API để cập nhật transaction
      await TransactionService.updatePayment(transaction._id, {
        paymentHash: paymentData.transactionHash,
        blockNumber: paymentData.blockNumber,
        paymentStatus: "paid"
      });
      
      message.success("Thanh toán thành công!");
      fetchTransactions(); // Refresh list
    }}
  />
)}
```

