import { ethers } from "ethers";

/**
 * PaymentService - Xử lý thanh toán ETH trên Sepolia Testnet
 */
class PaymentService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.account = null;
  }

  /**
   * Kết nối với MetaMask và tự động chuyển sang Sepolia Testnet nếu cần
   */
  async connectWallet() {
    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask không được cài đặt. Vui lòng cài đặt MetaMask extension.");
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        throw new Error("Không tìm thấy tài khoản MetaMask");
      }

      this.account = accounts[0];

      // Setup provider (Sepolia Testnet)
      this.provider = new ethers.providers.Web3Provider(window.ethereum);

      // Check network
      const network = await this.provider.getNetwork();
      const sepoliaChainId = 11155111; // Sepolia Testnet

      console.log("Current network chainId:", network.chainId);
      console.log("Required Sepolia chainId:", sepoliaChainId);

      // Nếu không phải Sepolia, thử chuyển sang Sepolia
      if (network.chainId !== sepoliaChainId) {
        try {
          // Thử chuyển sang Sepolia Testnet
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${sepoliaChainId.toString(16)}` }], // 0xaa36a7
          });
          
          // Đợi một chút để network chuyển đổi
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Tạo lại provider sau khi chuyển network
          this.provider = new ethers.providers.Web3Provider(window.ethereum);
          
          // Kiểm tra lại network
          const newNetwork = await this.provider.getNetwork();
          if (newNetwork.chainId !== sepoliaChainId) {
            throw new Error("Không thể chuyển sang Sepolia Testnet. Vui lòng chuyển thủ công trong MetaMask.");
          }
          
          console.log("Successfully switched to Sepolia Testnet");
        } catch (switchError) {
          // Nếu lỗi 4902, có nghĩa là chain chưa được thêm vào MetaMask
          if (switchError.code === 4902) {
            // Thử thêm Sepolia Testnet vào MetaMask
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: `0x${sepoliaChainId.toString(16)}`,
                    chainName: "Sepolia",
                    nativeCurrency: {
                      name: "SepoliaETH",
                      symbol: "SepoliaETH",
                      decimals: 18,
                    },
                    rpcUrls: ["https://sepolia.infura.io/v3/"],
                    blockExplorerUrls: ["https://sepolia.etherscan.io"],
                  },
                ],
              });
              // Đợi một chút
              await new Promise(resolve => setTimeout(resolve, 1000));
              // Tạo lại provider
              this.provider = new ethers.providers.Web3Provider(window.ethereum);
            } catch (addError) {
              throw new Error(
                "Không thể thêm Sepolia Testnet. Vui lòng thêm thủ công:\n" +
                "Network Name: Sepolia\n" +
                "RPC URL: https://sepolia.infura.io/v3/\n" +
                "Chain ID: 11155111\n" +
                "Currency Symbol: SepoliaETH\n" +
                "Block Explorer: https://sepolia.etherscan.io"
              );
            }
          } else {
            throw new Error(
              `Vui lòng chuyển sang Sepolia Testnet (Chain ID: ${sepoliaChainId}) trong MetaMask. ` +
              `Hiện tại đang ở Chain ID: ${network.chainId}`
            );
          }
        }
      }

      this.signer = this.provider.getSigner();

      return {
        success: true,
        account: this.account,
      };
    } catch (error) {
      console.error("Error connecting wallet:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Kiểm tra xem đã kết nối wallet chưa
   */
  async checkConnection() {
    try {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length > 0) {
          this.account = accounts[0];
          this.provider = new ethers.providers.Web3Provider(window.ethereum);
          this.signer = this.provider.getSigner();

          return {
            connected: true,
            account: this.account,
          };
        }
      }

      return {
        connected: false,
      };
    } catch (error) {
      console.error("Error checking connection:", error);
      return {
        connected: false,
        error: error.message,
      };
    }
  }

  /**
   * Lấy số dư ETH của tài khoản
   */
  async getBalance() {
    try {
      // Luôn lấy account mới nhất từ MetaMask để đảm bảo đúng
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask không được cài đặt");
      }

      // Lấy account trực tiếp từ MetaMask
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length === 0) {
        throw new Error("Chưa kết nối wallet. Vui lòng kết nối MetaMask trước.");
      }

      const currentAccount = accounts[0];
      
      // Đảm bảo provider được khởi tạo
      if (!this.provider) {
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
      }

      // Cập nhật account
      this.account = currentAccount;

      console.log("Getting balance for account:", this.account);
      console.log("Account from MetaMask:", currentAccount);
      
      // Lấy số dư từ provider
      const balance = await this.provider.getBalance(this.account);
      console.log("Balance (Wei):", balance.toString());
      const balanceInEth = ethers.utils.formatEther(balance);
      console.log("Balance (ETH):", balanceInEth);

      return {
        success: true,
        balance: balanceInEth,
        balanceWei: balance.toString(),
      };
    } catch (error) {
      console.error("Error getting balance:", error);
      console.error("Current account:", this.account);
      console.error("Provider:", this.provider);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Gửi ETH thanh toán
   * @param {string} recipientAddress - Địa chỉ nhận tiền
   * @param {string} amountInEth - Số lượng ETH (ví dụ: "0.001")
   * @returns {Promise<Object>}
   */
  async sendPayment(recipientAddress, amountInEth) {
    try {
      if (!this.signer) {
        const connection = await this.connectWallet();
        if (!connection.success) {
          throw new Error(connection.error || "Không thể kết nối wallet");
        }
      }

      // Validate recipient address
      if (!ethers.utils.isAddress(recipientAddress)) {
        throw new Error("Địa chỉ nhận tiền không hợp lệ");
      }

      // Validate amount
      const amount = parseFloat(amountInEth);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Số tiền không hợp lệ");
      }

      // Convert to Wei
      const amountInWei = ethers.utils.parseEther(amountInEth);

      // Check balance
      const balanceCheck = await this.getBalance();
      if (!balanceCheck.success) {
        throw new Error("Không thể kiểm tra số dư");
      }

      if (parseFloat(balanceCheck.balance) < amount) {
        throw new Error(
          `Số dư không đủ. Cần: ${amount} ETH, Hiện có: ${balanceCheck.balance} ETH`
        );
      }

      // Send transaction
      const tx = await this.signer.sendTransaction({
        to: recipientAddress,
        value: amountInWei,
      });

      // Wait for transaction
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        from: receipt.from,
        to: receipt.to,
        amount: amountInEth,
      };
    } catch (error) {
      console.error("Error sending payment:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Format ETH amount để hiển thị
   */
  formatEth(amount) {
    try {
      return parseFloat(amount).toFixed(6);
    } catch (error) {
      return "0.000000";
    }
  }

  /**
   * Convert ETH to VND (tỷ giá ước tính - chỉ để hiển thị)
   */
  ethToVnd(ethAmount) {
    // Tỷ giá ước tính: 1 ETH ≈ 80,000,000 VND (testnet không có giá trị thật)
    const rate = 80000000;
    return (parseFloat(ethAmount) * rate).toLocaleString("vi-VN");
  }
}

export default new PaymentService();

